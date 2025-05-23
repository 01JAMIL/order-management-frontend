import {EmployeePosition} from "@/types/employee/EmployeePosition";
import {Machine} from "@/types/machine/Machine";


export interface Employee {
    id: number;
    name: string;
    position: EmployeePosition;
    employeeMachine: Machine;
    createdAt: string;
    updatedAt: string;
}