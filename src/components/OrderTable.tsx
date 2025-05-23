"use client"

import {ManufacturingOrder} from "@/types/Order/ManufacturingOrder"
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
import {formatDate} from "date-fns";

interface OrdersTableProps {
    data: ManufacturingOrder[]
    handleEditAction: (order: ManufacturingOrder) => void
    handleDeleteAction: (id: number) => void
    isLoading?: boolean
    isDeleteLoading?: boolean
}

export function OrdersTable({
                                data,
                                handleEditAction,
                                handleDeleteAction,
                                isLoading = false,
                                isDeleteLoading = false,
                            }: OrdersTableProps) {
    const SkeletonLoader = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        <TableCell>
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"/>
                        </TableCell>
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
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"/>
                        </TableCell>
                        <TableCell>
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"/>
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
            <TableCell colSpan={8} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                    <p className="text-lg text-gray-500 mb-2">No orders found.</p>
                    <p className="text-sm text-gray-400">Try adding a new manufacturing order.</p>
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
                                <TableHead>Order ID</TableHead>
                                <TableHead>Project</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Machine</TableHead>
                                <TableHead className="w-[70px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">{order.id}</TableCell>
                                        <TableCell>{order.project}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    order.status === "COMPLETED"
                                                        ? "success"
                                                        : order.status === "IN_PROGRESS"
                                                            ? "secondary"
                                                            : "warning"
                                                }
                                            >
                                                {order.status === "COMPLETED"
                                                    ? "Completed"
                                                    : order.status === "IN_PROGRESS"
                                                        ? "In Progress"
                                                        : "Pending"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{order.quantity}</TableCell>
                                        <TableCell>{
                                            formatDate(new Date(order.date), "dd/MM/yyyy")
                                        }</TableCell>
                                        <TableCell>{order.product.name}</TableCell>
                                        <TableCell>{order.machine.name}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEditAction(order)}>
                                                        <Pencil className="mr-2 h-4 w-4"/>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteAction(order.id)}
                                                        disabled={isDeleteLoading}
                                                    >
                                                        {
                                                            isDeleteLoading ?
                                                                <>
                                                                    <Trash className="mr-2 h-4 w-4"/>
                                                                    Deleting ...
                                                                </> :
                                                                <>
                                                                    <Trash className="mr-2 h-4 w-4"/>
                                                                    Delete
                                                                </>
                                                        }
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