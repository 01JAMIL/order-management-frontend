import { useMutation } from "@tanstack/react-query";
import { deleteMachine } from "@/services/machineService";

const useDeleteMachine = () => {
    return useMutation({
        mutationKey: ["delete-machine"],
        mutationFn: async (id: number) => await deleteMachine(id),
        retry: 0
    });
};

export default useDeleteMachine;
