import useNavigationStore from "@/stores/useNavigationStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function NavigationSetter() {
  const navigation = useNavigate();
  const setNavigationFunction = useNavigationStore(
    (state) => state.setNavigationFunction
  );

  useEffect(() => {
    setNavigationFunction(navigation);
  }, [navigation, setNavigationFunction]);

  return null; // This component does not render anything
}
