import AppHeaders from "@/components/common/AppHeaders";
import { TProjectDetailsStore } from "@/lib/model";
import useProjectDetailsStore from "@/stores/useProjectDetailsStore";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const { isLoading, setId, data, getProjectDetails } = useProjectDetailsStore(
    (state: TProjectDetailsStore) => ({
      isLoading: state.isLoading,
      data: state.data,
      setId: state.setId,
      getProjectDetails: state.getProjectDetails,
    })
  );

  useEffect(() => {
    setId(projectId as string);
    getProjectDetails();
  }, []);

  const DisplayProjectDetails = ({
    header,
    data,
  }: {
    header: string;
    data: string;
  }) => {
    return (
      <div className="flex flex-1 flex-col gap-2 pb-1">
        <span className="text-lg font-bold">{header}</span>
        <span className="text-base text-[#637887]">{data}</span>
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
          <AppHeaders header="Project Details" />
          <div className="flex flex-1 flex-col">
            <DisplayProjectDetails header="Name" data={data.customer_name} />
            <DisplayProjectDetails
              header="Description"
              data={data.description}
            />
            <DisplayProjectDetails
              header="Master Project Id"
              data={data.master_project_id}
            />
            <DisplayProjectDetails
              header="Child Project Id"
              data={data.child_project_id}
            />
            <DisplayProjectDetails
              header="Customer Name"
              data={data.customer_name}
            />
            <DisplayProjectDetails
              header="Project Type"
              data={data.project_type}
            />
            <DisplayProjectDetails
              header="Service Offering"
              data={data.service_offering}
            />
            <DisplayProjectDetails
              header="Project Status"
              data={data.project_status}
            />
          </div>
        </>
      )}
    </div>
  );
}
