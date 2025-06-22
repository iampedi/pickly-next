// src/app/layout/ContentCard.tsx
"use client";

import { Content } from "@/types/content";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

// UI Imports
import { Button } from "@/components/theme/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDownIcon,
  ArrowLineUpRightIcon,
  ArrowsDownUpIcon,
  ArrowUpIcon,
  DotsThreeOutlineIcon,
  PencilSimpleLineIcon,
  TrashSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Icon } from "@/components/ContentIcon";

type ContentTableProps = {
  contents: Content[];
  handleDelete: (id: string) => void;
  searchTerm: string;
  isLoading: boolean;
};

export const ContentTable = ({
  contents,
  handleDelete,
  searchTerm,
  isLoading,
}: ContentTableProps) => {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Define columns
  const columns: ColumnDef<Content>[] = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <Image
          src={row.getValue("image")}
          alt={row.getValue("title")}
          className="aspect-square rounded-md"
          width={34}
          height={0}
        />
      ),
    },
    {
      accessorKey: "category",
      accessorFn: (row) => row.category?.label,
      header: ({ column }) => {
        const sorted = column.getIsSorted();

        return (
          <Button
            variant="link"
            className="!px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
            {sorted === "asc" ? (
              <ArrowDownIcon className="size-4" />
            ) : sorted === "desc" ? (
              <ArrowUpIcon className="size-4" />
            ) : (
              <ArrowsDownUpIcon className="size-4" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        const category = row.original.category;

        return (
          <div className="flex items-center gap-1.5">
            <Icon icon={category?.icon} />
            {category.label}
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const content = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
                <span className="sr-only">Open menu</span>
                <DotsThreeOutlineIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuItem>
                <ArrowLineUpRightIcon /> Content Page
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/panel/contents/update/${content.id}`)
                }
              >
                <PencilSimpleLineIcon /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(content.id)}
                variant="destructive"
              >
                <TrashSimpleIcon /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // React Table
  const table = useReactTable({
    data: contents,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    table.getColumn("title")?.setFilterValue(searchTerm);
  }, [searchTerm, table]);

  return (
    <div className="_wrapper flex flex-col gap-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell>
                  <Skeleton className="h-[34px] w-[34px] rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px] w-[100px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px] w-[60px]" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-[20px] w-[40px]" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
