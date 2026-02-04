'use client';

// ============================================
// REKAIRE - Admin Auth Callback Handler
// Handles Magic Link redirect from Supabase
// ============================================

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    async function handleCallback() {
      try {
        // Supabase gère automatiquement le token dans l'URL
        const { data: { session }, error: authError } = await supabase.auth.getSession();

        if (authError) {
          console.error('Auth callback error:', authError);
          setError(authError.message);
          setStatus('error');
          return;
        }

        if (session) {
          // Vérifier que l'email est dans la whitelist (côté serveur)
          const response = await fetch('/api/admin/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            }
          });

          if (!response.ok) {
            await supabase.auth.signOut();
            setError('Accès non autorisé');
            setStatus('error');
            return;
          }

          setStatus('success');
          
          // Rediriger vers le dashboard admin
          setTimeout(() => {
            router.push('/admin');
          }, 1500);
        } else {
          // Essayer d'échanger le code contre une session
          const params = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = params.get('access_token');
          
          if (accessToken) {
            // Token présent dans l'URL, la session devrait être créée
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: params.get('refresh_token') || ''
            });

            if (setSessionError) {
              setError('Erreur lors de la connexion');
              setStatus('error');
              return;
            }

            setStatus('success');
            setTimeout(() => {
              router.push('/admin');
            }, 1500);
          } else {
            setError('Session non trouvée');
            setStatus('error');
          }
        }
      } catch (err) {
        console.error('Callback error:', err);
        setError('Erreur inattendue');
        setStatus('error');
      }
    }

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md text-center">
        {status === 'verifying' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-900">Vérification en cours...</h1>
            <p className="text-gray-600 mt-2">Veuillez patienter</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Connexion réussie !</h1>
            <p className="text-gray-600 mt-2">Redirection vers le dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Erreur de connexion</h1>
            <p className="text-red-600 mt-2">{error}</p>
            <button
              onClick={() => router.push('/admin')}
              className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Retour à la page de connexion
            </button>
          </>
        )}
      </div>
    </div>
  );
}
