import AppHeaders from "@/components/common/AppHeaders";
import { AppTable } from "@/components/common/AppTable";
import { Input } from "@/components/ui/input";
import { TCustomerStore, TProjects } from "@/lib/model";
import useCustomerStore from "@/stores/useCustomerStore";
import useNavigationStore from "@/stores/useNavigationStore";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

export default function CustomerList() {
  const { isLoading, headers, data, search, setSearch, getAllCustomers } =
    useCustomerStore((state: TCustomerStore) => ({
      isLoading: state.isLoading,
      data: state.data,
      headers: state.headers,
      search: state.search,
      setSearch: state.setSearch,
      getAllCustomers: state.getAllCustomers,
    }));

  useEffect(() => {
    getAllCustomers();
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
        <AppHeaders
          header="Customers"
          desc="Manage all customers and their details"
        />
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
            No Customers Found
          </div>
        )}
      </div>
    </div>
  );
}
