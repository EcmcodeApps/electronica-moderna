let catalogoCache = [];

const DATOS_PRUEBA = [
  {
    id: 'EM-001', nombre: 'Transistor 2SC5200 NPN',
    categoria: 'Componentes', subcategoria: 'Transistores',
    precio: 8500, precio_texto: '$8.500',
    precio_anterior: '$10.000',
    referencia: '2SC5200-NPN', marca: 'Toshiba',
    descripcion: 'Transistor NPN de potencia para amplificadores de audio',
    especificaciones: 'Vceo: 230V | Ic: 15A | Pc: 150W | hFE: 55-160',
    compatibilidad: 'Par complementario con 2SA1943',
    stock: 12, url_foto: '', url_video: '',
    en_promocion: true, texto_promo: 'LIQUIDACIÓN',
    es_nuevo: false, activo: 'TRUE'
  },
  {
    id: 'EM-002', nombre: 'ESP32 DevKit V1',
    categoria: 'Arduino y ESP32', subcategoria: 'Placas',
    precio: 28000, precio_texto: '$28.000',
    precio_anterior: '',
    referencia: 'ESP32-DEVKIT-V1', marca: 'Generic',
    descripcion: 'Módulo con WiFi y Bluetooth integrado para IoT',
    especificaciones: 'CPU: 240MHz | RAM: 520KB | Flash: 4MB | WiFi 2.4GHz | BT 4.2',
    compatibilidad: 'Arduino IDE, MicroPython, ESPHome',
    stock: 8, url_foto: '', url_video: '',
    en_promocion: false, texto_promo: '',
    es_nuevo: true, activo: 'TRUE'
  },
  {
    id: 'EM-003', nombre: 'Bocina Tweeter 1" 8Ω 30W',
    categoria: 'Audio', subcategoria: 'Tweeters',
    precio: 15000, precio_texto: '$15.000',
    precio_anterior: '',
    referencia: 'TWE-1IN-8OHM', marca: 'Genérico',
    descripcion: 'Tweeter de titanio para sistemas de audio HiFi',
    especificaciones: 'Impedancia: 8Ω | Potencia: 30W RMS | Freq: 3kHz-20kHz',
    compatibilidad: 'Sistemas 2 vías y 3 vías',
    stock: 22, url_foto: '', url_video: '',
    en_promocion: false, texto_promo: '',
    es_nuevo: false, activo: 'TRUE'
  },
];

async function cargarCatalogo() {
  try {
    console.log('📡 Cargando catálogo Electrónica Moderna...');
    const respuesta = await fetch(CONFIG.API_URL, {
      signal: AbortSignal.timeout(10000)
    });
    if (!respuesta.ok) throw new Error('n8n respondió: ' + respuesta.status);
    const datos = await respuesta.json();
    const lista = datos.productos || datos;
    const activos = lista.filter(function(p) {
      return p.activo === true || p.activo === 'TRUE';
    });
    catalogoCache = activos;
    console.log('✅ Catálogo cargado: ' + catalogoCache.length + ' productos');
    return catalogoCache;
  } catch (error) {
    if (catalogoCache.length > 0) {
      console.warn('⚠️ Usando caché:', error.message);
      return catalogoCache;
    }
    console.warn('⚠️ Usando datos de prueba — n8n no disponible');
    catalogoCache = DATOS_PRUEBA;
    return catalogoCache;
  }
}

setInterval(async function() {
  console.log('🔄 Refrescando catálogo...');
  const nuevos = await cargarCatalogo();
  if (nuevos.length !== catalogoCache.length) {
    console.log('📦 Catálogo actualizado. Reiniciando carrusel...');
    iniciarCarrusel(nuevos);
  }
}, CONFIG.INTERVALO_REFRESH);
