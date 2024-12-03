import AppHeaders from "@/components/common/AppHeaders";

export default function Compliances() {

  return (
    <div className="flex flex-col h-full w-full p-6 space-y-6">
      <div className="flex justify-between items-center w-full">
        <AppHeaders
          id="compliancesTitle"
          header="Compliances"
          desc="Manage all compliances details"
        />
      </div>
    </div>
  );
}
