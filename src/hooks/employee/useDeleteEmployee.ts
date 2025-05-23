import { useMutation } from "@tanstack/react-query";
import { deleteEmployee } from "@/services/employeeService";

const useDeleteEmployee = () => {
    return useMutation({
        mutationKey: ["delete-employee"],
        mutationFn: async (id: number) => await deleteEmployee(id),
        retry: 0
    });
};

export default useDeleteEmployee;
