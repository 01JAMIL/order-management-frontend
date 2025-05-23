import { useMutation } from "@tanstack/react-query";
import { EmployeePayload } from "@/types/employee/EmployeePayload";
import { updateEmployee } from "@/services/employeeService";

const useUpdateEmployee = () => {
    return useMutation({
        mutationKey: ["update-employee"],
        mutationFn: async ({ id, payload }: { id: number; payload: EmployeePayload }) => 
            await updateEmployee(id, payload),
        retry: 0
    });
};

export default useUpdateEmployee;
