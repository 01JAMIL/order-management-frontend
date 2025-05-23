export interface CreateManufacturingOrderPayload {
    project: string;
    quantity: number;
    date: string;
    productId: number;
    machineId: number;
}