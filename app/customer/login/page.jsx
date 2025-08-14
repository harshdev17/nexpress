import Link from "next/link";

export const metadata = {
  title: "Login | Nexpress Delivery",
  description: "Login to your Nexpress Delivery account to manage orders and preferences.",
};

export default function LoginPage() {
  return (
    <main className="w-full bg-gray-50 min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#368899] focus:border-transparent transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-[#368899] focus:ring-[#368899]" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link href="/customer/forgot-password" className="text-sm text-[#368899] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#368899] text-white py-3 px-4 rounded-lg hover:bg-[#2d7a8a] focus:ring-2 focus:ring-[#368899] focus:ring-offset-2 transition-colors font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link href="/customer/register" className="text-[#368899] hover:underline font-medium">
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
