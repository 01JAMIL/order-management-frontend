import {useQuery} from "@tanstack/react-query";
import {getAllProducts} from "@/services/productService";


const useGetAllProducts = () => {
    return useQuery({
        queryKey: ["get-all-products"],
        queryFn: getAllProducts,
        retry: 0,
        refetchOnMount: false,
        refetchInterval: false
    })
}

export default useGetAllProducts;