import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-10 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">BJJ School Finder</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              Find your perfect BJJ academy and start your journey today.
            </p>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-600 hover:text-primary-600">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-600 hover:text-primary-600">
                Contact
              </Link>
              <Link href="/privacy" className="block text-gray-600 hover:text-primary-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-600 hover:text-primary-600">
                Terms of Service
              </Link>
            </div>
          </div>
          
          {/* For School Owners */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">For School Owners</h3>
            <div className="space-y-2">
              <Link href="/claim" className="block text-gray-600 hover:text-primary-600">
                Claim Your School
              </Link>
              <Link href="/advertise" className="block text-gray-600 hover:text-primary-600">
                Advertise With Us
              </Link>
              <Link href="/pricing" className="block text-gray-600 hover:text-primary-600">
                Pricing
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} BJJ School Finder. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
