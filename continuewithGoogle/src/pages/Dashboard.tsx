// src/pages/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchAuthSession } from 'aws-amplify/auth';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [tokens, setTokens] = useState<{
    accessToken: string;
    idToken: string;
  } | null>(null);

  useEffect(() => {
    // Fetch tokens for display (optional - for debugging)
    const getTokens = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.tokens) {
          setTokens({
            accessToken: session.tokens.accessToken.toString(),
            idToken: session.tokens.idToken?.toString() || '',
          });
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    getTokens();
  }, []);

  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, {user?.username}! 👋
          </h2>
          <p className="text-gray-600 mb-4">
            You have successfully signed in with Google.
          </p>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">User Information</h3>
          <div className="space-y-3">
            <div className="flex border-b pb-2">
              <span className="font-semibold text-gray-700 w-40">User ID:</span>
              <span className="text-gray-600">{user?.userId}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="font-semibold text-gray-700 w-40">Username:</span>
              <span className="text-gray-600">{user?.username}</span>
            </div>
            <div className="flex border-b pb-2">
              <span className="font-semibold text-gray-700 w-40">Email:</span>
              <span className="text-gray-600">{user?.email || 'N/A'}</span>
            </div>
            <div className="flex pb-2">
              <span className="font-semibold text-gray-700 w-40">Email Verified:</span>
              <span
                className={`font-medium ${
                  user?.emailVerified ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {user?.emailVerified ? '✓ Yes' : '✗ No'}
              </span>
            </div>
          </div>
        </div>

        {/* Tokens Card (Optional - for debugging) */}
        {tokens && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Authentication Tokens
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              These tokens are used to authenticate API requests
            </p>

            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-700 mb-2">Access Token:</p>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto">
                  <code className="text-xs text-gray-600 break-all">
                    {tokens.accessToken.substring(0, 150)}...
                  </code>
                </div>
              </div>

              <div>
                <p className="font-semibold text-gray-700 mb-2">ID Token:</p>
                <div className="bg-gray-50 p-3 rounded border border-gray-200 overflow-x-auto">
                  <code className="text-xs text-gray-600 break-all">
                    {tokens.idToken.substring(0, 150)}...
                  </code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;