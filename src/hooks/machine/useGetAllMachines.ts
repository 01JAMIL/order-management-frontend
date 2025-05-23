import {useQuery} from "@tanstack/react-query";
import {getAllMachines} from "@/services/machineService";

const useGetAllMachines = () => {
    return useQuery({
        queryKey: ["get-all-machines"],
        queryFn: getAllMachines,
        retry: 0,
        refetchOnMount: false,
        refetchInterval: false
    });
};

export default useGetAllMachines;
