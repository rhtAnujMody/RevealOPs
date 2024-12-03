import AppHeaders from "@/components/common/AppHeaders";
import { AppTable } from "@/components/common/AppTable";
import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import useComplianceStore from "@/stores/useComplianceStore";
import { format } from "date-fns";

export default function Compliances() {
  const { isLoading, headers, data, getAllCompliances } = useComplianceStore();

  useEffect(() => {
    getAllCompliances();
  }, []);

  const formattedData = data.map(item => ({
    ...item,
    created_at: format(new Date(item.created_at), 'MMM dd, yyyy'),
    updated_at: format(new Date(item.updated_at), 'MMM dd, yyyy'),
  }));

  const formattedHeaders = headers.map(header => ({
    key: header.key,
    label: header.value
  }));

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-6">
      <div className="flex justify-between items-center w-full">
        <AppHeaders
          id="compliancesTitle"
          header="Compliances"
          desc="Manage all compliances details"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      ) : formattedData.length > 0 ? (
        <div className="flex-1 overflow-auto">
          <div className="w-full bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <AppTable
                headers={formattedHeaders}
                rows={formattedData}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
          No Compliances Found
        </div>
      )}
    </div>
  );
}
