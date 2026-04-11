import { Suspense } from "react";
import JoinView from "./JoinView";

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </main>
      }
    >
      <JoinView />
    </Suspense>
  );
}
