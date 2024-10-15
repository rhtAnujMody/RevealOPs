import { AppTable } from "@/components/common/AppTable";
import { Input } from "@/components/ui/input";
import { TProjects, TProjectStore } from "@/lib/model";
import useProjectStore from "@/stores/useProjectStore";
import { PlusCircle, RefreshCw, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ProjectManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoading, headers, data, search, setSearch, getAllProjects, clearSearch, currentPage, totalPages, setCurrentPage } =
    useProjectStore((state: TProjectStore) => ({
      isLoading: state.isLoading,
      data: state.data,
      headers: state.headers,
      search: state.search,
      setSearch: state.setSearch,
      getAllProjects: state.getAllProjects,
      clearSearch: state.clearSearch,
      currentPage: state.currentPage,
      totalPages: state.totalPages,
      setCurrentPage: state.setCurrentPage,
    }));

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchValue = searchParams.get('search');
    const page = searchParams.get('page');
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
    getAllProjects(currentPage);
  }, [location.search]);

  useEffect(() => {
    getAllProjects(currentPage);
  }, [search, currentPage]);

  const handleOnClick = (data: TProjects) => {
    navigate(`/projects/${data.id}`);
  };

  const handleAddProject = () => {
    navigate('/projects/add');
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    setSearch("");
    setCurrentPage(1);
    getAllProjects(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    getAllProjects(newPage);
  };

  const formattedHeaders = headers.map(header => ({
    key: header.key,
    label: header.value
  }));

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-6">
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
          <p className="text-sm text-gray-500">Manage all projects and their details</p>
        </div>
        <Button onClick={handleAddProject} className="bg-blue-500 hover:bg-blue-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Project
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
      ) : data.length > 0 ? (
        <>
          <div className="flex-1 overflow-auto">
            <div className="w-full bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <AppTable
                  headers={formattedHeaders}
                  rows={data}
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
        <div
          id="noProjects"
          className="flex flex-1 items-center justify-center text-gray-500 text-lg"
        >
          No Projects Found
        </div>
      )}
    </div>
  );
}
