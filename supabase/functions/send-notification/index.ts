import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// More restrictive CORS - only allow same-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schemas
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxLengths = {
  name: 100,
  email: 255,
  company: 100,
  phone: 50,
  message: 5000,
  notes: 2000,
  business_type: 50,
  additionalNotes: 2000,
  productName: 200,
  quantityNow: 50,
  quantityUnit: 50,
};

// Allowed notification types
const allowedTypes = ["contact", "quote", "waitlist"];

// Allowed admin emails (validated against site_settings)
async function validateAdminEmail(supabase: any, email: string): Promise<boolean> {
  const { data } = await supabase
    .from('site_settings')
    .select('value')
    .in('key', ['contact_email', 'admin_email'])
    .limit(10);
  
  if (!data || data.length === 0) return false;
  
  const validEmails = data.map((d: any) => d.value?.toLowerCase()).filter(Boolean);
  return validEmails.includes(email.toLowerCase());
}

function sanitizeString(str: string | undefined | null, maxLength: number): string {
  if (!str) return "";
  // Remove potentially dangerous characters and limit length
  return str
    .toString()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove HTML brackets
    .trim();
}

function validateEmail(email: string): boolean {
  if (!email || email.length > maxLengths.email) return false;
  return emailRegex.test(email);
}

interface NotificationRequest {
  type: "contact" | "quote" | "waitlist";
  data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    message?: string;
    products?: Array<{
      productName: string;
      quantityNow: string;
      quantityUnit: string;
    }>;
    additionalNotes?: string;
    business_type?: string;
    notes?: string;
  };
  adminEmail: string;
}

function validateAndSanitizeRequest(body: any): { valid: boolean; data?: NotificationRequest; error?: string } {
  // Validate type
  if (!body.type || !allowedTypes.includes(body.type)) {
    return { valid: false, error: "Invalid notification type" };
  }

  // Validate data object exists
  if (!body.data || typeof body.data !== 'object') {
    return { valid: false, error: "Missing data object" };
  }

  // Validate required fields
  if (!body.data.name || typeof body.data.name !== 'string') {
    return { valid: false, error: "Name is required" };
  }
  
  if (!body.data.email || !validateEmail(body.data.email)) {
    return { valid: false, error: "Valid email is required" };
  }

  // Validate admin email format
  if (!body.adminEmail || !validateEmail(body.adminEmail)) {
    return { valid: false, error: "Valid admin email is required" };
  }

  // Sanitize all inputs
  const sanitizedData: NotificationRequest = {
    type: body.type,
    data: {
      name: sanitizeString(body.data.name, maxLengths.name),
      email: sanitizeString(body.data.email, maxLengths.email),
      company: sanitizeString(body.data.company, maxLengths.company),
      phone: sanitizeString(body.data.phone, maxLengths.phone),
      message: sanitizeString(body.data.message, maxLengths.message),
      business_type: sanitizeString(body.data.business_type, maxLengths.business_type),
      notes: sanitizeString(body.data.notes, maxLengths.notes),
      additionalNotes: sanitizeString(body.data.additionalNotes, maxLengths.additionalNotes),
    },
    adminEmail: sanitizeString(body.adminEmail, maxLengths.email),
  };

  // Validate and sanitize products array if present
  if (body.data.products && Array.isArray(body.data.products)) {
    if (body.data.products.length > 20) {
      return { valid: false, error: "Too many products (max 20)" };
    }
    
    sanitizedData.data.products = body.data.products.slice(0, 20).map((p: any) => ({
      productName: sanitizeString(p?.productName, maxLengths.productName),
      quantityNow: sanitizeString(p?.quantityNow, maxLengths.quantityNow),
      quantityUnit: sanitizeString(p?.quantityUnit, maxLengths.quantityUnit),
    }));
  }

  // Validate message exists for contact type
  if (body.type === "contact" && !sanitizedData.data.message) {
    return { valid: false, error: "Message is required for contact submissions" };
  }

  return { valid: true, data: sanitizedData };
}

// HTML escape function to prevent XSS in emails
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }

  try {
    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate and sanitize inputs
    const validation = validateAndSanitizeRequest(body);
    if (!validation.valid || !validation.data) {
      console.log("Validation failed:", validation.error);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { type, data, adminEmail } = validation.data;

    // Create Supabase client to validate admin email
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validate admin email is in site_settings
    const isValidAdmin = await validateAdminEmail(supabase, adminEmail);
    if (!isValidAdmin) {
      console.log("Invalid admin email attempted:", adminEmail);
      return new Response(
        JSON.stringify({ error: "Invalid recipient" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log(`Processing ${type} notification for ${data.email}`);

    let subject: string;
    let htmlContent: string;

    if (type === "contact") {
      subject = `New Contact Form Submission from ${escapeHtml(data.name)}`;
      htmlContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(data.company || "Not provided")}</p>
        <h3>Message:</h3>
        <p>${escapeHtml(data.message || "")}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This message was sent from your website contact form.</p>
      `;
    } else if (type === "waitlist") {
      subject = `New Waitlist Signup: ${escapeHtml(data.name)} (${escapeHtml(data.company || "No Company")})`;
      htmlContent = `
        <h2>New Warehouse Tracker AI Waitlist Signup</h2>
        <h3>Contact Information:</h3>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(data.company || "Not provided")}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone || "Not provided")}</p>
        <p><strong>Business Type:</strong> ${escapeHtml(data.business_type || "Not provided")}</p>
        
        ${data.notes ? `<h3>Additional Notes:</h3><p>${escapeHtml(data.notes)}</p>` : ""}
        
        <hr>
        <p style="color: #666; font-size: 12px;">This signup was submitted through your Warehouse Tracker AI waitlist.</p>
      `;
    } else {
      subject = `New Quote Request from ${escapeHtml(data.name)} (${escapeHtml(data.company || "No Company")})`;
      const productsList = data.products?.map((p) => 
        `<li><strong>${escapeHtml(p.productName)}</strong> - ${escapeHtml(p.quantityNow)} ${escapeHtml(p.quantityUnit)}</li>`
      ).join("") || "";
      
      htmlContent = `
        <h2>New Quote Request</h2>
        <h3>Customer Information:</h3>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(data.company || "Not provided")}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone || "Not provided")}</p>
        
        <h3>Products Requested:</h3>
        <ul>${productsList}</ul>
        
        ${data.additionalNotes ? `<h3>Additional Notes:</h3><p>${escapeHtml(data.additionalNotes)}</p>` : ""}
        
        <hr>
        <p style="color: #666; font-size: 12px;">This quote request was submitted through your website.</p>
      `;
    }

    // Send email to admin
    const emailResponse = await resend.emails.send({
      from: "CaseStore Notifications <onboarding@resend.dev>",
      to: [adminEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send notification" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
