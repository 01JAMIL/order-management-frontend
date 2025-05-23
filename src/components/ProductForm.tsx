"use client"

import {useFormik} from "formik"
import * as Yup from "yup"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label"
import {Product} from "@/types/product/Product"
import {ProductType} from "@/types/product/ProductType"
import useCreateProduct from "@/hooks/product/useCreateProduct"
import useUpdateProduct from "@/hooks/product/useUpdateProduct"
import {useQueryClient} from "@tanstack/react-query"

const TYPES: ProductType[] = [
    ProductType.PART,
    ProductType.ASSEMBLY,
    ProductType.MATERIAL,
]

const validationSchema = Yup.object({
    name: Yup.string().min(2, "Name must be at least 2 characters").required("Name is required"),
    type: Yup.string()
        .oneOf(TYPES, "Invalid type")
        .required("Type is required"),
    stock: Yup.number().min(0, "Stock must be a positive number").required("Stock is required"),
    supplier: Yup.string().required("Supplier is required"),
})

interface ProductFormValues {
    name: string
    type: ProductType
    stock: number
    supplier: string
}

interface ProductFormProps {
    product: Product | null
    handleSuccessAction: () => void
}

export function ProductForm({product, handleSuccessAction}: ProductFormProps) {
    const queryClient = useQueryClient()

    const {
        mutateAsync: createProduct,
        isPending: isPendingCreate,
    } = useCreateProduct()
    const {
        mutateAsync: updateProduct,
        isPending: isPendingUpdate,
    } = useUpdateProduct()

    const isLoading = isPendingCreate || isPendingUpdate

    const formik = useFormik<ProductFormValues>({
        initialValues: {
            name: product?.name || "",
            type: product?.type || ProductType.PART,
            stock: product?.stock || 0,
            supplier: product?.supplier || "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    name: values.name,
                    type: values.type,
                    stock: values.stock,
                    supplier: values.supplier,
                }
                if (product) {
                    // Update existing product
                    const updatedProduct = await updateProduct({
                        id: product.id,
                        payload
                    })
                    // Update the product list in the cache
                    queryClient.setQueryData<Product[]>(["get-all-products"], (oldData = []) =>
                        oldData.map((p) =>
                            p.id === product.id ? {...p, ...updatedProduct} : p
                        )
                    )
                } else {
                    // Create new product
                    const newProduct = await createProduct(payload)
                    // Append the new product to the cache
                    queryClient.setQueryData<Product[]>(["get-all-products"], (oldData = []) => [
                        newProduct,
                        ...oldData,
                    ])
                }
                handleSuccessAction()
            } catch (error) {
                console.error("Error saving product:", error)
            }
        },
    })

    return (
        <>
            <DialogHeader>
                <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={formik.handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Hydraulic Pump"
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
                    <Label htmlFor="type">Type</Label>
                    <Select
                        value={formik.values.type}
                        onValueChange={(value) => formik.setFieldValue("type", value)}
                        onOpenChange={() => formik.setFieldTouched("type", true)}
                    >
                        <SelectTrigger
                            id="type"
                            className={formik.errors.type && formik.touched.type ? "border-red-500" : ""}
                        >
                            <SelectValue placeholder="Select a type"/>
                        </SelectTrigger>
                        <SelectContent>
                            {TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type === ProductType.PART
                                        ? "Part"
                                        : type === ProductType.ASSEMBLY
                                            ? "Assembly"
                                            : "Material"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {formik.errors.type && formik.touched.type && (
                        <div className="text-sm text-red-500">{formik.errors.type}</div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        value={formik.values.stock}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.errors.stock && formik.touched.stock ? "border-red-500" : ""}
                    />
                    {formik.errors.stock && formik.touched.stock && (
                        <div className="text-sm text-red-500">{formik.errors.stock}</div>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                        id="supplier"
                        name="supplier"
                        placeholder="Acme Hydraulics"
                        value={formik.values.supplier}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={formik.errors.supplier && formik.touched.supplier ? "border-red-500" : ""}
                    />
                    {formik.errors.supplier && formik.touched.supplier && (
                        <div className="text-sm text-red-500">{formik.errors.supplier}</div>
                    )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" type="button" onClick={handleSuccessAction}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Saving..." : product ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </>
    )
}