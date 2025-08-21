// /.netlify/functions/send-email
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const {
      toEmail,
      subject = "Your Travel Archetype Results",
      htmlContent,
    } = JSON.parse(event.body || "{}");
    if (!toEmail || !htmlContent) {
      return { statusCode: 400, body: "Missing toEmail or htmlContent" };
    }

    // Make relative image URLs absolute for email clients
    const base = process.env.PUBLIC_BASE_URL || "";
    const absolutizedHtml = base
      ? htmlContent.replace(
          /src="\/?(images\/[^"']+)"/g,
          (m, p1) => `src="${base.replace(/\/$/, "")}/${p1}"`
        )
      : htmlContent;

    const payload = {
      sender: {
        email: process.env.SENDER_EMAIL || "no-reply@yourdomain.com",
        name: "Kior Travel",
      },
      to: [{ email: toEmail }],
      bcc: process.env.OWNER_EMAIL
        ? [{ email: process.env.OWNER_EMAIL }]
        : undefined, // optional: send a copy to you
      subject,
      htmlContent: absolutizedHtml,
      textContent:
        "Your results are attached as HTML (open in an HTML-capable client).",
    };

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: res.status, body: errText };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: e.message || "Error" };
  }
}
