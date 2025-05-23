import { useQuery } from "@tanstack/react-query";
import { getEmployees } from "@/services/employeeService";

const useGetAllEmployees = () => {
    return useQuery({
        queryKey: ["get-all-employees"],
        queryFn: getEmployees,
        retry: 0,
        refetchOnMount: false,
        refetchInterval: false
    });
};

export default useGetAllEmployees;
