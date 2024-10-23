import { TCustomerDetailsStore } from "@/lib/model";
import useCustomerDetailsStore from "@/stores/useCustomerDetailsStore";
import useSOWStore from "@/stores/useSOWStore";
import useProjectStore from "@/stores/useProjectStore";
import { ArrowLeft, FileText, Briefcase, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from 'react-hot-toast';
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";
import { useCustomerStore } from "@/stores/useCustomerStore";
import { ArrowLeftIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DeleteButton } from "@/components/common/DeleteButton";

export default function CustomerDetails() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, setId, data, getCustomerDetails } = useCustomerDetailsStore(
    (state: TCustomerDetailsStore) => ({
      isLoading: state.isLoading,
      data: state.data,
      setId: state.setId,
      getCustomerDetails: state.getCustomerDetails,
    })
  );
  const clearSOWSearch = useSOWStore(state => state.clearSearch);
  const clearProjectSearch = useProjectStore(state => state.clearSearch);

  useEffect(() => {
    if (customerId) {
      setId(customerId);
      getCustomerDetails();
    } else {
      console.error("Customer ID is undefined");
      navigate("/customer-management");
    }

    return () => {
      clearSOWSearch();
      clearProjectSearch();
    };
  }, [customerId, setId, getCustomerDetails, navigate, clearSOWSearch, clearProjectSearch]);

  const handleBackClick = () => {
    clearSOWSearch();
    clearProjectSearch();
    navigate(-1);
  };

  const handleViewAllSOWs = () => {
    navigate(`/sows?search=${encodeURIComponent(data.customer_name)}`);
  };

  const handleViewAllProjects = () => {
    navigate(`/projects?search=${encodeURIComponent(data.customer_name)}`);
  };

  const handleEdit = () => {
    navigate(`/customers/${customerId}/edit`);
  };

  const handleDelete = async () => {
    try {
      const response = await apiRequest(`${constants.ALL_CUSTOMERS}${customerId}/`, "DELETE");
      if (response.ok) {
        toast.success("Customer deleted successfully");
        navigate("/customers");
      } else {
        toast.error("Failed to delete customer");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("An error occurred while deleting the customer");
    }
  };

  const DisplayCustomerDetails = ({
    header,
    data,
    titleId,
    valueId,
  }: {
    header: string;
    data: string | number;
    titleId?: string;
    valueId?: string;
  }) => {
    return (
      <div className="bg-white p-4">
        <span className="text-sm font-semibold text-gray-600" id={titleId}>
          {header}
        </span>
        <p className="text-lg font-medium mt-1 text-gray-800" id={valueId}>
          {data || "N/A"}
        </p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full w-full p-6 space-y-6">
        <div className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <Button
              onClick={handleBackClick}
              variant="outline"
              size="sm"
              className="mr-4"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Customer Details</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={handleEdit}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Pencil1Icon className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <DeleteButton onDelete={handleDelete} itemName="customer" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{data.customer_name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DisplayCustomerDetails
              header="Contact Name"
              data={`${data.contact_first_name} ${data.contact_last_name}`}
              titleId="contactNameTitle"
              valueId="contactNameValue"
            />
            <DisplayCustomerDetails
              header="Email"
              data={data.email_id}
              titleId="emailTitle"
              valueId="emailValue"
            />
            <DisplayCustomerDetails
              header="Contact Phone"
              data={data.contact_phone}
              titleId="phoneTitle"
              valueId="phoneValue"
            />
            <DisplayCustomerDetails
              header="Designation"
              data={data.contact_designation}
              titleId="designationTitle"
              valueId="designationValue"
            />
            <DisplayCustomerDetails
              header="Contract Type"
              data={data.contract_type}
              titleId="contractTypeTitle"
              valueId="contractTypeValue"
            />
            <DisplayCustomerDetails
              header="Contract Start Date"
              data={data.contract_start_date}
              titleId="contractStartDateTitle"
              valueId="contractStartDateValue"
            />
            <DisplayCustomerDetails
              header="Contract End Date"
              data={data.contract_end_date}
              titleId="contractEndDateTitle"
              valueId="contractEndDateValue"
            />
            <DisplayCustomerDetails
              header="MSA Location"
              data={data.msa_location}
              titleId="msaLocationTitle"
              valueId="msaLocationValue"
            />
            <DisplayCustomerDetails
              header="Address"
              data={data.address}
              titleId="addressTitle"
              valueId="addressValue"
            />
            <div className="col-span-full flex space-x-4">
              <Button
                onClick={handleViewAllSOWs}
                variant="outline"
                className="flex-1 flex items-center justify-center"
              >
                <FileText className="w-4 h-4 mr-2" />
                View All SOWs
              </Button>
              <Button
                onClick={handleViewAllProjects}
                variant="outline"
                className="flex-1 flex items-center justify-center"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                View All Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
