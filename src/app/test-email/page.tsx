'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const testConnection = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'GET',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult('✅ SMTP 連線測試成功！郵件服務已準備就緒。');
      } else {
        setResult(`❌ SMTP 連線失敗: ${data.message}`);
      }
    } catch (error) {
      setResult(`❌ 測試失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestEmail = async () => {
    setIsLoading(true);
    setResult('');
    
    const testOrder = {
      timestamp: new Date().toLocaleString('zh-TW'),
      deliveryTime: '8:30',
      orderDetails: '測試訂單: 1份',
      totalItems: 1,
      items: [
        { name: '測試餐點', quantity: 1 }
      ]
    };

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testOrder),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setResult(`✅ 測試郵件發送成功！\n郵件 ID: ${data.messageId}`);
      } else {
        setResult(`❌ 郵件發送失敗: ${data.message}\n錯誤: ${data.error || '無詳細資訊'}`);
      }
    } catch (error) {
      setResult(`❌ 發送失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            📧 郵件功能測試
          </h1>
          
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="font-semibold text-yellow-800 mb-2">設定提醒</h2>
              <p className="text-yellow-700 text-sm">
                請確保已設定 .env.local 檔案中的 SMTP 配置。
                詳細設定請參考 MAIL_SETUP.md 文件。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testConnection}
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? '測試中...' : '🔍 測試 SMTP 連線'}
              </button>

              <button
                onClick={sendTestEmail}
                disabled={isLoading}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {isLoading ? '發送中...' : '📤 發送測試郵件'}
              </button>
            </div>

            {result && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold mb-2">測試結果:</h3>
                <pre className="text-sm whitespace-pre-wrap">{result}</pre>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/"
                className="text-blue-500 hover:text-blue-700 underline"
              >
                ← 回到主頁面
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
