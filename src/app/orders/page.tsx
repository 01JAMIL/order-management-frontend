"use client"

import {useState} from "react"
import {Plus} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog"
import {OrderForm} from "@/components/OrderForm"
import {OrdersTable} from "@/components/OrderTable"
import {ManufacturingOrder} from "@/types/Order/ManufacturingOrder"
import {toast} from "sonner"
import {useQueryClient} from "@tanstack/react-query"
import useGetManufacturingOrders from "@/hooks/order/useGetManufacturingOrders";
import useDeleteManufacturingOrder from "@/hooks/order/useDeleteManufacturingOrder";

export default function OrdersPage() {
    const queryClient = useQueryClient()

    const {
        data: orders = [],
        isPending,
    } = useGetManufacturingOrders()
    const {
        mutateAsync,
        isPending: isDeletePending,
    } = useDeleteManufacturingOrder()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<ManufacturingOrder | null>(null)

    const handleEdit = (order: ManufacturingOrder) => {
        setSelectedOrder(order)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        try {
            await mutateAsync(id)
            queryClient.setQueryData<ManufacturingOrder[]>(["get-manufacturing-orders"], (oldData = []) =>
                oldData.filter((order) => order.id !== id)
            )
            toast.success("Order deleted successfully")
        } catch (error) {
            console.log("Error deleting order:", error)
            toast.error("Failed to delete order")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Manufacturing Orders</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button id="add-order-btn" onClick={() => setSelectedOrder(null)}>
                            <Plus className="mr-2 h-4 w-4"/>
                            Add Order
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <OrderForm
                            order={selectedOrder}
                            handleSuccessAction={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <OrdersTable
                data={orders}
                handleEditAction={handleEdit}
                handleDeleteAction={handleDelete}
                isLoading={isPending}
                isDeleteLoading={isDeletePending}
            />
        </div>
    )
}
