import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            Admin
          </Link>
          <UserButton />
        </div>
      </div>
    </header>
  );
}
