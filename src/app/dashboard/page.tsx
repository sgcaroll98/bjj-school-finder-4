'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type SchoolSummary = {
  id: string;
  name: string;
  city: string;
  state: string;
  visits: number;
  saves: number;
};

type Stats = {
  totalSchools: number;
  totalVisits: number;
  totalSaves: number;
};

export default function DashboardHome() {
  const [schools, setSchools] = useState<SchoolSummary[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSchools: 0,
    totalVisits: 0,
    totalSaves: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch schools owned by the user
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('schools')
          .select('id, name, city, state')
          .eq('owner_id', user.id)
          .limit(5);
        
        if (schoolsError) throw schoolsError;
        
        // For demo purposes, generate random stats
        // In a real app, you would have analytics tables to query
        const schoolsWithAnalytics = schoolsData?.map(school => ({
          ...school,
          visits: Math.floor(Math.random() * 100),
          saves: Math.floor(Math.random() * 30)
        })) || [];
        
        setSchools(schoolsWithAnalytics);
        
        // Calculate totals
        setStats({
          totalSchools: schoolsWithAnalytics.length,
          totalVisits: schoolsWithAnalytics.reduce((sum, school) => sum + school.visits, 0),
          totalSaves: schoolsWithAnalytics.reduce((sum, school) => sum + school.saves, 0),
        });
        
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user, supabase]);
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">School Owner Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your schools and track performance
      </p>
      
      {loading ? (
        <div className="mt-8 flex justify-center">
          <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-primary-600 animate-spin"></div>
        </div>
      ) : error ? (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Schools
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.totalSchools}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link href="/dashboard/schools" className="font-medium text-primary-600 hover:text-primary-500">
                    View all schools
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Profile Views
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.totalVisits}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link href="/dashboard/schools" className="font-medium text-primary-600 hover:text-primary-500">
                    View details
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Saved by Users
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stats.totalSaves}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <Link href="/dashboard/schools" className="font-medium text-primary-600 hover:text-primary-500">
                    View details
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Schools List */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Your Schools</h2>
              <Link
                href="/dashboard/schools/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Add New School
              </Link>
            </div>
            
            {schools.length === 0 ? (
              <div className="mt-6 text-center bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add New School
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {schools.map((school) => (
                    <li key={school.id}>
                      <Link
                        href={`/dashboard/schools/${school.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-700 font-medium">
                                  {school.name.charAt(0)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-primary-600 truncate">
                                  {school.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {school.city}, {school.state}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex flex-col items-end text-sm text-gray-500">
                                <div className="flex items-center">
                                  <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  {school.visits} views
                                </div>
                                <div className="flex items-center mt-1">
                                  <svg className="mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                  </svg>
                                  {school.saves} saves
                                </div>
                              </div>
                              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                {stats.totalSchools > 5 && (
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <Link
                      href="/dashboard/schools"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View all schools
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-base font-medium text-gray-900">Update Profile</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-sm text-gray-500">
                    Update your profile information, contact details, and profile picture.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/profile"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-base font-medium text-gray-900">Manage School Details</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-sm text-gray-500">
                    Update your school information, add instructors, or upload new images.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/dashboard/schools"
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200"
                    >
                      Manage Schools
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
