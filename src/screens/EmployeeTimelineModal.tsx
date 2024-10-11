import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TimelineItem } from "@/lib/model";
import { Calendar } from "@/components/ui/calendar";
import CommonDropdown from "@/components/common/CommonDropDown";
import { useEffect, useState } from "react";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";

interface EmployeeTimelineModalProps {
  employeeName: string | null;
  isOpen: boolean;
  onClose: () => void;
  timelineData: TimelineItem[];
  selectedEmployeeId: number | null;
}

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

const EmployeeTimelineModal: React.FC<EmployeeTimelineModalProps> = ({ employeeName, isOpen, onClose, timelineData, selectedEmployeeId }) => {
  const [editableData, setEditableData] = useState<TimelineItem[]>(timelineData);

  useEffect(() => {
    setEditableData(timelineData);
  }, [timelineData]);

  const updateProject = async (project: TimelineItem) => {
    if (selectedEmployeeId === null) {
      console.error("No employee selected.");
      return;
    }

    try {
      const response = await apiRequest<TimelineItem>(
        constants.UPDATE_EMPLOYEE_TIMELINE
          .replace('{employee_id}', selectedEmployeeId.toString())
          .replace('{project_id}', project.id.toString()),
        "PATCH",
        project
      );

      if (response.ok) {
        console.log("Update successful:", response.data);
      } else {
        console.error("Update failed:", response.error);
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const handleDateChange = async (index: number, type: 'allocation_start_date' | 'allocation_end_date', date: Date | null) => {
    const updatedData = [...editableData];
    updatedData[index] = { ...updatedData[index], [type]: date ? date.toISOString().split('T')[0] : null };
    setEditableData(updatedData);
    await updateProject(updatedData[index]);
  };

  const handleDropdownChange = async (index: number, type: 'bandwidth_allocated' | 'billable', value: string) => {
    const updatedData = [...editableData];
    updatedData[index] = { ...updatedData[index], [type]: value };
    setEditableData(updatedData);
    await updateProject(updatedData[index]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <button className="hidden">Open Modal</button>
      </DialogTrigger>
      <DialogContent className="w-[80%] max-w-[800px] p-6 rounded-lg shadow-lg bg-white">
        <DialogTitle className="text-lg font-semibold mb-4">Employee Timeline</DialogTitle>
        <DialogTitle className="text-lg font-semibold mb-4">{employeeName}</DialogTitle>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-300 p-2 text-left">Project Name</th>
              <th className="border-b-2 border-gray-300 p-2 text-left">Role</th>
              <th className="border-b-2 border-gray-300 p-2 text-left">Allocation Start Date</th>
              <th className="border-b-2 border-gray-300 p-2 text-left">Allocation End Date</th>
              <th className="border-b-2 border-gray-300 p-2 text-left">Bandwidth Allocated</th>
              <th className="border-b-2 border-gray-300 p-2 text-left">Billable</th>
            </tr>
          </thead>
          <tbody>
            {editableData.map((item, index) => (
              <tr key={item.id} className="hover:bg-gray-100">
                <td className="border-b p-2">{item.project_name}</td>
                <td className="border-b p-2">{item.role}</td>
                <td className="border-b p-2">
                  <Dialog>
                    <DialogTrigger>
                      {item.allocation_start_date
                        ? new Date(item.allocation_start_date).toLocaleDateString()
                        : "Start Date"}
                    </DialogTrigger>
                    <DialogContent className="w-fit">
                      <Calendar
                        mode="single"
                        selected={item.allocation_start_date ? new Date(item.allocation_start_date) : undefined}
                        onSelect={(date) => handleDateChange(index, 'allocation_start_date', date || null)}
                        initialFocus
                      />
                    </DialogContent>
                  </Dialog>
                </td>
                <td className="border-b p-2">
                  <Dialog>
                    <DialogTrigger>
                      {item.allocation_end_date
                        ? new Date(item.allocation_end_date).toLocaleDateString()
                        : "End Date"}
                    </DialogTrigger>
                    <DialogContent className="w-fit">
                      <Calendar
                        mode="single"
                        selected={item.allocation_end_date ? new Date(item.allocation_end_date) : undefined}
                        onSelect={(date) => handleDateChange(index, 'allocation_end_date', date || null)}
                        initialFocus
                      />
                    </DialogContent>
                  </Dialog>
                </td>
                <td className="border-b p-2">
                  <CommonDropdown
                    items={BandwidthArray}
                    onSelect={(value) => handleDropdownChange(index, 'bandwidth_allocated', value)}
                    placeholder="Choose Bandwidth"
                    selectedValue={item?.bandwidth_allocated?.toString()}
                  />
                </td>
                <td className="border-b p-2">
                  <CommonDropdown
                    items={BillableArray}
                    onSelect={(value) => handleDropdownChange(index, 'billable', value)}
                    placeholder="Choose Billable"
                    selectedValue={item?.billable || null}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <button onClick={handleUpdate} className="mt-4 bg-blue-500 text-white p-2 rounded">
          Update
        </button> */}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeTimelineModal;
