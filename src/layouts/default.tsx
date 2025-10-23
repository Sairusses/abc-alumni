import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="container mx-auto max-w-9xl px-6 flex-grow pt-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-100 dark:bg-[#1A1A1A] border-t border-gray-200 dark:border-[#2d2d2d] mt-8 py-4" />
    </div>
  );
}
