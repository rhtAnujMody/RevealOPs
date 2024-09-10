import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/common/Layout";
import Dashboard from "./screens/Dashboard";
import Login from "./screens/Login";
import useNavigationStore from "./stores/useNavigationStore";
import ProjectDetails from "./screens/ProjectDetails";

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
        <Route path="customer-management" element={<Dashboard />} />
        <Route path="sow-management" element={<Dashboard />} />
        <Route path="project-management" element={<Dashboard />} />
        <Route path="project-details" element={<ProjectDetails />} />
        <Route path="employee-management" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
