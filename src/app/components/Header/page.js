'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            NexEra AI Training
          </Link>

          <div className="flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </Link>

            <Link
              href="/prototype-1"
              className={`text-sm font-medium transition-colors ${
                isActive('/prototype-1')
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Prototype 1
            </Link>

            <Link
              href="/prototype-2"
              className={`text-sm font-medium transition-colors ${
                isActive('/prototype-2')
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Prototype 2
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
