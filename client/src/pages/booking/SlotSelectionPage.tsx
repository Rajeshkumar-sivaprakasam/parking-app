import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Check,
  Clock,
  CreditCard,
  X,
  CheckCircle,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  parkingService,
  type ParkingSlot,
} from "../../features/parking/api/parkingService";
import {
  vehicleService,
  type Vehicle,
} from "../../features/vehicles/api/vehicleService";
import { bookingService } from "../../features/bookings/api/bookingService";

export const SlotSelectionPage = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState(2);

  // Initialize with local current time formatted for datetime-local (YYYY-MM-DDTHH:mm)
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    // Offset for local timezone
    const offset = now.getTimezoneOffset() * 60000;
    const localIso = new Date(now.getTime() - offset)
      .toISOString()
      .slice(0, 16);
    return localIso;
  });

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const pricePerHour = 5;
  const totalPrice = duration * pricePerHour;

  // Fetch Vehicles on Mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehiclesData = await vehicleService.getVehicles();
        setVehicles(vehiclesData);
        if (vehiclesData.length > 0) {
          setSelectedVehicle(vehiclesData[0]._id);
        }
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };
    fetchVehicles();
  }, []);

  // Fetch Slots when time or duration changes
  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        // Send as UTC string
        const utcStartTime = new Date(startTime).toISOString();
        const slotsData = await parkingService.getSlots(
          undefined,
          utcStartTime,
          duration
        );
        setSlots(slotsData);
      } catch (error) {
        console.error("Failed to fetch slots:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce slightly to avoid rapid calls
    const timeout = setTimeout(fetchSlots, 300);
    return () => clearTimeout(timeout);
  }, [startTime, duration]);

  const getSlotColor = (slot: ParkingSlot) => {
    if (slot._id === selectedSlot)
      return "bg-brand-primary border-brand-primary text-white";
    if (slot.status === "occupied")
      return "bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 cursor-not-allowed";
    if (slot.status === "reserved")
      return "bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700 text-orange-600 cursor-not-allowed";
    if (slot.type === "ev")
      return "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700 text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30";
    if (slot.type === "disabled")
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30";
    return "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700";
  };

  const handleProceedToPayment = () => {
    if (selectedSlot && selectedVehicle) {
      setShowPaymentModal(true);
    } else if (!selectedVehicle) {
      alert("Please add a vehicle first");
      navigate("/vehicles");
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      await bookingService.createBooking({
        slotId: selectedSlot,
        vehicleId: selectedVehicle,
        startTime: new Date(startTime).toISOString(), // Convert local input to UTC
        duration,
        totalAmount: totalPrice,
      });

      setPaymentSuccess(true);

      // Redirect to bookings after success
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (error: any) {
      console.error("Booking failed:", error);
      const msg =
        error.response?.data?.message || "Booking failed. Please try again.";
      alert(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Select Your Slot
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Suria KLCC - Level B2
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot Grid */}
        <div className="lg:col-span-2">
          {/* Time Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap gap-6 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                <Calendar size={16} />
                Start Time
              </label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-2">
                <Clock size={16} />
                Duration: {duration} hours
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-brand-primary"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1h</span>
                <span>12h</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-100 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Occupied
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  EV Charging
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Disabled
                </span>
              </div>
            </div>

            {/* Slots Grid */}
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-3">
                {slots.map((slot) => (
                  <motion.button
                    key={slot._id}
                    whileHover={
                      slot.status === "available" ? { scale: 1.05 } : {}
                    }
                    whileTap={
                      slot.status === "available" ? { scale: 0.95 } : {}
                    }
                    onClick={() =>
                      slot.status === "available" && setSelectedSlot(slot._id)
                    }
                    disabled={slot.status !== "available"}
                    className={`aspect-square rounded-xl border-2 font-bold text-sm flex items-center justify-center transition-all relative group ${getSlotColor(
                      slot
                    )}`}
                  >
                    {slot.number}
                    {slot._id === selectedSlot && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <Check size={12} className="text-brand-primary" />
                      </div>
                    )}
                    {/* Tooltip for occupied slots showing booking end time */}
                    {slot.status === "occupied" &&
                      slot.currentBookingEndTime && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-gray-300">Available at:</span>
                            <span className="font-semibold">
                              {new Date(
                                slot.currentBookingEndTime
                              ).toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          {/* Tooltip arrow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                        </div>
                      )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Booking Summary */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Booking Summary
            </h3>

            <div className="space-y-4">
              {/* Selected Time */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Time
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(startTime).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Selected Slot */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Selected Slot
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedSlot
                    ? slots.find((s) => s._id === selectedSlot)?.number
                    : "None"}
                </p>
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Vehicle
                </label>
                {vehicles.length > 0 ? (
                  <select
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none"
                  >
                    {vehicles.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.plateNumber} - {v.make} {v.vehicleModel}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-red-500">
                    No vehicles found.{" "}
                    <button
                      onClick={() => navigate("/vehicles")}
                      className="underline"
                    >
                      Add a vehicle
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Rate</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    RM {pricePerHour}/hr
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Duration
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {duration} hours
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="font-bold text-gray-900 dark:text-white">
                    Total
                  </span>
                  <span className="font-bold text-2xl text-brand-primary">
                    RM {totalPrice}
                  </span>
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={!selectedSlot || !selectedVehicle}
                className="w-full bg-brand-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-primary/30 disabled:shadow-none flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-8 relative"
            >
              {!paymentSuccess ? (
                <>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="text-brand-primary" size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Confirm Payment
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Review your booking details
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Location:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Suria KLCC
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Slot:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {slots.find((s) => s._id === selectedSlot)?.number}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Time:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {new Date(startTime).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Vehicle:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {
                            vehicles.find((v) => v._id === selectedVehicle)
                              ?.plateNumber
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          Duration:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {duration} hours
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="font-bold text-gray-900 dark:text-white">
                          Total Amount:
                        </span>
                        <span className="font-bold text-xl text-brand-primary">
                          RM {totalPrice}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <p className="text-sm text-blue-800 dark:text-blue-400">
                        <strong>Payment Method:</strong> Wallet Balance (RM
                        145.00)
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      className="flex-1 px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Confirm Payment"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <CheckCircle className="text-green-600" size={40} />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Your parking slot has been booked
                  </p>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Booking ID
                    </p>
                    <p className="text-lg font-bold text-brand-primary">
                      BK{Date.now().toString().slice(-6)}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Redirecting to My Bookings...
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
