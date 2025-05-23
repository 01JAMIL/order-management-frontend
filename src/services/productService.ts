import {Product} from "@/types/product/Product";
import axiosInstance from "@/services/axiosInstance";
import {ProductPayload} from "@/types/product/ProductPayload";


export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const response = await axiosInstance.get<Product[]>("/products/");
        return response.data;
    } catch (error) {
        return Promise.reject(error)
    }
}

export const createProduct = async (payload: ProductPayload): Promise<Product> => {
    try {
        const response = await axiosInstance.post<Product>("/products/", payload);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}

export const updateProduct = async (id: number, payload: ProductPayload): Promise<Product> => {
    try {
        const response = await axiosInstance.put<Product>(`/products/${id}`, payload);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const deleteProduct = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/products/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
}