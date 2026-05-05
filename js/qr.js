// ── qr.js ────────────────────────────────────────────────────
// CDN CORRECTO: cdn.jsdelivr.net (NO cdnjs — da 404)

var canvasQR = document.getElementById('canvas-qr');
var instanciaQR = null;

function generarQR(productoId) {
  var urlProducto = CONFIG.BASE_URL_MOVIL + '?id=' + productoId;
  if (!instanciaQR) {
    instanciaQR = new QRCode(canvasQR, {
      text:         urlProducto,
      width:        108,
      height:       108,
      colorDark:    '#00D4FF',
      colorLight:   '#0D1117',
      correctLevel: QRCode.CorrectLevel.M
    });
  } else {
    instanciaQR.makeCode(urlProducto);
  }
}
