import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Clock, MapPin, Calendar, CheckCircle, XCircle } from "lucide-react";
import {
  bookingService,
  type Booking,
} from "../../features/bookings/api/bookingService";
import { CardSkeleton, PageHeaderSkeleton } from "../../shared/ui/Skeleton";
import { Button } from "../../shared/ui/Button";

export const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [extendHours, setExtendHours] = useState(2);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "upcoming":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle size={16} />;
      case "upcoming":
        return <Clock size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking || actionLoading) return;

    setActionLoading(true);
    try {
      await bookingService.cancelBooking(selectedBooking._id);
      alert("Booking cancelled successfully!");
      setShowCancelModal(false);
      setCancelReason("");
      fetchBookings();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  };

  const handleExtendBooking = async () => {
    if (!selectedBooking || actionLoading) return;

    setActionLoading(true);
    try {
      const additionalAmount = extendHours * 5; // Assuming RM 5 per hour
      await bookingService.extendBooking(selectedBooking._id, {
        duration: extendHours,
        additionalAmount,
      });
      alert(`Booking extended by ${extendHours} hours.`);
      setShowExtendModal(false);
      setExtendHours(2);
      fetchBookings();
    } catch (error) {
      console.error("Failed to extend booking:", error);
      alert("Failed to extend booking");
    } finally {
      setActionLoading(false);
    }
  };

  // Skeleton loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeaderSkeleton />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <CardSkeleton />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

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
        {bookings.map((booking, index) => (
          <motion.div
            key={booking._id}
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
                      Suria KLCC
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <MapPin size={14} />
                    {booking.slotId?.location || "Unknown Location"} • Slot{" "}
                    {booking.slotId?.number || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-brand-primary">
                    RM {booking.totalAmount?.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Booking ID: {booking._id.slice(-6).toUpperCase()}
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
                      End Time
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(booking.endTime).toLocaleString("en-MY", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
                {booking.status === "active" && (
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowExtendModal(true);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-brand-primary bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    Extend Parking
                  </button>
                )}
                {(booking.status === "active" ||
                  booking.status === "upcoming") && (
                  <button
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowCancelModal(true);
                    }}
                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
        {bookings.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No bookings found.
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Cancel Booking
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to cancel this booking?
            </p>
            <textarea
              className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-xl mb-4 bg-gray-50 dark:bg-gray-900"
              placeholder="Reason for cancellation (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowCancelModal(false)}
                disabled={actionLoading}
              >
                Keep Booking
              </Button>
              <Button
                variant="danger"
                onClick={handleCancelBooking}
                loading={actionLoading}
                loadingText="Cancelling..."
              >
                Confirm Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Modal */}
      {showExtendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Extend Parking
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              How many hours would you like to extend?
            </p>
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setExtendHours(Math.max(1, extendHours - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl font-bold"
              >
                -
              </button>
              <span className="text-2xl font-bold">{extendHours} h</span>
              <button
                onClick={() => setExtendHours(extendHours + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl font-bold"
              >
                +
              </button>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowExtendModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleExtendBooking}
                loading={actionLoading}
                loadingText="Processing..."
              >
                Pay RM {(extendHours * 5)?.toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
