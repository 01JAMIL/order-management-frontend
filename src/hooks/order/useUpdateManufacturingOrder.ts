import { useMutation } from "@tanstack/react-query";
import { UpdateManufacturingOrderPayload } from "@/types/Order/UpdateManufacturingOrderPayload";
import { updateManufacturingOrder } from "@/services/manufacturingOrderService";

const useUpdateManufacturingOrder = () => {
    return useMutation({
        mutationKey: ["update-manufacturing-order"],
        mutationFn: async ({ id, payload }: { id: number; payload: UpdateManufacturingOrderPayload }) => 
            await updateManufacturingOrder(id, payload),
        retry: 0
    });
};

export default useUpdateManufacturingOrder;
