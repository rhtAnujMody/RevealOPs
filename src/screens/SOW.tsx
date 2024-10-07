import AppHeaders from "@/components/common/AppHeaders";
import { AppTable } from "@/components/common/AppTable";
import { Input } from "@/components/ui/input";
import { TProjects, TSOWStore } from "@/lib/model";
import useNavigationStore from "@/stores/useNavigationStore";
import useSOWStore from "@/stores/useSOWStore";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

export default function SOW() {
  const { isLoading, headers, data, search, setSearch, getAllSOW } =
    useSOWStore((state: TSOWStore) => ({
      isLoading: state.isLoading,
      data: state.data,
      headers: state.headers,
      search: state.search,
      setSearch: state.setSearch,
      getAllSOW: state.getAllSOW,
    }));

  useEffect(() => {
    getAllSOW();
  }, [search]);

  const handleOnClick = (data: TProjects) => {
    useNavigationStore.getState().navigate(`/projects/${data.id}`, false);
  };

  const handleOnEditClick = (data: TProjects) => {
    alert("Id: " + data.id);
  };

  return (
    <div className="flex flex-1 gap-10">
      <div className="flex flex-1 flex-col gap-5">
        <AppHeaders header="SOW" desc="Manage all SOW and their details" />
        <Input
          placeholder="Search by name"
          className="text-sm"
          value={search}
          onChange={(value) => {
            setSearch(value.target.value);
          }}
        />
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <ReloadIcon className="animate-spin flex flex-1 items-center justify-center w-8 h-8" />
          </div>
        ) : data.length > 0 ? (
          <AppTable
            headers={headers}
            rows={data}
            onClick={handleOnClick}
            onEditClick={handleOnEditClick}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            No SOWs Found
          </div>
        )}
      </div>
    </div>
  );
}
