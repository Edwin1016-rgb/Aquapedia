import React from 'react';
import useOnlineStatus from '../../hooks/useOnlineStatus';

const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;
  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-black text-center py-2 z-50">
      Estás sin conexión — algunos recursos pueden estar limitados.
    </div>
  );
};

export default OfflineBanner;
