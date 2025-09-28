"use client";

import Link from "next/link";
import AccountTabs from "@/components/common/AccountTabs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditAccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/customer/login');
        return;
      }

      const response = await fetch('/api/protected/profile', {
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        router.push('/customer/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.profile);
      } else {
        setError(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/customer/login');
        return;
      }

      const formData = new FormData(e.target);
      const updateData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        company: formData.get('company'),
        telephone: formData.get('telephone'),
        mobile: formData.get('mobile'),
        fax: formData.get('fax'),
        customerReference: formData.get('customerReference'),
        fileAsName: formData.get('fileAsName'),
        taxReference: formData.get('taxReference'),
        taxStatus: formData.get('taxStatus'),
        notes: formData.get('notes')
      };

      const response = await fetch('/api/protected/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      if (data.success) {
        alert('Profile updated successfully!');
        fetchProfile(); // Refresh the profile data
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <p className="text-gray-500">Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Error Loading Profile</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchProfile}
              className="px-6 py-3 bg-[#368899] text-white rounded-xl hover:bg-[#2d7a8a] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="w-full bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Edit Account
                </h1>
                <p className="text-lg text-gray-600 mt-1">Update your personal information and preferences</p>
              </div>
            </div>
            <Link
              href="/customer/account"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-[#368899] bg-white border-2 border-[#368899] rounded-xl hover:bg-[#368899] hover:text-white transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Account Tabs */}
        <div className="mb-8">
          <AccountTabs />
        </div>

        {/* Edit Account Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Address Management Notice */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Address Management</h3>
                <p className="text-sm text-blue-700 mt-1">
                  To manage your delivery and billing addresses, please visit the 
                  <Link href="/customer/account/addresses" className="underline hover:text-blue-800">
                    Address Book
                  </Link> section.
                </p>
              </div>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Personal Details Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    defaultValue={profile?.firstName || ""}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    defaultValue={profile?.lastName || ""}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    defaultValue={profile?.email || ""}
                    required
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    defaultValue={profile?.username || ""}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Business Information Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    defaultValue={profile?.company || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="customerReference" className="block text-sm font-medium text-gray-700 mb-2">
                    Ref/Acct No
                  </label>
                  <input
                    type="text"
                    id="customerReference"
                    name="customerReference"
                    defaultValue={profile?.customerReference || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="fileAsName" className="block text-sm font-medium text-gray-700 mb-2">
                    Display / File name
                  </label>
                  <input
                    type="text"
                    id="fileAsName"
                    name="fileAsName"
                    defaultValue={profile?.fileAsName || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="taxReference" className="block text-sm font-medium text-gray-700 mb-2">
                    VAT No
                  </label>
                  <input
                    type="text"
                    id="taxReference"
                    name="taxReference"
                    defaultValue={profile?.taxReference || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="taxStatus" className="block text-sm font-medium text-gray-700 mb-2">
                    VAT
                  </label>
                  <select
                    id="taxStatus"
                    name="taxStatus"
                    defaultValue={profile?.taxStatus || "Taxable"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                  >
                    <option value="Taxable">Taxable</option>
                    <option value="Exempt">Exempt</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                    User Type
                  </label>
                  <select
                    id="userType"
                    name="userType"
                    defaultValue={profile?.type || "Wholesaler"}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  >
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Standard">Standard</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">User type cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Customer Group</label>
                  <input
                    type="text"
                    value={String(profile?.customerGroup ?? '')}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    defaultValue={profile?.mobile || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telephone
                  </label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    defaultValue={profile?.telephone || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="fax" className="block text-sm font-medium text-gray-700 mb-2">
                    Fax
                  </label>
                  <input
                    type="tel"
                    id="fax"
                    name="fax"
                    defaultValue={profile?.fax || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Joined</label>
                    <input
                      type="text"
                      value={profile?.joiningDate ? new Date(profile.joiningDate).toLocaleString() : ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Special Customer</label>
                    <input
                      type="text"
                      value={profile?.isSpecialCustomer ? 'Yes' : 'No'}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Delivery Address ID</label>
                    <input
                      type="text"
                      value={profile?.defaultDeliveryAddressID ?? ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Default Billing Address ID</label>
                    <input
                      type="text"
                      value={profile?.defaultBillingAddressID ?? ''}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    defaultValue={profile?.notes || ""}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-[#368899] transition-colors resize-none"
                    placeholder="Any additional notes or comments..."
                  />
                </div>
              </div>
            </div>


            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/customer/account"
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 text-sm font-medium text-white bg-[#368899] rounded-lg hover:bg-[#2d7a8a] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
