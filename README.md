# Pixel Quiz Adventure 像素風闖關問答遊戲

這是一個結合像素復古風格與問答機制的網頁遊戲。玩家可以輸入專屬 ID 進行闖關，題目會動態從 Google Sheets 載入，並將成績即時寫回試算表，方便管理者追蹤員工或學生的測驗結果。

## 🚀 快速開始指南

本專案分為兩個主要部分：
1. **Google Sheets & Google Apps Script (後端資料庫)**
2. **React + Vite (前端網頁遊戲)**

---

### 第一部分：建立 Google 試算表與後端 API
1. **建立新的 Google 試算表 (Google Sheets)**
   - 打開 Google 試算表並建立一個新的空白檔案。
   - 將頁籤分別重新命名為以下兩個（請確保名稱完全一致）：
     1. `題目`
     2. `回答`
     
2. **設定「題目」工作表的欄位**
   - 在第一列 (Row 1) 依序填入以下標題：
     | A | B | C | D | E | F | G |
     |---|---|---|---|---|---|---|
     | 題號 | 題目 | A | B | C | D | 解答 |

3. **設定「回答」工作表的欄位**
   - 在第一列 (Row 1) 依序填入以下標題：
     | A | B | C | D | E | F | G |
     |---|---|---|---|---|---|---|
     | ID | 闖關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間 |

4. **設定 Google Apps Script (GAS)**
   - 在試算表的上方選單，點擊 **[擴充功能]** -> **[Apps Script]**。
   - 在打開的編輯器中，清除預設的程式碼，並將專案內 `Code.gs` 的所有內容複製貼上。
   - 點擊上方的「儲存」圖示（或按 `Ctrl + S`）。

5. **部署 Web 應用程式**
   - 點擊右上角 **[部署]** -> **[新增部署]**。
   - 點擊左側齒輪 ⚙️ 選擇 **「網頁應用程式 (Web App)」**。
   - 內容設定如下：
     - **執行身分**：我 (你的帳號)
     - **誰可以存取**：所有人 (Anyone)
   - 點擊 **[部署]**（初次執行會需要授權，請點擊「進階」並允許存取）。
   - 部署完成後，會獲得一串 **「網頁應用程式網址 (URL)」**。請將這串網址複製備用。

---

### 第二部分：前端專案安裝與執行

1. **安裝環境依賴**
   請確保您的電腦已安裝 [Node.js](https://nodejs.org/)。
   在專案根目錄下開啟終端機，執行以下指令安裝套件：
   ```bash
   npm install
   ```

2. **設定環境變數 (.env)**
   - 在專案根目錄建立一個 `.env` 檔案。
   - 將剛才複製的 GAS 網址填寫如下：
   ```env
   VITE_GOOGLE_APP_SCRIPT_URL="這裡貼上你的 GAS 網頁應用程式網址"
   VITE_QUESTIONS_COUNT=5
   ```
   *(註：`VITE_QUESTIONS_COUNT` 代表每次要隨機抽取的題目數量)*

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```
   伺服器啟動後，開啟瀏覽器進入 `http://localhost:5174` 即可開始遊玩！

---

### 第三部分：部署至 GitHub

若是您希望將此專案推送到 GitHub 上進行版本控制，或後續使用 GitHub Pages、Vercel 等平台託管您的網頁遊戲，請按照以下步驟進行：

1. **初始化與提交至本機 Git 儲存庫**
   在終端機的專案根目錄下依序輸入：
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到遠端儲存庫**
   在 GitHub 上建立一個新的 Repository，然後執行以下指令（請將網址替換為您的實際網址）：
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```
   *(註：專案已經內建了 `.gitignore` 檔案，確保您的 `.env` 等敏感檔案不會被推送到公開儲存庫。)*

---

### 注意事項
- 變更 Google Apps Script 程式碼後，**務必** 重新執行「部署 -> 管理部署 -> 編輯 -> 新版本」，否則網址功能不會更新。
- 前端發出的非同步請求必須有 CORS 支援，`Code.gs` 中已包含對應的處理。
