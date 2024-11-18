import AppHeaders from "@/components/common/AppHeaders";
import { AppTable } from "@/components/common/AppTable";
import { Input } from "@/components/ui/input";
import { RefreshCw, PlusCircle, Search, X, ChevronLeft, ChevronRight, CalendarIcon, XCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import debounce from 'lodash/debounce';
import { useNavigate } from "react-router-dom";
import useEmployeesListStore from "@/stores/useEmployeesListStore";
import CommonDropdown from "@/components/common/CommonDropDown";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MultiSelect } from "react-multi-select-component";

export default function EmployeesList() {
  const {
    isLoading,
    data,
    headers,
    filters,
    currentPage,
    totalPages,
    setFilters,
    setCurrentPage,
    getAllEmployees,
    clearFilters,
  } = useEmployeesListStore();

  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Initial load');
    setFilters({ ...filters, date: format(new Date(), 'yyyy-MM-dd') });
    getAllEmployees();
  }, []); // Initial load

  useEffect(() => {
    console.log('Filters or page changed:', { filters, currentPage });
    getAllEmployees();
  }, [filters, currentPage]);

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setFilters({ search: value });
    }, 300),
    [setFilters]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value.trim());
    debouncedSetSearch(value.trim());
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
    clearFilters();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setSelectedDate(formattedDate);
      setFilters({ ...filters, date: formattedDate });
    }
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the popover from opening
    const today = format(new Date(), 'yyyy-MM-dd');
    setSelectedDate(today);
    setFilters({ ...filters, date: today });
  };

  console.log('Rendering with data:', data);

  const formattedData = data.map(employee => ({
    id: employee.id,
    employee_id: employee.employee_id,
    name: `${employee.first_name} ${employee.last_name}`,
    business_unit: employee.business_unit,
    designation: employee.designation,
    team: employee.team,
    status: employee.status,
    allocation_status: employee.allocation_status,
    bandwidth_available: `${employee.bandwidth_available}%`,
  }));

  const tableHeaders = [
    { key: "employee_id", label: "Employee ID" },
    { key: "name", label: "Name" },
    { key: "business_unit", label: "Business Unit" },
    { key: "designation", label: "Designation" },
    { key: "team", label: "Team" },
    { key: "status", label: "Status" },
    { key: "allocation_status", label: "Allocation Status" },
    { key: "bandwidth_available", label: "Available Bandwidth" },
  ];

  const skillsOptions = [
    { label: "Grapes 🍇", value: "grapes" },
    { label: "Mango 🥭", value: "mango" },
    { label: "Strawberry 🍓", value: "strawberry", disabled: true },
  ];

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-6">
      <div className="flex justify-between items-center w-full">
        <AppHeaders
          id="employeesTitle"
          header="Employees"
          desc="Manage all employees and their details"
        />
      </div>
      
      <div className="flex flex-wrap gap-4">
        <div className="w-full max-w-md relative">
          <Input
            id="search"
            placeholder="Search employees..."
            className="pl-10 pr-10"
            value={localSearch}
            onChange={handleSearchChange}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="w-52 relative">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full pr-10 justify-start text-left font-normal"
              >
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>
                    {selectedDate ? format(new Date(selectedDate), "MMMM do, yyyy") : "Pick a date"}
                  </span>
                </div>
              </Button>
            </PopoverTrigger>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {selectedDate && (
                <button
                  onClick={handleClearDate}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(selectedDate) : undefined}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <CommonDropdown
          items={[
            { label: "All", value: "" },
            { label: "ENG BU", value: "ENG BU" },
            { label: "AI BU", value: "AI BU" },
          ]}
          onSelect={(value) => setFilters({ ...filters, business_unit: value })}
          selectedValue={filters.business_unit || ""}
          placeholder="Business Unit"
        />

        <CommonDropdown
          items={[
            { label: "All", value: "" },
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ]}
          onSelect={(value) => setFilters({ status: value })}
          selectedValue={filters.status || ""}
          placeholder="Status"
        />

        <CommonDropdown
          items={[
            { label: "All", value: "" },
            { label: "On Bench", value: "on_bench" },
            { label: "Allocated", value: "allocated" },
            { label: "Partially Allocated", value: "partially_allocated" }
          ]}
          onSelect={(value) => setFilters({ availability: value })}
          selectedValue={filters.availability || ""}
          placeholder="Availability"
        />
        {/* <MultiSelect
          options={skillsOptions}
          value={selectedSkills}
          onChange={setSelectedSkills}
          labelledBy="Select"
          className="w-48"
      /> */}
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      ) : formattedData.length > 0 ? (
        <>
          <div className="flex-1 min-h-0">
            <div className="h-full flex flex-col bg-white rounded-lg shadow">
              <div className="flex-1 overflow-auto">
                <AppTable
                  headers={tableHeaders}
                  rows={formattedData}
                  fixedColumns={false}
                  onClick={(row) => {
                    console.log('Row clicked:', row);
                    navigate(`/employees/${row.id}`);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              isLoading={isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              isLoading={isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
          No Employees Found
        </div>
      )}
    </div>
  );
}
