import { NextRequest, NextResponse } from 'next/server'

// Proxy API pour l'autocomplétion d'adresse (contourne CORS)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  
  if (!query || query.length < 3) {
    return NextResponse.json({ features: [] })
  }

  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=6&autocomplete=1`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('Address API error:', response.status)
      return NextResponse.json({ features: [] })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Address proxy error:', error)
    return NextResponse.json({ features: [] })
  }
}
