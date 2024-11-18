import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TResourceAllocation } from "@/lib/model";
import CommonDropdown from "@/components/common/CommonDropDown";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format, parseISO } from 'date-fns';

interface EditResourceAllocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: TResourceAllocation;
  onSave: (updatedResource: TResourceAllocation) => void;
}

export default function EditResourceAllocationModal({
  isOpen,
  onClose,
  resource,
  onSave,
}: EditResourceAllocationModalProps) {
  const [editedResource, setEditedResource] = useState<TResourceAllocation>(resource);
  const [openDialogs, setOpenDialogs] = useState({ startDate: false, endDate: false });

  useEffect(() => {
    setEditedResource(resource);
  }, [resource]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedResource((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setEditedResource((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | null, fieldName: 'allocation_start_date' | 'allocation_end_date') => {
    if (date) {
      // Format the date as YYYY-MM-DD in UTC
      const formattedDate = format(date, 'yyyy-MM-dd');
      setEditedResource((prev) => ({ ...prev, [fieldName]: formattedDate }));
    }
    // Close the dialog
    setOpenDialogs(prev => ({ ...prev, [fieldName === 'allocation_start_date' ? 'startDate' : 'endDate']: false }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedResource);
  };

  const handleClearEndDate = () => {
    setEditedResource(prev => ({ ...prev, allocation_end_date: null }));
  };

  const allocationOptions = [
    { label: '25%', value: '25' },
    { label: '50%', value: '50' },
    { label: '75%', value: '75' },
    { label: '100%', value: '100' },
  ];

  const billableOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return "Select date";
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Resource Allocation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="employee_name" className="text-sm font-medium text-gray-700 mb-1">
                Employee
              </label>
              <Input
                id="employee_name"
                name="employee_name"
                value={editedResource.employee_name}
                readOnly
                disabled
                className="w-full bg-gray-100 border-gray-300 text-gray-600"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="bandwidth_allocated" className="text-sm font-medium text-gray-700 mb-1">
                Allocation %
              </label>
              <CommonDropdown
                items={allocationOptions}
                onSelect={(value) => handleDropdownChange('bandwidth_allocated', value)}
                selectedValue={editedResource.bandwidth_allocated.toString()}
                placeholder="Select allocation percentage"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="allocation_start_date" className="text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Dialog open={openDialogs.startDate} onOpenChange={(open) => setOpenDialogs(prev => ({ ...prev, startDate: open }))}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateForDisplay(editedResource.allocation_start_date)}
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-fit">
                  <Calendar
                    mode="single"
                    selected={editedResource.allocation_start_date ? parseISO(editedResource.allocation_start_date) : undefined}
                    onSelect={(date) => handleDateChange(date, 'allocation_start_date')}
                    initialFocus
                  />
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col">
              <label htmlFor="allocation_end_date" className="text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="flex w-full gap-2">
                <div className="flex-grow">
                  <Dialog 
                    open={openDialogs.endDate} 
                    onOpenChange={(open) => setOpenDialogs(prev => ({ ...prev, endDate: open }))}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDateForDisplay(editedResource.allocation_end_date)}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-fit">
                      <Calendar
                        mode="single"
                        selected={editedResource.allocation_end_date ? parseISO(editedResource.allocation_end_date) : undefined}
                        onSelect={(date) => handleDateChange(date, 'allocation_end_date')}
                        initialFocus
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {editedResource.allocation_end_date && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClearEndDate}
                    className="w-[60px]"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="role" className="text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <Input
                id="role"
                name="role"
                value={editedResource.role}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="billable" className="text-sm font-medium text-gray-700 mb-1">
                Billable
              </label>
              <CommonDropdown
                items={billableOptions}
                onSelect={(value) => handleDropdownChange('billable', value)}
                selectedValue={editedResource.billable}
                placeholder="Select billable status"
              />
            </div>
          </div>
        </form>
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} className="bg-blue-600 text-white hover:bg-blue-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
