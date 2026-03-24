import Banner from "@/components/Banner/Banner";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-[#f9f9fb] p-5  border rounded-md" style={{marginTop:"40px"}}>
      <div className="border px-6 bg-white rounded-sm">
        <Banner/>
      </div>
    </div>
  );
}
