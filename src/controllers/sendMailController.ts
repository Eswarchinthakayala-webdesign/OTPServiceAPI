import nodemailer, { Transporter } from 'nodemailer';
import logger from '../utils/logger';

class SendMailController {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.GMAIL_USER as string,
        pass: process.env.GMAIL_PASS as string,
      },
      pool: true,
    });
  }

  async sendMail(email: string, otp: string, organization: string, subject: string): Promise<void> {
    try {
      const mailOptions = {
        from: `"${organization}" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: subject,
        text: `Your OTP is ${otp}`,
        html: this.generateHtmlTemplate(otp, organization),
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Sent OTP to ${email}`);
    } catch (error: any) {
      logger.error(`Failed to send OTP to ${email}:`, error.message);
      throw new Error(`Failed to send OTP to ${email}`);
    }
  }

  private generateHtmlTemplate(otp: string, organization: string): string {
    const year = new Date().getFullYear();
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${organization} - Verification Code</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
              
              body {
                  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  background-color: #f1f5f9;
                  margin: 0;
                  padding: 0;
                  -webkit-font-smoothing: antialiased;
              }
              .container-table {
                  width: 100%;
                  background-color: #f1f5f9;
                  padding: 40px 15px;
              }
              .email-card {
                  background-color: #ffffff;
                  margin: 0 auto;
                  width: 100%;
                  max-width: 580px;
                  border-radius: 16px;
                  overflow: hidden;
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
              }
              .header {
                  background-color: #0066ff;
                  padding: 40px 40px;
                  text-align: center;
              }
              .brand-name {
                  font-size: 28px;
                  font-weight: 800;
                  color: #ffffff;
                  letter-spacing: -0.5px;
                  margin-bottom: 8px;
              }
              .header-subtitle {
                  font-size: 15px;
                  color: rgba(255, 255, 255, 0.8);
                  font-weight: 500;
              }
              .content {
                  padding: 40px;
              }
              .h1 {
                  font-size: 22px;
                  font-weight: 700;
                  color: #0f172a;
                  margin-bottom: 16px;
                  text-align: left;
              }
              .text {
                  font-size: 16px;
                  color: #475569;
                  margin-bottom: 32px;
                  line-height: 1.6;
              }
              .otp-wrapper {
                  background-color: #f8fafc;
                  border-radius: 12px;
                  padding: 32px;
                  text-align: center;
                  margin-bottom: 32px;
                  border: 1px dashed #cbd5e1;
              }
              .otp-label {
                  font-size: 13px;
                  font-weight: 700;
                  color: #64748b;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                  margin-bottom: 16px;
              }
              .otp-code {
                  font-size: 40px;
                  font-weight: 800;
                  color: #0066ff;
                  letter-spacing: 10px;
                  font-family: 'Courier New', monospace;
                  margin: 0;
              }
              .expiry {
                  font-size: 14px;
                  color: #94a3b8;
                  margin-top: 16px;
              }
              .notice {
                  background-color: #fef2f2;
                  border-radius: 10px;
                  padding: 20px;
                  border: 1px solid #fee2e2;
              }
              .notice p {
                  font-size: 13px;
                  color: #b91c1c;
                  margin: 0;
                  line-height: 1.5;
                  font-weight: 500;
              }
              .footer {
                  padding: 32px 40px;
                  background-color: #f8fafc;
                  text-align: center;
                  border-top: 1px solid #e2e8f0;
              }
              .footer-links {
                  margin-bottom: 16px;
              }
              .footer-links a {
                  color: #0066ff;
                  text-decoration: none;
                  font-size: 14px;
                  font-weight: 600;
                  margin: 0 10px;
              }
              .footer-text {
                  font-size: 13px;
                  color: #94a3b8;
                  line-height: 1.6;
              }
              .credit {
                  font-size: 12px;
                  color: #cbd5e1;
                  margin-top: 24px;
                  font-weight: 500;
              }
          </style>
      </head>
      <body>
          <table class="container-table" role="presentation" border="0" cellpadding="0" cellspacing="0">
              <tr>
                  <td>
                      <table class="email-card" role="presentation" border="0" cellpadding="0" cellspacing="0">
                          <tr>
                              <td class="header">
                                  <div class="brand-name">${organization}</div>
                                  <div class="header-subtitle">Identity Verification</div>
                              </td>
                          </tr>
                          <tr>
                              <td class="content">
                                  <h1 class="h1">Confirm your verification code</h1>
                                  <p class="text">
                                      Hello,<br><br>
                                      Use the following One-Time Password (OTP) to complete your request. This code is valid for a single use and should never be shared with others.
                                  </p>
                                  <div class="otp-wrapper">
                                      <p class="otp-label">Verification Code</p>
                                      <div class="otp-code">${otp}</div>
                                      <p class="expiry">Expires in 5 minutes</p>
                                  </div>
                                  <div class="notice">
                                      <p>If you didn't request this code, your account security might be compromised. Please ignore this email or change your password if you suspect unauthorized activity.</p>
                                  </div>
                              </td>
                          </tr>
                          <tr>
                              <td class="footer">
                                  <div class="footer-links">
                                      <a href="https://otpservice-free.vercel.app">Home</a>
                                      <a href="https://github.com/Eswarchinthakayala-webdesign/OTPServiceAPI">GitHub</a>
                                      <a href="https://github.com/Eswarchinthakayala-webdesign">Support</a>
                                  </div>
                                  <p class="footer-text">
                                      This is an automated security notification from ${organization}.<br>
                                      &copy; ${year} ${organization}. All rights reserved.
                                  </p>
                                  <p class="credit">
                                      Built with love by Eswar Chinthakayala
                                  </p>
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
}

export default SendMailController;
