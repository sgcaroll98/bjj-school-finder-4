'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { School } from '@/types/school';
import { useAuth } from '@/contexts/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type SchoolFormProps = {
  schoolId?: string;
  initialData?: Partial<School>;
};

export default function SchoolForm({ schoolId, initialData }: SchoolFormProps) {
  const isEditing = !!schoolId;
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  
  const [formData, setFormData] = useState<Partial<School>>({
    name: '',
    description: '',
    website: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    has_gi: false,
    has_nogi: false,
    has_kids_classes: false,
    has_showers: false,
    has_open_mat: false,
    ...initialData,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // If editing, fetch the school data if not provided
  useEffect(() => {
    const fetchSchoolData = async () => {
      if (isEditing && !initialData && schoolId) {
        try {
          setLoading(true);
          const { data, error } = await supabase
            .from('schools')
            .select('*')
            .eq('id', schoolId)
            .eq('owner_id', user?.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setFormData(data);
          }
        } catch (error: any) {
          console.error('Error fetching school:', error);
          setError('Failed to load school data');
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchSchoolData();
  }, [isEditing, initialData, schoolId, user, supabase]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to perform this action');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const schoolData = {
        ...formData,
        owner_id: user.id,
        updated_at: new Date().toISOString(),
      };
      
      if (isEditing) {
        // Update existing school
        const { error } = await supabase
          .from('schools')
          .update(schoolData)
          .eq('id', schoolId)
          .eq('owner_id', user.id);
        
        if (error) throw error;
      } else {
        // Create new school
        const { error } = await supabase
          .from('schools')
          .insert({
            ...schoolData,
            created_at: new Date().toISOString(),
          });
        
        if (error) throw error;
      }
      
      setSuccess(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        router.push('/dashboard/schools');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error saving school:', error);
      setError(error.message || 'Failed to save school');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isEditing ? 'Edit School' : 'Add New School'}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {isEditing 
            ? 'Update your school information' 
            : 'Fill out the form below to add a new BJJ school'}
        </p>
      </div>
      
      {error && (
        <div className="mx-4 my-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mx-4 my-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>{isEditing ? 'School updated successfully!' : 'School added successfully!'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <form onSubmit={handleSubmit}>
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">School Name*</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="max-w-lg shadow-sm block w-full focus:ring-primary-500 focus:border-primary-500 sm:text-sm border border-gray-300 rounded-md"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Brief description of your school, training philosophy, etc.
                </p>
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Website</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="url"
                  name="website"
                  id="website"
                  value={formData.website || ''}
                  onChange={handleChange}
                  placeholder="https://www.example.com"
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                />
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">State</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="state"
                  id="state"
                  value={formData.state || ''}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">ZIP Code</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <input
                  type="text"
                  name="zipcode"
                  id="zipcode"
                  value={formData.zipcode || ''}
                  onChange={handleChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                />
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:px-6">
              <div className="text-sm font-medium text-gray-500 mb-4">Training Options</div>
              <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6">
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="has_gi"
                      name="has_gi"
                      type="checkbox"
                      checked={formData.has_gi || false}
                      onChange={handleChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="has_gi" className="font-medium text-gray-700">Gi Classes</label>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="has_nogi"
                      name="has_nogi"
                      type="checkbox"
                      checked={formData.has_nogi || false}
                      onChange={handleChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="has_nogi" className="font-medium text-gray-700">No-Gi Classes</label>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="has_kids_classes"
                      name="has_kids_classes"
                      type="checkbox"
                      checked={formData.has_kids_classes || false}
                      onChange={handleChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="has_kids_classes" className="font-medium text-gray-700">Kids Classes</label>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="has_open_mat"
                      name="has_open_mat"
                      type="checkbox"
                      checked={formData.has_open_mat || false}
                      onChange={handleChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="has_open_mat" className="font-medium text-gray-700">Open Mat</label>
                  </div>
                </div>
                
                <div className="relative flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="has_showers"
                      name="has_showers"
                      type="checkbox"
                      checked={formData.has_showers || false}
                      onChange={handleChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="has_showers" className="font-medium text-gray-700">Showers Available</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="py-4 sm:py-5 sm:px-6">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/schools')}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : isEditing ? 'Update School' : 'Create School'}
                </button>
              </div>
            </div>
          </dl>
        </form>
      </div>
    </div>
  );
}
