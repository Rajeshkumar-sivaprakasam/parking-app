import { motion } from 'framer-motion';
import { CreditCard, Wallet, Download, Plus, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const paymentData = [
  { month: 'Jan', amount: 45 },
  { month: 'Feb', amount: 62 },
  { month: 'Mar', amount: 38 },
  { month: 'Apr', amount: 71 },
  { month: 'May', amount: 55 },
  { month: 'Jun', amount: 89 },
];

const transactions = [
  { id: '1', date: '2024-11-23', location: 'Suria KLCC', amount: 12.50, status: 'Completed' },
  { id: '2', date: '2024-11-22', location: 'Pavilion KL', amount: 18.00, status: 'Completed' },
  { id: '3', date: '2024-11-21', location: 'Mid Valley', amount: 9.00, status: 'Completed' },
  { id: '4', date: '2024-11-20', location: 'Sunway Pyramid', amount: 15.50, status: 'Refunded' },
];

export const PaymentsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payments & Wallet</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your transactions and balance</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-brand-primary/30">
          <Plus size={20} />
          Top Up
        </button>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Wallet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-primary to-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-blue-100 text-sm mb-1">Available Balance</p>
                <h3 className="text-4xl font-bold">RM 145.50</h3>
              </div>
              <Wallet size={40} className="text-white/80" />
            </div>
            <div className="flex items-center gap-4">
              <button className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 py-3 rounded-xl font-semibold transition-colors">
                Withdraw
              </button>
              <button className="flex-1 bg-white text-brand-primary hover:bg-blue-50 py-3 rounded-xl font-semibold transition-colors">
                Top Up
              </button>
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">This Month</h3>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">RM 89.00</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transactions</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">24</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Avg. Cost</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">RM 3.71</p>
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
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Spending Overview</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={paymentData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `RM${value}`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                cursor={{ fill: 'rgba(0, 102, 204, 0.1)' }}
              />
              <Bar dataKey="amount" fill="#0066CC" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
          <button className="text-brand-primary text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-brand-primary" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{transaction.location}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-4">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">- RM {transaction.amount.toFixed(2)}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.status === 'Completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Download size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
