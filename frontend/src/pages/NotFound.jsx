import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4 py-12">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <h2 className="mt-2 text-2xl font-semibold text-gray-800">Page not found</h2>
      <p className="mt-4 text-gray-600">Sorry, we couldn't find the page you're looking for.</p>
      <Link
        to="/"
        className="mt-8 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <HomeIcon className="mr-2 h-4 w-4" />
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
