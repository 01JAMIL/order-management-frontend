import {ManufacturingOrderStatus} from "@/types/Order/ManufacturingOrderStatus";


export interface UpdateManufacturingOrderPayload {
    project: string;
    status: ManufacturingOrderStatus;
    quantity: number;
    date: string;
    productId: number;
    machineId: number;
}