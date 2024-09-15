import { TAppHeader } from "@/lib/model";

export default function AppHeaders({ header, desc }: TAppHeader) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{header}</h1>
      {desc && <h6 className="text-sm text-[#637887]">{desc}</h6>}
    </div>
  );
}
