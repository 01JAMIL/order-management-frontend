import {MachineStatus} from "@/types/machine/MachineStatus";


export interface MachinePayload {
    name: string;
    status: MachineStatus;
    lastMaintenanceDate: string;

}