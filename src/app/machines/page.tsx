"use client"

import {useState} from "react"
import {Plus} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog"
import {MachineForm} from "@/components/MachineForm"
import {Machine} from "@/types/machine/Machine"
import useGetAllMachines from "@/hooks/machine/useGetAllMachines"
import useDeleteMachine from "@/hooks/machine/useDeleteMachine"
import {toast} from "sonner"
import {useQueryClient} from "@tanstack/react-query"
import {MachinesTable} from "@/components/MachineTable";

export default function MachinesPage() {
    const queryClient = useQueryClient()

    const {
        data: machines = [],
        isPending,
    } = useGetAllMachines()
    const {
        mutateAsync,
        isPending: isDeletePending,
    } = useDeleteMachine()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)

    const handleEdit = (machine: Machine) => {
        setSelectedMachine(machine)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: number) => {
        try {
            await mutateAsync(id)
            queryClient.setQueryData<Machine[]>(["get-all-machines"], (oldData = []) =>
                oldData.filter((machine) => machine.id !== id)
            )
            toast.success("Machine deleted successfully")
        } catch (error) {
            console.error("Error deleting machine:", error)
            toast.error("Failed to delete machine")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Machines</h1>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button id="add-machine-btn" onClick={() => setSelectedMachine(null)}>
                            <Plus className="mr-2 h-4 w-4"/>
                            Add Machine
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <MachineForm
                            machine={selectedMachine}
                            handleSuccessAction={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <MachinesTable
                data={machines}
                handleEditAction={handleEdit}
                handleDeleteAction={handleDelete}
                isDeleteLoading={isDeletePending}
                isLoading={isPending}
            />
        </div>
    )
}