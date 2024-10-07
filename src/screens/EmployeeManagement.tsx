import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TEmployeeStore } from "@/lib/model";
import useEmployeeStore from "@/stores/useEmployeesStore";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

export default function EmployeeManagement() {
  const { isLoading, data, getAllEmployees } = useEmployeeStore(
    (state: TEmployeeStore) => ({
      isLoading: state.isLoading,
      getAllEmployees: state.getAllEmployees,
      data: state.data,
    })
  );

  useEffect(() => {
    getAllEmployees();
  }, []);

  return (
    <div className="flex flex-1">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <ReloadIcon className="animate-spin flex flex-1 items-center justify-center w-8 h-8" />
        </div>
      ) : (
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[250px]">Available Bandwidth</TableHead>
              <TableHead>Billable</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((employee, index) => (
              <TableRow key={index}>
                <TableCell className="text-center">
                  <Checkbox />
                </TableCell>
                <TableCell>{`${employee.first_name} ${employee.last_name} (${employee.employee_id})`}</TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>{employee.status}</TableCell>
                <TableCell>Yes</TableCell>
                <Popover>
                  <PopoverTrigger>
                    <Dialog>
                      <DialogTrigger>
                        <TableCell>Start Date</TableCell>
                      </DialogTrigger>
                      <DialogContent className="w-fit">
                        <Calendar
                          mode="single"
                          initialFocus
                          className="w-full"
                        />
                      </DialogContent>
                    </Dialog>
                  </PopoverTrigger>
                </Popover>
                <TableCell>End Date</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
