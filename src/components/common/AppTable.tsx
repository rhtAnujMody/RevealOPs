import { TAppTable } from "@/lib/model";
import { EditIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export const AppTable = <T extends object>({
  headers,
  rows,
  onClick,
}: TAppTable<T>) => {
  const handleClick = (data: T) => {
    if (onClick) {
      onClick(data);
    }
  };

  return (
    <div className="flex w-full">
      <Table className="border">
        <TableHeader>
          <TableRow>
            {headers.map((header: Record<string, string>) => {
              if (header.key !== "id") {
                return (
                  <TableHead
                    key={header.key}
                    className=" text-black text-normal font-semibold"
                  >
                    {header.value}
                  </TableHead>
                );
              }
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: T, index: number) => {
            return (
              <TableRow
                key={index}
                className="cursor-pointer"
                onClick={() => handleClick(row)}
              >
                {Object.keys(row).map((key) => {
                  console.log(Object.keys(row).length);
                  if (key !== "id") {
                    return (
                      <TableCell className="text-[#637887] text-sm" key={key}>
                        {key === "actions" ? (
                          <div className="flex">
                            <EditIcon className="w-5 h-5 ml-4" />
                          </div>
                        ) : (
                          row[key]
                        )}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
