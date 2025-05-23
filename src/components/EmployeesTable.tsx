"use client";

import {useState, useMemo} from "react"
import {MoreHorizontal, Pencil, Trash} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Input} from "@/components/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Employee} from "@/types/employee/Employee"
import {formatDistanceToNow} from "date-fns"

interface EmployeesTableProps {
    data: Employee[]
    handleEditAction: (employee: Employee) => void
    handleDeleteAction: (id: number) => void
    isDeleteLoading?: boolean
    isLoading?: boolean
}

export function EmployeesTable({
                                   data,
                                   handleEditAction,
                                   handleDeleteAction,
                                   isDeleteLoading = false,
                                   isLoading = false
                               }: EmployeesTableProps) {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredData = useMemo(() => {
        return data.filter(
            (employee) =>
                employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.employeeMachine.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [data, searchTerm])

    const SkeletonLoader = () => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Created</TableHead>
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
                    <p className="text-lg text-gray-500 mb-2">No employees found.</p>
                    <p className="text-sm text-gray-400">Try adjusting your search or add a new employee.</p>
                </div>
            </TableCell>
        </TableRow>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <div className="text-sm text-muted-foreground">
                    Showing {filteredData.length} {filteredData.length === 1 ? "employee" : "employees"}
                </div>
            </div>

            <div className="rounded-md border">
                {isLoading ? (
                    <SkeletonLoader/>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Position</TableHead>
                                <TableHead>Machine</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="w-[70px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell className="font-medium">{employee.name}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    employee.position === "SUPERVISOR"
                                                        ? "default"
                                                        : employee.position === "TECHNICIAN"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                            >
                                                {employee.position}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{employee.employeeMachine.name}</TableCell>
                                        <TableCell>{
                                            formatDistanceToNow(new Date(employee.createdAt))
                                        }</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleEditAction(employee)}>
                                                        <Pencil className="mr-2 h-4 w-4"/>
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteAction(employee.id)}
                                                        disabled={isDeleteLoading}
                                                    >
                                                        {
                                                            isDeleteLoading ? (
                                                                <span className="animate-pulse">
                                                                    <Trash className="mr-2 h-4 w-4"/>
                                                                    Deleting...
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <Trash className="mr-2 h-4 w-4"/>
                                                                    Delete
                                                                </>
                                                            )
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