// export const API_URL = process.env.BASE_URL;
export const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
export const EDITOR_KEY = process.env.NEXT_PUBLIC_EDITOR_KEY;
export const JWT_SECRET = process.env.JWT_SECRET;

export const PriceType = [
  {
    label: "Fixed",
    value: "Fixed",
  },
  {
    label: "Range",
    value: "Range",
  },
];

export const PriceUnit = [
  {
    label: "Lakh",
    value: "Lakh",
  },
  {
    label: "Crore",
    value: "Crore",
  },
];

export const possionNumber = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4",
    value: "4",
  },
];

export const possionWMY = [
  {
    label: "Week",
    value: "Week",
  },
  {
    label: "Month",
    value: "Month",
  },
  {
    label: "Year",
    value: "Year",
  },
];

export const propertyOrderBy = [
  {
    label: "1",
    value: "1",
  },
  {
    label: "2",
    value: "2",
  },
  {
    label: "3",
    value: "3",
  },
  {
    label: "4",
    value: "4",
  },
];

export const maxSizeUnit = [
  {
    label: "sqmt",
    value: "sqmt",
  },
  {
    label: "sqft",
    value: "sqft",
  },
  {
    label: "sqyd",
    value: "sqyd",
  },
];

export const minSizeUnit = [
  {
    label: "sqmt",
    value: "sqmt",
  },
  {
    label: "sqft",
    value: "sqft",
  },
  {
    label: "sqyd",
    value: "sqyd",
  },
];

export function generateAlphanumericOTP(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += chars[Math.floor(Math.random() * chars.length)];
  }
  return otp;
}

export function generateWelcomeEmail({ username, email, password }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Welcome Email</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f4f4f7;
          padding: 0;
          margin: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          padding: 40px 30px;
        }
        .header {
          text-align: center;
          color: #2c3e50;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
          color: #007bff;
        }
        .content {
          margin-top: 30px;
          font-size: 16px;
          color: #555;
          line-height: 1.6;
        }
        .credentials {
          background: #f1f1f1;
          padding: 20px;
          border-radius: 5px;
          margin-top: 20px;
          font-family: monospace;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 13px;
          color: #aaa;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>Welcome to CMS Dashboard!</h1>
          <p>Your account has been created successfully 🎉</p>
        </div>
        <div class="content">
          <p>Hi <strong>${username}</strong>,</p>
          <p>We're excited to have you on board. Below are your login credentials:</p>
          <div class="credentials">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            <p><strong>OTP : ${generateAlphanumericOTP()}</strong> please don't share this otp with anyone!</p>
          </div>
          <p>Make sure to change your password after your first login for security reasons.</p>
          <p>If you have any questions or need help, feel free to contact our support team.</p>
        </div>
        <div class="footer">
          © 2025 Realty Assistant. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
}
