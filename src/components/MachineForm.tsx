"use client"

import {useFormik} from "formik"
import * as Yup from "yup"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {CalendarIcon} from "lucide-react"
import {format} from "date-fns"
import {Calendar} from "@/components/ui/calendar"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {cn} from "@/lib/utils"
import {Label} from "@/components/ui/label"
import {Machine} from "@/types/machine/Machine"
import {MachineStatus} from "@/types/machine/MachineStatus"
import useCreateMachine from "@/hooks/machine/useCreateMachine"
import useUpdateMachine from "@/hooks/machine/useUpdateMachine"
import {useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner";

const STATUSES: MachineStatus[] = [
    MachineStatus.OPERATIONAL,
    MachineStatus.UNDER_MAINTENANCE,
    MachineStatus.OUT_OF_ORDER,
    MachineStatus.IDLE,
    MachineStatus.DECOMMISSIONED,
]

const validationSchema = Yup.object({
    name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    status: Yup.string()
        .oneOf(STATUSES, "Invalid status")
        .required("Status is required"),
    lastMaintenance: Yup.date().required("Please select a date"),
})

interface MachineFormValues {
    name: string
    status: MachineStatus
    lastMaintenance: Date
}

interface MachineFormProps {
    machine: Machine | null
    handleSuccessAction: () => void
}

export function MachineForm({machine, handleSuccessAction}: MachineFormProps) {
    const queryClient = useQueryClient()

    const {
        mutateAsync: createMachine,
        isPending: isPendingCreate,
    } = useCreateMachine()
    const {
        mutateAsync: updateMachine,
        isPending: isPendingUpdate,
    } = useUpdateMachine()

    const isLoading = isPendingCreate || isPendingUpdate

    const formik = useFormik<MachineFormValues>({
        initialValues: {
            name: machine?.name || "",
            status: machine?.status || MachineStatus.OPERATIONAL,
            lastMaintenance: machine ? new Date(machine.lastMaintenanceDate) : new Date(),
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    name: values.name,
                    status: values.status,
                    lastMaintenance: new Date(values.lastMaintenance).toISOString()
                }
                if (machine) {
                    // Update existing machine
                    const updatedMachine = await updateMachine({
                        id: machine.id,
                        payload: {
                            name: payload.name,
                            status: payload.status,
                            lastMaintenanceDate: payload.lastMaintenance
                        },
                    })
                    // Update the machine list in the cache
                    queryClient.setQueryData<Machine[]>(["get-all-machines"], (oldData = []) =>
                        oldData.map((m) =>
                            m.id === machine.id ? {...m, ...updatedMachine} : m
                        )
                    )
                } else {
                    // Create new machine
                    const newMachine = await createMachine({
                        ...payload,
                        lastMaintenanceDate: payload.lastMaintenance
                    })
                    // Append the new machine to the cache
                    queryClient.setQueryData<Machine[]>(["get-all-machines"], (oldData = []) => [
                        newMachine,
                        ...oldData,
                    ])
                }
                handleSuccessAction()
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong try again later!")
            }
        },
    })

    return (
        <>
            <DialogHeader>
                <DialogTitle>{machine ? "Edit Machine" : "Add Machine"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={formik.handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="CNC Mill #4"
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
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={formik.values.status}
                        onValueChange={(value) => formik.setFieldValue("status", value)}
                        onOpenChange={() => formik.setFieldTouched("status", true)}
                    >
                        <SelectTrigger
                            id="status"
                            className={formik.errors.status && formik.touched.status ? "border-red-500" : ""}
                        >
                            <SelectValue placeholder="Select a status"/>
                        </SelectTrigger>
                        <SelectContent>
                            {STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status === MachineStatus.OPERATIONAL
                                        ? "Operational"
                                        : status === MachineStatus.UNDER_MAINTENANCE
                                            ? "Under Maintenance"
                                            : status === MachineStatus.OUT_OF_ORDER
                                                ? "Out of Order"
                                                : status === MachineStatus.IDLE
                                                    ? "Idle"
                                                    : "Decommissioned"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formik.errors.status && formik.touched.status && (
                        <div className="text-sm text-red-500">{formik.errors.status}</div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Last Maintenance Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !formik.values.lastMaintenance && "text-muted-foreground",
                                    formik.errors.lastMaintenance && formik.touched.lastMaintenance && "border-red-500"
                                )}
                            >
                                {formik.values.lastMaintenance
                                    ? format(formik.values.lastMaintenance, "PPP")
                                    : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={formik.values.lastMaintenance}
                                onSelect={(date) => formik.setFieldValue("lastMaintenance", date)}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {formik.errors.lastMaintenance && formik.touched.lastMaintenance && (
                        <div className="text-sm text-red-500">
                            {String(formik.errors.lastMaintenance)}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={handleSuccessAction}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : machine ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </>
    )
}