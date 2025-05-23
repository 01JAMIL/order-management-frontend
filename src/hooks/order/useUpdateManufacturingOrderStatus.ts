import { useMutation } from "@tanstack/react-query";
import { ManufacturingOrderStatus } from "@/types/Order/ManufacturingOrderStatus";
import { updateManufacturingOrderStatus } from "@/services/manufacturingOrderService";

const useUpdateManufacturingOrderStatus = () => {
    return useMutation({
        mutationKey: ["update-manufacturing-order-status"],
        mutationFn: async ({ id, status }: { id: number; status: ManufacturingOrderStatus }) => 
            await updateManufacturingOrderStatus(id, status),
        retry: 0
    });
};

export default useUpdateManufacturingOrderStatus;
