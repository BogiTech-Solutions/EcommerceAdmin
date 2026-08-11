'use client';

import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconDotsVertical,
  IconCategory,
  IconFolder,
  IconLoader2
} from '@tabler/icons-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

// UI Components
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

// Mock Initial Data
const INITIAL_CATEGORIES = [
  {
    id: 'cat-1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Gadgets, devices, and electronic accessories.',
    parentId: null,
    productCount: 142,
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 'cat-2',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'iOS and Android smartphones.',
    parentId: 'cat-1',
    parentName: 'Electronics',
    productCount: 58,
    status: 'active',
    createdAt: '2024-01-16'
  },
  {
    id: 'cat-3',
    name: 'Laptops & Computers',
    slug: 'laptops-computers',
    description: 'MacBooks, Windows PCs, and accessories.',
    parentId: 'cat-1',
    parentName: 'Electronics',
    productCount: 44,
    status: 'active',
    createdAt: '2024-01-18'
  },
  {
    id: 'cat-4',
    name: 'Apparel & Fashion',
    slug: 'apparel-fashion',
    description: 'Clothing, footwear, and wearable fashion.',
    parentId: null,
    productCount: 310,
    status: 'active',
    createdAt: '2024-02-01'
  },
  {
    id: 'cat-5',
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Furniture, appliances, and decor.',
    parentId: null,
    productCount: 89,
    status: 'archived',
    createdAt: '2024-02-10'
  }
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
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
      slug: '',
      parentId: 'none',
      description: '',
      status: 'active'
    }
  });

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nameValue = e.target.value;
    setValue('name', nameValue);
    if (!editingCategory) {
      const generatedSlug = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setValue('slug', generatedSlug);
    }
  };

  // Open modal for Creating or Editing
  const handleOpenModal = (categoryToEdit: any = null) => {
    if (categoryToEdit) {
      setEditingCategory(categoryToEdit);
      reset({
        name: categoryToEdit.name,
        slug: categoryToEdit.slug,
        parentId: categoryToEdit.parentId || 'none',
        description: categoryToEdit.description || '',
        status: categoryToEdit.status
      });
    } else {
      setEditingCategory(null);
      reset({
        name: '',
        slug: '',
        parentId: 'none',
        description: '',
        status: 'active'
      });
    }
    setIsModalOpen(true);
  };

  // Submit Handler
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 800)); // Simulate API call

      const parentCategory = categories.find((c) => c.id === data.parentId);

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory.id
              ? {
                  ...cat,
                  ...data,
                  parentId: data.parentId === 'none' ? null : data.parentId,
                  parentName: parentCategory ? parentCategory.name : undefined
                }
              : cat
          )
        );
        toast.success('Category updated successfully');
      } else {
        const newCategory = {
          id: `cat-${Date.now()}`,
          name: data.name,
          slug: data.slug,
          description: data.description,
          parentId: data.parentId === 'none' ? null : data.parentId,
          parentName: parentCategory ? parentCategory.name : undefined,
          productCount: 0,
          status: data.status,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setCategories((prev) => [newCategory, ...prev]);
        toast.success('Category created successfully');
      }

      setIsModalOpen(false);
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Category
  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    toast.success('Category deleted successfully');
  };

  // Filter Categories
  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.parentName && cat.parentName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground text-sm">
            Organize products into hierarchical categories and subcategories.
          </p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <IconPlus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <IconSearch className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-muted-foreground text-sm">
              Showing{' '}
              <span className="text-foreground font-medium">{filteredCategories.length}</span>{' '}
              categories
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Parent Category</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground h-24 text-center">
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-md">
                            {cat.parentId ? (
                              <IconFolder className="text-muted-foreground h-4 w-4" />
                            ) : (
                              <IconCategory className="text-primary h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{cat.name}</p>
                            {cat.description && (
                              <p className="text-muted-foreground line-clamp-1 text-xs">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{cat.slug}</TableCell>
                      <TableCell>
                        {cat.parentName ? (
                          <Badge variant="outline" className="font-normal">
                            {cat.parentName}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">— Top Level —</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-medium">{cat.productCount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={cat.status === 'active' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {cat.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <IconDotsVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleOpenModal(cat)}>
                              <IconEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(cat.id)}
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
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update existing category details.'
                : 'Create a new category to group your products.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                placeholder="e.g. Footwear"
                {...register('name', { required: 'Name is required' })}
                onChange={handleNameChange}
              />
              {errors.name && (
                <p className="text-destructive text-xs">{errors.name.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                placeholder="e.g. footwear"
                {...register('slug', { required: 'Slug is required' })}
              />
              {errors.slug && (
                <p className="text-destructive text-xs">{errors.slug.message as string}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Category</Label>
              <Select value={watch('parentId')} onValueChange={(val) => setValue('parentId', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select parent (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— None (Top Level) —</SelectItem>
                  {categories
                    .filter((c) => c.id !== editingCategory?.id) // Prevent selecting self as parent
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={watch('status')} onValueChange={(val: any) => setValue('status', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description for SEO and storefront..."
                rows={3}
                {...register('description')}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
