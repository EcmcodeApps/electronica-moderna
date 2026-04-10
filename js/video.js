// ── video.js v3.0 ─────────────────────────────────────────────
// Soporta YouTube (recomendado), Google Drive y MP4 directo.

var videoEl    = document.getElementById('video-lsc');
var zonaAvatar = document.getElementById('zona-avatar');
var iframeEl   = null;

function extraerIdYoutube(url) {
  if (!url) return null;
  var m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function extraerIdDrive(url) {
  if (!url || !url.includes('drive.google.com')) return null;
  var m = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  return m ? m[1] : null;
}

function mostrarIframe(src, onListo) {
  videoEl.style.display = 'none';
  var icono = document.getElementById('icono-manos');
  if (icono) icono.style.display = 'none';

  if (!iframeEl) {
    iframeEl = document.createElement('iframe');
    iframeEl.id = 'iframe-lsc';
    iframeEl.setAttribute('allowfullscreen', true);
    iframeEl.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframeEl.style.cssText =
      'width:100%;height:75vh;border:none;border-radius:16px;background:#161B22;';
    zonaAvatar.appendChild(iframeEl);
  }

  if (iframeEl.src !== src) {
    iframeEl.onload = function() {
      console.log('✅ Video cargado');
      if (typeof onListo === 'function') onListo();
      iframeEl.onload = null;
    };
    iframeEl.src = src;
  } else {
    if (typeof onListo === 'function') onListo();
  }
  iframeEl.style.display = 'block';
}

function mostrarSinVideo() {
  videoEl.style.display = 'none';
  if (iframeEl) iframeEl.style.display = 'none';
}

function reproducirVideoLSC(urlVideo, onListo) {
  if (!urlVideo || urlVideo.trim() === '') {
    mostrarSinVideo();
    if (typeof onListo === 'function') onListo();
    return;
  }

  // ✅ YouTube — más confiable para el kiosco
  var ytId = extraerIdYoutube(urlVideo);
  if (ytId) {
    var ytSrc = 'https://www.youtube.com/embed/' + ytId
      + '?autoplay=1&mute=1&loop=1&controls=0'
      + '&playlist=' + ytId
      + '&rel=0&modestbranding=1&iv_load_policy=3';
    mostrarIframe(ytSrc, onListo);
    return;
  }

  // Google Drive — segunda opción
  var driveId = extraerIdDrive(urlVideo);
  if (driveId) {
    mostrarIframe(
      'https://drive.google.com/file/d/' + driveId + '/preview',
      onListo
    );
    return;
  }

  // MP4 directo — tercera opción
  if (iframeEl) iframeEl.style.display = 'none';
  videoEl.style.display = 'block';

  if (videoEl.src !== urlVideo) {
    videoEl.oncanplay = function() {
      if (typeof onListo === 'function') onListo();
      videoEl.oncanplay = null;
    };
    videoEl.src = urlVideo;
    videoEl.load();
    videoEl.play().catch(function() {
      mostrarSinVideo();
      if (typeof onListo === 'function') onListo();
    });
  } else {
    if (typeof onListo === 'function') onListo();
  }
}

videoEl.setAttribute('autoplay', true);
videoEl.setAttribute('loop', true);
videoEl.setAttribute('muted', true);
videoEl.setAttribute('playsinline', true);
videoEl.addEventListener('ended', function() {
  videoEl.currentTime = 0; videoEl.play();
});
videoEl.addEventListener('error', function() { mostrarSinVideo(); });
