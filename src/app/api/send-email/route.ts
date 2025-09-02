import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail, testEmailConnection } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // 驗證必要欄位
    if (!orderData.deliveryTime || !orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, message: '訂單資料不完整' },
        { status: 400 }
      );
    }

    // 發送郵件
    const emailResult = await sendOrderEmail(orderData);
    
    console.log('訂單處理成功:', {
      timestamp: orderData.timestamp,
      deliveryTime: orderData.deliveryTime,
      totalItems: orderData.totalItems,
      messageId: emailResult.messageId
    });
    
    return NextResponse.json({ 
      success: true, 
      message: '訂單已成功發送',
      messageId: emailResult.messageId
    });
    
  } catch (error) {
    console.error('訂單處理錯誤:', error);
    
    // 根據錯誤類型提供不同的回應
    const errorMessage = error instanceof Error ? error.message : '未知錯誤';
    
    return NextResponse.json(
      { 
        success: false, 
        message: '訂單發送失敗', 
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}

// 測試郵件配置的 GET 端點
export async function GET() {
  try {
    const isConnected = await testEmailConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: 'SMTP 配置正常' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'SMTP 連線失敗' 
      }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'SMTP 測試失敗',
      error: error instanceof Error ? error.message : '未知錯誤'
    }, { status: 500 });
  }
}
