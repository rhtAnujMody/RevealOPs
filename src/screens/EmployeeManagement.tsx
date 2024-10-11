import AppHeaders from "@/components/common/AppHeaders";
import CommonDropdown from "@/components/common/CommonDropDown";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TEmployee, TEmployeeStore, TimelineItem } from "@/lib/model";
import useEmployeeStore from "@/stores/useEmployeesStore";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import EmployeeTimelineModal from "./EmployeeTimelineModal";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";
import { useNavigate, useParams } from "react-router-dom";

export default function EmployeeManagement() {
  const { isLoading, data, getAllEmployees, search, setSearch, getEmployeeTimeline } = useEmployeeStore(
    (state: TEmployeeStore) => ({
      isLoading: state.isLoading,
      getAllEmployees: state.getAllEmployees,
      data: state.data,
      headers: state.headers,
      search: state.search,
      setSearch: state.setSearch,
      getEmployeeTimeline: state.getEmployeeTimeline,
    })
  );
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [dates, setDates] = useState<{ [key: number]: { startDate: Date | null; endDate: Date | null } }>({})
  const [selectedBandwidth, setSelectedBandwidth] = useState<{ [key: number]: string }>({});
  const [selectedBillable, setSelectedBillable] = useState<{ [key: number]: string }>({});
  const [checkedEmployees, setCheckedEmployees] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    getAllEmployees();
  }, [search]);

  const handleEmployeeClick = async (employee: TEmployee) => {
    setSelectedEmployeeId(employee.id);
    setSelectedEmployeeName(`${employee.first_name} ${employee.last_name}`);
    const timeline = await getEmployeeTimeline(employee.id);
    setTimelineData(timeline);
    setModalOpen(true);
  };

  const handleDateChange = (employeeId: number, type: 'startDate' | 'endDate', date: Date | null) => {
    setDates((prev) => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], [type]: date },
    }));
  };

  const BillableArray = [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' },
  ];

  const BandwidthArray = [
    { label: '25%', value: '25' },
    { label: '50%', value: '50' },
    { label: '75%', value: '75' },
    { label: '100%', value: '100' },
  ];

  const bandWidthHandler = (employeeId: number, value: string) => {
    setSelectedBandwidth((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

  const billableHandler = (employeeId: number, value: string) => {
    setSelectedBillable((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
  };

  const handleCheckboxChange = (employeeId: number) => {
    setCheckedEmployees((prev) => ({
      ...prev,
      [employeeId]: !prev[employeeId],
    }));
  };

  const sortedEmployees = [...data].sort((a, b) => {
    if (checkedEmployees[a.id] && !checkedEmployees[b.id]) return -1;
    if (!checkedEmployees[a.id] && checkedEmployees[b.id]) return 1;
    return 0;
  });

  const handleSubmit = async () => {
    const selectedEmployees = sortedEmployees.filter(employee => checkedEmployees[employee.id]);

    if (selectedEmployees.length === 0) {
      console.error("No employees selected for allocation.");
      return;
    }

    const payload = selectedEmployees.map(employee => ({
      employee_id: employee.id,
      allocation_start_date: dates[employee.id]?.startDate ? dates[employee.id].startDate?.toISOString().split('T')[0] : null,
      allocation_end_date: dates[employee.id]?.endDate ? dates[employee.id].endDate?.toISOString().split('T')[0] : null,
      bandwidth_allocated: selectedBandwidth[employee.id] || null,
      billable: selectedBillable[employee.id] || null,
    }));

    try {
      // Ensure projectId is correctly inserted into the URL
      const url = constants.CREATE_RESOURCE_ALLOCATION.replace('{project_pk}', projectId as string);
      const response = await apiRequest(url, "POST", payload);
      if (response.ok) {
        console.log("Resource allocation created successfully:", response.data);
        navigate(`/projects/${projectId}`, { replace: true });
      } else {
        console.error("Failed to create resource allocation:", response.error);
      }
    } catch (error) {
      console.error("Error creating resource allocation:", error);
    }
  };

  return (
    <div className="flex flex-1 gap-10 overflow-y-auto">
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex justify-between mb-4">
          <AppHeaders
            id="resourceTitle"
            header="Resource Allocation"
            desc="Manage all resources and their details"
          />
          <button
            className="bg-primary md:text-fuchsia-50 rounded-lg p-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>

        <Input
          id="search"
          placeholder="Search by name"
          className="text-sm"
          value={search}
          onChange={(value) => {
            setSearch(value.target.value);
          }}
        />
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
                <TableHead className="w-[250px]">Allocate Bandwidth</TableHead>
                <TableHead>Billable</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEmployees?.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell className="text-center">
                    <Checkbox
                      checked={checkedEmployees[employee.id] || false}
                      onCheckedChange={() => handleCheckboxChange(employee.id)}
                    />
                  </TableCell>
                  <TableCell onClick={() => handleEmployeeClick(employee)} className="cursor-pointer">{`${employee.first_name} ${employee.last_name} (${employee.employee_id})`}</TableCell>
                  <TableCell>{employee.designation}</TableCell>
                  <TableCell>{employee.status}</TableCell>
                  <TableCell>
                    <CommonDropdown
                      items={BandwidthArray}
                      onSelect={(value) => bandWidthHandler(employee.id, value)}
                      selectedValue={selectedBandwidth[employee.id] || ''}
                      placeholder="Choose an option"
                    />
                  </TableCell>
                  <TableCell>
                    <CommonDropdown
                      items={BillableArray}
                      onSelect={(value) => billableHandler(employee.id, value)}
                      selectedValue={selectedBillable[employee.id] || ''}
                      placeholder="Choose an option"
                    />
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger>
                        {dates[employee.id]?.startDate
                          ? dates[employee.id]?.startDate?.toLocaleDateString()
                          : "Start Date"}
                      </DialogTrigger>
                      <DialogContent className="w-fit">
                        <Calendar
                          mode="single"
                          selected={dates[employee.id]?.startDate || undefined}
                          onSelect={(date) => handleDateChange(employee.id, 'startDate', date || null)}
                          initialFocus
                        />
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger>
                        {dates[employee.id]?.endDate
                          ? dates[employee.id]?.endDate?.toLocaleDateString()
                          : "End Date"}
                      </DialogTrigger>
                      <DialogContent className="w-fit">
                        <Calendar
                          mode="single"
                          selected={dates[employee.id]?.endDate || undefined}
                          onSelect={(date) => handleDateChange(employee.id, 'endDate', date || null)}
                          initialFocus
                        />
                      </DialogContent>
                    </Dialog>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <EmployeeTimelineModal
        employeeName={selectedEmployeeName}
        selectedEmployeeId={selectedEmployeeId}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        timelineData={timelineData}
      />
    </div>
  );
}
