"use client"

import {Machine} from "@/types/machine/Machine"
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

interface MachinesTableProps {
    data: Machine[]
    handleEditAction: (machine: Machine) => void
    handleDeleteAction: (id: number) => void
    isDeleteLoading?: boolean;
    isLoading?: boolean
}

export function MachinesTable({
                                  data,
                                  handleEditAction,
                                  handleDeleteAction,
                                  isDeleteLoading = false,
                                  isLoading = false
                              }: MachinesTableProps) {
    const SkeletonLoader = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Maintenance</TableHead>
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
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-2/3"/>
                        </TableCell>
                        <TableCell>
                            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"/>
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
                    <p className="text-lg text-gray-500 mb-2">No machines found.</p>
                    <p className="text-sm text-gray-400">Try adding a new machine.</p>
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
                                <TableHead>Status</TableHead>
                                <TableHead>Last Maintenance</TableHead>
                                <TableHead className="w-[70px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((machine) => (
                                    <TableRow key={machine.id}>
                                        <TableCell className="font-medium">{machine.name}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    machine.status === "OPERATIONAL"
                                                        ? "success"
                                                        : machine.status === "UNDER_MAINTENANCE"
                                                            ? "warning"
                                                            : "destructive"
                                                }
                                            >
                                                {machine.status === "OPERATIONAL"
                                                    ? "Operational"
                                                    : machine.status === "UNDER_MAINTENANCE"
                                                        ? "Maintenance"
                                                        : "Out of Order"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                formatDistanceToNow(new Date(machine.lastMaintenanceDate))
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4"/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleEditAction(machine)}>
                                                        <Pencil className="mr-2 h-4 w-4"/>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteAction(machine.id)}
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