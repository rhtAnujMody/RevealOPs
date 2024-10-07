import { TEmployeeStore } from "@/lib/model";
import useEmployeeStore from "@/stores/useEmployeesStore";
import { useEffect } from "react";

export default function Dashboard() {
  const { isLoading, data, getAllEmployees } = useEmployeeStore(
    (state: TEmployeeStore) => ({
      isLoading: state.isLoading,
      getAllEmployees: state.getAllEmployees,
      data: state.data,
    })
  );

  useEffect(() => {
    getAllEmployees();
  }, []);

  return <div className="flex flex-1">Dashboard</div>;
}
