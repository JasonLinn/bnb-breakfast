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
  roomNumber?: string;
  deliveryTime: string;
  orderDate?: string;
  orderNote?: string;
  foodItems: Array<{
    name: string;
    quantity: number;
    type?: string;
  }>;
  drinkItems: Array<{
    name: string;
    quantity: number;
    type?: string;
  }>;
  foodTotal: number;
  drinkTotal: number;
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
            ${orderData.roomNumber && orderData.roomNumber !== '未填寫' ? `<p><strong>📍 房號:</strong> ${orderData.roomNumber}</p>` : ''}
            <p><strong>送餐時間:</strong> ${orderData.deliveryTime}</p>
            ${orderData.orderDate && orderData.orderDate !== '未指定' ? `<p><strong>指定日期:</strong> ${orderData.orderDate}</p>` : ''}
            ${orderData.orderNote && orderData.orderNote !== '無' ? `<p><strong>備註:</strong> ${orderData.orderNote}</p>` : ''}
            <p class="total"><strong>總計:</strong> ${orderData.totalItems} 份</p>
          </div>

          <h3>🍽️ 訂單明細</h3>
          
          <div style="background-color: #f0f9ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 15px; margin: 15px 0;">
            <p style="margin: 0; font-weight: bold; color: #1e40af; font-size: 16px;">
              📋 快速複製區域 ${orderData.roomNumber && orderData.roomNumber !== '未填寫' ? `- 房號: ${orderData.roomNumber}` : ''} - ${orderData.deliveryTime}送餐
            </p>
            <div style="background-color: white; padding: 12px; margin-top: 10px; border-radius: 4px; font-family: monospace; white-space: pre-line;">
${orderData.foodItems && orderData.foodItems.length > 0 ? `【主餐】
${orderData.foodItems.map(item => `${item.name}: ${item.quantity}份`).join('\n')}
主餐小計: ${orderData.foodTotal} 份

` : ''}${orderData.drinkItems && orderData.drinkItems.length > 0 ? `【飲料】
${orderData.drinkItems.map(item => `${item.name}: ${item.quantity}杯`).join('\n')}
飲料小計: ${orderData.drinkTotal} 杯

` : ''}總計: ${orderData.foodTotal > 0 ? `${orderData.foodTotal}份餐` : ''}${orderData.foodTotal > 0 && orderData.drinkTotal > 0 ? ' + ' : ''}${orderData.drinkTotal > 0 ? `${orderData.drinkTotal}杯飲料` : ''} (共${orderData.totalItems}項)
            </div>
          </div>
          
          ${orderData.foodItems && orderData.foodItems.length > 0 ? `
          <h4 style="color: #f59e0b; margin-top: 20px;">主餐</h4>
          <table class="items-table">
            <thead>
              <tr>
                <th>品項</th>
                <th>數量</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.foodItems.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity} 份</td>
                </tr>
              `).join('')}
              <tr style="background-color: #fff3cd; font-weight: bold;">
                <td>主餐小計</td>
                <td>${orderData.foodTotal} 份</td>
              </tr>
            </tbody>
          </table>
          ` : ''}
          
          ${orderData.drinkItems && orderData.drinkItems.length > 0 ? `
          <h4 style="color: #3b82f6; margin-top: 20px;">飲料</h4>
          <table class="items-table">
            <thead>
              <tr>
                <th>品項</th>
                <th>數量</th>
              </tr>
            </thead>
            <tbody>
              ${orderData.drinkItems.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity} 杯</td>
                </tr>
              `).join('')}
              <tr style="background-color: #dbeafe; font-weight: bold;">
                <td>飲料小計</td>
                <td>${orderData.drinkTotal} 杯</td>
              </tr>
            </tbody>
          </table>
          ` : ''}
          
          <div class="order-info" style="background-color: #fef3c7; margin-top: 20px;">
            <h4 style="color: #f59e0b; margin: 0;">📊 總計</h4>
            <p style="font-size: 18px; font-weight: bold; margin: 10px 0;">
              ${orderData.foodTotal > 0 ? `主餐: ${orderData.foodTotal} 份` : ''}
              ${orderData.foodTotal > 0 && orderData.drinkTotal > 0 ? ' + ' : ''}
              ${orderData.drinkTotal > 0 ? `飲料: ${orderData.drinkTotal} 杯` : ''}
              <br>
              <span style="color: #dc2626;">總共: ${orderData.totalItems} 項</span>
            </p>
          </div>

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
${orderData.roomNumber && orderData.roomNumber !== '未填寫' ? `📍 房號: ${orderData.roomNumber}` : ''}
送餐時間: ${orderData.deliveryTime}
${orderData.orderDate && orderData.orderDate !== '未指定' ? `指定日期: ${orderData.orderDate}` : ''}
${orderData.orderNote && orderData.orderNote !== '無' ? `備註: ${orderData.orderNote}` : ''}

========================================
訂單明細 ${orderData.roomNumber && orderData.roomNumber !== '未填寫' ? `- 房號: ${orderData.roomNumber}` : ''} - ${orderData.deliveryTime}送餐
========================================

${orderData.foodItems && orderData.foodItems.length > 0 ? `【主餐】
${orderData.foodItems.map(item => `${item.name}: ${item.quantity}份`).join('\n')}
----------------------------------------
主餐小計: ${orderData.foodTotal} 份

` : ''}${orderData.drinkItems && orderData.drinkItems.length > 0 ? `【飲料】
${orderData.drinkItems.map(item => `${item.name}: ${item.quantity}杯`).join('\n')}
----------------------------------------
飲料小計: ${orderData.drinkTotal} 杯

` : ''}========================================
【總計】
${orderData.foodTotal > 0 ? `主餐: ${orderData.foodTotal} 份` : ''}
${orderData.foodTotal > 0 && orderData.drinkTotal > 0 ? ' + ' : ''}
${orderData.drinkTotal > 0 ? `飲料: ${orderData.drinkTotal} 杯` : ''}
總共: ${orderData.totalItems} 項
========================================

---
此郵件由 ToDo早午餐訂單系統 自動發送
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      subject: `🍳 新訂單${orderData.roomNumber && orderData.roomNumber !== '未填寫' ? ` - 房號${orderData.roomNumber}` : ''} - ${orderData.deliveryTime}送餐${orderData.orderDate && orderData.orderDate !== '未指定' ? ` (${orderData.orderDate})` : ''} (${orderData.foodTotal > 0 ? `${orderData.foodTotal}份餐` : ''}${orderData.foodTotal > 0 && orderData.drinkTotal > 0 ? '+' : ''}${orderData.drinkTotal > 0 ? `${orderData.drinkTotal}杯飲料` : ''})`,
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
