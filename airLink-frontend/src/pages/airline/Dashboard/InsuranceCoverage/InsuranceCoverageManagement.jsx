import React, { useState, useEffect } from "react";
import { Shield, Home, ArrowLeft, CheckCircle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Breadcrumb from "@/components/navigation/Breadcrumb";
import InsuranceCoverageForm from "./InsuranceCoverageForm";
import InsuranceCoverageTable from "./InsuranceCoverageTable";
import { getAllInsuranceCoverages } from "@/Redux/insuranceCoverage/insuranceCoverageThunk";
import { getAllAncillaries } from "@/Redux/ancillary/ancillaryThunk";

const InsuranceCoverageManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [selectedCoverage, setSelectedCoverage] = useState(null);

  const { insuranceCoverages, loading } = useSelector((state) => state.insuranceCoverage);
  const { ancillaries } = useSelector((state) => state.ancillary);

  // Load data on mount
  useEffect(() => {
    dispatch(getAllInsuranceCoverages());
    dispatch(getAllAncillaries());
  }, [dispatch]);

  // Calculate dynamic stats
  const totalCoverages = insuranceCoverages?.length || 0;
  const activeCoverages = insuranceCoverages?.filter((c) => c.active)?.length || 0;
  const uniqueCoverageTypes = new Set(insuranceCoverages?.map((c) => c.coverageType)).size;
  const travelProtectionProducts = ancillaries?.filter((a) => a.type === "TRAVEL_PROTECTION")?.length || 0;

  const handleEdit = (coverage) => {
    setSelectedCoverage(coverage);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCoverage(null);
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/airline", icon: Home },
    { label: "Insurance Coverages", disabled: true },
  ];

  if (showForm) {
    return (
      <InsuranceCoverageForm
        coverage={selectedCoverage}
        onClose={handleCloseForm}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-10 w-10 opacity-90" />
              <div>
                <div className="text-sm opacity-90">Total Coverages</div>
                <div className="text-2xl font-bold">
                  {loading ? "..." : totalCoverages}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm opacity-90">
              {activeCoverages} active, {totalCoverages - activeCoverages} inactive
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <Layers className="h-10 w-10 opacity-90" />
              <div>
                <div className="text-sm opacity-90">Coverage Types</div>
                <div className="text-2xl font-bold">
                  {loading ? "..." : uniqueCoverageTypes}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm opacity-90">
              Different types of protection available
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-10 w-10 opacity-90" />
              <div>
                <div className="text-sm opacity-90">Insurance Products</div>
                <div className="text-2xl font-bold">
                  {loading ? "..." : travelProtectionProducts}
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm opacity-90">
              Travel protection ancillaries configured
            </p>
          </div>
        </div>

        {/* Table */}
        <InsuranceCoverageTable onEdit={handleEdit} />
      </div>
    </div>
  );
};

export default InsuranceCoverageManagement;
