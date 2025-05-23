import {Machine} from "@/types/machine/Machine";
import axiosInstance from "@/services/axiosInstance";
import {MachinePayload} from "@/types/machine/MachinePayload";

export const getAllMachines = async (): Promise<Machine[]> => {
    try {
        const response = await axiosInstance.get<Machine[]>("/machines/");
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createMachine = async (payload: MachinePayload): Promise<Machine> => {
    try {
        const response = await axiosInstance.post<Machine>("/machines/", payload);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateMachine = async (id: number, payload: MachinePayload): Promise<Machine> => {
    try {
        const response = await axiosInstance.put<Machine>(`/machines/${id}`, payload);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteMachine = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/machines/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
