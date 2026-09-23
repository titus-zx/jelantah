// Jelantah Apps Script Backend (paste in Google Apps Script editor)
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var folderId = "<<FOLDER_ID>>"; // Ganti dengan ID folder Google Drive buat foto
  var now = new Date();

  // Parse form data
  var nama = e.parameter["nama"] || "-";
  var hp = e.parameter["hp"] || "-";
  var berat = e.parameter["berat"] || "0";
  var waktu = e.parameter["waktu"] || now.toISOString();
  var imgBlob = null;
  var fotoLink = "";

  try {
    // File foto (
    if (e.parameters["foto"] && typeof e.parameters["foto"] !== 'string') {
      imgBlob = e.parameters["foto"][0];
    } else if (e.parameters["foto"]) {
      imgBlob = e.parameters["foto"];
    } else if (e.postData && e.postData.type.indexOf("multipart") !== -1) {
      // new Vercel Next multipart: fallback for File
      var boundary = e.postData.contents.match(/boundary=(.+)/)[1];
      imgBlob = Utilities.newBlob(e.postData.bytes).getAs("image/jpeg");
    }
    if (imgBlob) {
      var folder = DriveApp.getFolderById(folderId);
      var file = folder.createFile(imgBlob);
      file.setName("timbang-"+Utilities.formatDate(now,"Asia/Jakarta","yyyyMMddHHmmss")+".jpg");
      fotoLink = file.getUrl();
    }
  } catch (err) {
    // skip foto, still log error
    fotoLink = "UPLOAD FAILED: " + err;
  }
  // Append to sheet
  sheet.appendRow([waktu, nama, hp, berat, fotoLink]);

  // Respond
  return ContentService.createTextOutput(JSON.stringify({success:true})).setMimeType(ContentService.MimeType.JSON);
}