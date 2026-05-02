// ── carrusel.js v3.0 ──────────────────────────────────────────
// Motor principal del kiosco.

var indiceActual      = 0;
var intervaloCarrusel = null;
var timeoutSiguiente  = null;

var elNombre         = document.getElementById('nombre');
var elCategoria      = document.getElementById('categoria');
var elSubcategoria   = document.getElementById('subcategoria');
var elPrecio         = document.getElementById('precio');
var elPrecioAnterior = document.getElementById('precio-anterior');
var elDescripcion    = document.getElementById('descripcion');
var elSpecs          = document.getElementById('specs-contenido');
var elCompat         = document.getElementById('compat-contenido');
var elReferencia     = document.getElementById('txt-referencia');
var elMarca          = document.getElementById('txt-marca');
var elStock          = document.getElementById('stock-txt');
var elFoto           = document.getElementById('foto');
var elNumActual      = document.getElementById('num-actual');
var elNumTotal       = document.getElementById('num-total');
var elBanner         = document.getElementById('banner-promo');
var elBannerTexto    = document.getElementById('banner-texto');
var elBadgePromo     = document.getElementById('badge-promo');
var elBadgeNuevo     = document.getElementById('badge-nuevo');

function crearBarraProgreso() {
  var barra = document.getElementById('barra-progreso');
  if (barra) return barra;
  barra = document.createElement('div');
  barra.id = 'barra-progreso';
  barra.style.cssText =
    'position:fixed;bottom:0;left:0;height:4px;width:0%;'
    + 'background:#00D4FF;transition:width linear;z-index:999;';
  document.body.appendChild(barra);
  return barra;
}

function iniciarBarra(segundos) {
  var barra = crearBarraProgreso();
  barra.style.transition = 'none';
  barra.style.width = '0%';
  setTimeout(function() {
    barra.style.transition = 'width ' + segundos + 's linear';
    barra.style.width = '100%';
  }, 100);
}

function resetBarra() {
  var barra = document.getElementById('barra-progreso');
  if (barra) { barra.style.transition = 'none'; barra.style.width = '0%'; }
}

function convertirFotoUrl(url) {
  if (!url || !url.includes('drive.google.com')) return url;
  if (url.includes('uc?')) return url;
  var m = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  return m ? 'https://drive.google.com/uc?export=view&id=' + m[1] : url;
}

// ── Mensajes base del banner (siempre visibles) ──────────────
var MENSAJES_BASE = [
  '🏪 ELECTRÓNICA MODERNA',
  '⚡ TU PROVEEDOR DE CONFIANZA',
  '🔧 COMPONENTES · AUDIO · VIDEO · ARDUINO',
  '📦 NUEVOS PRODUCTOS DISPONIBLES',
  '💡 TRANSISTORES · ESP32 · BOCINAS · FUENTES',
  '🛒 CONSULTA PRECIOS Y DISPONIBILIDAD',
  '⚡ CALIDAD GARANTIZADA EN TODOS NUESTROS PRODUCTOS',
];

function construirTextoBanner(producto) {
  var partes = [];

  // Mensajes base siempre presentes
  MENSAJES_BASE.forEach(function(m) { partes.push(m); });

  // Si tiene promoción — agregar al inicio
  var esPromo = producto.en_promocion === true
    || String(producto.en_promocion).toUpperCase() === 'TRUE';
  if (esPromo) {
    var txt = producto.texto_promo || 'PROMOCIÓN ESPECIAL';
    partes.unshift('🏷️ ' + txt + ' EN ' + (producto.nombre || 'ESTE PRODUCTO').toUpperCase());
    partes.unshift('🔥 OFERTA ESPECIAL 🔥');
  }

  // Si es nuevo — agregar
  var esNuevo = producto.es_nuevo === true
    || String(producto.es_nuevo).toUpperCase() === 'TRUE';
  if (esNuevo) {
    partes.unshift('🆕 NUEVO: ' + (producto.nombre || '').toUpperCase());
    partes.unshift('📣 ¡RECIÉN LLEGADO!');
  }

  // Construir texto doble para loop continuo
  var sep = '   ✦   ';
  var texto = partes.join(sep);
  return texto + sep + texto; // doble para loop continuo
}

function actualizarBanner(producto) {
  if (!elBanner || !elBannerTexto) return;

  // Banner SIEMPRE visible
  elBannerTexto.textContent = construirTextoBanner(producto);

  // Badges
  var esPromo = producto.en_promocion === true
    || String(producto.en_promocion).toUpperCase() === 'TRUE';
  if (elBadgePromo) {
    if (esPromo) {
      elBadgePromo.textContent = '🏷️ ' + (producto.texto_promo || 'OFERTA');
      elBadgePromo.style.display = 'block';
    } else {
      elBadgePromo.style.display = 'none';
    }
  }

  var esNuevo = producto.es_nuevo === true
    || String(producto.es_nuevo).toUpperCase() === 'TRUE';
  if (elBadgeNuevo) elBadgeNuevo.style.display = esNuevo ? 'block' : 'none';
}

function programarSiguiente(productos, segundos) {
  if (timeoutSiguiente) clearTimeout(timeoutSiguiente);
  iniciarBarra(segundos);
  timeoutSiguiente = setTimeout(function() {
    indiceActual = (indiceActual + 1) % productos.length;
    mostrarProducto(productos, productos[indiceActual]);
  }, segundos * 1000);
}

function mostrarProducto(productos, producto) {
  if (timeoutSiguiente) { clearTimeout(timeoutSiguiente); timeoutSiguiente = null; }
  resetBarra();

  if (elNombre)      elNombre.textContent      = producto.nombre       || 'Sin nombre';
  if (elCategoria)   elCategoria.textContent   = producto.categoria    || '';
  if (elSubcategoria)elSubcategoria.textContent= producto.subcategoria || '';
  if (elDescripcion) elDescripcion.textContent = producto.descripcion  || '';
  if (elSpecs)       elSpecs.textContent       = producto.especificaciones || '';
  if (elCompat)      elCompat.textContent      = producto.compatibilidad   || '';
  if (elReferencia)  elReferencia.textContent  = 'Ref: ' + (producto.referencia || '');
  if (elMarca)       elMarca.textContent       = producto.marca        || '';

  // Stock
  if (elStock) {
    var st = parseInt(producto.stock) || 0;
    elStock.textContent = st > 0 ? '✅ Stock: ' + st + ' unidades' : '⚠️ Sin stock';
    elStock.style.color = st > 0 ? '#00D4FF' : '#FF6B6B';
  }

  // Precio
  var precioNum = parseInt(
    producto.precio_texto
      ? producto.precio_texto.replace(/[^0-9]/g, '')
      : producto.precio
  ) || 0;
  if (elPrecio) elPrecio.textContent = producto.precio_texto
    || ('$' + precioNum.toLocaleString('es-CO'));

  if (elPrecioAnterior) {
    if (producto.precio_anterior && producto.precio_anterior.trim() !== '') {
      elPrecioAnterior.textContent = 'Antes: ' + producto.precio_anterior;
      elPrecioAnterior.style.display = 'block';
    } else {
      elPrecioAnterior.style.display = 'none';
    }
  }

  // Foto — usa placehold.co (NO via.placeholder.com — bloqueado en Colombia)
  if (elFoto) {
    if (producto.url_foto && producto.url_foto.trim() !== '') {
      elFoto.src = convertirFotoUrl(producto.url_foto);
    } else {
      elFoto.src = 'https://placehold.co/380x320/161B22/00D4FF?text='
        + encodeURIComponent(producto.nombre || 'Producto');
    }
    elFoto.style.display = 'block';
  }

  actualizarBanner(producto);
  generarQR(producto.id);
  if (elNumActual) elNumActual.textContent = indiceActual + 1;

  // Video: esperar que cargue antes de iniciar countdown
  var tieneVideo = producto.url_video && producto.url_video.trim() !== '';
  if (tieneVideo) {
    reproducirVideoLSC(producto.url_video, function onVideoListo() {
      programarSiguiente(productos, CONFIG.TIEMPO_PRODUCTO);
    });
    // Seguridad: si el video tarda más de 6s, arrancar igual
    setTimeout(function() {
      if (!timeoutSiguiente) {
        console.warn('⏱ Video tardó demasiado — iniciando countdown');
        programarSiguiente(productos, CONFIG.TIEMPO_PRODUCTO);
      }
    }, 6000);
  } else {
    programarSiguiente(productos, CONFIG.TIEMPO_PRODUCTO);
  }

  console.log('📺 ' + producto.nombre + ' — $' + precioNum.toLocaleString('es-CO'));
}

function iniciarCarrusel(productos) {
  if (timeoutSiguiente) clearTimeout(timeoutSiguiente);
  if (intervaloCarrusel) { clearInterval(intervaloCarrusel); intervaloCarrusel = null; }

  if (!productos || productos.length === 0) {
    if (elNombre) elNombre.textContent = 'Sin productos activos';
    return;
  }
  indiceActual = 0;
  if (elNumTotal) elNumTotal.textContent = productos.length;
  mostrarProducto(productos, productos[0]);
  console.log('✅ Carrusel v3.0: ' + productos.length
    + ' productos · ' + CONFIG.TIEMPO_PRODUCTO + 's c/u');
}

if (elFoto) {
  elFoto.addEventListener('error', function() {
    elFoto.src = 'https://placehold.co/380x320/161B22/00D4FF?text=Sin+foto';
  });
}
