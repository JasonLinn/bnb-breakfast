import nodemailer from 'nodemailer';

// 建立郵件傳輸器
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

export interface OrderData {
  timestamp: string;
  deliveryTime: string;
  orderDetails: string;
  totalItems: number;
  items: Array<{
    name: string;
    quantity: number;
  }>;
}

export const sendOrderEmail = async (orderData: OrderData) => {
  try {
    const transporter = createTransporter();

    // 建立 HTML 郵件內容
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .order-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 10px 0; }
          .items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f59e0b; color: white; }
          .total { font-weight: bold; font-size: 18px; color: #f59e0b; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🍳 新的早餐訂單</h1>
          <h2>ToDo早午餐 利澤店</h2>
        </div>
        
        <div class="content">
          <div class="order-info">
            <h3>📋 訂單資訊</h3>
            <p><strong>訂單時間:</strong> ${orderData.timestamp}</p>
            <p><strong>送餐時間:</strong> ${orderData.deliveryTime}</p>
            <p class="total"><strong>總計:</strong> ${orderData.totalItems} 份</p>
          </div>

          <h3>🍽️ 訂單明細</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>品項</th>
                <th>數量</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity} 份</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>此郵件由 ToDo早午餐訂單系統 自動發送</p>
            <p>如有問題，請聯繫系統管理員</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // 純文字版本
    const textContent = `
新的早餐訂單 - ToDo早午餐 利澤店

訂單時間: ${orderData.timestamp}
送餐時間: ${orderData.deliveryTime}

訂單內容:
${orderData.orderDetails}

總計: ${orderData.totalItems}份

詳細品項:
${orderData.items.map(item => `${item.name}: ${item.quantity}份`).join('\n')}

---
此郵件由 ToDo早午餐訂單系統 自動發送
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      subject: `🍳 新訂單 - ${orderData.deliveryTime} 送餐 (${orderData.totalItems}份)`,
      text: textContent,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('郵件發送成功:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('郵件發送失敗:', error);
    throw error;
  }
};

// 測試郵件配置
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('SMTP 連線測試成功');
    return true;
  } catch (error) {
    console.error('SMTP 連線測試失敗:', error);
    return false;
  }
};
