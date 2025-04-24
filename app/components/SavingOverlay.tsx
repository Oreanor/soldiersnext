interface SavingOverlayProps {
  onCancel: () => void;
}

export default function SavingOverlay({ onCancel }: SavingOverlayProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white/80 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-lg text-gray-700">Saving data to server...</span>
        </div>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
} 