import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { TimelineItem } from "@/lib/model";
import { CalendarIcon, BriefcaseIcon, PercentIcon, DollarSignIcon, PencilIcon, CheckIcon, XIcon, Trash2Icon } from 'lucide-react';
import { format, isBefore, isAfter, isWithinInterval, parseISO } from 'date-fns';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import CommonDropdown from "@/components/common/CommonDropDown";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";
import toast from 'react-hot-toast';

interface EmployeeTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
  selectedEmployeeId: number;
  employeeName: string;
  projectId: string | undefined;
  isLoading: boolean;
  timelineData: TimelineItem[];
  onUpdateTimeline: () => void;
}

const EmployeeTimelineModal: React.FC<EmployeeTimelineModalProps> = ({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  isLoading,
  timelineData: initialTimelineData,
  selectedEmployeeId,
  onUpdateTimeline,
}) => {
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<TimelineItem>>({});
  const [timelineData, setTimelineData] = useState<TimelineItem[]>(initialTimelineData);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<TimelineItem | null>(null);
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({});

  // Update timelineData when props change
  useEffect(() => {
    console.log('Timeline data updated:', initialTimelineData);
    setTimelineData(initialTimelineData);
  }, [initialTimelineData]);
  useEffect(() => {
    console.log('editedValues updated:', editedValues);
  }, [editedValues]);

  const handleEdit = (item: TimelineItem) => {
    console.log('handleEdit called with item:', item);
    setEditingItem(item);
    setEditedValues({
      ...item,
      allocation_start_date: item.allocation_start_date || null,
      allocation_end_date: item.allocation_end_date || null,
      billable: item.billable
    });
    console.log('editedValues set to:', editedValues);
  };

  const handleSave = async () => {
    if (!editingItem || isLoading) {
      toast.error("Unable to update: Missing employee or timeline information.");
      return;
    }

    try {
      const updatedItem = {
        ...editingItem,
        ...editedValues,
        billable: editedValues.billable
      };
      console.log('Sending updated item to API:', updatedItem);
      const response = await apiRequest<TimelineItem>(
        constants.UPDATE_EMPLOYEE_TIMELINE
          .replace('{employee_id}', selectedEmployeeId.toString())
          .replace('{project_id}', editingItem.project_id.toString())
          .replace('{allocation_id}', editingItem.id.toString()),
        "PATCH",
        updatedItem
      );

      if (response.ok && response.data) {
        toast.success("The allocation has been updated successfully.");

        // Fetch the latest data after successful update
        const latestData = await getEmployeeTimeline(employeeId);

        setTimelineData(latestData);
        onUpdateTimeline(); // Call this function to update the parent component
        setEditingItem(null);
        setEditedValues({});
      } else {
        toast.error("Failed to update the allocation. Please try again.");
      }
    } catch (error) {
      console.error("Error updating allocation:", error);
      toast.error("An error occurred while updating the allocation.");
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditedValues({});
  };

  const handleInputChange = (name: string, value: string | number | Date | null) => {
    setEditedValues(prev => {
      let newValue = value;
      if (value instanceof Date) {
        newValue = value.toISOString().split('T')[0];
      }
      return { ...prev, [name]: newValue };
    });
  };

  const bandwidthOptions = [
    // { label: '0%', value: '0' },
    { label: '25%', value: '25' },
    { label: '50%', value: '50' },
    { label: '75%', value: '75' },
    { label: '100%', value: '100' },
  ];

  const billableOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  const getStatusTag = (startDate: string | null, endDate: string | null) => {
    const now = new Date();
    const start = new Date(startDate || now);
    const end = endDate ? new Date(endDate) : null;

    if (end && isBefore(end, now)) {
      return <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold">Completed</span>;
    } else if (isWithinInterval(now, { start, end: end || now })) {
      return <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Active</span>;
    } else if (isAfter(start, now)) {
      return <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">Upcoming</span>;
    }
    return null;
  };

  const getEmployeeTimeline = async (): Promise<TimelineItem[]> => {
    try {
      const response = await apiRequest<TimelineItem[]>(
        constants.EMPLOYEE_TIMELINE.replace('{employee_id}', selectedEmployeeId.toString()),
        "GET"
      );
      if (response.ok) {
        return response.data || [];
      } else {
        console.error('Failed to fetch timeline:', response.error);
        toast.error("Failed to fetch the latest timeline data.");
        return [];
      }
    } catch (error) {
      console.error('Error fetching timeline:', error);
      toast.error("An error occurred while fetching the latest timeline data.");
      return [];
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    try {
      const response = await apiRequest(
        constants.DELETE_EMPLOYEE_TIMELINE
          .replace('{employee_id}', selectedEmployeeId.toString())
          .replace('{project_id}', deletingItem.project_id.toString())
          .replace('{allocation_id}', deletingItem.id.toString()),
        "DELETE"
      );

      if (response.ok) {
        toast.success("The allocation has been deleted successfully.");

        // Fetch the latest data after successful deletion
        // @ts-ignore
        const latestData = await getEmployeeTimeline(employeeId);

        setTimelineData(latestData);
        onUpdateTimeline(); // Call this function to update the parent component
      } else {
        toast.error("Failed to delete the allocation. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting allocation:", error);
      toast.error("An error occurred while deleting the allocation.");
    }

    setIsConfirmDeleteOpen(false);
    setDeletingItem(null);
  };

  const handleDateChange = (type: 'allocation_start_date' | 'allocation_end_date', date: Date | null) => {
    if (date) {
      // Adjust the date to local timezone
      const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      handleInputChange(type, adjustedDate.toISOString().split('T')[0]);
    } else {
      handleInputChange(type, null);
    }
    // Close the dialog
    setOpenDialogs(prev => ({
      ...prev,
      [type]: false
    }));
  };

  const renderDatePicker = (fieldName: 'allocation_start_date' | 'allocation_end_date', label: string) => (
    <div className="flex-1">
      <Dialog open={openDialogs[fieldName]} onOpenChange={(open) => setOpenDialogs(prev => ({ ...prev, [fieldName]: open }))}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full pl-3 text-left font-normal" isLoading={false}>
            {editedValues[fieldName]
              ? format(parseISO(editedValues[fieldName] as string), 'PPP')
              : <span>{label}</span>}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-fit">
          <Calendar
            mode="single"
            selected={editedValues[fieldName] ? parseISO(editedValues[fieldName] as string) : undefined}
            // @ts-ignore
            onSelect={(date) => handleDateChange(fieldName, date)}
            initialFocus
            minDate={fieldName === 'allocation_end_date' ? new Date() : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[70vw] w-11/12 max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{employeeName}'s Timeline</DialogTitle>
            <DialogDescription>
              Employee ID: {selectedEmployeeId}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex-grow overflow-y-auto">
            {timelineData?.length > 0 ? (
              <div className="space-y-4">
                {timelineData.map((item, index) => (
                  <div key={index} className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{item.project_name}</h3>
                        {getStatusTag(item?.allocation_start_date, item.allocation_end_date)}
                      </div>
                      {editingItem?.id === item.id ? (
                        <div className="flex space-x-2">
                          <Button onClick={handleSave} size="sm"><CheckIcon className="w-4 h-4" /></Button>
                          <Button onClick={handleCancel} variant="outline" size="sm"><XIcon className="w-4 h-4" /></Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button onClick={() => handleEdit(item)} variant="ghost" size="sm"><PencilIcon className="w-4 h-4" /></Button>
                          <Button onClick={() => { setDeletingItem(item); setIsConfirmDeleteOpen(true); }} variant="ghost" size="sm"><Trash2Icon className="w-4 h-4" /></Button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <BriefcaseIcon className="w-4 h-4 mr-1" />
                        {editingItem?.id === item.id ? (
                          <Input
                            name="role"
                            value={editedValues.role || ''}
                            onChange={(e) => handleInputChange('role', e.target.value)}
                            className="h-7 text-sm"
                          />
                        ) : (
                          item.role
                        )}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <PercentIcon className="w-4 h-4 mr-1" />
                        {editingItem?.id === item.id ? (
                          <CommonDropdown
                            items={bandwidthOptions}
                            onSelect={(value) => handleInputChange('bandwidth_allocated', parseInt(value))}
                            selectedValue={editedValues.bandwidth_allocated?.toString() || ''}
                            placeholder="Select bandwidth"
                          />
                        ) : (
                          `${item.bandwidth_allocated}% Allocated`
                        )}
                      </div>
                      <div className="col-span-2 flex items-center text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {editingItem?.id === item.id ? (
                          <div className="flex space-x-2 w-full">
                            {renderDatePicker('allocation_start_date', 'Start Date')}
                            {renderDatePicker('allocation_end_date', 'End Date')}
                          </div>
                        ) : (
                          <>
                            {format(new Date(item?.allocation_start_date || ''), 'MMM d, yyyy')} -
                            {item.allocation_end_date
                              ? format(new Date(item.allocation_end_date), 'MMM d, yyyy')
                              : 'Present'}
                          </>
                        )}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSignIcon className="w-4 h-4 mr-1" />
                        {editingItem?.id === item.id ? (
                          <CommonDropdown
                            items={billableOptions}
                            onSelect={(value) => handleInputChange('billable', value)}
                            selectedValue={editedValues.billable || ''}
                            placeholder="Select billable status"
                          />
                        ) : (
                          item.billable === 'Yes' ? 'Billable' : 'Non-billable'
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No timeline data available for this employee.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this allocation?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the allocation from the employee's timeline.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmployeeTimelineModal;
