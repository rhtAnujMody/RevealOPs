import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface SupersetDashboardProps {
  supersetUrl: string;
  dashboardId: string;
  username: string;
  password: string;
  guestUsername: string;
  guestFirstName: string;
  guestLastName: string;
  dashboardTitle: string;
}

const SupersetDashboard = ({
  dashboardTitle,
  supersetUrl,
  dashboardId,
  username,
  password,
  guestUsername,
  guestFirstName,
  guestLastName,
}: SupersetDashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const divRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const supersetApiUrl = supersetUrl + '/api/v1/security';

    const fetchAccessToken = async () => {
      const body = {
        username,
        password,
        provider: "db",
        refresh: true,
      };

      const config = {
        headers: {
          "Content-Type": "application/json"
        }
      };

      const { data } = await axios.post(supersetApiUrl + '/login', body, config);
      return data.access_token;
    };

    const fetchGuestToken = async (accessToken: string) => {
      const guestTokenBody = {
        resources: [
          {
            type: "dashboard",
            id: dashboardId,
          }
        ],
        rls: [], // Add your RLS filters here if needed
        user: {
          username: guestUsername,
          first_name: guestFirstName,
          last_name: guestLastName,
        }
      };

      const guestTokenHeaders = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + accessToken
        }
      };

      const response = await axios.post(supersetApiUrl + '/guest_token/', guestTokenBody, guestTokenHeaders);
  
      return response.data.token;
    };

    const initializeDashboard = async () => {
      try {
        const accessToken = await fetchAccessToken();
        const guestToken = await fetchGuestToken(accessToken);
        const mountPoint = document.getElementById("superset-container") as HTMLElement;
        if (mountPoint) {
          embedDashboard({
            id: dashboardId,
            supersetDomain: supersetUrl,
            mountPoint: mountPoint,
            fetchGuestToken: () => guestToken,
            dashboardUiConfig: {
              hideTitle: true,
              hideChartControls: true,
              hideTab: false,
              filters: {
                expanded: false,
                visible: false
              }
            },
          });

          // Ensure iframe is properly sized
          const iframeSuperset = mountPoint.children[0] as HTMLIFrameElement;
          if (iframeSuperset) {
            iframeSuperset.style.width = "100%";
            iframeSuperset.style.height = "100%";
            iframeSuperset.onload = () => setIsLoading(false);
          }
        } else {
          console.error("Mount point element not found");
        }
      } catch (error) {
        console.error("Error initializing the dashboard:", error);
        setIsLoading(false);
      }
    };

    initializeDashboard();

  }, [supersetUrl, dashboardId, username, password, guestUsername, guestFirstName, guestLastName]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div 
        id="superset-container" 
        style={{ 
          width: '100%', 
          height: '100%',
          visibility: isLoading ? 'hidden' : 'visible' 
        }} 
      />
    </div>
  );
};

export default SupersetDashboard;
