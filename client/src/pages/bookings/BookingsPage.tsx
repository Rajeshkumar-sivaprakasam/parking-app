import { motion } from "framer-motion";
import { useState } from "react";
import {
  Clock,
  MapPin,
  Car,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface Booking {
  id: string;
  parkingLot: string;
  location: string;
  slotNumber: string;
  startTime: string;
  endTime: string;
  duration: number;
  amount: number;
  status: "ACTIVE" | "UPCOMING" | "COMPLETED" | "CANCELLED";
  refundable: boolean;
  vehiclePlate: string;
}

const mockBookings: Booking[] = [
  {
    id: "BK001",
    parkingLot: "Suria KLCC",
    location: "Level B2, Zone A",
    slotNumber: "A-45",
    startTime: "2024-11-24T09:00:00",
    endTime: "2024-11-24T17:00:00",
    duration: 8,
    amount: 40,
    status: "ACTIVE",
    refundable: true,
    vehiclePlate: "WXX 1234",
  },
  {
    id: "BK002",
    parkingLot: "Pavilion KL",
    location: "Level 3, Section B",
    slotNumber: "B-12",
    startTime: "2024-11-26T14:00:00",
    endTime: "2024-11-26T18:00:00",
    duration: 4,
    amount: 16,
    status: "UPCOMING",
    refundable: true,
    vehiclePlate: "ABC 5678",
  },
  {
    id: "BK003",
    parkingLot: "Mid Valley",
    location: "Ground Floor",
    slotNumber: "G-89",
    startTime: "2024-11-20T10:00:00",
    endTime: "2024-11-20T15:00:00",
    duration: 5,
    amount: 15,
    status: "COMPLETED",
    refundable: false,
    vehiclePlate: "WXX 1234",
  },
];

export const BookingsPage = () => {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [extendHours, setExtendHours] = useState(2);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "UPCOMING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle size={16} />;
      case "UPCOMING":
        return <Clock size={16} />;
      case "COMPLETED":
        return <CheckCircle size={16} />;
      case "CANCELLED":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const calculateRefund = (booking: Booking) => {
    if (!booking.refundable)
      return { eligible: false, amount: 0, percentage: 0 };

    const now = new Date();
    const startTime = new Date(booking.startTime);
    const hoursUntilStart =
      (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    let percentage = 0;
    if (hoursUntilStart > 48) percentage = 100;
    else if (hoursUntilStart > 24) percentage = 75;
    else if (hoursUntilStart > 12) percentage = 50;
    else if (hoursUntilStart > 2) percentage = 25;

    return {
      eligible: hoursUntilStart > 2,
      amount: (booking.amount * percentage) / 100,
      percentage,
      hoursUntilStart: Math.floor(hoursUntilStart),
    };
  };

  const handleCancelBooking = () => {
    if (!selectedBooking) return;

    const refund = calculateRefund(selectedBooking);

    if (!refund.eligible) {
      alert(
        "Cancellations are not permitted within 2 hours of booking start time."
      );
      return;
    }

    // Simulate API call
    console.log(
      "Cancelling booking:",
      selectedBooking.id,
      "Reason:",
      cancelReason
    );
    alert(
      `Booking cancelled successfully! Refund: RM ${refund.amount.toFixed(
        2
      )} (${refund.percentage}%)`
    );
    setShowCancelModal(false);
    setCancelReason("");
  };

  const handleExtendBooking = () => {
    if (!selectedBooking) return;

    const additionalCost = extendHours * 5; // RM 5 per hour
    console.log(
      "Extending booking:",
      selectedBooking.id,
      "Hours:",
      extendHours
    );
    alert(
      `Booking extended by ${extendHours} hours. Additional cost: RM ${additionalCost}`
    );
    setShowExtendModal(false);
    setExtendHours(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Bookings
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View and manage your parking reservations
        </p>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {mockBookings.map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {booking.parkingLot}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin size={14} />
                    {booking.location} • Slot {booking.slotNumber}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-primary">
                    RM {booking.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Booking ID: {booking.id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="text-brand-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Start Time
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(booking.startTime).toLocaleString("en-MY", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Clock className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Duration
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {booking.duration} hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Car className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Vehicle
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white font-mono">
                      {booking.vehiclePlate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {booking.status === "ACTIVE" && (
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowExtendModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
                  >
                    <RefreshCw size={18} />
                    Extend Parking
                  </button>
                )}

                {(booking.status === "ACTIVE" ||
                  booking.status === "UPCOMING") && (
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowCancelModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <XCircle size={18} />
                    Cancel Booking
                  </button>
                )}

                <button className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  View Details
                </button>
              </div>

              {!booking.refundable && (
                <div className="mt-4 flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <AlertCircle
                    className="text-orange-600 flex-shrink-0 mt-0.5"
                    size={16}
                  />
                  <p className="text-xs text-orange-800 dark:text-orange-400">
                    <strong>Non-refundable:</strong> This booking cannot be
                    refunded if cancelled.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Cancel Booking
            </h3>

            {(() => {
              const refund = calculateRefund(selectedBooking);
              return (
                <>
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Booking: {selectedBooking.parkingLot}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Slot: {selectedBooking.slotNumber}
                    </p>

                    {refund.eligible ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Original Amount:
                          </span>
                          <span className="font-semibold">
                            RM {selectedBooking.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Refund Percentage:
                          </span>
                          <span className="font-semibold text-green-600">
                            {refund.percentage}%
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                          <span className="font-semibold">Refund Amount:</span>
                          <span className="font-bold text-lg text-green-600">
                            RM {refund.amount.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Refund will be processed in 5-7 business days
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-400">
                          <strong>Warning:</strong> This booking is
                          non-refundable or within the cancellation window.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Reason for Cancellation (Optional)
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Please let us know why you're cancelling..."
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowCancelModal(false);
                        setCancelReason("");
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Keep Booking
                    </button>
                    <button
                      onClick={handleCancelBooking}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                    >
                      Confirm Cancel
                    </button>
                  </div>
                </>
              );
            })()}
          </motion.div>
        </div>
      )}

      {/* Extend Modal */}
      {showExtendModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full p-6"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Extend Parking
            </h3>

            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Current End Time:
              </p>
              <p className="font-semibold text-gray-900 dark:text-white mb-4">
                {new Date(selectedBooking.endTime).toLocaleString("en-MY")}
              </p>

              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Extend by (hours):
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={extendHours}
                onChange={(e) => setExtendHours(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>1h</span>
                <span className="font-bold text-brand-primary">
                  {extendHours}h
                </span>
                <span>12h</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Rate:
                  </span>
                  <span className="font-semibold">RM 5/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Additional Cost:</span>
                  <span className="font-bold text-lg text-brand-primary">
                    RM {(extendHours * 5).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowExtendModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExtendBooking}
                className="flex-1 px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
              >
                Confirm Extension
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
