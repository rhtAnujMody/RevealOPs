import { TAppTable } from "@/lib/model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const MAX_CELL_LENGTH = 20; // Adjust this value as needed

const truncateText = (text: string) => {
  if (text.length <= MAX_CELL_LENGTH) return text;
  return `${text.substring(0, MAX_CELL_LENGTH)}...`;
};

export const AppTable = <T extends Record<string, any>>({
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
          <TableRow className="w-full">
            {headers.map((header) => (
              <TableHead
                key={header.key}
                className="text-black text-normal font-semibold min-w-[130px]"
              >
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row: T, index: number) => (
            <TableRow
              key={index}
              className="cursor-pointer"
              onClick={() => handleClick(row)}
            >
              {headers.map((header) => (
                <TableCell
                  className="text-[#637887] text-sm"
                  key={header.key}
                >
                  {header.key === 'actions' ? (
                    <div onClick={(e) => e.stopPropagation()}>
                      {row[header.key]}
                    </div>
                  ) : typeof row[header.key] === "string" ? (
                    truncateText(row[header.key])
                  ) : typeof row[header.key] === "number" || typeof row[header.key] === "boolean" ? (
                    String(row[header.key])
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
