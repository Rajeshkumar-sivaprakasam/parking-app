import { motion } from "framer-motion";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

/**
 * Skeleton loading component for content placeholders
 */
export const Skeleton = ({
  className = "",
  variant = "text",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700";

  const variantClasses = {
    text: "rounded h-4",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
    none: "",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

/**
 * Card skeleton for booking/vehicle cards
 */
export const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Skeleton variant="rounded" width={150} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </div>
        <Skeleton variant="text" width="60%" height={16} className="mt-2" />
      </div>
      <Skeleton variant="rounded" width={80} height={32} />
    </div>
    <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="rounded" width={40} height={40} />
          <div className="flex-1">
            <Skeleton variant="text" width="50%" height={12} className="mb-1" />
            <Skeleton variant="text" width="80%" height={16} />
          </div>
        </div>
      ))}
    </div>
    <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
      <Skeleton variant="rounded" width={120} height={36} />
      <Skeleton variant="rounded" width={120} height={36} />
    </div>
  </div>
);

/**
 * Vehicle card skeleton
 */
export const VehicleCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
    <div className="p-6 bg-gray-100 dark:bg-gray-700">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border-4 border-gray-300 dark:border-gray-600">
        <div className="text-center">
          <Skeleton
            variant="text"
            width="40%"
            height={12}
            className="mx-auto mb-2"
          />
          <Skeleton
            variant="text"
            width="70%"
            height={28}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <Skeleton variant="text" width={120} height={20} className="mb-2" />
          <Skeleton variant="text" width={80} height={14} />
        </div>
        <Skeleton variant="circular" width={24} height={24} />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="rounded" width="100%" height={40} />
        <Skeleton variant="rounded" width={48} height={40} />
      </div>
    </div>
  </div>
);

/**
 * Stats card skeleton for dashboard
 */
export const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-start justify-between">
      <div>
        <Skeleton variant="text" width={80} height={14} className="mb-2" />
        <Skeleton variant="text" width={100} height={28} />
      </div>
      <Skeleton variant="rounded" width={44} height={44} />
    </div>
  </div>
);

/**
 * Table row skeleton
 */
export const TableRowSkeleton = ({ columns = 4 }: { columns?: number }) => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-700 animate-pulse">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={`${100 / columns}%`}
        height={16}
      />
    ))}
  </div>
);

/**
 * Page header skeleton
 */
export const PageHeaderSkeleton = () => (
  <div className="mb-6 animate-pulse">
    <Skeleton variant="text" width={200} height={28} className="mb-2" />
    <Skeleton variant="text" width={300} height={16} />
  </div>
);

/**
 * Full page skeleton layout
 */
export const PageSkeleton = ({
  cards = 3,
  cardType = "card",
}: {
  cards?: number;
  cardType?: "card" | "vehicle" | "stat";
}) => (
  <div className="space-y-6">
    <PageHeaderSkeleton />
    <div
      className={`grid grid-cols-1 ${
        cardType === "stat" ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"
      } gap-6`}
    >
      {Array.from({ length: cards }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {cardType === "vehicle" ? (
            <VehicleCardSkeleton />
          ) : cardType === "stat" ? (
            <StatCardSkeleton />
          ) : (
            <CardSkeleton />
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

export default Skeleton;
