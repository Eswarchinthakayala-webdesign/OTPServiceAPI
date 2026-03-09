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
    return `
      <!DOCTYPE html>
      <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>${organization} - Verification Code</title>
              <style>
                  body {
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      background-color: #f4f6f8;
                      margin: 0;
                      padding: 0;
                  }
                  .wrapper {
                      width: 100%;
                      table-layout: fixed;
                      background-color: #f4f6f8;
                      padding-bottom: 30px;
                  }
                  .main {
                      background-color: #ffffff;
                      margin: 0 auto;
                      width: 100%;
                      max-width: 600px;
                      border-spacing: 0;
                      border-radius: 8px;
                      overflow: hidden;
                  }
                  .header {
                      background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
                      padding: 40px 30px;
                      text-align: center;
                  }
                  .header-logo {
                      font-size: 28px;
                      font-weight: 600;
                      color: #ffffff;
                      letter-spacing: 0.5px;
                  }
                  .header-subtitle {
                      font-size: 14px;
                      color: #a0aec0;
                      margin-top: 8px;
                      font-weight: 400;
                  }
                  .content {
                      padding: 40px 30px;
                  }
                  .greeting {
                      font-size: 18px;
                      color: #2d3748;
                      margin-bottom: 24px;
                      line-height: 1.6;
                  }
                  .otp-label {
                      font-size: 14px;
                      color: #718096;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                      margin-bottom: 12px;
                  }
                  .otp-container {
                      background-color: #edf2f7;
                      border-radius: 8px;
                      padding: 24px;
                      margin: 20px 0;
                  }
                  .otp {
                      font-size: 36px;
                      font-weight: 700;
                      color: #1a365d;
                      letter-spacing: 8px;
                      font-family: 'Courier New', monospace;
                  }
                  .otp-note {
                      font-size: 13px;
                      color: #a0aec0;
                      margin-top: 16px;
                      line-height: 1.5;
                  }
                  .footer {
                      background-color: #f7fafc;
                      padding: 30px;
                      text-align: center;
                      border-top: 1px solid #e2e8f0;
                  }
                  .footer-text {
                      font-size: 12px;
                      color: #a0aec0;
                      margin: 0;
                      line-height: 1.6;
                  }
                  .footer-links {
                      margin-top: 12px;
                  }
                  .footer-links a {
                      color: #2c5282;
                      text-decoration: none;
                      font-size: 12px;
                  }
                  .footer-links a:hover {
                      text-decoration: underline;
                  }
                  .credit {
                      font-size: 12px;
                      color: #718096;
                      margin: 12px 0 0 0;
                      line-height: 1.6;
                  }
                  .credit a {
                      color: #2c5282;
                      text-decoration: none;
                      font-weight: 500;
                  }
                  .credit a:hover {
                      text-decoration: underline;
                  }
                  .divider {
                      height: 1px;
                      background-color: #e2e8f0;
                      margin: 0 30px;
                  }
                  .security-badge {
                      display: inline-block;
                      background-color: #c6f6d5;
                      color: #22543d;
                      padding: 6px 12px;
                      border-radius: 4px;
                      font-size: 11px;
                      font-weight: 600;
                      text-transform: uppercase;
                      letter-spacing: 0.5px;
                      margin-bottom: 20px;
                  }
              </style>
          </head>
          <body>
              <div class="wrapper">
                  <table class="main" role="presentation">
                      <tr>
                          <td class="header">
                              <div class="header-logo">${organization}</div>
                              <div class="header-subtitle">Secure Verification</div>
                          </td>
                      </tr>
                      <tr>
                          <td class="content">
                              <div class="security-badge">
                                  &#128274; One-Time Password
                              </div>
                              <p class="greeting">
                                  Hello,<br><br>
                                  We received a request for a verification code to access your account. 
                                  Please use the following OTP to complete your authentication:
                              </p>
                              <div class="otp-container">
                                  <p class="otp-label">Your Verification Code</p>
                                  <p class="otp">${otp}</p>
                              </div>
                              <p class="otp-note">
                                  This code will expire in <strong>5 minutes</strong> for security purposes.
                                  If you didn't request this code, please ignore this email or contact support 
                                  if you have concerns about your account security.
                              </p>
                          </td>
                      </tr>
                      <tr>
                          <td class="divider"></td>
                      </tr>
                      <tr>
                          <td class="footer">
                              <p class="footer-text">
                                  This is an automated message. Please do not reply directly to this email.
                              </p>
                              <div class="footer-links">
                                   <p class="credit">
                                      <a href="https://otpservice-free.vercel.app" target="_blank">Visit Our Website</a>
                                      &nbsp;·&nbsp; Designed & Built by <a href="https://github.com/Eswarchinthakayala-webdesign" target="_blank">Eswar Chinthakayala</a>
                                    
                                  </p>
                              </div>
                              <p class="footer-text" style="margin-top: 16px;">
                                  &copy; ${new Date().getFullYear()} ${organization}. All rights reserved.
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
