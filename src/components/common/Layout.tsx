// components/Layout.tsx

import useGlobalStore from "@/stores/useGlobalStore";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "./SideBar";

const Layout = () => {
  const isAuthenticated = useGlobalStore((state) => state.isAuthenticated);
  console.log("is Authenticated", isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return (
    <div className="flex flex-1 w-screen h-screen">
      <div className="flex basis-1/5">
        <SideBar />
      </div>
      <div className="flex flex-1 p-10">
        <Outlet /> {/* Renders the nested route content */}
      </div>
    </div>
  );
};

export default Layout;
