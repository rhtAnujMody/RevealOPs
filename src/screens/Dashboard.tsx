import { FC } from "react";
import SupersetDashboard from "@/components/SupersetDashboard";
import { supersetConfig } from "@/lib/envConfig";
import AppHeaders from "@/components/common/AppHeaders";

export default function Dashboard() {
  //   return <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
  //   <SupersetDashboard
  //     dashboardTitle="My Dashboard"
  //     supersetUrl={supersetConfig.supersetUrl}
  //     dashboardId={"fac366e8-211c-4a38-bc77-64084a34d027"}
  //     username={supersetConfig.username}
  //     password={supersetConfig.password}
  //     guestUsername={supersetConfig.guestUsername}
  //     guestFirstName={supersetConfig.guestFirstName}
  //     guestLastName={supersetConfig.guestLastName}
  //   />
  // </div>;
  return (
    <div className="flex flex-1 gap-10">
      <div className="flex flex-1 flex-col gap-5">
        <div className="">
          <AppHeaders
            id="dashboardTitle"
            header="Dashboard"
            desc="Gain insights into key metrics and performance indicators for teams across the organization at a glance"
          />
        </div>
        <div style={{ width: "100%", height: "", overflow: "auto" }}>
          <SupersetDashboard
            dashboardTitle="My Dashboard"
            supersetUrl={supersetConfig.supersetUrl}
            dashboardId={supersetConfig.dashboardId}
            username={supersetConfig.username}
            password={supersetConfig.password}
            guestUsername={supersetConfig.guestUsername}
            guestFirstName={supersetConfig.guestFirstName}
            guestLastName={supersetConfig.guestLastName}
          />
        </div>
      </div>
    </div>
  );
}
