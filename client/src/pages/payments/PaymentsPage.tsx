import { motion } from "framer-motion";
import { CreditCard, Wallet, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import {
  bookingService,
  type Booking,
} from "../../features/bookings/api/bookingService";

export const PaymentsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchBookings();
  }, []);

  // Calculate stats
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalTransactions = bookings.length;
  const avgCost = totalTransactions > 0 ? totalSpent / totalTransactions : 0;

  // Chart data (monthly)
  const chartData = bookings.reduce((acc, b) => {
    const month = new Date(b.startTime).toLocaleDateString("en-US", {
      month: "short",
    });
    const existing = acc.find((d) => d.month === month);
    if (existing) {
      existing.amount += b.totalAmount || 0;
    } else {
      acc.push({ month, amount: b.totalAmount || 0 });
    }
    return acc;
  }, [] as { month: string; amount: number }[]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        Loading payments...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Payments & History
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your transactions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Spent Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-br from-brand-primary to-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Spent</p>
                <h3 className="text-4xl font-bold">
                  RM {totalSpent.toFixed(2)}
                </h3>
              </div>
              <Wallet size={40} className="text-white/80" />
            </div>
            <div className="flex items-center gap-4">
              <p className="text-blue-100 text-sm">
                Lifetime spending on parking
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Overview
            </h3>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Transactions
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {totalTransactions}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Avg. Cost
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  RM {avgCost.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Spending Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Spending Overview
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={
                chartData.length > 0
                  ? chartData
                  : [{ month: "No Data", amount: 0 }]
              }
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                tickFormatter={(value) => `RM${value}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
                cursor={{ fill: "rgba(0, 102, 204, 0.1)" }}
              />
              <Bar dataKey="amount" fill="#0066CC" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-brand-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {booking.slotId?.number || "Unknown Slot"}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(booking.startTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    - RM {booking.totalAmount}
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
