import React from 'react'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Settings } from "lucide-react";
import { Grid3X3 } from "lucide-react";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const EmptyCabin = () => {
  const navigate = useNavigate();
  const { flightInstance } = useSelector((store) => store);
  return (
    <Card className="border-dashed border-2 border-gray-300">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Grid3X3 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Cabin Classes Configured
        </h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          This flight instance doesn't have any cabin classes configured yet.
          Create your first cabin to start managing seats and pricing.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() =>
              navigate(`/airline/instances/${flightInstance.id}/cabins/new`)
            }
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create First Cabin
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/airline/aircraft")}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Configure Aircraft
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};




export default EmptyCabin