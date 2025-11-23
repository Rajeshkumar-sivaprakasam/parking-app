import { motion } from 'framer-motion';
import { Car, Plus, Trash2, Star, Edit } from 'lucide-react';
import { useState } from 'react';

export const VehiclesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [model, setModel] = useState('');

  const vehicles = [
    { id: '1', plateNumber: 'WXX 1234', model: 'Perodua Myvi', isDefault: true, color: 'Silver' },
    { id: '2', plateNumber: 'ABC 5678', model: 'Honda City', isDefault: false, color: 'Black' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Vehicles</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your registered vehicles</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-brand-primary/30"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* License Plate Design */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 relative">
              {vehicle.isDefault && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star size={12} className="fill-yellow-900" />
                  Default
                </div>
              )}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border-4 border-gray-800 dark:border-gray-600">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">MALAYSIA</div>
                  <div className="text-3xl font-bold tracking-wider font-mono text-gray-900 dark:text-white">
                    {vehicle.plateNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{vehicle.model}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.color}</p>
                </div>
                <Car className="text-gray-400" size={24} />
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium">
                  <Edit size={16} />
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add New Card */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: vehicles.length * 0.1 }}
          onClick={() => setShowAddModal(true)}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-brand-primary dark:hover:border-brand-primary transition-all min-h-[280px] flex flex-col items-center justify-center gap-4 group"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-white">Add New Vehicle</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Register another car</p>
          </div>
        </motion.button>
      </div>

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Vehicle</h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plate Number
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="WXX 1234"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all font-mono text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Car Model
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g., Perodua Myvi"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <input type="checkbox" id="default" className="w-4 h-4" />
                <label htmlFor="default" className="text-sm text-gray-700 dark:text-gray-300">
                  Set as default vehicle
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-brand-primary/30"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
