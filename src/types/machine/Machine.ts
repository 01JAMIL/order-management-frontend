import {MachineStatus} from "@/types/machine/MachineStatus";


export interface Machine {
    id: number;
    name: string;
    status: MachineStatus;
    lastMaintenanceDate: string;
    createdAt: string;
    updatedAt: string;
}