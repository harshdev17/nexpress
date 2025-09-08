"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company: "",
    firstName: "",
    lastName: "",
    telephone: "",
    mobile: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    state: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) {
      setIsCheckingSession(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/auth/validate-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionToken: token })
        });
        const data = await res.json();
        if (data?.success) {
          router.replace('/customer/account');
        } else {
          setIsCheckingSession(false);
        }
      } catch (_) {
        setIsCheckingSession(false);
      }
    })();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.telephone.trim()) newErrors.telephone = "Telephone is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.address1.trim()) newErrors.address1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postcode.trim()) newErrors.postcode = "Postcode is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Registration successful - show proper success message
        const successMessage = `🎉 Registration successful! 
        
Your account has been created successfully.
Username: ${data.username}
User ID: ${data.userId}

You will be redirected to the login page in 3 seconds...`;
        
        alert(successMessage);
        
        // Clear form data
        setFormData({
          company: "",
          firstName: "",
          lastName: "",
          telephone: "",
          mobile: "",
          email: "",
          address1: "",
          address2: "",
          city: "",
          postcode: "",
          country: "United Kingdom",
          state: "",
          password: "",
          confirmPassword: ""
        });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push('/customer/login');
        }, 3000);
      } else {
        setSubmitError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loader while checking session
  if (isCheckingSession) {
    return (
      <main className="w-full bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#368899]"></div>
              <p className="mt-4 text-gray-600">Checking session...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join Nexpress Delivery to start ordering</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/customer/login" className="text-[#368899] hover:underline font-medium">
                Please click here to login
              </Link>
            </p>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-center">{submitError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter first name"
                />
                {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter last name"
                />
                {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
              </div>

              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telephone *
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors ${
                    errors.telephone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter telephone number"
                />
                {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
              </div>
            </div>

            {/* Address Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-2">
                  Address Field 1 *
                </label>
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  value={formData.address1}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors ${
                    errors.address1 ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter address line 1"
                />
                {errors.address1 && <p className="mt-1 text-sm text-red-600">{errors.address1}</p>}
              </div>

              <div>
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-2">
                  Address Field 2
                </label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                  placeholder="Enter address line 2 (optional)"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter city"
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formData.postcode}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors ${
                    errors.postcode ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter postcode"
                />
                {errors.postcode && <p className="mt-1 text-sm text-red-600">{errors.postcode}</p>}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                >
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="England">England</option>
                  <option value="Scotland">Scotland</option>
                  <option value="Wales">Wales</option>
                  <option value="Northern Ireland">Northern Ireland</option>
                </select>
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State/Province/County
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                  placeholder="Enter state/province/county"
                />
              </div>
            </div>

            {/* Contact & Password */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                  placeholder="Enter mobile number (optional)"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="rounded border-gray-300 text-[#368899] focus:ring-[#368899]"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-[#368899] hover:underline">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#368899] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-lg focus:ring-2 focus:ring-[#368899] focus:ring-offset-2 transition-colors font-medium text-lg ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#368899] hover:bg-[#2d7a8a] text-white'
              }`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
