'use client';

import { useEffect } from 'react';

export default function SentryTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔍 Sentry Test
          </h1>
          <p className="text-gray-600 mb-8">
            Cliquez sur le bouton pour envoyer une erreur test à Sentry
          </p>
          
          <button
            onClick={() => {
              // Déclencher une erreur volontaire
              throw new Error('🎯 Test Sentry - Everything is working!');
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Déclencher erreur test
          </button>
          
          <p className="mt-4 text-sm text-gray-500">
            Cette erreur sera visible dans votre dashboard Sentry
          </p>
        </div>
      </div>
    </div>
  );
}
