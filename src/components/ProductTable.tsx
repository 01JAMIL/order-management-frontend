"use client"

import {Product} from "@/types/product/Product"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {MoreHorizontal, Pencil, Trash} from "lucide-react"
import {formatDistanceToNow} from "date-fns";

interface ProductsTableProps {
    data: Product[]
    handleEditAction: (product: Product) => void
    handleDeleteAction: (id: number) => void
    isLoading?: boolean
    isDeleteLoading?: boolean
}

export function ProductsTable({
                                  data,
                                  handleEditAction,
                                  handleDeleteAction,
                                  isLoading = false,
                                  isDeleteLoading = false
                              }: ProductsTableProps) {
    const SkeletonLoader = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Created at</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell>
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"/>
                        </TableCell>
                        <TableCell>
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"/>
                        </TableCell>
                        <TableCell>
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"/>
                        </TableCell>
                        <TableCell>
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-2/3"/>
                        </TableCell>
                        <TableCell>
                            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"/>
                        </TableCell>
                        <TableCell>
                            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )

    const EmptyState = () => (
        <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-lg text-gray-500 mb-2">No products found.</p>
                    <p className="text-sm text-gray-400">Try adding a new product.</p>
                </div>
            </TableCell>
        </TableRow>
    )

    return (
        <div className="space-y-4">
            <div className="rounded-md border">
                {isLoading ? (
                    <SkeletonLoader/>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Supplier</TableHead>
                                <TableHead>Created at</TableHead>
                                <TableHead className="w-[70px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    product.type === "PART"
                                                        ? "outline"
                                                        : product.type === "ASSEMBLY"
                                                            ? "secondary"
                                                            : "default"
                                                }
                                            >
                                                {product.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                className={
                                                    product.stock < 10
                                                        ? "text-red-500 font-medium"
                                                        : product.stock < 50
                                                            ? "text-yellow-500 font-medium"
                                                            : ""
                                                }
                                            >
                                                {product.stock}
                                            </div>
                                        </TableCell>
                                        <TableCell>{product.supplier}</TableCell>
                                        <TableCell>
                                            {formatDistanceToNow(new Date(product.createdAt))}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0"
                                                            disabled={isDeleteLoading}>
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEditAction(product)}>
                                                        <Pencil className="mr-2 h-4 w-4"/>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleDeleteAction(product.id)}>
                                                        <Trash className="mr-2 h-4 w-4"/>
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <EmptyState/>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}