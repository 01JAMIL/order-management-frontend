import { useMutation } from "@tanstack/react-query";
import { deleteManufacturingOrder } from "@/services/manufacturingOrderService";

const useDeleteManufacturingOrder = () => {
    return useMutation({
        mutationKey: ["delete-manufacturing-order"],
        mutationFn: async (id: number) => await deleteManufacturingOrder(id),
        retry: 0
    });
};

export default useDeleteManufacturingOrder;
