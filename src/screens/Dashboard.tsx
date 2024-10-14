import AppHeaders from "@/components/common/AppHeaders";
import SupersetDashboard from "@/components/SupersetDashboard";
import { supersetConfig } from "@/lib/envConfig";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full w-full p-6 space-y-6">
      <div>
        <AppHeaders
          id="dashboardTitle"
          header="Dashboard"
          desc="Gain insights into key metrics and performance indicators for teams across the organization at a glance"
        />
      </div>

      <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
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
  );
}
