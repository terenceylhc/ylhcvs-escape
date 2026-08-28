// 員林家商圖書館密室逃脫 - Firebase 免費跨裝置即時資料庫設定檔
// 您只需在 Firebase 官網免費申請專案後，將金鑰複製黏貼至此即可全校跨裝置即時同步！

const firebaseConfig = {
  // 請將您的 Firebase 專案設定複製到這裡：
  apiKey: "AIzaSyAlqB3BTJBfLKMvZRS7xWAg56eot4TKGZ4",
  authDomain: "libesc.firebaseapp.com",
  databaseURL: "https://libesc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "libesc",
  storageBucket: "libesc.firebasestorage.app",
  messagingSenderId: "204492961244",
  appId: "1:204492961244:web:9c27a11cc183e18b4dcb19",
  measurementId: "G-HFSMCLYYVC"
};

// 匯出設定
if (typeof window !== 'undefined') {
  window.firebaseConfig = firebaseConfig;
}
