const nodemailer = require("nodemailer");

let transporter = null;

const createTransporter = async () => {
  if (transporter) return transporter;

  const emailHost = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const emailPort = Number(process.env.SMTP_PORT || process.env.EMAIL_PORT) || 587;
  const emailUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const emailPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (emailUser && emailPass) {
    // Production / Configured SMTP Transporter
    transporter = nodemailer.createTransport({
      host: emailHost || "smtp.gmail.com",
      port: emailPort,
      secure: emailPort === 465, // true for 465, false for 587
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
    console.log(`📧 Nodemailer SMTP transporter initialized for ${emailUser}`);
  } else {
    // Development / Local Transporter fallback
    console.warn("⚠️ [AUTH] SMTP credentials not configured in .env. Using fallback transport.");
    transporter = {
      sendMail: async (options) => {
        console.log(`[AUTH] 📧 [SMTP DISPATCH SIMULATION] To: ${options.to} | Subject: ${options.subject}`);
        return { messageId: "smtp_sim_" + Date.now() };
      },
    };
    console.log(`📧 Development email transporter initialized (Local SMTP Mode)`);
  }

  return transporter;
};

// Reusable function to send low stock alert emails
const sendLowStockAlert = async ({ item, quantity, threshold, unit, supplier }) => {
  try {
    const activeTransporter = await createTransporter();
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER || process.env.EMAIL_USER || "harshital784@gmail.com";
    const fromSender = process.env.EMAIL_FROM || '"CraveCrust Kitchen Alerts" <no-reply@cravecrust.com>';

    const subject = `🚨 LOW STOCK ALERT: ${item} (${quantity} ${unit} remaining)`;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; rounded: 12px;">
        <h2 style="color: #e65100; margin-top: 0;">🍕 CraveCrust Gourmet Kitchen Alert</h2>
        <p style="font-size: 14px; color: #333;">The following kitchen ingredient has fallen below its re-order threshold:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #fff3e0;">
            <th style="padding: 10px; border: 1px solid #ffe0b2; text-align: left;">Ingredient Name</th>
            <td style="padding: 10px; border: 1px solid #ffe0b2;"><strong>${item}</strong></td>
          </tr>
          <tr>
            <th style="padding: 10px; border: 1px solid #eee; text-align: left;">Current Quantity</th>
            <td style="padding: 10px; border: 1px solid #eee; color: #d32f2f; font-weight: bold;">${quantity} ${unit}</td>
          </tr>
          <tr style="background-color: #fafafa;">
            <th style="padding: 10px; border: 1px solid #eee; text-align: left;">Minimum Threshold</th>
            <td style="padding: 10px; border: 1px solid #eee;">${threshold} ${unit}</td>
          </tr>
          <tr>
            <th style="padding: 10px; border: 1px solid #eee; text-align: left;">Assigned Supplier</th>
            <td style="padding: 10px; border: 1px solid #eee;">${supplier || "Kitchen Direct"}</td>
          </tr>
        </table>
        
        <p style="font-size: 13px; color: #666;">Please place a replenishment purchase order with supplier soon to prevent menu item outages.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 11px; color: #999; text-align: center;">CraveCrust Automated Telemetry & Inventory Management System</p>
      </div>
    `;

    const info = await activeTransporter.sendMail({
      from: fromSender,
      to: adminEmail,
      subject,
      html: htmlBody,
    });

    console.log(`✅ [LOW STOCK EMAIL SENT] to ${adminEmail} for "${item}". Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ [LOW STOCK EMAIL ERROR] Failed to send email for "${item}":`, error.message);
    return null;
  }
};

// Function to send 6-digit OTP Email Verification
const sendVerificationOtpEmail = async ({ email, name, otp }) => {
  console.log(`[AUTH] Verification OTP email sending to: ${email}`);
  try {
    const activeTransporter = await createTransporter();
    const fromSender = process.env.EMAIL_FROM || '"CraveCrust Gourmet Kitchen" <no-reply@cravecrust.com>';

    const subject = "🍕 Your CraveCrust Verification Code";
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #ff6600; margin-top: 0;">CraveCrust Email Verification</h2>
        <p style="font-size: 14px; color: #444; line-height: 1.6;">
          Hello ${name || 'Pizza Enthusiast'}, thank you for registering with CraveCrust Gourmet Woodfire Kitchen. Please use the 6-digit verification code below to activate your account:
        </p>

        <div style="text-align: center; margin: 30px 0; background-color: #fff5eb; padding: 20px; border-radius: 12px; border: 1px dashed #ff6600;">
          <span style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #ff6600; font-family: monospace;">${otp}</span>
        </div>

        <p style="font-size: 12px; color: #666; line-height: 1.5;">
          ⏱️ This verification code is valid for <strong>10 minutes</strong>.<br/>
          🔒 <strong>Security Warning:</strong> Never share this code with anyone. CraveCrust staff will never ask for your verification code.
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">CraveCrust Security & Authentication Systems</p>
      </div>
    `;

    const info = await activeTransporter.sendMail({
      from: fromSender,
      to: email,
      subject,
      html: htmlBody,
    });

    console.log(`[AUTH] Verification OTP email sent successfully to ${email}. Message ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.warn(`[AUTH] Verification OTP email dispatch note: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Function to send Password Reset email link
const sendPasswordResetEmail = async ({ email, name, token }) => {
  console.log(`[AUTH] Password reset email sending to: ${email}`);
  try {
    const activeTransporter = await createTransporter();
    const fromSender = process.env.EMAIL_FROM || '"CraveCrust Security" <no-reply@cravecrust.com>';
    const clientBaseUrl = process.env.CLIENT_BASE_URL || "http://localhost:5173";
    const resetUrl = `${clientBaseUrl}/reset-password?token=${token}`;

    const subject = "🔒 Reset your CraveCrust account password";
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eee; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #ff6600; margin-top: 0;">Password Reset Request</h2>
        <p style="font-size: 14px; color: #444; line-height: 1.6;">
          Hello ${name}, we received a request to reset the password for your CraveCrust account. Click the button below to create a new password:
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #1e293b; color: #ffffff; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 30px; font-size: 14px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 12px; color: #888;">
          This link will expire in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
        </p>

        <p style="font-size: 12px; color: #888;">
          Link URL: <a href="${resetUrl}" style="color: #ff6600;">${resetUrl}</a>
        </p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 11px; color: #aaa; text-align: center;">CraveCrust Security & Authentication Telemetry</p>
      </div>
    `;

    const info = await activeTransporter.sendMail({
      from: fromSender,
      to: email,
      subject,
      html: htmlBody,
    });

    console.log(`[AUTH] Password reset email sent successfully to ${email}. Message ID: ${info.messageId}`);
    let previewUrl = null;
    if (nodemailer.getTestMessageUrl && info) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log(`[AUTH] 🔗 Ethereal Reset Email Preview: ${previewUrl}`);
      }
    }
    console.log(`[AUTH] 🔗 Direct Reset Link: ${resetUrl}`);

    return {
      success: true,
      messageId: info.messageId,
      previewUrl,
      resetUrl,
      isTestAccount: !Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS),
    };
  } catch (error) {
    console.error(`[AUTH] Password reset email failed: ${error.message}`);
    throw error;
  }
};

module.exports = {
  sendLowStockAlert,
  sendVerificationOtpEmail,
  sendVerificationEmail: sendVerificationOtpEmail,
  sendPasswordResetEmail,
};
