import {useMutation} from "@tanstack/react-query";
import {createMachine} from "@/services/machineService";
import {MachinePayload} from "@/types/machine/MachinePayload";

const useCreateMachine = () => {
    return useMutation({
        mutationKey: ["create-machine"],
        mutationFn: async (payload: MachinePayload) => await createMachine(payload),
        retry: 0
    });
};

export default useCreateMachine;
