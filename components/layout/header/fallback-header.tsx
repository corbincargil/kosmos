import { cn } from "@/lib/utils";

export default function FallbackHeader() {
  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="bg-white shadow-md shadow-[color:var(--accent-lighter)]">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="animate-pulse w-[180px] h-9 bg-gray-300 rounded"></div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link) => (
              <div
                key={link.href}
                className={cn(
                  "text-[color:var(--accent-color)] hover:text-[color:var(--accent-darker)]",
                  "animate-pulse w-20 h-6 bg-gray-300 rounded"
                )}
              ></div>
            ))}
          </div>
          <div className="animate-pulse w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </header>
  );
}
