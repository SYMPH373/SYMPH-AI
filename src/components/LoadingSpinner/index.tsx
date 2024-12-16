export const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="w-4 h-4 border-2 border-neon-blue border-t-transparent rounded-full animate-spin" />
    <span className="ml-2 text-[#00ff00]">Processing transaction...</span>
  </div>
); 