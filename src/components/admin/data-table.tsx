import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function AdminDataTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: { id: string; cells: (string | React.ReactNode)[] }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col}>{col}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
              Tidak ada data.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.id}>
              {row.cells.map((cell, i) => (
                <TableCell key={i}>{cell}</TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const variant =
    status === "PUBLISHED"
      ? "default"
      : status === "DRAFT"
        ? "secondary"
        : "outline";
  return <Badge variant={variant}>{status}</Badge>;
}
