import CommonDropdown from "@/components/common/CommonDropDown";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import constants from "@/lib/constants";
import { TEmployee, TEmployeeStore, TimelineItem, TResourceAllocation } from "@/lib/model";
import { apiRequest } from "@/network/apis";
import useEmployeeStore from "@/stores/useEmployeesStore";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import * as Tooltip from '@radix-ui/react-tooltip';
import { Eye, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useNavigate, useParams } from "react-router-dom";
import EmployeeTimelineModal from "./EmployeeTimelineModal";
import { format, parseISO } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export default function EmployeeManagement() {
  const { isLoading, data, getAllEmployees, search, setSearch, getEmployeeTimeline } = useEmployeeStore(
    (state: TEmployeeStore) => ({
      isLoading: state.isLoading,
      getAllEmployees: state.getAllEmployees,
      data: state.data,
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
  const [dates, setDates] = useState<{ [key: number]: { startDate: Date | null; endDate: Date | null } }>({});
  const [selectedBandwidth, setSelectedBandwidth] = useState<{ [key: number]: string }>({});
  const [selectedBillable, setSelectedBillable] = useState<{ [key: number]: string }>({});
  const [checkedEmployees, setCheckedEmployees] = useState<{ [key: number]: boolean }>({});
  const [errors, setErrors] = useState<{ [key: number]: string }>({});

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

  const fetchTimelineData = async (resource: TResourceAllocation) => {
    try {
      const timeline = await getEmployeeTimeline(selectedEmployeeId);
      setTimelineData(timeline);
    } catch (error) {
      console.error("Error fetching employee timeline:", error);
      toast.error("Failed to fetch employee timeline");
    }
  };

  const handleDateChange = (employeeId: number, type: 'startDate' | 'endDate', date: Date | null) => {
    setDates((prev) => ({
      ...prev,
      [employeeId]: { ...prev[employeeId], [type]: date },
    }));
    validateEmployeeFields(employeeId);
  };

  const handleUpdateTimeline = useCallback(() => {
    getAllEmployees();
  }, [getAllEmployees]);

  const BillableArray = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  const BandwidthArray = [
    { label: '25%', value: '25' },
    { label: '50%', value: '50' },
    { label: '75%', value: '75' },
    { label: '100%', value: '100' },
  ];
  const getAvailableBandwidthOptions = (availableBandwidth: string) => {
    const options = [];
    if (availableBandwidth == '0') options.push();
    if (availableBandwidth == '25') options.push({ label: '25%', value: '25' });
    if (availableBandwidth == '50') options.push({ label: '25%', value: '25' }, { label: '50%', value: '50' });
    if (availableBandwidth == '75') options.push({ label: '25%', value: '25' }, { label: '50%', value: '50' }, { label: '75%', value: '75' });
    if (availableBandwidth == '100') options.push({ label: '25%', value: '25' }, { label: '50%', value: '50' }, { label: '75%', value: '75' }, { label: '100%', value: '100' });
    return options;
  };

  const bandWidthHandler = (employeeId: number, value: string) => {
    setSelectedBandwidth((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
    validateEmployeeFields(employeeId);
  };

  const billableHandler = (employeeId: number, value: string) => {
    setSelectedBillable((prev) => ({
      ...prev,
      [employeeId]: value,
    }));
    validateEmployeeFields(employeeId);
  };

  const validateEmployeeFields = (employeeId: number): boolean => {
    const bandwidth = selectedBandwidth[employeeId];
    const billable = selectedBillable[employeeId];
    const startDate = dates[employeeId]?.startDate;
    const endDate = dates[employeeId]?.endDate;

    if (!bandwidth || !billable || !startDate || !endDate) {
      setErrors(prev => ({
        ...prev,
        [employeeId]: "Please fill all fields before selecting the employee."
      }));
      return false;
    }

    setErrors(prev => ({ ...prev, [employeeId]: "" }));
    return true;
  };

  const handleCheckboxChange = (employeeId: number) => {
    if (checkedEmployees[employeeId]) {
      setCheckedEmployees((prev) => ({
        ...prev,
        [employeeId]: false,
      }));
    } else {
      if (validateEmployeeFields(employeeId)) {
        setCheckedEmployees((prev) => ({
          ...prev,
          [employeeId]: true,
        }));
      } else {
        toast.error("Please fill all fields before selecting the employee.");
      }
    }
  };

  const sortedEmployees = [...data].sort((a, b) => {
    if (checkedEmployees[a.id] && !checkedEmployees[b.id]) return -1;
    if (!checkedEmployees[a.id] && checkedEmployees[b.id]) return 1;
    return 0;
  });

  const handleSubmit = async () => {
    const selectedEmployees = sortedEmployees.filter(employee => checkedEmployees[employee.id]);

    if (selectedEmployees.length === 0) {
      toast.error("No employees selected for allocation.");
      return;
    }

    const payload = selectedEmployees.map(employee => {
      const startDate = dates[employee.id]?.startDate;
      const endDate = dates[employee.id]?.endDate;

      return {
        employee: employee.id,
        role: employee.designation,
        allocation_start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
        allocation_end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        bandwidth_allocated: selectedBandwidth[employee.id] || null,
        billable: selectedBillable[employee.id] || null,
      };
    });

    try {
      const url = constants.CREATE_RESOURCE_ALLOCATION.replace('{project_pk}', projectId as string);
      const response = await apiRequest(url, "POST", payload);
      if (response.ok) {
        toast.success("Resource allocation created successfully");
        navigate(`/projects/${projectId}`, { replace: true });
      } else {
        toast.error("Failed to create resource allocation");
      }
    } catch (error) {
      console.error("Error creating resource allocation:", error);
      toast.error("An error occurred while creating resource allocation");
    }
  };

  const handleBackClick = () => {
    navigate(-1); // This will go back to the previous page in the browser history
  };

  // const handleUpdateTimeline = (updatedTimeline: TimelineItem[]) => {
  //   setTimelineData(updatedTimeline);
  // };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between bg-white shadow-sm p-4 rounded-lg sticky top-0 z-10 ps-0">
          <Button
            onClick={handleBackClick}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Allocate Resources</h1>
        </div>

        <div className="flex justify-between items-center">
          <div className="w-full max-w-md relative">
            <Input
              id="search"
              placeholder="Search by Name and Role"
              className="pl-10 pr-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          <Button
            onClick={handleSubmit}
            className="bg-primary text-white hover:bg-primary/90"
          >
            Submit
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="flex flex-1">
            <Tooltip.Provider>
              <Table className="border w-full h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px] sticky top-0 bg-white z-10"></TableHead>
                    <TableHead className="sticky top-0 bg-white z-10">Name</TableHead>
                    <TableHead className="sticky top-0 bg-white z-10">Role</TableHead>
                    <TableHead className="sticky top-0 bg-white z-10">Available Bandwidth</TableHead>
                    <TableHead className="sticky top-0 bg-white z-10">Allocate Bandwidth</TableHead>
                    <TableHead className="sticky top-0 bg-white z-10">Billable</TableHead>
                    <TableHead className="sticky top-0 bg-white z-10">Start Date</TableHead>
                    <TableHead className="sticky top-0 bg-white z-10">End Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedEmployees?.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={checkedEmployees[employee.id] || false}
                          onCheckedChange={() => handleCheckboxChange(employee.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-between">
                          <span>{`${employee.first_name} ${employee.last_name} (${employee.employee_id})`}</span>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEmployeeClick(employee)}
                                className="ml-2"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="bg-gray-800 text-white text-xs rounded py-1 px-2 z-50"
                                sideOffset={5}
                              >
                                View and edit employee's existing project allocations
                                <Tooltip.Arrow className="fill-gray-800" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </div>
                      </TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>{employee.bandwidth_available}%</TableCell>
                      <TableCell>
                        <CommonDropdown
                          items={getAvailableBandwidthOptions(employee.bandwidth_available)}
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
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline">
                              {dates[employee.id]?.startDate
                                ? format(dates[employee.id].startDate, 'yyyy-MM-dd')
                                : "Start Date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dates[employee.id]?.startDate}
                              onSelect={(date) => handleDateChange(employee.id, 'startDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline">
                              {dates[employee.id]?.endDate
                                ? format(dates[employee.id].endDate, 'yyyy-MM-dd')
                                : "End Date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dates[employee.id]?.endDate}
                              onSelect={(date) => handleDateChange(employee.id, 'endDate', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Tooltip.Provider>
          </div>
        )}
      </div>
      <EmployeeTimelineModal
        employeeName={selectedEmployeeName || ''}
        employeeId={selectedEmployeeId || 0}
        selectedEmployeeId={selectedEmployeeId || 0}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        timelineData={timelineData}
        onUpdateTimeline={handleUpdateTimeline}
        projectId={projectId}
        isLoading={false}
        fetchTimelineData={fetchTimelineData}
      />
    </div>
  );
}
