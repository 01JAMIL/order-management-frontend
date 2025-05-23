"use client"

import {useState} from "react"
import {Plus} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog"
import {EmployeeForm} from "@/components/EmployeeForm"
import {EmployeesTable} from "@/components/EmployeesTable"
import {Employee} from "@/types/employee/Employee"
import useGetAllEmployees from "@/hooks/employee/useGetAllEmployees"
import useDeleteEmployee from "@/hooks/employee/useDeleteEmployee";
import {toast} from "sonner";
import {useQueryClient} from "@tanstack/react-query";

export default function EmployeesPage() {

    const queryClient = useQueryClient()

    const {
        data: employees = [],
        isPending
    } = useGetAllEmployees()
    const {
        mutateAsync,
        isPending: isDeletePending,
    } = useDeleteEmployee();

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        try {
            await mutateAsync(id);
            queryClient.setQueryData<Employee[]>(["get-all-employees"], (oldData = []) =>
                oldData.filter((employee) => employee.id !== id)
            )
            toast.success("Employee deleted successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete employee");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button id="add-employee-btn" onClick={() => setSelectedEmployee(null)}>
                            <Plus className="mr-2 h-4 w-4"/>
                            Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <EmployeeForm
                            employee={selectedEmployee}
                            handleSuccessAction={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <EmployeesTable
                data={employees}
                handleEditAction={handleEdit}
                handleDeleteAction={handleDelete}
                isDeleteLoading={isDeletePending}
                isLoading={isPending}
            />
        </div>
    )
}