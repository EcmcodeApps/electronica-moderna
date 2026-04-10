const CONFIG = {
  // ── URL del endpoint de n8n ───────────────────────────────
  API_URL: 'https://n8n-production-9cab.up.railway.app/webhook/electronica/productos',

  // ── Tiempos ───────────────────────────────────────────────
  TIEMPO_PRODUCTO: 45,              // segundos por producto
  INTERVALO_REFRESH: 30 * 60 * 1000, // refrescar catálogo cada 30 min

  // ── URL base para el QR ───────────────────────────────────
  BASE_URL_MOVIL: 'https://EcmcodeApps.github.io/electronica-moderna/producto',

  // ── Identidad del almacén ─────────────────────────────────
  NOMBRE_TIENDA: 'Electrónica Moderna',
  SLOGAN: 'Tu proveedor de componentes electrónicos',
  WHATSAPP: '573XXXXXXXXX',
};
