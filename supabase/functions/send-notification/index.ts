import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, adminEmail }: NotificationRequest = await req.json();
    console.log(`Processing ${type} notification for ${data.email}`);

    let subject: string;
    let htmlContent: string;

    if (type === "contact") {
      subject = `New Contact Form Submission from ${data.name}`;
      htmlContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
        <h3>Message:</h3>
        <p>${data.message}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This message was sent from your website contact form.</p>
      `;
    } else if (type === "waitlist") {
      subject = `New Waitlist Signup: ${data.name} (${data.company || "No Company"})`;
      htmlContent = `
        <h2>New Warehouse Tracker AI Waitlist Signup</h2>
        <h3>Contact Information:</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Business Type:</strong> ${data.business_type || "Not provided"}</p>
        
        ${data.notes ? `<h3>Additional Notes:</h3><p>${data.notes}</p>` : ""}
        
        <hr>
        <p style="color: #666; font-size: 12px;">This signup was submitted through your Warehouse Tracker AI waitlist.</p>
      `;
    } else {
      subject = `New Quote Request from ${data.name} (${data.company || "No Company"})`;
      const productsList = data.products?.map((p, i) => 
        `<li><strong>${p.productName}</strong> - ${p.quantityNow} ${p.quantityUnit}</li>`
      ).join("") || "";
      
      htmlContent = `
        <h2>New Quote Request</h2>
        <h3>Customer Information:</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        
        <h3>Products Requested:</h3>
        <ul>${productsList}</ul>
        
        ${data.additionalNotes ? `<h3>Additional Notes:</h3><p>${data.additionalNotes}</p>` : ""}
        
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

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
