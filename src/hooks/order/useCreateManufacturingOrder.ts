import { useMutation } from "@tanstack/react-query";
import { CreateManufacturingOrderPayload } from "@/types/Order/CreateManufacturingOrderPayload";
import { createManufacturingOrder } from "@/services/manufacturingOrderService";

const useCreateManufacturingOrder = () => {
    return useMutation({
        mutationKey: ["create-manufacturing-order"],
        mutationFn: async (payload: CreateManufacturingOrderPayload) => await createManufacturingOrder(payload),
        retry: 0
    });
};

export default useCreateManufacturingOrder;
