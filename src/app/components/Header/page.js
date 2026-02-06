'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className="bg-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-black rounded-lg group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-black">NexEra AI Training</span>
          </Link>

          <div className="flex gap-2">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/')
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              Home
            </Link>

            <Link
              href="/prototype-1"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/prototype-1')
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              3D Learning
            </Link>

            <Link
              href="/prototype-2"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/prototype-2')
                  ? 'bg-black text-white'
                  : 'text-black/60 hover:text-black hover:bg-black/5'
              }`}
            >
              AI Avatar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
