import AppHeaders from "@/components/common/AppHeaders";
import { AppTable } from "@/components/common/AppTable";
import { Input } from "@/components/ui/input";
import { TCustomer, TCustomerStore } from "@/lib/model";
import useNavigationStore from "@/stores/useNavigationStore";
import useCustomerStore from "@/stores/useCustomerStore";
import { RefreshCw, PlusCircle, Search, X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import debounce from 'lodash/debounce';
import { useLocation, useNavigate } from "react-router-dom";

export default function CustomerList() {
  const location = useLocation();
  const { isLoading, headers, data, search, setSearch, getAllCustomers, clearSearch } =
    useCustomerStore((state: TCustomerStore) => ({
      isLoading: state.isLoading,
      headers: state.headers,
      data: state.data,
      search: state.search,
      setSearch: state.setSearch,
      getAllCustomers: state.getAllCustomers,
      clearSearch: state.clearSearch,
    }));

  const [localSearch, setLocalSearch] = useState(search);
  const navigate = useNavigate();

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
    }, 300),
    []
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchValue = searchParams.get('search');
    if (searchValue) {
      setSearch(searchValue);
      setLocalSearch(searchValue);
    } else {
      clearSearch();
      setLocalSearch('');
    }
    getAllCustomers();
  }, [location.search]);

  useEffect(() => {
    getAllCustomers();
  }, [search]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const handleOnClick = (customer: TCustomer) => {
    navigate(`/customers/${customer.customer_id}`);
  };

  const handleAddCustomer = () => {
    navigate('/customers/add');
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    setSearch("");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    debouncedSetSearch(value);
  };

  const formattedHeaders = headers.map(header => ({
    key: header.key,
    label: header.value
  }));

  const filteredData = data.map(({ contact_designation, contact_phone, ...rest }) => rest);

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-6">
      <div className="flex justify-between items-center w-full">
        <AppHeaders
          id="customerTitle"
          header="Customers"
          desc="Manage all customers and their details"
        />
        <Button onClick={handleAddCustomer} className="bg-blue-500 hover:bg-blue-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>
      
      <div className="w-full max-w-md relative">
        <Input
          id="search"
          placeholder="Search"
          className="pl-10 pr-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={localSearch}
          onChange={handleSearchChange}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        {localSearch && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      ) : filteredData.length > 0 ? (
        <div className="w-full bg-white rounded-lg shadow overflow-hidden">
          <AppTable
            headers={formattedHeaders}
            rows={filteredData}
            onClick={handleOnClick}
          />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
          No Customers Found
        </div>
      )}
    </div>
  );
}
