const Loader = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-orange-200 border-t-orange-500 rounded-full animate-spin`}
      />
    </div>
  );
};

export const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <Loader size="lg" className="mb-4" />
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  </div>
);

export default Loader;
