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
import { Badge } from "@/components/ui/badge";

type ContentTableProps = {
  contents: Content[];
  onRequestDelete: (id: string) => void;
  searchTerm: string;
  isLoading: boolean;
  categoryFilter: string;
};

export const ContentTable = ({
  contents,
  onRequestDelete,
  searchTerm,
  isLoading,
  categoryFilter,
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
          className="mx-auto aspect-square rounded-full"
          width={30}
          height={30}
          priority
        />
      ),
    },
    {
      accessorFn: (row) => row.category?.label,
      id: "category",
      header: ({ column }) => {
        const sorted = column.getIsSorted();

        return (
          <Button
            variant="link"
            className="w-full justify-start rounded-none !px-0"
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
            <Badge
              variant={"secondary"}
              className="rounded bg-lime-100 px-1.5 font-normal"
            >
              {category?.label}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return (row.original.category?.label || "") === value;
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
      accessorKey: "curationsCount",
      header: ({ column }) => {
        const sorted = column.getIsSorted();

        return (
          <Button
            variant="link"
            className="!px-0"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Curation
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
      cell: ({ row }) => <div>{row.getValue("curationsCount")}</div>,
    },

    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const content = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className="mx-auto flex justify-center"
            >
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
                onClick={() => onRequestDelete(content.id)}
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

  useEffect(() => {
    table.getColumn("category")?.setFilterValue(categoryFilter);
  }, [categoryFilter, table]);

  return (
    <div className="_wrapper flex flex-col gap-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-center">
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
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
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
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-1.5 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-end space-x-2">
        <div className="text-muted-foreground flex-1 text-sm">
          Showing {table.getRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length}.
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
