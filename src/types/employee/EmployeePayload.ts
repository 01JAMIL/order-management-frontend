import {EmployeePosition} from "@/types/employee/EmployeePosition";


export interface EmployeePayload {
    name: string;
    position: EmployeePosition;
    machineId: number;
}