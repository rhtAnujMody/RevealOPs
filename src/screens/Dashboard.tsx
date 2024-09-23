import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const headers = [
    { value: "", width: "50px" },
    { value: "Name" },
    { value: "Role" },
    { value: "Available Bandwidth" },
    { value: "Billable" },
    { value: "Start Date" },
    { value: "End Date" },
  ];
  return (
    // <AppTable
    //   headers={[
    //     { key: "id", value: "ID" },
    //     { key: "cb", value: "Select"},
    //     { key: "project_name", value: "Project Name" },
    //   ]}
    //   rows={[{ id: 1, cb: "", project_name: "Project 1" }]}
    // />

    <div className="flex flex-1">
      {/* <div className="flex flex-1 h-fit gap-2">
        {headers.map((header) => (
          <div
            className={cn("flex  text-base", !header.width && "flex-1")}
            style={{ width: header.width }}
            key={header.value}
          >
            {header.value}
          </div>
        ))}
      </div> */}
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[250px]">Available Bandwidth</TableHead>
            <TableHead>Billable</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell className="text-center">
                <Checkbox />
              </TableCell>
              <TableCell>Anuj Mody</TableCell>
              <TableCell>Developer</TableCell>
              <TableCell>25%</TableCell>
              <TableCell>Yes</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
