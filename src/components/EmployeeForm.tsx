"use client"

import {useFormik} from "formik"
import * as Yup from "yup"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Employee} from "@/types/employee/Employee"
import useGetAllMachines from "@/hooks/machine/useGetAllMachines"
import useCreateEmployee from "@/hooks/employee/useCreateEmployee"
import useUpdateEmployee from "@/hooks/employee/useUpdateEmployee"
import {useQueryClient} from "@tanstack/react-query"
import {EmployeePosition} from "@/types/employee/EmployeePosition";


const POSITIONS: EmployeePosition[] = [
    EmployeePosition.OPERATOR,
    EmployeePosition.TECHNICIAN,
    EmployeePosition.SUPERVISOR,
    EmployeePosition.LOGISTICS_COORDINATOR,
    EmployeePosition.ASSEMBLER,
    EmployeePosition.PRODUCTION_MANAGER,
    EmployeePosition.SHIFT_LEADER,
    EmployeePosition.QUALITY_INSPECTOR,
    EmployeePosition.MAINTENANCE_ENGINEER,
    EmployeePosition.SAFETY_OFFICER,
    EmployeePosition.TOOLMAKER
]

const validationSchema = Yup.object({
    name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    position: Yup.string()
        .oneOf(POSITIONS, "Invalid position")
        .required("Position is required"),
    machine: Yup.number().required("Machine is required"),
})

interface EmployeeFormValues {
    name: string
    position: EmployeePosition
    machine: number // Represents machine.id
}

interface EmployeeFormProps {
    employee: Employee | null
    handleSuccessAction: () => void
}

export function EmployeeForm({employee, handleSuccessAction}: EmployeeFormProps) {
    const queryClient = useQueryClient()

    const {
        data: machines = [],
        isPending: isLoadingMachines,
    } = useGetAllMachines()

    const {
        mutateAsync: createEmployee,
        isPending: isPendingCreate,
    } = useCreateEmployee()
    const {
        mutateAsync: updateEmployee,
        isPending: isPendingUpdate,
    } = useUpdateEmployee()

    const isLoading = isPendingCreate || isPendingUpdate

    const formik = useFormik<EmployeeFormValues>({
        initialValues: {
            name: employee?.name || "",
            position: employee?.position || EmployeePosition.OPERATOR,
            machine: employee?.employeeMachine?.id || 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                if (employee) {
                    // Update existing employee
                    const updatedEmployee = await updateEmployee({
                        id: employee.id,
                        payload: {
                            name: values.name,
                            position: values.position,
                            machineId: values.machine,
                        }
                    })
                    // Update the employee list in the cache
                    queryClient.setQueryData<Employee[]>(["get-all-employees"], (oldData = []) =>
                        oldData.map((emp) =>
                            emp.id === employee.id ? {
                                ...emp,
                                name: updatedEmployee.name,
                                position: updatedEmployee.position,
                                machineId: updatedEmployee.employeeMachine.id,
                            } : emp
                        )
                    )
                } else {
                    // Create new employee
                    const newEmployee = await createEmployee({
                        name: values.name,
                        position: values.position,
                        machineId: values.machine,
                    })
                    // Append the new employee to the cache
                    queryClient.setQueryData<Employee[]>(["get-all-employees"], (oldData = []) => [
                        newEmployee,
                        ...oldData,
                    ])
                }
                handleSuccessAction()
            } catch (error) {
                console.error("Error saving employee:", error)
            }
        },
    })

    return (
        <>
            <DialogHeader>
                <DialogTitle>{employee ? "Edit Employee" : "Add Employee"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={formik.handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="John Smith"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.errors.name && formik.touched.name ? "border-red-500" : ""}
                    />
                    {formik.errors.name && formik.touched.name && (
                        <div className="text-sm text-red-500">{formik.errors.name}</div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select
                        value={formik.values.position}
                        onValueChange={(value) => formik.setFieldValue("position", value)}
                        onOpenChange={() => formik.setFieldTouched("position", true)}
                    >
                        <SelectTrigger
                            id="position"
                            className={formik.errors.position && formik.touched.position ? "border-red-500" : ""}
                        >
                            <SelectValue placeholder="Select a position"/>
                        </SelectTrigger>
                        <SelectContent>
                            {
                                POSITIONS.map((e, index) => (
                                    <SelectItem
                                        key={index + Math.random() + "-" + e}
                                        value={e}
                                    >
                                        {e}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    {formik.errors.position && formik.touched.position && (
                        <div className="text-sm text-red-500">{formik.errors.position}</div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="machine">Machine</Label>
                    <Select
                        value={formik.values.machine ? String(formik.values.machine) : ""}
                        onValueChange={(value) => formik.setFieldValue("machine", Number(value))}
                        onOpenChange={() => formik.setFieldTouched("machine", true)}
                    >
                        <SelectTrigger
                            id="machine"
                            className={formik.errors.machine && formik.touched.machine ? "border-red-500" : ""}
                        >
                            <SelectValue placeholder="Select a machine"/>
                        </SelectTrigger>
                        <SelectContent>
                            {machines.map((machine) => (
                                <SelectItem key={machine.id} value={String(machine.id)}>
                                    {machine.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formik.errors.machine && formik.touched.machine && (
                        <div className="text-sm text-red-500">{formik.errors.machine}</div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={handleSuccessAction}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || isLoadingMachines}>
                        {isLoading ? "Saving..." : employee ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </>
    )
}