
import LifeServiceManagement from "@/components/LifeService/LifeServiceManagement";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-[#f9f9fb] p-5 mt-32 border rounded-md">
      <div className="border px-6 bg-white rounded-sm">
        <LifeServiceManagement />
      </div>
    </div>
  );
}
