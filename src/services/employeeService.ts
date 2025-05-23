import {Employee} from "@/types/employee/Employee";
import axiosInstance from "@/services/axiosInstance";
import {EmployeePayload} from "@/types/employee/EmployeePayload";

export const getEmployees = async (): Promise<Employee[]> => {
    try {
        const response = await axiosInstance.get<Employee[]>("/employees/");
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const createEmployee = async (payload: EmployeePayload): Promise<Employee> => {
    try {
        const response = await axiosInstance.post<Employee>("/employees/", payload);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const updateEmployee = async (id: number, payload: EmployeePayload): Promise<Employee> => {
    try {
        const response = await axiosInstance.put<Employee>(`/employees/${id}`, payload);
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteEmployee = async (id: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/employees/${id}`);
    } catch (error) {
        return Promise.reject(error);
    }
};
