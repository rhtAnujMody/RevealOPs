import { Route, Routes, useNavigate } from "react-router-dom";
import Layout from "./components/common/Layout";
import CustomerList from "./screens/CustomerList";
import Dashboard from "./screens/Dashboard";
import Login from "./screens/Login";
import ProjectDetails from "./screens/ProjectDetails";
import ProjectManagement from "./screens/ProjectManagement";
import SOW from "./screens/SOW";
import SOWDetails from "./screens/SOWDetails";
import AddSOW from "./screens/AddSOW";
import EditSOW from "./screens/EditSOW";
import useNavigationStore from "./stores/useNavigationStore";
import ResourceAllocation from "./screens/ResourceAllocation";
import CustomerDetails from "./screens/CustomerDetails";
import AddCustomer from "./screens/AddCustomer";
import { Toaster } from 'react-hot-toast';
import EditCustomer from "./screens/EditCustomer";
import AddProject from "./screens/AddProject";
import EditProject from "./screens/EditProject";

function App() {
  const navigate = useNavigate();
  useNavigationStore.getState().setNavigationFunction(navigate);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/:customerId" element={<CustomerDetails />} />
          <Route path="customers/:customerId/edit" element={<EditCustomer />} />
          <Route path="sows" element={<SOW />} />
          <Route path="sows/add" element={<AddSOW />} />
          <Route path="sows/:sowId" element={<SOWDetails />} />
          <Route path="sows/:sowId/edit" element={<EditSOW />} />
          <Route path="projects" element={<ProjectManagement />} />
          <Route path="projects/add" element={<AddProject />} />
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          <Route path="projects/:projectId/edit" element={<EditProject />} />
          <Route path="projects/:projectId/resource-allocation" element={<ResourceAllocation />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
