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
    <div className="flex flex-1 w-screen h-screen overflow-hidden">
      <div className="flex basis-[15%] flex-shrink-0 border-r">
        <SideBar />
      </div>

      <div className="flex flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
