import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CabinClassForm from '@/components/cabinClass/CabinClassForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CabinClassCreate = () => {
  const { aircraftId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = (cabinClass) => {
    console.log('Cabin class created successfully:', cabinClass);
    // Navigate back to aircraft detail page
    navigate(`/airline/aircraft/${aircraftId}`);
  };

  const handleCancel = () => {
    // Navigate back to aircraft detail page
    navigate(`/airline/aircraft/${aircraftId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Navigation */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/airline/aircraft/${aircraftId}`)}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Aircraft
        </Button>
        <div className="text-sm text-gray-500">
          / Aircraft / {aircraftId} / New Cabin Class
        </div>
      </div>

      {/* Form */}
      <CabinClassForm
        isEdit={false}
        aircraftId={aircraftId ? parseInt(aircraftId) : null}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default CabinClassCreate;