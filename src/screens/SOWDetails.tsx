import { TSOWDetailsStore } from "@/lib/model";
import useSOWDetailsStore from "@/stores/useSOWDetailsStore";
import { ReloadIcon, ArrowLeftIcon, Pencil1Icon, FileIcon, PersonIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { convertDaysToWeeks } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { DeleteButton } from "@/components/common/DeleteButton";
import toast from 'react-hot-toast';
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";

export default function SOWDetails() {
  const { sowId } = useParams<{ sowId: string }>();
  const navigate = useNavigate();
  const { isLoading, setId, data, getSOWDetails } = useSOWDetailsStore(
    (state: TSOWDetailsStore) => ({
      isLoading: state.isLoading,
      data: state.data,
      setId: state.setId,
      getSOWDetails: state.getSOWDetails,
    })
  );

  useEffect(() => {
    if (sowId) {
      console.log("SOW ID from URL:", sowId);
      setId(sowId);
      getSOWDetails();
    } else {
      console.error("SOW ID is undefined");
      navigate("/sow-management"); // Redirect to SOW list if ID is missing
    }
  }, [sowId, setId, getSOWDetails, navigate]);

  const handleBackClick = () => {
    navigate(-1); // This will go back to the previous page in the browser history
  };

  const handleViewAllProjects = () => {
    navigate(`/projects?search=${encodeURIComponent(data.customer_name)}`);
  };

  const handleEdit = () => {
    navigate(`/sows/${sowId}/edit`);
  };

  const handleDelete = async () => {
    try {
      const response = await apiRequest(`${constants.ALL_SOWS}${sowId}/`, "DELETE");
      if (response.ok) {
        toast.success("SOW deleted successfully");
        navigate("/sows");
      } else {
        toast.error("Failed to delete SOW");
      }
    } catch (error) {
      console.error("Error deleting SOW:", error);
      toast.error("An error occurred while deleting the SOW");
    }
  };

  const handleViewContract = () => {
    if (data.sow_presigned_url) {
      window.open(data.sow_presigned_url, '_blank');
    } else {
      toast.error("Contract URL is not available");
    }
  };

  const handleViewCustomer = () => {
    if (data.customer) {
      navigate(`/customers/${data.customer}`);
    } else {
      toast.error("No customer associated with this SOW");
    }
  };

  const DisplaySOWDetails = ({
    header,
    data,
    titleId,
    valueId,
    prefix,
  }: {
    header: string;
    data: string | number | undefined;
    titleId?: string;
    valueId?: string;
    prefix?: string;
  }) => {
    return (
      <div className="bg-white p-4">
        <span className="text-sm font-semibold text-gray-600" id={titleId}>
          {header}
        </span>
        <p className="text-base font-medium mt-1 text-gray-800" id={valueId}>
          {prefix && data !== undefined ? `${prefix}${data}` : data !== undefined ? data?.toString() : "N/A"}
        </p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <ReloadIcon className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full space-y-6">
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
          <h1 className="text-2xl font-bold">SOW Details</h1>
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
          {/* <DeleteButton onDelete={handleDelete} itemName="SOW" /> */}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{data.customer_name}</h2>
          <Button
            onClick={handleViewCustomer}
            variant="outline"
            className="flex items-center"
          >
            <PersonIcon className="w-4 h-4 mr-2" />
            View Customer Details
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DisplaySOWDetails
            header="Description"
            data={data.sow_description}
            titleId="descriptionTitle"
            valueId="descriptionValue"
          />
          <DisplaySOWDetails
            header="SOW Value"
            data={data.sow_value}
            titleId="valueTitle"
            valueId="valueValue"
            prefix="$"
          />
          <DisplaySOWDetails
            header="Start Date"
            data={data.start_date}
            titleId="startDateTitle"
            valueId="startDateValue"
          />
          <DisplaySOWDetails
            header="End Date"
            data={data.end_date}
            titleId="endDateTitle"
            valueId="endDateValue"
          />
          <DisplaySOWDetails
            header="Customer SPOC"
            data={data.customer_spoc}
            titleId="customerSpocTitle"
            valueId="customerSpocValue"
          />
          <DisplaySOWDetails
            header="Reveal SPOC"
            data={data.reveal_spoc}
            titleId="revealSpocTitle"
            valueId="revealSpocValue"
          />
          <DisplaySOWDetails
            header="Business Unit"
            data={data.business_unit}
            titleId="businessUnitTitle"
            valueId="businessUnitValue"
          />
          <DisplaySOWDetails
            header="Duration"
            data={data.duration ? convertDaysToWeeks(data.duration) : undefined}
            titleId="durationTitle"
            valueId="durationValue"
          />
          <div className="col-span-full flex space-x-4">
            <Button
              onClick={handleViewAllProjects}
              variant="outline"
              className="flex-1 flex items-center justify-center"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              View All Projects
            </Button>
            <Button
              onClick={handleViewContract}
              variant="outline"
              className="flex-1 flex items-center justify-center"
            >
              <FileIcon className="w-4 h-4 mr-2" />
              View Contract
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
