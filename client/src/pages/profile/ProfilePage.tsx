import { motion } from "framer-motion";
import {
  User,
  ChevronRight,
  Edit,
  Bell,
  Shield,
  Moon,
  Globe,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../../app/providers/store";
import { logout } from "../../features/auth/model/authSlice";

export const ProfilePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    if (
      window.confirm(
        t("common.logoutConfirm", "Are you sure you want to logout?")
      )
    ) {
      dispatch(logout());
      navigate("/login");
    }
  };

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Personal Information",
          value: "Update your details",
        },
        { icon: Shield, label: "Security", value: "Password & 2FA" },
        {
          icon: Bell,
          label: "Notifications",
          value: notifications ? "Enabled" : "Disabled",
          toggle: true,
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Moon,
          label: "Dark Mode",
          value: darkMode ? "On" : "Off",
          toggle: true,
        },
        { icon: Globe, label: "Language", value: "English" },
      ],
    },
  ];

  if (!user) {
    return <div className="text-center py-10">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("profile.title")}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t("profile.subtitle")}
          </p>
        </div>
        <button
          onClick={() => navigate("/profile/edit")}
          className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-brand-primary/30"
        >
          <Edit size={20} />
          Edit Profile
        </button>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-br from-brand-primary to-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
              <User size={40} />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-brand-primary rounded-full flex items-center justify-center shadow-lg hover:bg-blue-50 transition-colors">
              <Edit size={14} />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1">{user.name || "User"}</h3>
            <p className="text-blue-100 mb-3 capitalize">
              {user.role || "Member"}
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                {user.email}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                {user.phoneNumber || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: t("profile.totalBookings"),
            value: "0",
            color: "bg-blue-500",
          },
          { label: "Total Spent", value: "RM 0.00", color: "bg-purple-500" },
          {
            label: t("profile.memberSince"),
            value: "Nov 2024",
            color: "bg-green-500",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div
              className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-4`}
            >
              <MapPin size={24} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + sectionIndex * 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {section.title}
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {section.items.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.label === "Notifications")
                    setNotifications(!notifications);
                  if (item.label === "Dark Mode") setDarkMode(!darkMode);
                }}
                className="w-full p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                    <item.icon size={20} />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {item.label}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.value}
                    </p>
                  </div>
                </div>
                {item.toggle ? (
                  <div
                    className={`w-12 h-6 rounded-full transition-colors ${
                      (item.label === "Notifications" && notifications) ||
                      (item.label === "Dark Mode" && darkMode)
                        ? "bg-brand-primary"
                        : "bg-gray-300 dark:bg-gray-600"
                    } relative`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        (item.label === "Notifications" && notifications) ||
                        (item.label === "Dark Mode" && darkMode)
                          ? "translate-x-6"
                          : "translate-x-0.5"
                      }`}
                    />
                  </div>
                ) : (
                  <ChevronRight className="text-gray-400" size={20} />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-4 rounded-2xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
      >
        {t("common.logout")}
      </button>
    </div>
  );
};
