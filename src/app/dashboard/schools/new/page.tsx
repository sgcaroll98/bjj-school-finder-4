'use client';

import SchoolForm from '@/components/forms/SchoolForm';

export default function NewSchoolPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Add New School</h1>
      <p className="mt-1 text-sm text-gray-500">
        Create a new BJJ school listing
      </p>
      
      <div className="mt-6">
        <SchoolForm />
      </div>
    </div>
  );
}
