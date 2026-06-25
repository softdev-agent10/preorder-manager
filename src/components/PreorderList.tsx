// src/components/PreorderList.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StatusSwitch } from "./StatusSwitch";
import { Pagination } from "./Pagination";
import clsx from "clsx";

interface Preorder {
  id: string;
  name: string;
  productCount: number;
  preorderWhen: Date;
  startAt: Date;
  endAt: Date;
  status: "active" | "inactive";
}

export function PreorderList() {
  const router = useRouter();
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [sort, setSort] = useState("createdAt_desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const limit = 10;

  useEffect(() => {
    fetchPreorders();
  }, [filter, sort, page]);

  const fetchPreorders = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/preorders?page=${page}&limit=${limit}&filter=${filter}&sort=${sort}`,
      );
      const data = await res.json();
      setPreorders(data.preorders);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching preorders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (
    id: string,
    newStatus: "active" | "inactive",
  ) => {
    try {
      const res = await fetch(`/api/preorders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setPreorders((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this preorder?")) return;
    try {
      const res = await fetch(`/api/preorders/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPreorders((prev) => prev.filter((p) => p.id !== id));
        setSelectedIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error deleting preorder:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === preorders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(preorders.map((p) => p.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Preorders</h1>
          <Link
            href="/preorders/create"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Create Preorder
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as any);
              setPage(1);
            }}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="createdAt_desc">Newest</option>
            <option value="createdAt_asc">Oldest</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : preorders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No preorders found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === preorders.length &&
                        preorders.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Products
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Preorder Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Period
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {preorders.map((preorder) => (
                  <tr key={preorder.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(preorder.id)}
                        onChange={() => handleSelectOne(preorder.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">{preorder.name}</td>
                    <td className="px-4 py-3 text-sm">
                      {preorder.productCount}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(preorder.preorderWhen)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(preorder.startAt)} -{" "}
                      {formatDate(preorder.endAt)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusSwitch
                        id={preorder.id}
                        status={preorder.status}
                        onToggle={handleStatusToggle}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/preorders/edit/${preorder.id}`}
                          className="p-1 text-gray-600 hover:text-blue-600"
                        >
                          <p className="w-4 h-4">PencilIcon</p>
                          {/* <PencilIcon className="w-4 h-4" /> */}
                        </Link>
                        <button
                          onClick={() => handleDelete(preorder.id)}
                          className="p-1 text-gray-600 hover:text-red-600"
                        >
                          <p className="w-4 h-4">TrashIcon</p>
                          {/* <TrashIcon className="w-4 h-4" /> */}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {selectedIds.size} selected
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
