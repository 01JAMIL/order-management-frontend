import {ProductType} from "@/types/product/ProductType";


export interface ProductPayload {
    name: string;
    type: ProductType;
    stock: number;
    supplier: string;
}