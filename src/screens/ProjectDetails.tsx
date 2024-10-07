import AppHeaders from "@/components/common/AppHeaders";
import { AppTable } from "@/components/common/AppTable";
import { TProjectDetailsStore } from "@/lib/model";
import useProjectDetailsStore from "@/stores/useProjectDetailsStore";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const {
    isLoading,
    setId,
    data,
    resources,
    resourceAllocationLoading,
    resourceAllocationHeaders,
    getProjectDetails,
    getProjectAllocationDetails,
  } = useProjectDetailsStore((state: TProjectDetailsStore) => ({
    isLoading: state.isLoading,
    resourceAllocationLoading: state.resourceAllocationLoading,
    resourceAllocationHeaders: state.resourceAllocationHeaders,
    data: state.data,
    resources: state.resources,
    setId: state.setId,
    getProjectDetails: state.getProjectDetails,
    getProjectAllocationDetails: state.getProjectAllocationDetails,
  }));

  useEffect(() => {
    setId(projectId as string);
    getProjectDetails();
    getProjectAllocationDetails();
  }, []);

  const DisplayProjectDetails = ({
    header,
    data,
    titleId,
    valueId,
  }: {
    header: string;
    data: string;
    titleId?: string;
    valueId?: string;
  }) => {
    return (
      <div className="flex flex-1 flex-col gap-2 pb-1">
        <span className="text-lg font-bold" id={titleId}>
          {header}
        </span>
        <span className="text-base text-[#637887]" id={valueId}>
          {data}
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-10">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <ReloadIcon className="animate-spin flex flex-1 items-center justify-center w-8 h-8" />
        </div>
      ) : (
        <>
          <AppHeaders header="Project Details" id={"projectDetailsTitle"} />
          <div id="projectDetails" className="flex flex-1 flex-col">
            <DisplayProjectDetails
              titleId="nameTitle"
              valueId="nameValue"
              header="Name"
              data={data.customer_name}
            />
            <DisplayProjectDetails
              header="Description"
              data={data.description}
              titleId="descriptionTitle"
              valueId="descriptionValue"
            />
            <DisplayProjectDetails
              header="Master Project Id"
              data={data.master_project_id}
              titleId="masterTitle"
              valueId="masterValue"
            />
            <DisplayProjectDetails
              header="Child Project Id"
              data={data.child_project_id}
              titleId="childTitle"
              valueId="childValue"
            />
            <DisplayProjectDetails
              header="Customer Name"
              data={data.customer_name}
              titleId="customerTitle"
              valueId="customerValue"
            />
            <DisplayProjectDetails
              header="Project Type"
              data={data.project_type}
              titleId="projectTypeTitle"
              valueId="projectTypeValue"
            />
            <DisplayProjectDetails
              header="Service Offering"
              data={data.service_offering}
              titleId="serviceTitle"
              valueId="serviceValue"
            />
            <DisplayProjectDetails
              header="Project Status"
              data={data.project_status}
              titleId="statusTitle"
              valueId="statusValue"
            />
          </div>
          <div>
            <DisplayProjectDetails header="Resource  Allocation" data="" />
            {resourceAllocationLoading ? (
              <ReloadIcon className="animate-spin flex flex-1 items-center justify-center w-8 h-8" />
            ) : resources.length === 0 ? (
              <span className="text-base text-[#637887]">
                No Resource Allocation Found
              </span>
            ) : (
              <AppTable headers={resourceAllocationHeaders} rows={resources} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
