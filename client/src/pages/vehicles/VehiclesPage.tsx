import { motion } from "framer-motion";
import { Car, Plus, Trash2, Star, Edit } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  vehicleService,
  type Vehicle,
} from "../../features/vehicles/api/vehicleService";
import {
  VehicleCardSkeleton,
  PageHeaderSkeleton,
} from "../../shared/ui/Skeleton";
import { Button } from "../../shared/ui/Button";

export const VehiclesPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form State
  const [plateNumber, setPlateNumber] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleService.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const vehicleData = {
        plateNumber,
        make,
        vehicleModel: model,
        color,
        isDefault,
      };

      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle._id, vehicleData);
      } else {
        await vehicleService.addVehicle(vehicleData);
      }

      setShowAddModal(false);
      setEditingVehicle(null);
      resetForm();
      fetchVehicles();
    } catch (error) {
      console.error("Failed to save vehicle:", error);
      alert("Failed to save vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setPlateNumber(vehicle.plateNumber);
    setMake(vehicle.make);
    setModel(vehicle.vehicleModel);
    setColor(vehicle.color);
    setIsDefault(vehicle.isDefault);
    setShowAddModal(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (deleting) return;
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      setDeleting(id);
      try {
        await vehicleService.deleteVehicle(id);
        fetchVehicles();
      } catch (error) {
        console.error("Failed to delete vehicle:", error);
      } finally {
        setDeleting(null);
      }
    }
  };

  const resetForm = () => {
    setPlateNumber("");
    setMake("");
    setModel("");
    setColor("");
    setIsDefault(false);
    setEditingVehicle(null);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  // Skeleton loading
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <PageHeaderSkeleton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <VehicleCardSkeleton />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Vehicles
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your registered vehicles
          </p>
        </div>
        <Button
          variant="primary"
          size="lg"
          leftIcon={<Plus size={20} />}
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
        >
          Add Vehicle
        </Button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle, index) => (
          <motion.div
            key={vehicle._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group"
          >
            {/* License Plate Design */}
            <div className="p-6 bg-linear-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 relative">
              {vehicle.isDefault && (
                <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star size={12} className="fill-yellow-900" />
                  Default
                </div>
              )}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border-4 border-gray-800 dark:border-gray-600">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    MALAYSIA
                  </div>
                  <div className="text-3xl font-bold tracking-wider font-mono text-gray-900 dark:text-white uppercase">
                    {vehicle.plateNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {vehicle.make} {vehicle.vehicleModel}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {vehicle.color}
                  </p>
                </div>
                <Car className="text-gray-400" size={24} />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEditClick(vehicle)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteVehicle(vehicle._id)}
                  disabled={deleting === vehicle._id}
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors disabled:opacity-50"
                >
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
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-brand-primary dark:hover:border-brand-primary transition-all min-h-[280px] flex flex-col items-center justify-center gap-4 group"
        >
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <p className="font-semibold text-gray-900 dark:text-white">
              Add New Vehicle
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Register another car
            </p>
          </div>
        </motion.button>
      </div>

      {/* Add/Edit Vehicle Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plate Number
                </label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="WXX 1234"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all font-mono text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Make
                  </label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g., Perodua"
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g., Myvi"
                    required
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g., Silver"
                  required
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <input
                  type="checkbox"
                  id="default"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-4 h-4"
                />
                <label
                  htmlFor="default"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Set as default vehicle
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={submitting}
                  loadingText="Saving..."
                  fullWidth
                >
                  {editingVehicle ? "Save Changes" : "Add Vehicle"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
