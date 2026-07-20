  export const getSeatTypeColor = (type) => {
    switch (type) {
      case 'LIE_FLAT':
        return 'bg-purple-100 text-purple-800';
      case 'ANGLE_FLAT':
        return 'bg-blue-100 text-blue-800';
      case 'RECLINER':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };