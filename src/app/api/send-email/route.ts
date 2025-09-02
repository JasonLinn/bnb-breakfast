import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // 建立電子郵件內容
    const emailContent = `
新的早餐訂單 - ToDo早午餐 利澤店

訂單時間: ${orderData.timestamp}
送餐時間: ${orderData.deliveryTime}

訂單內容:
${orderData.orderDetails}

總計: ${orderData.totalItems}份

詳細品項:
${orderData.items.map((item: any) => `${item.name}: ${item.quantity}份`).join('\n')}
    `;

    // 這裡可以整合 EmailJS, SendGrid, 或其他郵件服務
    // 目前先記錄到 console 和回傳成功
    console.log('新訂單:', emailContent);
    
    // TODO: 實際發送郵件到 cheng11220@gmail.com
    // 可以使用 nodemailer, SendGrid, EmailJS 等服務
    
    return NextResponse.json({ 
      success: true, 
      message: '訂單已接收',
      orderData 
    });
    
  } catch (error) {
    console.error('郵件發送錯誤:', error);
    return NextResponse.json(
      { success: false, message: '訂單處理失敗' },
      { status: 500 }
    );
  }
}
