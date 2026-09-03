const nodemailer = require("nodemailer");

// ======================================================
// GMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ======================================================
// HELPER: ESCAPE HTML
// Prevents user input from breaking the email HTML
// ======================================================

function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ======================================================
// COMMON EMAIL TEMPLATE
// ======================================================

function emailTemplate(content, subtitle = "KISHORI SAREE CENTER") {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kishori Saree Center</title>
</head>
<body style="margin:0;padding:0;background:#f6f3f0;font-family:Arial, Helvetica, sans-serif;color:#2c2927;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f3f0;padding:35px 15px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;">

          <!-- HEADER -->
          <tr>
            <td align="center" style="background:#5b1834;padding:32px 25px;">
              <div style="font-family:Georgia, 'Times New Roman', serif;color:#ffffff;font-size:28px;font-weight:bold;line-height:36px;">
                Kishori Saree Center
              </div>
              <div style="margin-top:8px;color:#ead6dd;font-size:12px;letter-spacing:2px;">
                ${subtitle}
              </div>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:35px 30px;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td align="center" style="background:#faf8f6;border-top:1px solid #eee8e4;padding:22px 20px;">
              <div style="font-family:Georgia, 'Times New Roman', serif;color:#5b1834;font-size:17px;font-weight:bold;">
                Kishori Saree Center
              </div>
              <div style="margin-top:7px;color:#8b817b;font-size:12px;line-height:18px;">
                Thank you for choosing us ❤️
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// ======================================================
// SEND ENQUIRY EMAIL
// ======================================================

async function sendEnquiryEmail({ name, mobile, email, message, sareeName }) {
  const safeName = escapeHtml(name || "Customer");
  const safeMobile = escapeHtml(mobile || "Not provided");
  const safeEmail = escapeHtml(email || "Not provided");
  const safeSareeName = escapeHtml(sareeName || "General Enquiry");
  const safeMessage = escapeHtml(message || "No message provided.").replace(/\n/g, "<br>");

  const content = `
    <div style="text-align:center;">
      <div style="display:inline-block;background:#f6e8ed;color:#5b1834;padding:8px 16px;border-radius:30px;font-size:11px;font-weight:bold;letter-spacing:1px;">
        NEW ENQUIRY
      </div>
      <h1 style="margin:16px 0 8px;font-family:Georgia, 'Times New Roman', serif;color:#2c2927;font-size:26px;line-height:34px;">
        New Saree Enquiry
      </h1>
      <p style="margin:0 0 28px;color:#8b817b;font-size:14px;line-height:22px;">
        A customer has submitted an enquiry from your website.
      </p>
    </div>

    <div style="background:#faf8f6;border:1px solid #eee8e4;border-radius:10px;padding:20px;margin-bottom:20px;">
      <div style="color:#5b1834;font-size:12px;font-weight:bold;letter-spacing:1px;margin-bottom:15px;">
        CUSTOMER DETAILS
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:8px 0;width:35%;color:#8b817b;font-size:13px;">Name</td>
          <td style="padding:8px 0;color:#2c2927;font-size:14px;font-weight:bold;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#8b817b;font-size:13px;">Mobile</td>
          <td style="padding:8px 0;color:#2c2927;font-size:14px;font-weight:bold;">${safeMobile}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#8b817b;font-size:13px;">Email</td>
          <td style="padding:8px 0;color:#2c2927;font-size:14px;">${safeEmail}</td>
        </tr>
      </table>
    </div>

    <div style="border:1px solid #eadde2;border-radius:10px;padding:20px;margin-bottom:20px;">
      <div style="color:#8b817b;font-size:11px;letter-spacing:1px;text-transform:uppercase;">
        Saree Interested In
      </div>
      <div style="margin-top:8px;color:#5b1834;font-family:Georgia, 'Times New Roman', serif;font-size:20px;font-weight:bold;">
        ${safeSareeName}
      </div>
    </div>

    <div style="background:#faf8f6;border-left:4px solid #5b1834;border-radius:0 8px 8px 0;padding:18px 20px;">
      <div style="color:#8b817b;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">
        Customer Message
      </div>
      <div style="color:#403a36;font-size:14px;line-height:24px;">
        ${safeMessage}
      </div>
    </div>
  `;

  const html = emailTemplate(content, "NEW CUSTOMER ENQUIRY");

  await transporter.sendMail({
    from: `"Kishori Saree Center" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `New Saree Enquiry from ${name || "Customer"}`,
    html,
  });
}

// ======================================================
// SEND FEEDBACK EMAIL
// ======================================================

async function sendFeedbackEmail({ name, rating, comment, sareeId, photoUrl }) {
  const safeName = escapeHtml(name || "Customer");
  const parsedRating = Math.round(Number(rating)) || 0;
  const validRating = Math.min(5, Math.max(0, parsedRating));
  const safeSareeId = escapeHtml(sareeId || "Not provided");
  const safeComment = escapeHtml(comment || "No comment provided.").replace(/\n/g, "<br>");

  const stars = "★".repeat(validRating) + "☆".repeat(5 - validRating);

  let photoSection = "";
  if (photoUrl) {
    photoSection = `
      <div style="margin-top:25px;text-align:center;">
        <div style="color:#8b817b;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">
          CUSTOMER PHOTO
        </div>
        <img src="${escapeHtml(photoUrl)}" alt="Customer feedback photo" style="display:block;width:100%;max-width:320px;height:auto;margin:0 auto;border-radius:10px;border:1px solid #eee8e4;" />
      </div>
    `;
  }

  const content = `
    <div style="text-align:center;">
      <div style="display:inline-block;background:#f6e8ed;color:#5b1834;padding:8px 16px;border-radius:30px;font-size:11px;font-weight:bold;letter-spacing:1px;">
        NEW FEEDBACK
      </div>
      <h1 style="margin:16px 0 8px;font-family:Georgia, 'Times New Roman', serif;color:#2c2927;font-size:26px;line-height:34px;">
        Customer Feedback
      </h1>
      <p style="margin:0 0 28px;color:#8b817b;font-size:14px;line-height:22px;">
        A customer has shared their experience.
      </p>
    </div>

    <div style="text-align:center;background:#faf8f6;border:1px solid #eee8e4;border-radius:10px;padding:22px;margin-bottom:20px;">
      <div style="color:#c28a35;font-size:30px;letter-spacing:3px;line-height:36px;">
        ${stars}
      </div>
      <div style="margin-top:8px;color:#5b1834;font-size:14px;font-weight:bold;">
        ${validRating} / 5
      </div>
    </div>

    <div style="border:1px solid #eee8e4;border-radius:10px;padding:20px;margin-bottom:20px;">
      <div style="color:#5b1834;font-size:12px;font-weight:bold;letter-spacing:1px;margin-bottom:15px;">
        FEEDBACK DETAILS
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:8px 0;width:35%;color:#8b817b;font-size:13px;">Customer</td>
          <td style="padding:8px 0;color:#2c2927;font-size:14px;font-weight:bold;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#8b817b;font-size:13px;">Saree ID</td>
          <td style="padding:8px 0;color:#2c2927;font-size:14px;">${safeSareeId}</td>
        </tr>
      </table>
    </div>

    <div style="background:#faf8f6;border-left:4px solid #5b1834;border-radius:0 8px 8px 0;padding:18px 20px;">
      <div style="color:#8b817b;font-size:11px;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">
        Customer Comment
      </div>
      <div style="color:#403a36;font-size:14px;line-height:24px;">
        ${safeComment}
      </div>
    </div>

    ${photoSection}
  `;

  const html = emailTemplate(content, "CUSTOMER FEEDBACK");

  await transporter.sendMail({
    from: `"Kishori Saree Center" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: `New Feedback: ${validRating}★ from ${name || "Customer"}`,
    html,
  });
}

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  sendEnquiryEmail,
  sendFeedbackEmail,
};