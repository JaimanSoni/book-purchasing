import React from 'react';

export default function PaymentCanceled() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <svg
          className="mx-auto h-16 w-16 text-yellow-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Canceled</h1>
        <p className="text-gray-600 mb-8">
          Your payment has been canceled. No charges were made to your account.
        </p>
        <a
          href="/"
          className="inline-block bg-yellow-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-yellow-600 transition-colors"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}