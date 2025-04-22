interface SpinnerProps {
  fullScreen?: boolean;
}

export default function Spinner({ fullScreen = false }: SpinnerProps) {
  return (
    <div className={`flex justify-center items-center ${fullScreen ? 'h-screen' : 'h-full'}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
} 