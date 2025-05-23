import {ManufacturingOrderStatus} from "@/types/Order/ManufacturingOrderStatus";
import {Product} from "@/types/product/Product";
import {Machine} from "@/types/machine/Machine";

export interface ManufacturingOrder {
    id: number;
    project: string;
    status: ManufacturingOrderStatus;
    quantity: number;
    date: string;
    product: Product;
    machine: Machine;
    createdAt: string;
    updatedAt: string;
}