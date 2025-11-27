import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Save, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const EditProfilePage = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Demo User',
    email: 'demo@parkmy.com',
    phone: '+60123456789',
    address: 'Kuala Lumpur, Malaysia',
    dateOfBirth: '1990-01-01',
    gender: 'male'
  });

  const [editData, setEditData] = useState(profileData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProfileData(editData);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Update your personal information</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-brand-primary/30"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
          >
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-linear-to-tr from-brand-primary to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                  {profileData.name.charAt(0)}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
                    <Camera size={18} />
                  </button>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-4">{profileData.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('profile.premiumMember')}</p>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="text-gray-400" size={16} />
                    <span className="text-gray-600 dark:text-gray-400">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="text-gray-400" size={16} />
                    <span className="text-gray-600 dark:text-gray-400">{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="text-gray-400" size={16} />
                    <span className="text-gray-600 dark:text-gray-400">{profileData.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Profile Form Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 p-8"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
            
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="name"
                    value={isEditing ? editData.name : profileData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    name="email"
                    value={isEditing ? editData.email : profileData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="tel"
                    name="phone"
                    value={isEditing ? editData.phone : profileData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    name="address"
                    value={isEditing ? editData.address : profileData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={isEditing ? editData.dateOfBirth : profileData.dateOfBirth}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={isEditing ? editData.gender : profileData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <X size={20} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-brand-primary/30"
                  >
                    {isSaving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={20} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
