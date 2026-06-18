export const humanizeError = (error) => {
  const snakeCase = string => {
    return string.replace(/\W+/g, " ")
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('');
  }

  let _code = snakeCase(error.status)

  return {
    icon: `errors.${_code}.icon`,
    title: `errors.${_code}.title`,
    description: `errors.${_code}.description`
  }
}

export const cancelEvent = (event) => {
  event = event || window.event
  if (event) {
    event = event.originalEvent || event

    if (event.stopPropagation) event.stopPropagation()
    if (event.preventDefault) event.preventDefault()
      event.returnValue = false
      event.cancelBubble = true
  }

  return false
}

export const createThumb = (file) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e.target.error)
    reader.readAsDataURL(file)
  })
}

// formatBytes - переводит байты в удобночитаемый вид
export const formatBytes = (bytes, decimals) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024,
    dm = decimals ?? 1,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// formatDuration - преобразует секунды в удобночитаемый вид
export const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round(seconds % 60)

  const mm = m > 9 ? m : '0' + m
  const ss = s > 9 ? s : '0' + s

  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

// Видимо надо было
export const isObject = (value) => {
  if (value === null) { return false }
  return ( (typeof value === 'function') || (typeof value === 'object') )
}

// Видимо надо было
export const isArray = (value) => {
  return value && typeof value === 'object' && value.constructor === Array;
}

export const getScrollTopElement = (e) => {
  let top = 0
  while (e.offsetParent != undefined || e.offsetParent != null) {
    top += e.offsetTop + (e.clientTop != null ? e.clientTop : 0)
    e = e.offsetParent
  }
  return top
}

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value)
}

export const captureVideoFrame = (video, format, quality) => {
  if (typeof video === 'string') {
    video = document.getElementById(video);
  }

  format = format || 'jpeg';
  quality = quality || 0.92;

  if (!video || (format !== 'png' && format !== 'jpeg')) {
    return false;
  }

  var canvas = document.createElement("CANVAS");

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  canvas.getContext('2d').drawImage(video, 0, 0);

  var dataUri = canvas.toDataURL('image/' + format, quality);
  var data = dataUri.split(',')[1];
  var mimeType = dataUri.split(';')[0].slice(5)

  var bytes = window.atob(data);
  var buf = new ArrayBuffer(bytes.length);
  var arr = new Uint8Array(buf);

  for (var i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }

  var blob = new Blob([ arr ], { type: mimeType });
  return { blob: blob, dataUri: dataUri, format: format };
}

export function debounce(fn, delay) {
  let timer = null

  function debounced(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }

  debounced.cancel = () => {
    clearTimeout(timer)
    timer = null
  }

  return debounced
}

export async function to(promise) {
  try {
    const result = await promise
    return [null, result]
  } catch (error) {
    return [error, null]
  }
}

export const getYouTubeID = (url) => {
  if (!url) return null

  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,      // https://www.youtube.com/watch?v=XXXXXXXXXXX
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,         // https://www.youtube.com/shorts/XXXXXXXXXXX
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,                    // https://youtu.be/XXXXXXXXXXX
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,          // https://www.youtube.com/embed/XXXXXXXXXXX
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,              // https://www.youtube.com/v/XXXXXXXXXXX
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}