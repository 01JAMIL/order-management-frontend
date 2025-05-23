import {ManufacturingOrder} from "@/types/Order/ManufacturingOrder";
import axiosInstance from "@/services/axiosInstance";
import {CreateManufacturingOrderPayload} from "@/types/Order/CreateManufacturingOrderPayload";
import {UpdateManufacturingOrderPayload} from "@/types/Order/UpdateManufacturingOrderPayload";
import {ManufacturingOrderStatus} from "@/types/Order/ManufacturingOrderStatus";


export const getManufacturingOrders = async (): Promise<ManufacturingOrder[]> => {
    try {
        const response = await axiosInstance.get<ManufacturingOrder[]>("/manufacturing-orders/");
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const createManufacturingOrder = async (payload: CreateManufacturingOrderPayload): Promise<ManufacturingOrder> => {
    try {
        const response = await axiosInstance.post<ManufacturingOrder>("/manufacturing-orders/", payload);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const updateManufacturingOrder = async (id: number, payload: UpdateManufacturingOrderPayload): Promise<ManufacturingOrder> => {
    try {
        const response = await axiosInstance.put<ManufacturingOrder>(`/manufacturing-orders/${id}`, payload);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const updateManufacturingOrderStatus = async (id: number, status: ManufacturingOrderStatus): Promise<ManufacturingOrder> => {
    try {
        const response = await axiosInstance.put<ManufacturingOrder>(`/manufacturing-orders/${id}/status`, {
            status
        });
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}


export const deleteManufacturingOrder = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete<void>(`/manufacturing-orders/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
}