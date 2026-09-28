const EmptyState = ({
  icon,
  title = 'Nothing here yet',
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      {icon && (
        <div className="text-5xl mb-4 opacity-50">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      )}
      {action && action}
    </div>
  );
};

export default EmptyState;
