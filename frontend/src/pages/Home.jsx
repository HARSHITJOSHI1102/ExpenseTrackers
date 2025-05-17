import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans text-gray-800">
      {/* Hero Section */}
      <div className="text-center px-4 py-24 md:py-32">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Track Your Expenses, Master Your Budget
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Take control of your finances with our easy-to-use expense tracker.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition duration-300 shadow-md hover:shadow-lg"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition duration-300 shadow-md hover:shadow-lg"
          >
            Register
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white px-6 py-16 mx-4 md:mx-auto my-12 rounded-xl shadow-lg max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-xl transition duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Visual Analytics</h3>
            <p className="text-gray-600">Beautiful charts to understand your spending patterns.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-xl transition duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Secure</h3>
            <p className="text-gray-600">Your data is encrypted and always protected.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-xl transition duration-300 hover:-translate-y-2">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Cross-Platform</h3>
            <p className="text-gray-600">Access your expenses from anywhere, anytime.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} ExpenseTrack. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
