import { AppTable } from "@/components/common/AppTable";
import { TEmployee, TEmployeeStore, TimelineItem, TProjectDetailsStore, TResourceAllocation } from "@/lib/model";
import useProjectDetailsStore from "@/stores/useProjectDetailsStore";
import { ReloadIcon, ArrowLeftIcon, FileTextIcon, PersonIcon, PlusIcon, Pencil1Icon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import EmployeeTimelineModal from "@/screens/EmployeeTimelineModal";
import useEmployeeStore from "@/stores/useEmployeesStore";
import { DeleteButton } from "@/components/common/DeleteButton";
import toast from 'react-hot-toast';
import { apiRequest } from "@/network/apis";
import constants from "@/lib/constants";
import EditResourceAllocationModal from "@/components/EditResourceAllocationModal";
import { Eye } from "lucide-react";

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    isLoading,
    resourceAllocationLoading,
    data,
    resources,
    resourceAllocationHeaders,
    setId,
    getProjectDetails,
    getProjectAllocationDetails,
  } = useProjectDetailsStore((state: TProjectDetailsStore) => ({
    isLoading: state.isLoading,
    resourceAllocationLoading: state.resourceAllocationLoading,
    data: state.data,
    resources: state.resources,
    resourceAllocationHeaders: state.resourceAllocationHeaders,
    setId: state.setId,
    getProjectDetails: state.getProjectDetails,
    getProjectAllocationDetails: state.getProjectAllocationDetails,
  }));

  // @ts-ignore
  const { TEmpdata, getEmployeeTimeline } = useEmployeeStore((state: TEmployeeStore) => ({
    TEmpdata: state.data,
    getEmployeeTimeline: state.getEmployeeTimeline,
  }));
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineItem[]>([]);
  const [selectedResource, setSelectedResource] = useState<TResourceAllocation | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      setId(projectId);
      getProjectDetails();
      getProjectAllocationDetails();
    }
  }, [projectId, setId, getProjectDetails, getProjectAllocationDetails]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleViewSOW = () => {
    if (data.sow) {
      navigate(`/sows/${data.sow}`);
    } else {
      console.error("No SOW associated with this project");
    }
  };

  const handleViewCustomer = () => {
    if (data.customer) {
      navigate(`/customers/${data.customer}`);
    } else {
      console.error("No customer associated with this project");
    }
  };

  const handleAddResource = () => {
    navigate(`/projects/${projectId}/resource-allocation`);
  };

  const handleOpenTimelineModal = async (resource: TResourceAllocation) => {
    console.log('Opening timeline modal for employee:', resource.employee);
    setSelectedEmployeeId(resource.employee);
    setSelectedEmployeeName(resource.employee_name || 'Employee');
    try {
      const timeline = await getEmployeeTimeline(resource.employee);
      setTimelineData(timeline);
      setIsTimelineModalOpen(true);
    } catch (error) {
      console.error("Error fetching employee timeline:", error);
    }
  };

  const handleEditResource = (resource: TResourceAllocation) => {
    setSelectedResource(resource);
    setIsEditModalOpen(true);
  };

  const handleCloseTimelineModal = () => {
    setIsTimelineModalOpen(false);
    setSelectedEmployeeId(null);
    setSelectedEmployeeName(null);
    setTimelineData([]);
    setSelectedResource(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedResource(null);
  };

  const handleSaveResourceAllocation = async (updatedResource: TResourceAllocation) => {
    try {
      const response = await apiRequest(
        constants.UPDATE_PROJECT_ALLOCATION
          .replace('{project_id}', projectId as string)
          .replace('{allocation_id}', updatedResource.id.toString()),
        "PATCH",
        updatedResource
      );

      if (response.ok) {
        toast.success("Resource allocation updated successfully");
        // Refresh the project details and resource allocations
        getProjectDetails();
        getProjectAllocationDetails();
        handleCloseEditModal();
      } else {
        toast.error("Failed to update resource allocation");
      }
    } catch (error) {
      console.error("Error updating resource allocation:", error);
      toast.error("An error occurred while updating the resource allocation");
    }
  };

  const DisplayProjectDetails = ({
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

  const handleDeleteResource = async (resource: TResourceAllocation) => {
    try {
      const response = await apiRequest(
        constants.DELETE_PROJECT_ALLOCATION
          .replace('{project_id}', projectId as string)
          .replace('{allocation_id}', resource.id.toString()),
        "DELETE"
      );

      if (response.ok) {
        toast.success("Resource allocation deleted successfully");
        // Refresh the project details and resource allocations
        getProjectDetails();
        getProjectAllocationDetails();
      } else {
        toast.error("Failed to delete resource allocation");
      }
    } catch (error) {
      console.error("Error deleting resource allocation:", error);
      toast.error("An error occurred while deleting the resource allocation");
    }
  };

  const renderActionButtons = (resource: TResourceAllocation) => (
    <div className="flex space-x-2">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          handleEditResource(resource);
        }}
        variant="outline"
        size="sm"
        className="flex items-center"
        isLoading={false}
      >
        <Pencil1Icon className="w-4 h-4 mr-1" />
        Edit
      </Button>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          console.log('Data passed to handleOpenTimelineModal:', resource);
          handleOpenTimelineModal(resource);
        }}
        variant="outline"
        size="sm"
        className="flex items-center"
      >
        <Eye className="w-4 h-4 mr-1" />
        View Timeline
      </Button>
      <DeleteButton
        onDelete={() => handleDeleteResource(resource)}
        itemName="resource allocation"
      />
    </div>
  );

  const resourcesWithActions = resources.map(resource => ({
    ...resource,
    actions: renderActionButtons(resource)
  }));

  // Convert resourceAllocationHeaders to the correct format
  const formattedHeaders = resourceAllocationHeaders.map(header => ({
    key: header.key,
    label: header.value
  }));

  const handleEdit = () => {
    navigate(`/projects/${projectId}/edit`);
  };

  const handleDelete = async () => {
    try {
      const response = await apiRequest(`${constants.ALL_PROJECTS}${projectId}/`, "DELETE");
      if (response.ok) {
        toast.success("Project deleted successfully");
        navigate("/projects");
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("An error occurred while deleting the project");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust this number as needed

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Add this function to handle pagination for resources
  const paginatedResources = resources.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(resources.length / itemsPerPage);

  return (
    // @ts-ignore
    <div className="flex flex-col h-full w-full overflow-auto h-screen">
      <div className="flex-1 p-6 space-y-6">
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
            <h1 className="text-2xl font-bold">Project Details</h1>
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
            <DeleteButton onDelete={handleDelete} itemName="project" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <ReloadIcon className="animate-spin w-12 h-12 text-primary" />
          </div>
        ) : (
          <>
            <div className="bg-white shadow-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{data.project_name}</h2>
              <div className="flex justify-between items-center mb-6">
                <p className="text-lg text-gray-600">Customer: {data.customer_name}</p>
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
                <DisplayProjectDetails
                  header="Project Type"
                  data={data.project_type}
                  titleId="projectTypeTitle"
                  valueId="projectTypeValue"
                />
                <DisplayProjectDetails
                  header="Service Offering"
                  data={data.service_offering}
                  titleId="serviceOfferingTitle"
                  valueId="serviceOfferingValue"
                />
                <DisplayProjectDetails
                  header="Project Status"
                  data={data.project_status}
                  titleId="projectStatusTitle"
                  valueId="projectStatusValue"
                />
                <DisplayProjectDetails
                  header="Master Project ID"
                  data={data.master_project_id}
                  titleId="masterProjectIdTitle"
                  valueId="masterProjectIdValue"
                />
                <DisplayProjectDetails
                  header="Child Project ID"
                  data={data.child_project_id}
                  titleId="childProjectIdTitle"
                  valueId="childProjectIdValue"
                />
                <div className="bg-white p-4 border rounded-lg">
                  <span className="text-sm font-semibold text-gray-600">Statement of Work</span>
                  <Button
                    onClick={handleViewSOW}
                    variant="outline"
                    className="mt-2 w-full flex items-center justify-center"
                  >
                    <FileTextIcon className="w-4 h-4 mr-2" />
                    View Statement of Work
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Resource Allocation</h2>
                <Button
                  onClick={handleAddResource}
                  variant="outline"
                  className="flex items-center"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
              </div>
              {resourceAllocationLoading ? (
                <div className="flex items-center justify-center py-4">
                  <ReloadIcon className="animate-spin w-8 h-8 text-primary" />
                </div>
              ) : resources.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <AppTable
                      headers={[...formattedHeaders, { key: 'actions', label: 'Actions' }]}
                      rows={paginatedResources.map(resource => ({
                        ...resource,
                        actions: renderActionButtons(resource)
                      }))}
                      onClick={() => { }}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <Button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      isLoading={resourceAllocationLoading}
                    >
                      <ChevronLeftIcon className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      isLoading={resourceAllocationLoading}
                    >
                      Next
                      <ChevronRightIcon className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No resource allocations found for this project.
                </div>
              )}
            </div>

            {isTimelineModalOpen && selectedEmployeeId !== null && (
              // @ts-ignore
              <EmployeeTimelineModal
                isOpen={isTimelineModalOpen}
                onClose={handleCloseTimelineModal}
                // employeeId={selectedResource.id}
                employeeId={selectedEmployeeId}
                employeeName={selectedEmployeeName || ''}
                // employeeName={selectedResource.employee_name}
                projectId={projectId}
                isLoading={false}
                timelineData={timelineData}
                onUpdateTimeline={(updatedTimeline) => setTimelineData(updatedTimeline)}
              />
            )}

            {isEditModalOpen && selectedResource && (
              <EditResourceAllocationModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                resource={selectedResource}
                onSave={handleSaveResourceAllocation}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
