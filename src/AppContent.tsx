import { useEffect } from "react";
import App from "./App";
import { TGlobal } from "./lib/model";
import useGlobalStore from "./stores/useGlobalStore";

export default function AppContent() {
  const setIsAuthenticated = useGlobalStore(
    (state: TGlobal) => state.setIsAuthenticated
  );
  // const isAuthenticated = useGlobalStore(
  //   (state: TGlobal) => state.isAuthenticated
  // );

  useEffect(() => {
    // Example: Simulate an authentication check
    const authenticate = async () => {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsAuthenticated(true); // Assume authentication succeeds
    };

    authenticate();
  }, [setIsAuthenticated]);

  return <App />;
}
