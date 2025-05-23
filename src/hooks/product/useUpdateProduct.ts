import {useMutation} from "@tanstack/react-query";
import {ProductPayload} from "@/types/product/ProductPayload";
import {updateProduct} from "@/services/productService";


const useUpdateProduct = () => {
    return useMutation({
        mutationKey: ["update-product"],
        mutationFn: async ({id, payload}: { id: number; payload: ProductPayload }) => await updateProduct(id, payload),
        retry: 0
    })
}

export default useUpdateProduct