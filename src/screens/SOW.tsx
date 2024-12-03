import { AppTable } from "@/components/common/AppTable";
import { Input } from "@/components/ui/input";
import { TSOW, TSOWStore } from "@/lib/model";
import useSOWStore from "@/stores/useSOWStore";
import useNavigationStore from "@/stores/useNavigationStore";
import { RefreshCw, PlusCircle, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { convertDaysToWeeks } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SOW() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, headers, data, search, setSearch, getAllSOW, clearSearch, currentPage, totalPages, setCurrentPage, status, setStatus, clearStatus } =
    useSOWStore((state: TSOWStore) => ({
      isLoading: state.isLoading,
      data: state.data,
      headers: state.headers,
      search: state.search,
      setSearch: state.setSearch,
      getAllSOW: state.getAllSOW,
      clearSearch: state.clearSearch,
      currentPage: state.currentPage,
      totalPages: state.totalPages,
      setCurrentPage: state.setCurrentPage,
      status: state.status,
      setStatus: state.setStatus,
      clearStatus: state.clearStatus,
    }));

  const [localSearch, setLocalSearch] = useState(search);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchValue = searchParams.get('search');
    const page = searchParams.get('page');
    const status = searchParams.get('status');
    
    if (searchValue) {
      setSearch(searchValue);
      setLocalSearch(searchValue);
    } else {
      clearSearch();
      setLocalSearch('');
    }
    if (page) {
      setCurrentPage(parseInt(page));
    }
    if (status) {
      setStatusFilter(status);
    }
    getAllSOW(currentPage, searchValue || '', status || '');
  }, [location.search]);

  useEffect(() => {
    getAllSOW(currentPage, search, statusFilter);
  }, [search, currentPage, statusFilter]);

  // Debug log
  useEffect(() => {
    console.log("Current data:", data);
    console.log("Current page:", currentPage);
    console.log("Total pages:", totalPages);
  }, [data, currentPage, totalPages]);

  const handleOnClick = (sow: TSOW) => {
    useNavigationStore.getState().navigate(`/sows/${sow.sow_id}`, false);
  };

  const handleAddSOW = () => {
    navigate('/sows/add');
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    setSearch("");
    setCurrentPage(1);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('search');
    searchParams.set('page', '1');
    searchParams.set('status', statusFilter);
    navigate(`?${searchParams.toString()}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearch(value);
    setCurrentPage(1);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('search', value);
    searchParams.set('page', '1');
    searchParams.set('status', statusFilter);
    navigate(`?${searchParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', newPage.toString());
    if (search) searchParams.set('search', search);
    searchParams.set('status', statusFilter);
    navigate(`?${searchParams.toString()}`);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setStatusFilter(value);
    setCurrentPage(1);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('status', value);
    searchParams.set('page', '1');
    navigate(`?${searchParams.toString()}`);
  };

  const formattedHeaders = [...headers, { key: 'status', value: 'Status' }].map(header => ({
    key: header.key,
    label: header.value
  }));

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-6">
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Statement of Work</h1>
          <p className="text-sm text-gray-500">Manage all SOWs and their details</p>
        </div>
        <Button onClick={handleAddSOW} className="bg-blue-500 hover:bg-blue-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add SOW
        </Button>
      </div>

      <div className="flex gap-4 items-center">
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
        
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      ) : data && data.length > 0 ? (
        <>
          <div className="flex-1 overflow-auto">
            <div className="w-full bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <AppTable
                  headers={formattedHeaders}
                  rows={data.map(item => ({
                    ...item,
                    duration: typeof item.duration === 'number' ? convertDaysToWeeks(item.duration) : 'N/A',
                    status: 'Active'
                  }))}
                  onClick={handleOnClick}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              isLoading={isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              isLoading={isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
          No SOWs Found
        </div>
      )}
    </div>
  );
}
