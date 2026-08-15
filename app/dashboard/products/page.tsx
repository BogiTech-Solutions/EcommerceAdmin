'use client';

import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconLoader2,
  IconFilter,
  IconLayoutGrid,
  IconList,
  IconPhoto,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

// UI Components
import { SingleFileUploader } from '@/components/file-upload';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { API_BASE_URL } from '@/constants';
import { Category, PaginatedProductResponse, Product } from '@/types';

import KPICard from './kpi-card';

// Initial state matching your provided Spring Boot response structure
const INITIAL_RESPONSE: PaginatedProductResponse = {
  content: [],
  pageNumber: 0,
  pageSize: 10,
  totalElements: 2,
  totalPages: 1,
  last: true
};

export default function ProductsPage() {
  const token = localStorage.getItem('token');
  const [productData, setProductData] = useState<PaginatedProductResponse>(INITIAL_RESPONSE);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const fetchCategories = useCallback(async () => {
    const response = await fetch(API_BASE_URL + '/categories', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    }
  }, []);

  const getProducts = useCallback(async () => {
    const response = await fetch(
      API_BASE_URL + '/products/page?page=0&size=10&sortBy=id&sortDir=asc'
    );
    const data: PaginatedProductResponse = await response.json();
    setProductData(data);
    console.log(data);
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      file: '',
      categoryId: '1'
    }
  });

  const watchedImageUrl = watch('file');

  // Modal open
  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        file: product.imageUrl || '',
        categoryId: String(product.categoryId)
      });
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        file: '',
        categoryId: '1'
      });
    }
    setIsModalOpen(true);
  };

  // Create / Update product submit
  const onSubmit = async (data: {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    file: string;
    categoryId: string;
  }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('categoryId', data.categoryId);
    formData.append('stockQuantity', data.stockQuantity.toString());
    typeof data.file != 'string' && formData.append('image', data.file);
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        const response = await fetch(API_BASE_URL + '/products/' + editingProduct.id, {
          method: 'PUT',
          headers: {
            Authorization: 'Bearer ' + token
          },
          body: formData
        });
        if (response.ok) {
          getProducts();
          toast.success('Product updated successfully');
        }
      } else {
        const response = await fetch(API_BASE_URL + '/products', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + token
          },
          body: formData
        });
        if (response.ok) {
          getProducts();
          toast.success('New product created successfully');
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(API_BASE_URL + '/products/' + productId, {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      if (response.ok) {
        getProducts();
        toast.success('Product removed from inventory');
      }
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  // Client-side filtering
  const filteredProducts = productData.content.filter((product: Product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || product.categoryId === Number(categoryFilter);

    return matchesSearch && matchesCategory;
  });

  // Calculate Metrics
  const totalStockCount = productData.content.reduce(
    (acc: number, curr: Product) => acc + curr.stockQuantity,
    0
  );
  const totalValue = productData.content.reduce(
    (acc: number, curr: Product) => acc + curr.price * curr.stockQuantity,
    0
  );
  const lowStockCount = productData.content.filter((p: Product) => p.stockQuantity < 10).length;

  useEffect(() => {
    getProducts();
  }, [getProducts]);
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground text-sm">
            Manage product listings, pricing, stock levels, and inventory status.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <IconPlus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* KPI Cards */}

      <KPICard
        totalStockCount={totalStockCount}
        lowStockCount={lowStockCount}
        totalElements={productData.totalElements}
        totalValue={lowStockCount}
      />

      {/* Controls / Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <IconSearch className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search by name or description..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters and View Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <IconFilter className="text-muted-foreground h-4 w-4" />
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* View Switcher Toggle */}
              <div className="bg-muted/20 flex items-center rounded-md border p-1">
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setViewMode('table')}
                >
                  <IconList className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setViewMode('grid')}
                >
                  <IconLayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {viewMode === 'table' ? (
            /* TABLE VIEW */
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Stock</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                        No products found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product: Product) => (
                      <TableRow key={product.id}>
                        {/* Name & Image */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="bg-muted flex h-12 w-12 shrink-0 items-center justify-center rounded-md border">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="h-full w-full rounded-md object-cover"
                                  onError={(e) => {
                                    // Fallback if image fails to load (e.g. localhost URL)
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <IconPhoto className="text-muted-foreground h-5 w-5" />
                              )}
                            </div>
                            <div className="max-w-70">
                              <p className="truncate font-medium">{product.name}</p>
                              <p className="text-muted-foreground line-clamp-1 text-xs">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {product.categoryName}
                          </Badge>
                        </TableCell>

                        {/* Price */}
                        <TableCell className="text-right font-mono font-medium">
                          ${product.price.toFixed(2)}
                        </TableCell>

                        {/* Stock Quantity */}
                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            {product.stockQuantity === 0 ? (
                              <Badge variant="destructive">Out of Stock</Badge>
                            ) : product.stockQuantity < 10 ? (
                              <Badge className="border-amber-200 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
                                Low ({product.stockQuantity})
                              </Badge>
                            ) : (
                              <span className="font-mono text-sm font-medium">
                                {product.stockQuantity}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <IconDotsVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleOpenModal(product)}>
                                <IconEdit className="mr-2 h-4 w-4" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <IconTrash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            /* GRID VIEW */
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product: Product) => (
                <Card key={product.id} className="flex flex-col justify-between overflow-hidden">
                  <div>
                    <div className="bg-muted relative flex h-40 w-full items-center justify-center border-b">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="text-muted-foreground flex flex-col items-center gap-1">
                          <IconPhoto className="h-8 w-8" />
                          <span className="text-xs">No Image</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">{product.categoryName}</Badge>
                      </div>
                    </div>
                    <div className="space-y-2 p-4">
                      <h3 className="text-lg leading-tight font-semibold">{product.name}</h3>
                      <p className="text-muted-foreground line-clamp-2 text-xs">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t p-4 pt-0">
                    <div>
                      <p className="text-muted-foreground text-xs">Price</p>
                      <p className="font-mono text-lg font-bold">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">Stock</p>
                      <p className="font-mono text-sm font-medium">{product.stockQuantity} units</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="text-muted-foreground mt-4 flex items-center justify-between border-t pt-4 text-xs">
            <div>
              Showing <span className="text-foreground font-medium">{filteredProducts.length}</span>{' '}
              of <span className="text-foreground font-medium">{productData.totalElements}</span>{' '}
              products
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={productData.pageNumber === 0}
                className="h-8 gap-1"
              >
                <IconChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <span className="font-mono text-xs">
                Page {productData.pageNumber + 1} of {productData.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={productData.last} className="h-8 gap-1">
                Next <IconChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Product Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update product specifications, inventory, and pricing details.'
                : 'Add a new product to your catalog.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. ProBook Laptop 15"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-destructive text-xs">{errors.name.message as string}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select
                  value={watch('categoryId')}
                  onValueChange={(val) => setValue('categoryId', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="299.99"
                  {...register('price', { required: 'Price is required', min: 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  placeholder="50"
                  {...register('stockQuantity', { required: 'Stock count required', min: 0 })}
                />
              </div>
            </div>

            <div className="flex">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description for SEO and storefront..."
                    className="h-32 resize-none"
                    {...register('description')}
                  />
                </div>

                {/* Single File Upload with React Hook Form Controller */}
                <div className="max-h-36 space-y-2">
                  <Label>Category Image * </Label>
                  <Controller
                    name="file"
                    control={control}
                    render={({ field }) => (
                      <SingleFileUploader
                        value={field.value} // Can be a File object, image URL string (e.g., "/uploads/cat-1.png"), or null
                        onValueChange={(newFile) => field.onChange(newFile)}
                        maxSize={1024 * 1024 * 2} // 2MB
                        {...register('file', { required: 'Image is required' })}
                      />
                    )}
                  />
                  {errors.file && (
                    <p className="text-destructive text-xs">{errors.file.message as string}</p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
