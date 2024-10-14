import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CalendarIcon, X } from "lucide-react";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";
import { toast } from 'react-hot-toast';
import useCustomerStore from "@/stores/useCustomerStore";
import CommonDropdown from "@/components/common/CommonDropDown";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";

const AddCustomer: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customer_name: '',
    contact_first_name: '',
    contact_last_name: '',
    contact_designation: '',
    email_id: '',
    contact_phone: '',
    contract_type: '',
    contract_start_date: '',
    contract_end_date: '',
    msa_location: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const getAllCustomers = useCustomerStore(state => state.getAllCustomers);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: [] }));
    }
  };

  const handleContractTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, contract_type: value }));
    if (errors.contract_type) {
      setErrors(prev => ({ ...prev, contract_type: [] }));
    }
  };

  const handleDateChange = (date: Date | undefined, field: 'contract_start_date' | 'contract_end_date') => {
    if (date) {
      setFormData(prev => ({ ...prev, [field]: format(date, 'yyyy-MM-dd') }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: [] }));
      }
    } else {
      // If date is undefined (user cleared the selection), set it to an empty string
      setFormData(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};
    if (!formData.customer_name) newErrors.customer_name = ['Customer name is required'];
    if (!formData.contact_first_name) newErrors.contact_first_name = ['First name is required'];
    if (!formData.email_id) newErrors.email_id = ['Email is required'];
    if (formData.email_id && !/\S+@\S+\.\S+/.test(formData.email_id)) newErrors.email_id = ['Invalid email format'];
    if (!formData.contact_phone) newErrors.contact_phone = ['Phone number is required'];
    if (!formData.contract_type) newErrors.contract_type = ['Contract type is required'];
    if (!formData.contract_start_date) newErrors.contract_start_date = ['Contract start date is required'];
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => key !== 'contract_end_date' || value !== '')
    );

    try {
      const response = await apiRequest(constants.ALL_CUSTOMERS, 'POST', submitData);
      if (response.ok) {
        toast.success('Customer added successfully');
        getAllCustomers();
        navigate('/customers');
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
          toast.error('Failed to add customer');
        }
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('An error occurred while adding the customer');
    }
  };

  const contractTypeOptions = [
    { label: 'MSA', value: 'MSA' },
    { label: 'T&C SOW', value: 'T&C SOW' },
  ];

  const handleClearDate = (field: 'contract_start_date' | 'contract_end_date') => {
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
        <h1 className="text-2xl font-bold text-gray-800">Add New Customer</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {Object.entries(formData).map(([key, value]) => {
                if (key === 'contract_type') {
                  return (
                    <div key={key} className="space-y-2">
                      <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                        Contract Type
                      </label>
                      <CommonDropdown
                        items={contractTypeOptions}
                        onSelect={handleContractTypeChange}
                        selectedValue={value}
                        placeholder="Select contract type"
                        className="w-full"
                      />
                      {errors[key] && errors[key].map((error, index) => (
                        <p key={index} className="text-destructive text-sm mt-1">{error}</p>
                      ))}
                    </div>
                  );
                } else if (key === 'contract_start_date' || key === 'contract_end_date') {
                  return (
                    <div key={key} className="space-y-2 w-full">
                      <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                        {key === 'contract_start_date' ? 'Contract Start Date' : 'Contract End Date (Optional)'}
                      </label>
                      <div className="flex items-center w-full">
                        <Popover className="w-full">
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={value ? new Date(value) : undefined}
                              onSelect={(date) => handleDateChange(date, key as 'contract_start_date' | 'contract_end_date')}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {value && (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleClearDate(key as 'contract_start_date' | 'contract_end_date')}
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
                  );
                }
                return (
                  <div key={key} className="space-y-2">
                    <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                      {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </label>
                    <Input
                      id={key}
                      name={key}
                      value={value}
                      onChange={handleInputChange}
                      className={cn(errors[key] && errors[key].length > 0 && "border-destructive")}
                    />
                    {errors[key] && errors[key].map((error, index) => (
                      <p key={index} className="text-destructive text-sm mt-1">{error}</p>
                    ))}
                  </div>
                );
              })}

              <Button type="submit" className="w-full">Add Customer</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomer;
