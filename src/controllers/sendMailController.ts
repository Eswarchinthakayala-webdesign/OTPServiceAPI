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
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
              
              body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                  background-color: #f8fafc;
                  margin: 0;
                  padding: 0;
                  -webkit-font-smoothing: antialiased;
              }
              .wrapper {
                  width: 100%;
                  table-layout: fixed;
                  background-color: #f8fafc;
                  padding: 40px 0;
              }
              .main {
                  background-color: #ffffff;
                  margin: 0 auto;
                  width: 100%;
                  max-width: 580px;
                  border-spacing: 0;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              .header {
                  background-color: #ffffff;
                  padding: 40px 40px 20px;
                  text-align: left;
              }
              .header-logo {
                  font-size: 24px;
                  font-weight: 700;
                  color: #4f46e5;
                  letter-spacing: -0.5px;
              }
              .content {
                  padding: 0 40px 40px;
              }
              .title {
                  font-size: 24px;
                  font-weight: 700;
                  color: #1e293b;
                  margin-bottom: 24px;
                  line-height: 1.2;
              }
              .description {
                  font-size: 16px;
                  color: #475569;
                  margin-bottom: 32px;
                  line-height: 1.6;
              }
              .otp-container {
                  background-color: #f1f5f9;
                  border-radius: 12px;
                  padding: 32px;
                  text-align: center;
                  margin-bottom: 32px;
                  border: 1px solid #e2e8f0;
              }
              .otp-label {
                  font-size: 14px;
                  font-weight: 600;
                  color: #64748b;
                  text-transform: uppercase;
                  letter-spacing: 1.5px;
                  margin-bottom: 16px;
              }
              .otp-code {
                  font-size: 42px;
                  font-weight: 800;
                  color: #4f46e5;
                  letter-spacing: 12px;
                  font-family: 'Courier New', monospace;
                  margin: 0;
              }
              .expiry-note {
                  font-size: 14px;
                  color: #64748b;
                  margin-top: 16px;
              }
              .divider {
                  height: 1px;
                  background-color: #e2e8f0;
                  margin: 0 40px;
              }
              .footer {
                  padding: 32px 40px;
                  background-color: #ffffff;
              }
              .footer-text {
                  font-size: 14px;
                  color: #94a3b8;
                  line-height: 1.6;
                  margin: 0 0 16px;
              }
              .security-notice {
                  background-color: #fef2f2;
                  border-radius: 8px;
                  padding: 16px;
                  border: 1px solid #fee2e2;
                  margin-top: 24px;
              }
              .security-notice p {
                  font-size: 13px;
                  color: #991b1b;
                  margin: 0;
                  line-height: 1.5;
              }
              .social-links {
                  margin-top: 24px;
                  font-size: 13px;
                  color: #64748b;
              }
              .social-links a {
                  color: #4f46e5;
                  text-decoration: none;
                  font-weight: 500;
              }
              .copyright {
                  font-size: 12px;
                  color: #cbd5e1;
                  margin-top: 32px;
                  text-align: center;
              }
          </style>
      </head>
      <body>
          <div class="wrapper">
              <table class="main" role="presentation" align="center">
                  <tr>
                      <td class="header">
                          <div class="header-logo">${organization}</div>
                      </td>
                  </tr>
                  <tr>
                      <td class="content">
                          <h1 class="title">Verify your identity</h1>
                          <p class="description">
                              Hello,<br><br>
                              To complete your sign-in, please use the verification code below. This code is unique to this request and should not be shared with anyone.
                          </p>
                          <div class="otp-container">
                              <p class="otp-label">Verification Code</p>
                              <div class="otp-code">${otp}</div>
                              <p class="expiry-note">Valid for 5 minutes</p>
                          </div>
                          <div class="security-notice">
                              <p><strong>Security Tip:</strong> Our team will never ask for this code over the phone or via social media. If you didn't request this, please secure your account immediately.</p>
                          </div>
                      </td>
                  </tr>
                  <tr>
                      <td class="divider"></td>
                  </tr>
                  <tr>
                      <td class="footer">
                          <p class="footer-text">
                              This is an automated security notification from ${organization}.
                          </p>
                          <div class="social-links">
                              <a href="https://otpservice-free.vercel.app">Website</a> &nbsp;•&nbsp; 
                              <a href="https://github.com/Eswarchinthakayala-webdesign">Support</a>
                          </div>
                          <p class="copyright">
                              &copy; ${year} ${organization}. All rights reserved.
                          </p>
                      </td>
                  </tr>
              </table>
          </div>
      </body>
      </html>
    `;
  }
}

export default SendMailController;
