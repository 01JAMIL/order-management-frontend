"use client"

import {useState} from "react"
import {Plus} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog"
import {ProductForm} from "@/components/ProductForm"
import {Product} from "@/types/product/Product"
import useGetAllProducts from "@/hooks/product/useGetAllProducts"
import useDeleteProduct from "@/hooks/product/useDeleteProduct"
import {toast} from "sonner"
import {useQueryClient} from "@tanstack/react-query"
import {ProductsTable} from "@/components/ProductTable";

export default function ProductsPage() {
    const queryClient = useQueryClient()

    const {
        data: products = [],
        isPending,
    } = useGetAllProducts()
    const {
        mutateAsync,
        isPending: isDeletePending,
    } = useDeleteProduct()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

    const handleEdit = (product: Product) => {
        setSelectedProduct(product)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        try {
            await mutateAsync(id)
            queryClient.setQueryData<Product[]>(["get-all-products"], (oldData = []) =>
                oldData.filter((product) => product.id !== id)
            )
            toast.success("Product deleted successfully")
        } catch (error) {
            console.error("Error deleting product:", error)
            toast.error("Failed to delete product")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button id="add-product-btn" onClick={() => setSelectedProduct(null)}>
                            <Plus className="mr-2 h-4 w-4"/>
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <ProductForm
                            product={selectedProduct}
                            handleSuccessAction={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <ProductsTable
                data={products}
                handleEditAction={handleEdit}
                handleDeleteAction={handleDelete}
                isLoading={isPending}
                isDeleteLoading={isDeletePending}
            />
        </div>
    )
}