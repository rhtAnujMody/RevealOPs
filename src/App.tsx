import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/common/Layout";
import CustomerList from "./screens/CustomerList";
import Dashboard from "./screens/Dashboard";
import Login from "./screens/Login";
import ProjectDetails from "./screens/ProjectDetails";
import ProjectManagement from "./screens/ProjectManagement";
import SOW from "./screens/SOW";
import useNavigationStore from "./stores/useNavigationStore";
import EmployeeManagement from "./screens/EmployeeManagement";

function App() {
  const navigate = useNavigate();
  useNavigationStore.getState().setNavigationFunction(navigate);

  // const isAuthenticated = useGlobalStore((state) => state.isAuthenticated);

  // if (isAuthenticated) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customer-management" element={<CustomerList />} />
        <Route path="sow-management" element={<SOW />} />
        <Route path="project-management" element={<ProjectManagement />} />
        <Route path="project-allocation" element={<Dashboard />} />
        <Route path="employee-management" element={<EmployeeManagement />} />
        <Route path="projects/:projectId" element={<ProjectDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
