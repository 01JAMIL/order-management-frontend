import {useQuery} from "@tanstack/react-query";
import {getManufacturingOrders} from "@/services/manufacturingOrderService";

const useGetManufacturingOrders = () => {
    return useQuery({
        queryKey: ["get-manufacturing-orders"],
        queryFn: getManufacturingOrders,
        retry: 0,
        refetchOnMount: false,
        refetchInterval: false
    });
};

export default useGetManufacturingOrders;
