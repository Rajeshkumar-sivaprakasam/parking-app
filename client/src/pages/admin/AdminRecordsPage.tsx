import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Car, CheckCircle, Calendar, LayoutGrid } from "lucide-react";
import { bookingService } from "../../features/bookings/api/bookingService";
import { vehicleService } from "../../features/vehicles/api/vehicleService";
import { parkingService } from "../../features/parking/api/parkingService";
import { userService } from "../../features/auth/api/userService";

type Tab = "bookings" | "slots" | "vehicles" | "users";

interface Item {
  _id: string;
  [key: string]: any;
}

export const AdminRecordsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let result;
      switch (activeTab) {
        case "bookings":
          result = await bookingService.getAllBookings(); // Using the new admin endpoint
          break;
        case "vehicles":
          result = await vehicleService.getAllVehicles();
          break;
        case "slots":
          result = await parkingService.getSlots();
          break;
        case "users":
          result = await userService.getAllUsers();
          break;
      }
      setData(result || []);
    } catch (error) {
      console.error(`Failed to fetch ${activeTab}:`, error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl animate-pulse">
          Loading records...
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="p-12 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500">No records found for {activeTab}</p>
        </div>
      );
    }

    const TableHeader = ({ children }: { children: React.ReactNode }) => (
      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {children}
      </th>
    );

    const TableRow = ({ children }: { children: React.ReactNode }) => (
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
        {children}
      </tr>
    );

    const TableCell = ({
      children,
      className = "",
    }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <td
        className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 ${className}`}
      >
        {children}
      </td>
    );

    const renderContent = () => {
      switch (activeTab) {
        case "bookings":
          return (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <TableHeader>ID</TableHeader>
                    <TableHeader>User</TableHeader>
                    <TableHeader>Vehicle</TableHeader>
                    <TableHeader>Slot</TableHeader>
                    <TableHeader>Time Range</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Amount</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: Item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <span className="font-mono text-xs">
                          {item._id.slice(-6)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {item.userId?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.userId?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.vehicleId?.plateNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        {item.slotId ? (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-medium">
                            {item.slotId.number}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs">
                          <span>
                            {new Date(item.startTime).toLocaleString()}
                          </span>
                          <span className="text-gray-500">to</span>
                          <span>{new Date(item.endTime).toLocaleString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "active"
                              ? "bg-green-100 text-green-700"
                              : item.status === "upcoming"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "completed"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>RM {item.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case "vehicles":
          return (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <TableHeader>Plate Number</TableHeader>
                    <TableHeader>Details</TableHeader>
                    <TableHeader>Owner</TableHeader>
                    <TableHeader>Color</TableHeader>
                    <TableHeader>Default</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: Item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <span className="font-bold">{item.plateNumber}</span>
                      </TableCell>
                      <TableCell>
                        {item.make} {item.vehicleModel}
                      </TableCell>
                      <TableCell>
                        <div>{item.userId?.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.userId?.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          {item.color}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.isDefault ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case "slots":
          return (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <TableHeader>Number</TableHeader>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Price/Hr</TableHeader>
                    <TableHeader>Location</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: Item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <span className="font-bold text-lg">{item.number}</span>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{item.type}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "available"
                              ? "bg-green-100 text-green-700"
                              : item.status === "occupied"
                              ? "bg-red-100 text-red-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>RM {item.pricePerHour}</TableCell>
                      <TableCell>{item.location}</TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case "users":
          return (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Phone</TableHeader>
                    <TableHeader>Role</TableHeader>
                    <TableHeader>Joined</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item: Item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <span className="font-medium">{item.name}</span>
                      </TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>{item.phoneNumber}</TableCell>
                      <TableCell>
                        <span className="capitalize badge bg-gray-100 px-2 py-1 rounded text-xs">
                          {item.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </table>
            </div>
          );
      }
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        {renderContent()}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sample Records Browser
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            View database records for debugging
          </p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl w-fit">
        {[
          { id: "bookings", label: "Bookings", icon: Calendar },
          { id: "slots", label: "Slots", icon: LayoutGrid },
          { id: "vehicles", label: "Vehicles", icon: Car },
          { id: "users", label: "Users", icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-700 text-brand-primary shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderTable()}
      </motion.div>
    </div>
  );
};
