import {useMutation} from "@tanstack/react-query";
import {updateMachine} from "@/services/machineService";
import {MachinePayload} from "@/types/machine/MachinePayload";

const useUpdateMachine = () => {
    return useMutation({
        mutationKey: ["update-machine"],
        mutationFn: async ({id, payload}: { id: number; payload: MachinePayload }) => await updateMachine(id, payload),
        retry: 0
    });
};

export default useUpdateMachine;
