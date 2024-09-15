import AppHeaders from "@/components/common/AppHeaders";
import { AppTable } from "@/components/common/AppTable";
import { Input } from "@/components/ui/input";
import { TProjectStore } from "@/lib/model";
import useNavigationStore from "@/stores/useNavigationStore";
import useProjectStore from "@/stores/useProjectStore";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

export default function ProjectManagement() {
  const { isLoading, headers, data, getAllProjects } = useProjectStore(
    (state: TProjectStore) => ({
      isLoading: state.isLoading,
      data: state.data,
      headers: state.headers,
      getAllProjects: state.getAllProjects,
    })
  );

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <div className="flex flex-1 gap-10">
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <ReloadIcon className="animate-spin flex flex-1 items-center justify-center w-8 h-8" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-5">
          <AppHeaders
            header="Projects"
            desc="Manage all projects and their details"
          />
          <Input placeholder="Search by name" className="text-sm" />
          <AppTable
            headers={headers}
            rows={data}
            onClick={(data) => {
              useNavigationStore
                .getState()
                .navigate(`/projects/${data.id}`, false);
            }}
          />
        </div>
      )}
    </div>
  );
}
