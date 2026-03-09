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
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
              
              @keyframes fadeInDown {
                  from { opacity: 0; transform: translateY(-20px); }
                  to { opacity: 1; transform: translateY(0); }
              }
              @keyframes pulse {
                  0% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.02); opacity: 0.9; }
                  100% { transform: scale(1); opacity: 1; }
              }

              body {
                  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  background-color: #0a0a0f;
                  margin: 0;
                  padding: 0;
                  -webkit-font-smoothing: antialiased;
              }
              .wrapper {
                  width: 100%;
                  table-layout: fixed;
                  background-color: #0a0a0f;
                  padding: 40px 10px;
              }
              .main-card {
                  background-color: #111118;
                  margin: 0 auto;
                  width: 100%;
                  max-width: 580px;
                  border-radius: 20px;
                  overflow: hidden;
                  border: 1px solid rgba(108, 99, 255, 0.2);
                  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
                  animation: fadeInDown 0.8s ease-out;
              }
              .header {
                  padding: 40px;
                  text-align: center;
                  background: linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%);
              }
              .logo-circle {
                  width: 56px;
                  height: 56px;
                  background: linear-gradient(135deg, #6c63ff 0%, #a78bfa 100%);
                  border-radius: 12px;
                  margin: 0 auto 16px;
                  display: block;
                  line-height: 56px;
                  color: white;
                  font-size: 24px;
              }
              .brand-text {
                  font-size: 20px;
                  font-weight: 800;
                  color: #f0f0f5;
                  letter-spacing: -0.5px;
              }
              .brand-text span {
                  color: #a78bfa;
              }
              .content {
                  padding: 40px;
              }
              .title {
                  font-size: 24px;
                  font-weight: 700;
                  color: #ffffff;
                  margin-bottom: 20px;
                  letter-spacing: -0.02em;
              }
              .desc {
                  font-size: 16px;
                  color: #8b8b9e;
                  line-height: 1.7;
                  margin-bottom: 32px;
              }
              .otp-box {
                  background: rgba(108, 99, 255, 0.05);
                  border: 1px solid rgba(108, 99, 255, 0.15);
                  border-radius: 16px;
                  padding: 32px;
                  text-align: center;
                  margin-bottom: 32px;
              }
              .otp-label {
                  font-size: 13px;
                  font-weight: 600;
                  color: #5a5a6e;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                  margin-bottom: 12px;
              }
              .otp-code {
                  font-size: 48px;
                  font-weight: 800;
                  color: #6c63ff;
                  letter-spacing: 12px;
                  font-family: 'Courier New', monospace;
                  margin: 0;
                  text-shadow: 0 0 20px rgba(108, 99, 255, 0.3);
              }
              .expiry {
                  font-size: 14px;
                  color: #5a5a6e;
                  margin-top: 16px;
              }
              .security-warning {
                  border-left: 3px solid #6c63ff;
                  padding: 12px 20px;
                  background: rgba(108, 99, 255, 0.03);
                  margin-top: 24px;
              }
              .security-warning p {
                  font-size: 13px;
                  color: #8b8b9e;
                  margin: 0;
                  line-height: 1.5;
              }
              .footer {
                  padding: 32px 40px;
                  text-align: center;
                  background: #0d0d14;
                  border-top: 1px solid rgba(255, 255, 255, 0.05);
              }
              .footer-links a {
                  color: #8b8b9e;
                  text-decoration: none;
                  font-size: 14px;
                  margin: 0 12px;
                  transition: color 0.3s;
              }
              .footer-links a:hover {
                  color: #6c63ff;
              }
              .footer-credit {
                  font-size: 12px;
                  color: #5a5a6e;
                  margin-top: 24px;
                  line-height: 1.6;
              }
              .footer-credit a {
                  color: #a78bfa;
                  text-decoration: none;
                  font-weight: 500;
              }
          </style>
      </head>
      <body>
          <div class="wrapper">
              <table class="main-card" role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                      <td class="header">
                          <div class="logo-circle" align="center">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 14px;"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                          </div>
                          <div class="brand-text">${organization.split(' ')[0]}<span>${organization.split(' ').slice(1).join(' ')}</span></div>
                      </td>
                  </tr>
                  <tr>
                      <td class="content">
                          <h1 class="title">Security Verification</h1>
                          <p class="desc">
                              To complete your authentication, please use the secure verification code provided below. This code will expire soon for your protection.
                          </p>
                          <div class="otp-box">
                              <p class="otp-label">Verification Code</p>
                              <div class="otp-code">${otp}</div>
                              <p class="expiry">Valid for 5 minutes</p>
                          </div>
                          <div class="security-warning">
                              <p><strong>Note:</strong> If you did not request this code, please ignore this email. Someone may have entered your email address by mistake.</p>
                          </div>
                      </td>
                  </tr>
                  <tr>
                      <td class="footer">
                          <div class="footer-links" style="margin-bottom: 20px;">
                              <a href="https://otpservice-free.vercel.app">Dashboard</a>
                              <a href="https://github.com/Eswarchinthakayala-webdesign/OTPServiceAPI">Repository</a>
                              <a href="https://github.com/Eswarchinthakayala-webdesign">Contact</a>
                          </div>
                          <p class="footer-credit">
                              &copy; ${year} ${organization}. All rights reserved.<br>
                              Designed & Built by <a href="https://github.com/Eswarchinthakayala-webdesign">Eswar Chinthakayala</a>
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
