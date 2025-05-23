import {useMutation} from "@tanstack/react-query";
import {deleteProduct} from "@/services/productService";


const useDeleteProduct = () => {
    return useMutation({
        mutationKey: ["delete-product"],
        mutationFn: async (id: number) => await deleteProduct(id),
        retry: 0
    })
}

export default useDeleteProduct