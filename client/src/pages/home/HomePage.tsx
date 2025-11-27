import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Clock, MapPin, Wallet, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/providers/store";
import { useEffect, useState } from "react";
import {
  bookingService,
  type Booking,
} from "../../features/bookings/api/bookingService";

export const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
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
  const activeBooking = bookings.find((b) => b.status === "active");
  const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalHours = bookings.reduce((sum, b) => {
    const start = new Date(b.startTime).getTime();
    const end = new Date(b.endTime).getTime();
    return sum + (end - start) / (1000 * 60 * 60);
  }, 0);

  // Get favorite spot (most frequent)
  const spotCounts = bookings.reduce((acc, b) => {
    const location = b.slotId?.location || "Unknown"; // Assuming slotId is populated
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const favoriteSpot =
    Object.entries(spotCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  // Chart data (last 7 days)
  const chartData = bookings
    .reduce((acc, b) => {
      const date = new Date(b.startTime).toLocaleDateString("en-US", {
        weekday: "short",
      });
      const existing = acc.find((d) => d.name === date);
      if (existing) {
        existing.spend += b.totalAmount || 0;
      } else {
        acc.push({ name: date, spend: b.totalAmount || 0 });
      }
      return acc;
    }, [] as { name: string; spend: number }[])
    .slice(-7);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-primary to-blue-600 p-8 text-white shadow-2xl"
      >
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">
            {t("dashboard.welcomeUser", { name: user?.name || "User" })}
          </h2>
          <p className="text-blue-100 max-w-xl text-lg">
            {activeBooking
              ? t("dashboard.activeBooking", {
                  location: activeBooking.slotId?.number || "Unknown",
                  time: Math.ceil(
                    (new Date(activeBooking.endTime).getTime() - Date.now()) /
                      (1000 * 60)
                  ),
                })
              : "No active bookings currently."}
          </p>
          <div className="mt-6 flex gap-4">
            {activeBooking ? (
              <Link
                to="/bookings"
                className="px-6 py-3 bg-white text-brand-primary font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                {t("dashboard.extendParking")} <Clock size={18} />
              </Link>
            ) : (
              <Link
                to="/booking/slots"
                className="px-6 py-3 bg-white text-brand-primary font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                Find Parking <MapPin size={18} />
              </Link>
            )}
            <Link
              to="/bookings"
              className="px-6 py-3 bg-blue-700/50 text-white font-semibold rounded-xl hover:bg-blue-700/70 transition-colors backdrop-blur-sm"
            >
              {t("dashboard.viewTicket")}
            </Link>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Total Spent",
            value: `RM ${totalSpent.toFixed(2)}`,
            icon: Wallet,
            color: "bg-emerald-500",
          },
          {
            title: t("dashboard.totalHours"),
            value: `${totalHours.toFixed(1)} hrs`,
            icon: Clock,
            color: "bg-orange-500",
          },
          {
            title: t("dashboard.favoriteSpot"),
            value: favoriteSpot,
            icon: MapPin,
            color: "bg-purple-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </h3>
              </div>
              <div
                className={`p-3 rounded-xl ${stat.color} text-white shadow-lg`}
              >
                <stat.icon size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t("dashboard.spendingActivity")}
          </h3>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={
                chartData.length > 0
                  ? chartData
                  : [{ name: "No Data", spend: 0 }]
              }
            >
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066CC" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0066CC" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                dy={10}
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
                cursor={{
                  stroke: "#0066CC",
                  strokeWidth: 1,
                  strokeDasharray: "5 5",
                }}
              />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="#0066CC"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSpend)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {t("dashboard.recentBookings")}
          </h3>
          <Link
            to="/bookings"
            className="text-brand-primary text-sm font-semibold hover:underline flex items-center gap-1"
          >
            {t("dashboard.viewAll")} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {bookings.slice(0, 3).map((booking) => (
            <div
              key={booking._id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-brand-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    {booking.slotId?.number || "Unknown Slot"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {new Date(booking.startTime).toLocaleDateString()} •{" "}
                    {(
                      (new Date(booking.endTime).getTime() -
                        new Date(booking.startTime).getTime()) /
                      (1000 * 60 * 60)
                    ).toFixed(1)}{" "}
                    {t("dashboard.hours")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">
                  - RM {booking.totalAmount}
                </p>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : booking.status === "active"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
          {bookings.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
