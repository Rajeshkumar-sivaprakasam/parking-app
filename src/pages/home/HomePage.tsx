import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, MapPin, Wallet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const data = [
  { name: 'Mon', spend: 12 },
  { name: 'Tue', spend: 18 },
  { name: 'Wed', spend: 5 },
  { name: 'Thu', spend: 25 },
  { name: 'Fri', spend: 15 },
  { name: 'Sat', spend: 30 },
  { name: 'Sun', spend: 20 },
];

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-r from-brand-primary to-blue-600 p-8 text-white shadow-2xl"
      >
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">{t('dashboard.welcomeUser', { name: 'Demo User' })}</h2>
          <p className="text-blue-100 max-w-xl text-lg">
            {t('dashboard.activeBooking', { location: 'Suria KLCC, Zone B', time: 45 })}
          </p>
          <div className="mt-6 flex gap-4">
            <Link to="/booking" className="px-6 py-3 bg-white text-brand-primary font-bold rounded-xl shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-2">
              {t('dashboard.extendParking')} <Clock size={18} />
            </Link>
            <button className="px-6 py-3 bg-blue-700/50 text-white font-semibold rounded-xl hover:bg-blue-700/70 transition-colors backdrop-blur-sm">
              {t('dashboard.viewTicket')}
            </button>
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: t('dashboard.walletBalance'), value: 'RM 145.00', icon: Wallet, color: 'bg-emerald-500' },
          { title: t('dashboard.totalHours'), value: '34.5 hrs', icon: Clock, color: 'bg-orange-500' },
          { title: t('dashboard.favoriteSpot'), value: 'Pavilion KL', icon: MapPin, color: 'bg-purple-500' },
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg`}>
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
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('dashboard.spendingActivity')}</h3>
          <select className="bg-gray-50 dark:bg-gray-700 border-none rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 focus:ring-2 focus:ring-brand-primary">
            <option>{t('dashboard.thisWeek')}</option>
            <option>{t('dashboard.lastWeek')}</option>
          </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066CC" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0066CC" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `RM${value}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                cursor={{ stroke: '#0066CC', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area type="monotone" dataKey="spend" stroke="#0066CC" strokeWidth={3} fillOpacity={1} fill="url(#colorSpend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('dashboard.recentBookings')}</h3>
          <Link to="/history" className="text-brand-primary text-sm font-semibold hover:underline flex items-center gap-1">
            {t('dashboard.viewAll')} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-brand-primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Mid Valley Megamall</h4>
                  <p className="text-sm text-gray-500">{t('dashboard.today')}, 2:30 PM • 3 {t('dashboard.hours')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900 dark:text-white">- RM 12.00</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  {t('dashboard.completed')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
