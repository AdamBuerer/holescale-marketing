export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 animate-pulse">
      {/* Image skeleton */}
      <div className="bg-gray-200 h-32 w-full rounded-lg mb-3" />

      {/* Title skeleton */}
      <div className="bg-gray-200 h-6 w-3/4 rounded mb-2" />

      {/* Description skeleton */}
      <div className="space-y-2 mb-3">
        <div className="bg-gray-200 h-4 w-full rounded" />
        <div className="bg-gray-200 h-4 w-5/6 rounded" />
      </div>

      {/* Supplier skeleton */}
      <div className="bg-gray-200 h-4 w-1/2 rounded mb-3" />

      {/* Price skeleton */}
      <div className="bg-gray-200 h-6 w-1/3 rounded" />
    </div>
  );
}
