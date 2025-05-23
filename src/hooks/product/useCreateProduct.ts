import { useMutation } from "@tanstack/react-query";
import {ProductPayload} from "@/types/product/ProductPayload";
import {createProduct} from "@/services/productService";



const useCreateProduct = () => {
    return useMutation({
        mutationKey: ["create-product"],
        mutationFn: async (payload: ProductPayload) => await createProduct(payload),
        retry: 0
    })
}

export default useCreateProduct;