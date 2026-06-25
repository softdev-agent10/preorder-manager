// src/components/PreorderForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import clsx from "clsx";

interface PreorderFormData {
  name: string;
  productCount: number;
  preorderWhen: string;
  startAt: string;
  endAt: string;
  status: "active" | "inactive";
}

interface PreorderFormProps {
  initialData?: Partial<PreorderFormData> & { id?: string };
  isEditing?: boolean;
}

export function PreorderForm({
  initialData,
  isEditing = false,
}: PreorderFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreorderFormData>({
    defaultValues: initialData
      ? {
          name: initialData.name || "",
          productCount: initialData.productCount || 1,
          preorderWhen: initialData.preorderWhen
            ? new Date(initialData.preorderWhen).toISOString().split("T")[0]
            : "",
          startAt: initialData.startAt
            ? new Date(initialData.startAt).toISOString().split("T")[0]
            : "",
          endAt: initialData.endAt
            ? new Date(initialData.endAt).toISOString().split("T")[0]
            : "",
          status: initialData.status || "active",
        }
      : {
          name: "",
          productCount: 1,
          preorderWhen: "",
          startAt: "",
          endAt: "",
          status: "active",
        },
  });

  const onSubmit = async (data: PreorderFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = isEditing
        ? `/api/preorders/${initialData?.id}`
        : "/api/preorders";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          preorderWhen: new Date(data.preorderWhen),
          startAt: new Date(data.startAt),
          endAt: new Date(data.endAt),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save preorder");
      }

      router.push("/preorders");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name", { required: "Name is required" })}
          className={clsx(
            "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            errors.name && "border-red-300",
          )}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="productCount"
          className="block text-sm font-medium text-gray-700"
        >
          Product Count
        </label>
        <input
          id="productCount"
          type="number"
          min="1"
          {...register("productCount", {
            required: "Product count is required",
            min: { value: 1, message: "Must be at least 1" },
          })}
          className={clsx(
            "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            errors.productCount && "border-red-300",
          )}
        />
        {errors.productCount && (
          <p className="mt-1 text-sm text-red-600">
            {errors.productCount.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="preorderWhen"
          className="block text-sm font-medium text-gray-700"
        >
          Preorder When
        </label>
        <input
          id="preorderWhen"
          type="date"
          {...register("preorderWhen", {
            required: "Preorder date is required",
          })}
          className={clsx(
            "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            errors.preorderWhen && "border-red-300",
          )}
        />
        {errors.preorderWhen && (
          <p className="mt-1 text-sm text-red-600">
            {errors.preorderWhen.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="startAt"
          className="block text-sm font-medium text-gray-700"
        >
          Start At
        </label>
        <input
          id="startAt"
          type="date"
          {...register("startAt", { required: "Start date is required" })}
          className={clsx(
            "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            errors.startAt && "border-red-300",
          )}
        />
        {errors.startAt && (
          <p className="mt-1 text-sm text-red-600">{errors.startAt.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="endAt"
          className="block text-sm font-medium text-gray-700"
        >
          End At
        </label>
        <input
          id="endAt"
          type="date"
          {...register("endAt", { required: "End date is required" })}
          className={clsx(
            "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500",
            errors.endAt && "border-red-300",
          )}
        />
        {errors.endAt && (
          <p className="mt-1 text-sm text-red-600">{errors.endAt.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.push("/preorders")}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {isEditing ? "Update Preorder" : "Create Preorder"}
        </button>
      </div>
    </form>
  );
}
