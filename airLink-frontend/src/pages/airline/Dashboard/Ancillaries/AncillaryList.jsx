import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpinnerLoader } from '@/components/common/Loader';
import { getAllAncillaries, deleteAncillary } from '@/Redux/ancillary/ancillaryThunk';
import AncillaryCard from './AncillaryCard';



const AncillaryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ancillaries, loading, error } = useSelector((state) => state.ancillary);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterLevel, setFilterLevel] = useState('ALL');

  useEffect(() => {
    dispatch(getAllAncillaries());
  }, [dispatch]);

  

  const filteredAncillaries = ancillaries?.filter((ancillary) => {
    const matchesSearch = ancillary.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ancillary.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'ALL' || ancillary.category === filterCategory;
    const matchesLevel = filterLevel === 'ALL' || ancillary.level === filterLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SpinnerLoader size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Master Ancillaries</h1>
          <p className="text-muted-foreground">Manage your ancillary service catalog</p>
        </div>
        <Button
          onClick={() => navigate('/airline/ancillaries/create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Ancillary
        </Button>
      </div>


      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Ancillaries Grid - Optimized for Vertical Cards */}
      <div className="space-y-2">
        {filteredAncillaries?.map((ancillary) => (
         <AncillaryCard key={ancillary.id} ancillary={ancillary} />
        ))}
      </div>

      {filteredAncillaries?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">No ancillaries found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AncillaryList;