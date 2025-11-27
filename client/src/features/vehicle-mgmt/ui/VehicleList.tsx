import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVehicles, selectAllVehicles } from '../model/vehicleSlice';
import type { AppDispatch, RootState } from '../../../app/providers/store';
import { Trash2, Plus } from 'lucide-react';

export const VehicleList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const vehicles = useSelector(selectAllVehicles);
  const loading = useSelector((state: RootState) => state.vehicles.loading);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  if (loading) return <div>Loading vehicles...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">My Vehicles</h3>
        <button className="flex items-center gap-2 text-sm text-brand-primary hover:underline">
          <Plus size={16} /> Add Vehicle
        </button>
      </div>
      
      {vehicles.length === 0 ? (
        <p className="text-gray-500">No vehicles added yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center">
              <div>
                <div className="font-mono text-xl font-bold text-gray-800">{vehicle.plateNumber}</div>
                <div className="text-sm text-gray-600">{vehicle.model}</div>
                {vehicle.isDefault && (
                  <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                    Default
                  </span>
                )}
              </div>
              <button className="text-red-500 hover:text-red-700 p-2">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
