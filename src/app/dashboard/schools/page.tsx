'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type School = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  website: string | null;
  created_at: string;
  updated_at: string;
  has_gi: boolean;
  has_nogi: boolean;
  has_kids_classes: boolean;
};

export default function SchoolsListPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const fetchSchools = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('schools')
          .select('*')
          .eq('owner_id', user.id)
          .order('name');
        
        if (error) throw error;
        
        setSchools(data || []);
      } catch (error: any) {
        console.error('Error fetching schools:', error);
        setError(error.message || 'Failed to load schools');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSchools();
  }, [user, supabase]);
  
  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.state.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteSchool = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this school? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('schools')
          .delete()
          .eq('id', id)
          .eq('owner_id', user?.id); // Ensure only owner can delete
        
        if (error) throw error;
        
        // Update the UI by removing the deleted school
        setSchools(schools.filter(school => school.id !== id));
      } catch (error: any) {
        console.error('Error deleting school:', error);
        alert('Failed to delete school: ' + error.message);
      }
    }
  };
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Schools</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your BJJ schools, update information, and track performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard/schools/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New School
          </Link>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mt-2 flex-1 min-w-0">
            <div className="max-w-lg w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative text-gray-400 focus-within:text-gray-600">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full bg-white py-2 pl-10 pr-3 border border-gray-300 rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search schools by name or location"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Schools list */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-primary-600 animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading schools</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : filteredSchools.length === 0 ? (
          searchQuery ? (
            <div className="text-center py-10 bg-white shadow rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No schools match your search criteria. Try searching for something else.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 bg-white shadow rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No schools</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first BJJ school.
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard/schools/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New School
                </Link>
              </div>
            </div>
          )
        ) : (
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    School
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Programs
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="font-medium text-primary-700">
                            {school.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{school.name}</div>
                          <Link
                            href={`/schools/${school.id}`}
                            className="text-xs text-primary-600 hover:text-primary-900"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View public page
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{school.city}, {school.state}</div>
                      <div className="text-sm text-gray-500">{school.zipcode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{school.phone}</div>
                      {school.website && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900">
                            {school.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center mx-1">
                        {school.has_gi && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Gi
                          </span>
                        )}
                        {school.has_nogi && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            NoGi
                          </span>
                        )}
                        {school.has_kids_classes && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Kids
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <Link
                          href={`/dashboard/schools/${school.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteSchool(school.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
