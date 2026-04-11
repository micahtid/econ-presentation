"use client";

interface Props {
  message: string;
  subMessage?: string;
}

export default function WaitingScreen({ message, subMessage }: Props) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-6" />
      <h2 className="text-xl font-bold text-gray-900">{message}</h2>
      {subMessage && (
        <p className="mt-2 text-sm text-gray-500">{subMessage}</p>
      )}
    </div>
  );
}
