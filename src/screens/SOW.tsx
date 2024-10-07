import AppHeaders from "@/components/common/AppHeaders";
import { AppTable } from "@/components/common/AppTable";
import { Input } from "@/components/ui/input";
import { TSOW, TSOWStore } from "@/lib/model";
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

  const handleOnClick = (_: TSOW) => {
    // useNavigationStore.getState().navigate(`/projects/${data.id}`, false);
  };

  const handleOnEditClick = (_: TSOW) => {
    // alert("Id: " + data.id);
  };

  return (
    <div className="flex flex-1 gap-10">
      <div className="flex flex-1 flex-col gap-5">
        <AppHeaders
          header="SOW"
          desc="Manage all SOW and their details"
          id="sowTitle"
        />
        <Input
          placeholder="Search by customer name"
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
          <AppTable<TSOW>
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
