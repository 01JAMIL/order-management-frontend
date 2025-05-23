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
import {ManufacturingOrder} from "@/types/Order/ManufacturingOrder"
import {ManufacturingOrderStatus} from "@/types/Order/ManufacturingOrderStatus"
import useGetAllProducts from "@/hooks/product/useGetAllProducts"
import useGetAllMachines from "@/hooks/machine/useGetAllMachines"
import useCreateManufacturingOrder from "@/hooks/order/useCreateManufacturingOrder"
import useUpdateManufacturingOrder from "@/hooks/order/useUpdateManufacturingOrder"
import {useQueryClient} from "@tanstack/react-query"
import {toast} from "sonner";

const STATUSES: ManufacturingOrderStatus[] = [
    ManufacturingOrderStatus.PENDING,
    ManufacturingOrderStatus.IN_PROGRESS,
    ManufacturingOrderStatus.COMPLETED,
]

const validationSchema = Yup.object({
    project: Yup.string().min(2, "Project name must be at least 2 characters").required("Project name is required"),
    status: Yup.string()
        .oneOf(STATUSES, "Invalid status")
        .required("Status is required"),
    quantity: Yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
    date: Yup.date().required("Please select a date"),
    productId: Yup.number().required("Product is required"),
    machineId: Yup.number().required("Machine is required"),
})

interface OrderFormValues {
    project: string
    status: ManufacturingOrderStatus
    quantity: number
    date: Date
    productId: number
    machineId: number
}

interface OrderFormProps {
    order: ManufacturingOrder | null
    handleSuccessAction: () => void
}

export function OrderForm({order, handleSuccessAction}: OrderFormProps) {
    const queryClient = useQueryClient()

    const {
        data: products = [],
        isPending: isLoadingProducts,
    } = useGetAllProducts()
    const {
        data: machines = [],
        isPending: isLoadingMachines,
    } = useGetAllMachines()

    const {
        mutateAsync: createOrder,
        isPending: isPendingCreate,
    } = useCreateManufacturingOrder()
    const {
        mutateAsync: updateOrder,
        isPending: isPendingUpdate,
    } = useUpdateManufacturingOrder()

    const isLoading = isPendingCreate || isPendingUpdate || isLoadingProducts || isLoadingMachines

    const formik = useFormik<OrderFormValues>({
        initialValues: {
            project: order?.project || "",
            status: order?.status || ManufacturingOrderStatus.PENDING,
            quantity: order?.quantity || 1,
            date: order ? new Date(order.date) : new Date(),
            productId: order?.product.id || 0,
            machineId: order?.machine.id || 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    project: values.project,
                    status: values.status,
                    quantity: values.quantity,
                    date: new Date(values.date).toISOString(),
                    productId: values.productId,
                    machineId: values.machineId,
                }
                if (order) {
                    const updatedOrder = await updateOrder({
                        id: order.id,
                        payload,
                    })
                    queryClient.setQueryData<ManufacturingOrder[]>(["get-manufacturing-orders"], (oldData = []) =>
                        oldData.map((o) =>
                            o.id === order.id ? {...o, ...updatedOrder} : o
                        )
                    )
                } else {
                    const newOrder = await createOrder(payload)
                    // Append the new order to the cache
                    queryClient.setQueryData<ManufacturingOrder[]>(["get-manufacturing-orders"], (oldData = []) => [
                        newOrder,
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
                <DialogTitle>{order ? "Edit Order" : "Add Order"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={formik.handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="project">Project Name</Label>
                    <Input
                        id="project"
                        name="project"
                        placeholder="Hydraulic Pump Assembly"
                        value={formik.values.project}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.errors.project && formik.touched.project ? "border-red-500" : ""}
                    />
                    {formik.errors.project && formik.touched.project && (
                        <div className="text-sm text-red-500">{formik.errors.project}</div>
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
                                    {status === ManufacturingOrderStatus.PENDING
                                        ? "Pending"
                                        : status === ManufacturingOrderStatus.IN_PROGRESS
                                            ? "In Progress"
                                            : "Completed"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formik.errors.status && formik.touched.status && (
                        <div className="text-sm text-red-500">{formik.errors.status}</div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.errors.quantity && formik.touched.quantity ? "border-red-500" : ""}
                    />
                    {formik.errors.quantity && formik.touched.quantity && (
                        <div className="text-sm text-red-500">{formik.errors.quantity}</div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !formik.values.date && "text-muted-foreground",
                                    formik.errors.date && formik.touched.date && "border-red-500"
                                )}
                            >
                                {formik.values.date ? format(formik.values.date, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={formik.values.date}
                                onSelect={(date) => formik.setFieldValue("date", date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    {formik.errors.date && formik.touched.date && (
                        <div className="text-sm text-red-500">
                            {typeof formik.errors.date === "string" ? formik.errors.date : "Invalid date"}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="productId">Product</Label>
                    <Select
                        value={formik.values.productId ? String(formik.values.productId) : ""}
                        onValueChange={(value) => formik.setFieldValue("productId", Number(value))}
                        onOpenChange={() => formik.setFieldTouched("productId", true)}
                    >
                        <SelectTrigger
                            id="productId"
                            className={formik.errors.productId && formik.touched.productId ? "border-red-500" : ""}
                        >
                            <SelectValue placeholder="Select a product"/>
                        </SelectTrigger>
                        <SelectContent>
                            {products.map((product) => (
                                <SelectItem key={product.id} value={String(product.id)}>
                                    {product.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formik.errors.productId && formik.touched.productId && (
                        <div className="text-sm text-red-500">{formik.errors.productId}</div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="machineId">Machine</Label>
                    <Select
                        value={formik.values.machineId ? String(formik.values.machineId) : ""}
                        onValueChange={(value) => formik.setFieldValue("machineId", Number(value))}
                        onOpenChange={() => formik.setFieldTouched("machineId", true)}
                    >
                        <SelectTrigger
                            id="machineId"
                            className={formik.errors.machineId && formik.touched.machineId ? "border-red-500" : ""}
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
                    {formik.errors.machineId && formik.touched.machineId && (
                        <div className="text-sm text-red-500">{formik.errors.machineId}</div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={handleSuccessAction}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : order ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </>
    )
}