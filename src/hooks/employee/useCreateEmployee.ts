import { useMutation } from "@tanstack/react-query";
import { EmployeePayload } from "@/types/employee/EmployeePayload";
import { createEmployee } from "@/services/employeeService";

const useCreateEmployee = () => {
    return useMutation({
        mutationKey: ["create-employee"],
        mutationFn: async (payload: EmployeePayload) => await createEmployee(payload),
        retry: 0
    });
};

export default useCreateEmployee;
