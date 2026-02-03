import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ============================================
// REKAIRE - API Lead (Capture contacts)
// ============================================

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      firstName,
      lastName,
      phone,
      isCompany,
      companyName,
      source,
      address,
      postalCode,
      city,
    } = body;

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // Upsert: crée ou met à jour le lead
    const { data, error } = await supabase
      .from("leads")
      .upsert(
        {
          email,
          first_name: firstName || null,
          last_name: lastName || null,
          phone: phone || null,
          is_company: isCompany || false,
          company_name: companyName || null,
          source: source || "checkout",
          address: address || null,
          postal_code: postalCode || null,
          city: city || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "email",
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      console.error("[Lead API] Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[Lead API] Lead saved:", email);

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    console.error("[Lead API] Error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
