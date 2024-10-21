import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CalendarIcon, X } from "lucide-react";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";
import { toast } from 'react-hot-toast';
import useSOWStore from "@/stores/useSOWStore";
import CommonDropdown from "@/components/common/CommonDropDown";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';

const AddSOW: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer: '',
    sow_description: '',
    sow_value: '',
    start_date: '',
    end_date: '',
    customer_spoc: '',
    reveal_spoc: '',
    business_unit: '',
    contract_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [customers, setCustomers] = useState<{ label: string; value: string }[]>([]);
  const getAllSOW = useSOWStore(state => state.getAllSOW);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await apiRequest(constants.ALL_CUSTOMERS, 'GET');
      if (response.ok && response.data) {
        const customerOptions = response.data.map((customer: any) => ({
          label: customer.customer_name,
          value: customer.customer_id.toString(),
        }));
        setCustomers(customerOptions);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Failed to fetch customers');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const handleDropdownChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: [] }));
    }
  };

  const handleDateChange = (date: Date | undefined, field: 'start_date' | 'end_date') => {
    if (date) {
      setFormData(prev => ({ ...prev, [field]: format(date, 'yyyy-MM-dd') }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: [] }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};
    if (!formData.customer) newErrors.customer = ['Customer is required'];
    if (!formData.sow_description) newErrors.sow_description = ['SOW description is required'];
    if (!formData.sow_value) newErrors.sow_value = ['SOW value is required'];
    if (!formData.start_date) newErrors.start_date = ['Start date is required'];
    if (!formData.business_unit) newErrors.business_unit = ['Business unit is required'];
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = { ...formData };
    // If end_date is empty, remove it from the submission data
    if (!submitData.end_date) {
      delete submitData.end_date;
    }

    try {
      const response = await apiRequest(constants.ALL_SOWS, 'POST', submitData);
      if (response.ok) {
        toast.success('SOW added successfully');
        getAllSOW();
        navigate('/sows');
      } else {
        if (response.error && typeof response.error === 'object') {
          const apiErrors: Record<string, string[]> = {};
          Object.entries(response.error).forEach(([key, value]) => {
            apiErrors[key] = Array.isArray(value) ? value : [value as string];
          });
          setErrors(apiErrors);
          const firstErrorField = Object.keys(apiErrors)[0];
          if (firstErrorField) {
            toast.error(apiErrors[firstErrorField][0]);
          }
        } else {
          toast.error('Failed to add SOW');
        }
      }
    } catch (error) {
      console.error('Error adding SOW:', error);
      toast.error('An error occurred while adding the SOW');
    }
  };

  const businessUnitOptions = [
    { label: 'ENG BU', value: 'ENG BU' },
    { label: 'AI BU', value: 'AI BU' },
  ];

  const handleClearDate = (field: 'start_date' | 'end_date') => {
    setFormData(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between p-6 bg-white shadow-sm">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Add New SOW</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">SOW Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                  Customer
                </label>
                <CommonDropdown
                  items={customers}
                  onSelect={(value) => handleDropdownChange('customer', value)}
                  selectedValue={formData.customer}
                  placeholder="Select customer"
                  className="w-full"
                />
                {errors.customer && errors.customer.map((error, index) => (
                  <p key={index} className="text-destructive text-sm mt-1">{error}</p>
                ))}
              </div>

              <div className="space-y-2">
                <label htmlFor="business_unit" className="block text-sm font-medium text-gray-700">
                  Business Unit
                </label>
                <CommonDropdown
                  items={businessUnitOptions}
                  onSelect={(value) => handleDropdownChange('business_unit', value)}
                  selectedValue={formData.business_unit}
                  placeholder="Select business unit"
                  className="w-full"
                />
                {errors.business_unit && errors.business_unit.map((error, index) => (
                  <p key={index} className="text-destructive text-sm mt-1">{error}</p>
                ))}
              </div>

              {/* Other form fields */}
              {['sow_description', 'sow_value', 'customer_spoc', 'reveal_spoc', 'contract_url'].map((key) => (
                <div key={key} className="space-y-2">
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                  <Input
                    id={key}
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChange}
                    className={`w-full ${errors[key] && errors[key].length > 0 ? 'border-red-500' : ''}`}
                  />
                  {errors[key] && errors[key].map((error, index) => (
                    <p key={index} className="text-destructive text-sm mt-1">{error}</p>
                  ))}
                </div>
              ))}

              {/* Date fields */}
              {['start_date', 'end_date'].map((key) => (
                <div key={key} className="space-y-2 w-full">
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {key === 'start_date' ? 'Start Date' : 'End Date'}
                  </label>
                  <div className="flex items-center w-full">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !formData[key as keyof typeof formData] && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData[key as keyof typeof formData] ? format(new Date(formData[key as keyof typeof formData]), "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData[key as keyof typeof formData] ? new Date(formData[key as keyof typeof formData]) : undefined}
                          onSelect={(date) => handleDateChange(date, key as 'start_date' | 'end_date')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {formData[key as keyof typeof formData] && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleClearDate(key as 'start_date' | 'end_date')}
                        className="ml-2 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {errors[key] && errors[key].map((error, index) => (
                    <p key={index} className="text-destructive text-sm mt-1">{error}</p>
                  ))}
                </div>
              ))}

              <Button type="submit" className="w-full">Add SOW</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSOW;
