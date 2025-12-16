import { motion } from "framer-motion";

export const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <motion.div
        className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-gray-500 dark:text-gray-400 text-sm"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingFallback;
