import AppHeaders from "@/components/common/AppHeaders";
import { AppTable } from "@/components/common/AppTable";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, X, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import useRecruitmentStore from "@/stores/useRecruitmentStore";


export default function Recruitment() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isLoading,
    headers,
    data,
    search,
    setSearch,
    getAllRecruitments,
    clearSearch,
    currentPage,
    totalPages,
    setCurrentPage,
    offerStatus,
    setOfferStatus,
  } = useRecruitmentStore();

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchValue = searchParams.get('search');
    const page = searchParams.get('page');
    const status = searchParams.get('offer_status');
    
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
      setOfferStatus(status);
    }
    getAllRecruitments(currentPage, searchValue || '', status || '');
  }, [location.search]);

  useEffect(() => {
    getAllRecruitments(currentPage, search, offerStatus);
  }, [search, currentPage, offerStatus]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearch(value);
    setCurrentPage(1);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('search', value);
    searchParams.set('page', '1');
    searchParams.set('offer_status', offerStatus);
    navigate(`?${searchParams.toString()}`);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    setSearch("");
    setCurrentPage(1);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('search');
    searchParams.set('page', '1');
    searchParams.set('offer_status', offerStatus);
    navigate(`?${searchParams.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', newPage.toString());
    if (search) searchParams.set('search', search);
    searchParams.set('offer_status', offerStatus);
    navigate(`?${searchParams.toString()}`);
  };

  const handleStatusChange = (value: string) => {
    setOfferStatus(value);
    setCurrentPage(1);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('offer_status', value);
    searchParams.set('page', '1');
    navigate(`?${searchParams.toString()}`);
  };

  const formattedData = data.map(item => ({
    ...item,
    request_date: format(new Date(item.request_date), 'MMM dd, yyyy'),
    screened: item.screened ? "Yes" : "No",
    round1_select: item.round1_select ? "Passed" : "Pending",
    round2_select: item.round2_select ? "Passed" : "Pending",
    round3_select: item.round3_select ? "Passed" : "Pending",
    joining_date: item.joining_date ? format(new Date(item.joining_date), 'MMM dd, yyyy') : 'N/A'
  }));

  const formattedHeaders = headers.map(header => ({
    key: header.key,
    label: header.value
  }));

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-6">
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recruitment</h1>
          <p className="text-sm text-gray-500">Manage all recruitment requests</p>
        </div>
        {/* <Button onClick={() => navigate('/recruitment/add')} className="bg-blue-500 hover:bg-blue-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Request
        </Button> */}
      </div>

      {/* <div className="flex gap-4 items-center">
        <div className="w-full max-w-md relative">
          <Input
            id="search"
            placeholder="Search requests..."
            className="pl-10 pr-10"
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
        
        <Select value={offerStatus} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Offered">Offered</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      ) : formattedData.length > 0 ? (
        <>
          <div className="flex-1 overflow-auto">
            <div className="w-full bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <AppTable
                  headers={formattedHeaders}
                  rows={formattedData}
                  // onClick={(row) => navigate(`/recruitment/${row.id}`)}
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
          No Recruitment Requests Found
        </div>
      )}
    </div>
  );
}
