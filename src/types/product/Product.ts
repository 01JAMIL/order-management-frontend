import {ProductType} from "@/types/product/ProductType";


export interface Product {
    id: number;
    name: string;
    type: ProductType;
    stock: number;
    supplier: string;
    createdAt: string;
    updatedAt: string;
}