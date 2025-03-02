import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import UserMenuDropdown from '@/components/auth/UserMenuDropdown';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-primary-600">
            BJJ School Finder
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link href="/schools" className="text-gray-700 hover:text-primary-600">
              Schools
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600">
              Contact
            </Link>
          </nav>
          
          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button href="/claim" variant="outline" size="sm" className="hidden md:inline-flex">
              Claim Your School
            </Button>
            <UserMenuDropdown />
            
            {/* Mobile menu button */}
            <button className="md:hidden text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
