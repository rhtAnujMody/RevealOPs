import { TAppTable } from "@/lib/model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const MAX_CELL_LENGTH = 20;

const truncateText = (text: string) => {
  if (text.length <= MAX_CELL_LENGTH) return text;
  return `${text.substring(0, MAX_CELL_LENGTH)}...`;
};

interface AppTableProps<T> extends TAppTable<T> {
  fixedColumns?: boolean;
}

export const AppTable = <T extends Record<string, any>>({
  headers,
  rows,
  onClick,
  fixedColumns = false,
}: AppTableProps<T>) => {
  const handleClick = (data: T) => {
    if (onClick) {
      onClick(data);
    }
  };

  // If fixedColumns is false, render the original table
  if (!fixedColumns) {
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
                        {renderCell(row, header)}
                      </div>
                    ) : renderCell(row, header)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // Split headers into fixed and scrollable for fixed columns view
  const fixedHeaders = headers.slice(0, 2);
  const scrollableHeaders = headers.slice(2);

  return (
    <div className="flex w-full overflow-hidden relative border rounded-lg">
      {/* Fixed Columns Table */}
      <div className="sticky left-0 z-10 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              {fixedHeaders.map((header) => (
                <TableHead
                  key={header.key}
                  className="text-black text-normal font-semibold bg-white min-w-[130px] border-b"
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
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleClick(row)}
              >
                {fixedHeaders.map((header) => (
                  <TableCell
                    className="text-[#637887] text-sm bg-white"
                    key={header.key}
                  >
                    {header.key === 'actions' ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        {renderCell(row, header)}
                      </div>
                    ) : renderCell(row, header)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Scrollable Columns Table */}
      <div className="overflow-x-auto flex-1">
        <Table className="border-collapse">
          <TableHeader>
            <TableRow>
              {scrollableHeaders.map((header) => (
                <TableHead
                  key={header.key}
                  className="text-black text-normal font-semibold min-w-[130px] border-b"
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
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleClick(row)}
              >
                {scrollableHeaders.map((header) => (
                  <TableCell
                    className="text-[#637887] text-sm"
                    key={header.key}
                  >
                    {header.key === 'actions' ? (
                      <div onClick={(e) => e.stopPropagation()}>
                        {renderCell(row, header)}
                      </div>
                    ) : renderCell(row, header)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const renderCell = (row: any, header: { key: string; label: string }) => {
  const cellData = row[header.key];
  
  // If the cell data is an object with a render property, use that
  if (cellData && typeof cellData === 'object' && 'render' in cellData) {
    return cellData.render;
  }
  
  // If it's a string, truncate it
  if (typeof cellData === 'string') {
    return truncateText(cellData);
  }
  
  // For other types, convert to string
  return cellData?.toString() || '';
};
