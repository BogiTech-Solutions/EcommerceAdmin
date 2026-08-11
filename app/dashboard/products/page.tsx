'use client';

import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconBox,
  IconAlertTriangle,
  IconCurrencyDollar,
  IconCheck,
  IconLoader2,
  IconFilter,
  IconLayoutGrid,
  IconList,
  IconPhoto,
  IconChevronLeft,
  IconChevronRight
} from '@tabler/icons-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// UI Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { PaginatedProductResponse, Product } from '@/types';

// Initial state matching your provided Spring Boot response structure
const INITIAL_RESPONSE: PaginatedProductResponse = {
  content: [],
  pageNumber: 0,
  pageSize: 10,
  totalElements: 2,
  totalPages: 1,
  last: true
};

const CATEGORIES = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Home & Kitchen' },
  { id: 4, name: 'Books' }
];

export default function ProductsPage() {
  const token = localStorage.getItem('token');
  const [productData, setProductData] = useState<PaginatedProductResponse>(INITIAL_RESPONSE);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      imageUrl: '',
      categoryId: '1'
    }
  });

  const watchedImageUrl = watch('imageUrl');

  // Modal open
  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        imageUrl: product.imageUrl || '',
        categoryId: String(product.categoryId)
      });
    } else {
      setEditingProduct(null);
      reset({
        name: '',
        description: '',
        price: 0,
        stockQuantity: 0,
        imageUrl: '',
        categoryId: '1'
      });
    }
    setIsModalOpen(true);
  };

  // Create / Update product submit
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate API delay

      const selectedCategory = CATEGORIES.find((c) => c.id === Number(data.categoryId));

      if (editingProduct) {
        setProductData((prev) => ({
          ...prev,
          content: prev.content.map((p: Product) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  name: data.name,
                  description: data.description,
                  price: parseFloat(data.price),
                  stockQuantity: parseInt(data.stockQuantity, 10),
                  imageUrl: data.imageUrl.trim() === '' ? null : data.imageUrl,
                  categoryId: Number(data.categoryId),
                  categoryName: selectedCategory ? selectedCategory.name : 'General'
                }
              : p
          )
        }));
        toast.success('Product updated successfully');
      } else {
        const newProduct: Product = {
          id: Date.now(),
          name: data.name,
          description: data.description,
          price: parseFloat(data.price),
          stockQuantity: parseInt(data.stockQuantity, 10),
          imageUrl: data.imageUrl.trim() === '' ? null : data.imageUrl,
          categoryId: Number(data.categoryId),
          categoryName: selectedCategory ? selectedCategory.name : 'General'
        };

        setProductData((prev) => ({
          ...prev,
          content: [newProduct, ...prev.content],
          totalElements: prev.totalElements + 1
        }));
        toast.success('New product created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = (productId: number) => {
    setProductData((prev) => ({
      ...prev,
      content: prev.content.filter((p: Product) => p.id !== productId),
      totalElements: prev.totalElements - 1
    }));
    toast.success('Product removed from inventory');
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
  const getProducts = useCallback(async () => {
    const response = await fetch(
      API_BASE_URL + '/products/page?page=0&size=10&sortBy=id&sortDir=asc'
    );
    const data: PaginatedProductResponse = await response.json();
    setProductData(data);
    console.log(data);
  }, []);
  useEffect(() => {
    getProducts();
  }, [getProducts]);
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
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <IconBox className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productData.totalElements}</div>
            <p className="text-muted-foreground text-xs">Active unique SKUs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Units in Stock</CardTitle>
            <IconCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStockCount.toLocaleString()}</div>
            <p className="text-muted-foreground text-xs">Total stock inventory quantity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Valuation</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-muted-foreground text-xs">Based on current unit prices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <IconAlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockCount}</div>
            <p className="text-muted-foreground text-xs">Products under 10 units</p>
          </CardContent>
        </Card>
      </div>

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
                    {CATEGORIES.map((cat) => (
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief summary of the item..."
                rows={3}
                {...register('description')}
              />
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
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="http://localhost:8080/uploads/..."
                {...register('imageUrl')}
              />
            </div>

            {/* Live Image Preview */}
            {watchedImageUrl && watchedImageUrl.trim() !== '' && (
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Image Preview</Label>
                <div className="bg-muted relative flex h-24 w-full items-center justify-center overflow-hidden rounded-md border">
                  <img
                    src={watchedImageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              </div>
            )}

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
