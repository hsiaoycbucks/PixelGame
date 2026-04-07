/**
 * Google Apps Script 後端邏輯
 * 
 * 部署步驟：
 * 1. 建立一個 Google Sheets，並具備以下兩個工作表（請注意名稱）：
 *    - 「題目」工作表：包含欄位 [題號, 題目, A, B, C, D, 解答]
 *    - 「回答」工作表：包含欄位 [ID, 闖關次數, 總分, 最高分, 第一次通關分數, 花了幾次通關, 最近遊玩時間]
 * 2. 點擊 [擴充功能] -> [Apps Script]
 * 3. 將此程式碼貼上並儲存
 * 4. 點擊右上角 [部署] -> [新增部署] -> 類型選擇「網頁應用程式」
 * 5. 存取權限設為「所有人 (Anyone)」，點擊部署，並給予存取權限
 * 6. 將獲取的網址貼入前端 `.env` 的 `VITE_GOOGLE_APP_SCRIPT_URL` 中
 */

const SHEET_QUESTIONS = '題目';
const SHEET_ANSWERS = '回答';

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getQuestions') {
      const count = parseInt(e.parameter.count || 5, 10);
      const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS);
      if (!sheet) throw new Error('找不到題目工作表');
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0]; // 假設有標題行
      const rows = data.slice(1);
      
      // 隨機抽取 N 題
      const shuffled = rows.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, count);
      
      const questions = selected.map(row => {
        return {
          id: row[0],
          question: row[1],
          A: row[2],
          B: row[3],
          C: row[4],
          D: row[5]
          // 解答(row[6]) 不傳遞回前端
        };
      });
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, questions: questions }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput("Hello from Google Apps Script");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    // 支援 CORS，前端需傳送 JSON 字串格式
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    if (action === 'submitAnswers') {
      const userId = String(postData.userId);
      const userAnswers = postData.answers || []; // [{questionId, answer}, ...]
      
      // 計算分數
      let score = 0;
      const qSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_QUESTIONS);
      const qData = qSheet.getDataRange().getValues();
      
      // 建立題號對應解答的字典，加快搜尋
      const ansDict = {};
      for (let i = 1; i < qData.length; i++) {
        ansDict[qData[i][0]] = qData[i][6]; // 假設題號在第0欄，解答在第6欄
      }
      
      for (const ua of userAnswers) {
        if (ansDict[ua.questionId] && String(ansDict[ua.questionId]).trim().toUpperCase() === String(ua.answer).trim().toUpperCase()) {
          score += 1;
        }
      }
      
      // 處理「回答」工作表
      const aSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ANSWERS);
      const aData = aSheet.getDataRange().getValues();
      
      let foundRow = -1;
      // 找尋是否有此 ID
      for (let i = 1; i < aData.length; i++) {
        if (String(aData[i][0]) === userId) {
          foundRow = i + 1; // Google Sheets row 索引從 1 開始
          break;
        }
      }
      
      const currentTime = new Date();
      // 在這個範例中，不論這題數是多少分算通關，只要前端計算也可，但這裡後端只專注寫入總分。
      // 可以考慮傳入 passThreshold 或是後端統一設定
      
      if (foundRow === -1) {
        // [ID, 闖關次數, 總分, 最高分, 第一次通關分數, 花了幾次通關, 最近遊玩時間]
        aSheet.appendRow([userId, 1, score, score, "", "", currentTime]);
      } else {
        // 更新現有資料
        const playCount = Number(aSheet.getRange(foundRow, 2).getValue()) + 1;
        const highestScore = Number(aSheet.getRange(foundRow, 4).getValue());
        const newHighest = Math.max(highestScore, score);
        
        aSheet.getRange(foundRow, 2).setValue(playCount);    // 闖關次數
        aSheet.getRange(foundRow, 3).setValue(score);        // 總分(最新一次)
        aSheet.getRange(foundRow, 4).setValue(newHighest);   // 最高分
        aSheet.getRange(foundRow, 7).setValue(currentTime);  // 最近遊玩時間
        
        // 第一次通關邏輯：若以前第一次通關分數沒填，且現在分數達標(假設過關門檻為3，可自行修改或由前端傳)，即填入
        // 若需求是 "若同 ID 已通關過，後續分數不覆蓋" -> 即代表 第一次通關分數 若有值就不改變
      }
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, score: score }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
// 必須加入 doOptions 處理 CORS preflight req (即使有時候前端用 text/plain 可以繞過)
function doOptions(e) {
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}
