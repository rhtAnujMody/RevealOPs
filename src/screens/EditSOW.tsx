import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CalendarIcon, X, Upload } from "lucide-react";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";
import { toast } from 'react-hot-toast';
import useSOWStore from "@/stores/useSOWStore";
import useSOWDetailsStore from "@/stores/useSOWDetailsStore";
import CommonDropdown from "@/components/common/CommonDropDown";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isValid, parseISO } from 'date-fns';


interface EditSOWProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditSOW: React.FC<EditSOWProps> = ({ isOpen, onClose }) => {
  const { sowId } = useParams<{ sowId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    customer: '',
    sow_description: '',
    sow_value: '',
    start_date: '',
    end_date: null,
    customer_spoc: '',
    reveal_spoc: '',
    business_unit: '',
    contract_url: '',
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [customers, setCustomers] = useState<{ label: string; value: string }[]>([]);
  const getAllSOW = useSOWStore(state => state.getAllSOW);
  const { data: sowDataState, getSOWDetails, setId } = useSOWDetailsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sowId) {
      setId(sowId);
      getSOWDetails();
    }
    fetchCustomers();
  }, [sowId, setId, getSOWDetails]);

  useEffect(() => {
    if (sowDataState) {
      const { sow_id, duration, customer_name, ...rest } = sowDataState;
      // @ts-ignore
      setFormData({
        ...rest,
        customer: sowDataState.customer ? sowDataState.customer.toString() : '',
        end_date: rest.end_date || null,
      });
    }
  }, [sowDataState]);

  const fetchCustomers = async () => {
    try {
      const response = await apiRequest<{ customer_id: string; customer_name: string }[]>(constants.ALL_CUSTOMERS, 'GET');
      if (response.ok && response.data) {
        const customerOptions = response.data.map((customer) => ({
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
    } else {
      setFormData(prev => ({ ...prev, [field]: null }));
    }
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: [] }));
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Append the file if selected
      if (selectedFile) {
        formDataToSend.append('sow_repository', selectedFile);
      }

      if (sowId) {
        const response = await apiRequest(
          constants.UPDATE_SOW.replace('{sow_id}', sowId),
          'PUT',
          formDataToSend,
          {
            'Content-Type': 'multipart/form-data',
          }
        );

        if (response.ok) {
          toast.success('SOW updated successfully');
          getAllSOW(1);
          navigate(`/sows/${sowId}`);
        } else {
          toast.error('Failed to update SOW');
        }
      } else {
        toast.error('SOW ID is missing');
      }
    } catch (error) {
      console.error('Error updating SOW:', error);
      toast.error('An error occurred while updating the SOW');
    } finally {
      setIsLoading(false);
    }
  };

  const businessUnitOptions = [
    { label: 'ENG BU', value: 'ENG BU' },
    { label: 'AI BU', value: 'AI BU' },
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    if (dateString === null) return dateString;
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "PPP") : '';
  };

  const handleClearDate = (field: 'start_date' | 'end_date') => {
    setFormData(prev => ({ ...prev, [field]: field === 'end_date' ? null : null }));
  };

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
      });

      if (result.type === 'success') {
        setSelectedFile(result);
      }
    } catch (error) {
      console.error('Error picking file:', error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between p-6 bg-white shadow-sm">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Edit SOW</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl mx-auto">
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
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
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
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
              ))}
            </div>

            {/* Other form fields */}
            {['sow_description', 'sow_value', 'customer_spoc', 'reveal_spoc'].map((key) => (
              <div key={key} className="space-y-2">
                <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </label>
                <Input
                  id={key}
                  name={key}
                  // @ts-ignore
                  value={formData[key as keyof typeof formData]}
                  onChange={handleInputChange}
                  className={`w-full ${errors[key] && errors[key].length > 0 ? 'border-red-500' : ''}`}
                />
                {errors[key] && errors[key].map((error, index) => (
                  <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
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
                        className={`w-full justify-start text-left font-normal ${!formData[key as keyof typeof formData] && "text-muted-foreground"
                          }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData[key as keyof typeof formData]
                          ? formatDate(formData[key as keyof typeof formData] as string)
                          : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData[key as keyof typeof formData] && formData[key as keyof typeof formData] !== null
                          ? parseISO(formData[key as keyof typeof formData] as string)
                          : undefined}
                        onSelect={(date) => handleDateChange(date, key as 'start_date' | 'end_date')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {formData[key as keyof typeof formData] && formData[key as keyof typeof formData] !== null && (
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
                  <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
                ))}
              </div>
            ))}

            {/* Add file input for contract */}
            <div className="space-y-2">
              <label htmlFor="contract" className="block text-sm font-medium text-gray-700">
                Contract File
              </label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  id="contract"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {selectedFile ? 'Change File' : 'Upload Contract'}
                </Button>
                {selectedFile && (
                  <span className="text-sm text-gray-600">{selectedFile.name}</span>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full">Update SOW</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSOW;
