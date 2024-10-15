import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";
import { toast } from 'react-hot-toast';
import useProjectStore from "@/stores/useProjectStore";
import CommonDropdown from "@/components/common/CommonDropDown";
import { TProjects } from "@/lib/model";

const AddProject: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<TProjects>>({
    customer_name: '',
    master_project_id: '',
    child_project_id: '',
    project_name: '',
    description: '',
    project_type: '',
    service_offering: '',
    project_status: '',
    customer: 0,
    sow: 0,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [customers, setCustomers] = useState<{ label: string; value: string }[]>([]);
  const [sows, setSows] = useState<{ label: string; value: string }[]>([]);
  const getAllProjects = useProjectStore(state => state.getAllProjects);

  useEffect(() => {
    fetchCustomers();
    fetchSOWs();
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

  const fetchSOWs = async () => {
    try {
      const response = await apiRequest(constants.ALL_SOWS, 'GET');
      if (response.ok && response.data) {
        const sowOptions = response.data.map((sow: any) => ({
          label: sow.sow_description,
          value: sow.sow_id.toString(),
        }));
        setSows(sowOptions);
      }
    } catch (error) {
      console.error('Error fetching SOWs:', error);
      toast.error('Failed to fetch SOWs');
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

  const validateForm = () => {
    const newErrors: Record<string, string[]> = {};
    if (!formData.project_name) newErrors.project_name = ['Project name is required'];
    if (!formData.customer) newErrors.customer = ['Customer is required'];
    if (!formData.sow) newErrors.sow = ['SOW is required'];
    if (!formData.project_type) newErrors.project_type = ['Project type is required'];
    if (!formData.service_offering) newErrors.service_offering = ['Service offering is required'];
    if (!formData.project_status) newErrors.project_status = ['Project status is required'];
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await apiRequest(constants.ALL_PROJECTS, 'POST', formData);
      if (response.ok) {
        toast.success('Project added successfully');
        getAllProjects();
        navigate('/projects');
      } else {
        if (response.error && typeof response.error === 'object') {
          const apiErrors: Record<string, string[]> = {};
          Object.entries(response.error).forEach(([key, value]) => {
            apiErrors[key] = Array.isArray(value) ? value : [value as string];
          });
          setErrors(apiErrors);
          
          // Display the first error message as a toast
          const firstErrorField = Object.keys(apiErrors)[0];
          if (firstErrorField) {
            toast.error(apiErrors[firstErrorField][0]);
          }
        } else {
          toast.error('Failed to add project');
        }
      }
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('An error occurred while adding the project');
    }
  };

  const projectTypeOptions = [
    { label: 'Fixed Price', value: 'Fixed Price' },
    { label: 'Time and Material', value: 'Time and Material' },
  ];

  const serviceOfferingOptions = [
    { label: 'Product Engineering', value: 'Product Engineering' },
    { label: 'Staff Augmentation', value: 'Staff Augmentation' },
    { label: 'Software Development', value: 'Software Development' },
    { label: 'Consulting', value: 'Consulting' },
    { label: 'Maintenance', value: 'Maintenance' },
  ];

  const projectStatusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Completed', value: 'Completed' },
    { label: 'On Hold', value: 'On Hold' },
  ];

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
        <h1 className="text-2xl font-bold text-gray-800">Add New Project</h1>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Project Information</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <label htmlFor="project_name" className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <Input
                id="project_name"
                name="project_name"
                value={formData.project_name}
                onChange={handleInputChange}
                className={`w-full ${errors.project_name && errors.project_name.length > 0 ? 'border-red-500' : ''}`}
              />
              {errors.project_name && errors.project_name.map((error, index) => (
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
              ))}
            </div>

            {/* Customer */}
            <div className="space-y-2">
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700">
                Customer
              </label>
              <CommonDropdown
                items={customers}
                onSelect={(value) => handleDropdownChange('customer', value)}
                selectedValue={formData.customer?.toString()}
                placeholder="Select customer"
                className="w-full"
              />
              {errors.customer && errors.customer.map((error, index) => (
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
              ))}
            </div>

            {/* SOW */}
            <div className="space-y-2">
              <label htmlFor="sow" className="block text-sm font-medium text-gray-700">
                Statement of Work
              </label>
              <CommonDropdown
                items={sows}
                onSelect={(value) => handleDropdownChange('sow', value)}
                selectedValue={formData.sow?.toString()}
                placeholder="Select SOW"
                className="w-full"
              />
              {errors.sow && errors.sow.map((error, index) => (
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
              ))}
            </div>

            {/* Project Type */}
            <div className="space-y-2">
              <label htmlFor="project_type" className="block text-sm font-medium text-gray-700">
                Project Type
              </label>
              <CommonDropdown
                items={projectTypeOptions}
                onSelect={(value) => handleDropdownChange('project_type', value)}
                selectedValue={formData.project_type}
                placeholder="Select project type"
                className="w-full"
              />
              {errors.project_type && errors.project_type.map((error, index) => (
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
              ))}
            </div>

            {/* Service Offering */}
            <div className="space-y-2">
              <label htmlFor="service_offering" className="block text-sm font-medium text-gray-700">
                Service Offering
              </label>
              <CommonDropdown
                items={serviceOfferingOptions}
                onSelect={(value) => handleDropdownChange('service_offering', value)}
                selectedValue={formData.service_offering}
                placeholder="Select service offering"
                className="w-full"
              />
              {errors.service_offering && errors.service_offering.map((error, index) => (
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
              ))}
            </div>

            {/* Project Status */}
            <div className="space-y-2">
              <label htmlFor="project_status" className="block text-sm font-medium text-gray-700">
                Project Status
              </label>
              <CommonDropdown
                items={projectStatusOptions}
                onSelect={(value) => handleDropdownChange('project_status', value)}
                selectedValue={formData.project_status}
                placeholder="Select project status"
                className="w-full"
              />
              {errors.project_status && errors.project_status.map((error, index) => (
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            {/* Master Project ID */}
            <div className="space-y-2">
              <label htmlFor="master_project_id" className="block text-sm font-medium text-gray-700">
                Master Project ID
              </label>
              <Input
                id="master_project_id"
                name="master_project_id"
                value={formData.master_project_id}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            {/* Child Project ID */}
            <div className="space-y-2">
              <label htmlFor="child_project_id" className="block text-sm font-medium text-gray-700">
                Child Project ID
              </label>
              <Input
                id="child_project_id"
                name="child_project_id"
                value={formData.child_project_id}
                onChange={handleInputChange}
                className={`w-full ${errors.child_project_id && errors.child_project_id.length > 0 ? 'border-red-500' : ''}`}
              />
              {errors.child_project_id && errors.child_project_id.map((error, index) => (
                <p key={index} className="text-red-500 text-sm mt-1">{error}</p>
              ))}
            </div>

            <Button type="submit" className="w-full">Add Project</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProject;
