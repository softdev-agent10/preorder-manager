// src/components/StatusSwitch.tsx
"use client";

import { useState } from "react";
import clsx from "clsx";

interface StatusSwitchProps {
  id: string;
  status: "active" | "inactive";
  onToggle: (id: string, newStatus: "active" | "inactive") => Promise<void>;
}

export function StatusSwitch({ id, status, onToggle }: StatusSwitchProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const newStatus = status === "active" ? "inactive" : "active";
      await onToggle(id, newStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={clsx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        status === "active" ? "bg-green-600" : "bg-gray-300",
        isLoading && "opacity-50 cursor-not-allowed",
      )}
    >
      <span
        className={clsx(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          status === "active" ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}
