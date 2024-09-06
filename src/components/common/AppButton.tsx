import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

export default function AppButton({
  isLoading = false,
  label,
}: {
  isLoading: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center  bg-red-100">
      {isLoading ? (
        <ReloadIcon className="animate-spin" />
      ) : (
        <Button>{label}</Button>
      )}
    </div>
  );
}
