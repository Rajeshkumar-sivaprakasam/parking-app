import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Filter,
  Navigation,
  Car,
  AlertCircle,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { vehicleService } from "../../features/vehicles/api/vehicleService";
import { invalidateCache } from "../../api/axiosInstance";

interface ParkingLot {
  id: string;
  name: string;
  address: string;
  distance: number;
  price: number;
  rating: number;
  availableSlots: number;
  totalSlots: number;
  features: string[];
  image: string;
}

const mockParkingLots: ParkingLot[] = [
  {
    id: "1",
    name: "Suria KLCC",
    address: "Kuala Lumpur City Centre",
    distance: 0.5,
    price: 5,
    rating: 4.8,
    availableSlots: 45,
    totalSlots: 200,
    features: ["Covered", "EV Charging", "Valet"],
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400",
  },
  {
    id: "2",
    name: "Pavilion KL",
    address: "Bukit Bintang",
    distance: 1.2,
    price: 4,
    rating: 4.6,
    availableSlots: 120,
    totalSlots: 500,
    features: ["Covered", "Security"],
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400",
  },
  {
    id: "3",
    name: "Mid Valley Megamall",
    address: "Mid Valley City",
    distance: 2.8,
    price: 3,
    rating: 4.5,
    availableSlots: 230,
    totalSlots: 800,
    features: ["Covered", "Disabled Access"],
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
  },
];

export const BookingPage = () => {
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddVehiclePopup, setShowAddVehiclePopup] = useState(false);
  const [checkingVehicles, setCheckingVehicles] = useState(true);
  const navigate = useNavigate();

  // Check if user has vehicles on page load
  useEffect(() => {
    const checkVehicles = async () => {
      try {
        // Invalidate cache to get fresh data
        invalidateCache.vehicles();
        const vehicles = await vehicleService.getVehicles();
        if (!vehicles || vehicles.length === 0) {
          setShowAddVehiclePopup(true);
        }
      } catch (error) {
        console.error("Failed to check vehicles:", error);
        // If there's an error (possibly unauthenticated), don't show popup
      } finally {
        setCheckingVehicles(false);
      }
    };

    checkVehicles();
  }, []);

  const handleAddVehicleClick = () => {
    setShowAddVehiclePopup(false);
    navigate("/vehicles");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Find Parking
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Discover nearby parking spots
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
        <div className="flex items-center gap-3">
          <MapPin className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search location or parking lot..."
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
          <button className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
            Search
          </button>
        </div>
      </div>

      {/* Parking Lots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockParkingLots.map((lot, index) => (
          <motion.div
            key={lot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedLot(lot)}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="relative h-48 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent z-10" />
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <MapPin size={48} className="text-gray-400" />
              </div>
              <div className="absolute top-4 right-4 z-20 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm font-bold text-gray-900 dark:text-white shadow-lg">
                RM {lot.price}/hr
              </div>
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {lot.rating}
                  </span>
                </div>
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {lot.availableSlots} Available
                </div>
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {lot.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1">
                <MapPin size={14} />
                {lot.address} • {lot.distance} km away
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {lot.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-brand-primary text-xs font-medium rounded-lg"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 bg-brand-primary text-white py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                  <Car size={18} />
                  Book Now
                </button>
                <button className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Navigation
                    size={18}
                    className="text-gray-600 dark:text-gray-400"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Lot Modal */}
      {selectedLot && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLot(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedLot.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {selectedLot.address}
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Price per Hour
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      RM {selectedLot.price}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Available Slots
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedLot.availableSlots}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/booking/slots")}
                  className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors"
                >
                  Proceed to Slot Selection
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Add Vehicle First Popup */}
      {showAddVehiclePopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 text-center shadow-2xl"
          >
            {/* Car Icon with Circle Background */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Car size={40} className="text-white" />
            </div>

            {/* Alert Icon */}
            <div className="flex items-center justify-center gap-2 text-amber-500 mb-4">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">Action Required</span>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Add Your Vehicle First
            </h3>

            {/* Description */}
            <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Before you can book a parking spot, you need to register at least
              one vehicle. This helps us identify your car when you arrive.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddVehicleClick}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus size={20} />
                Add Vehicle Now
              </button>
              <button
                onClick={() => setShowAddVehiclePopup(false)}
                className="w-full text-gray-500 dark:text-gray-400 py-3 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                I'll do it later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
