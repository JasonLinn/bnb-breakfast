# 郵件發送設定指南

## Gmail SMTP 設定步驟

### 1. 啟用兩步驟驗證
1. 前往 [Google 帳戶設定](https://myaccount.google.com/security)
2. 點選「兩步驟驗證」並啟用

### 2. 生成應用程式密碼
1. 在「兩步驟驗證」頁面中，找到「應用程式密碼」
2. 選擇「郵件」和「其他 (自訂名稱)」
3. 輸入「ToDo早午餐訂單系統」
4. 複製生成的 16 字元密碼

### 3. 設定環境變數
編輯 `.env.local` 檔案：

```env
# 郵件發送設定
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=你的Gmail地址@gmail.com
SMTP_PASS=剛才生成的應用程式密碼
SMTP_FROM="ToDo早午餐 利澤店" <你的Gmail地址@gmail.com>
SMTP_TO=cheng11220@gmail.com

# 應用程式設定
NEXT_PUBLIC_APP_NAME=ToDo早午餐訂單系統
```

### 4. 測試郵件功能
啟動開發伺服器後，可以訪問測試端點：
```
GET http://localhost:3000/api/send-email
```

## 安全注意事項

### ⚠️ 重要提醒
- **絕對不要**將 `.env.local` 提交到 Git
- 應用程式密碼只顯示一次，請妥善保存
- 定期更換應用程式密碼

### 🔒 檔案保護
確保 `.env.local` 已被 `.gitignore` 忽略：
```gitignore
# 環境變數
.env.local
.env
```

## 其他郵件服務選項

### SendGrid (企業級)
```env
SENDGRID_API_KEY=your_sendgrid_api_key
```

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

### 自訂 SMTP
```env
SMTP_HOST=mail.your-domain.com
SMTP_PORT=587
SMTP_USER=your-email@your-domain.com
SMTP_PASS=your-password
```

## 故障排除

### 常見問題
1. **535 Authentication failed**: 檢查應用程式密碼是否正確
2. **Connection timeout**: 檢查防火牆設定
3. **Invalid login**: 確認已啟用兩步驟驗證

### 測試指令
```bash
# 測試 SMTP 連線
curl http://localhost:3000/api/send-email

# 檢查環境變數
echo $SMTP_USER
```
