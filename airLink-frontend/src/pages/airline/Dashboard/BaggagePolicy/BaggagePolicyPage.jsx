import React from "react";
import { Plus, Luggage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import BaggagePolicyTable from "./BaggagePolicyTable";

const BaggagePolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/airline/baggage-policies/new")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Policy
          </Button>
        </div>
      </div>

      {/* Table Component */}
      <BaggagePolicyTable />
    </div>
  );
};

export default BaggagePolicyPage;
