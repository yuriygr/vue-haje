const humanizeError = (error) => {
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

const formatBytes = (bytes, decimals) => {
  if (bytes == 0) return '0 Bytes'
  let k = 1024,
    dm = decimals || 1,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

let _datetimeToNormal = (datetime) => {
  if (typeof datetime === 'object') {
    return datetime
  } else {
    const _date = new Date(datetime)
    return new Date(_date.getTime() + _date.getTimezoneOffset() * 60000)
  }
}
let _localizedMonths = (locale) => {
  let l = {
    en: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    ru: ['янв','фев','мар','апр','май','июнь','июль','авг','сент','окт','нояб','дек']
  }
	return l[locale] || l['en']
}
let _localizedToday = (locale) => {
  let l = {
    en: 'today',
    ru: 'сегодня'
  }
	return l[locale] || l['en']
}
let _localizedYesterday = (locale) => {
  let l = {
    en: 'yesterday',
    ru: 'вчера'
  }
	return l[locale] || l['en']
}
const _localizedAt = (locale) => {
  let l = { en: 'at', ru: 'в' }
  return l[locale] || l['en']
}

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.round(seconds % 60)
  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
    s > 9 ? s : '0' + s
  ].filter(Boolean).join(':')
}

const timeFormat = (timestamp, prefomattedDate = false, hideYear = false, locale = false) => {
	if (!timestamp) { return null }

  const date = _datetimeToNormal(timestamp)
	const months = _localizedMonths(locale)
  const _at = _localizedAt(locale)

	const year = date.getFullYear()
	const month = months[date.getMonth()]
	const day = date.getDate()
	const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
	const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()

  if (year > (new Date()).getFullYear() && hideYear != false) {
    hideYear = true
  }

  if (prefomattedDate) {
    return `${prefomattedDate} ${_at} ${hours}:${minutes}`
  }

  if (hideYear) {
    return `${day} ${month} ${_at} ${hours}:${minutes}`
  }

  return `${day} ${month} ${_at} ${year} ${hours}:${minutes}`
}

const timeFormatOnlyYear = (timestamp, locale) => {
	if (!timestamp) { return null }

  const date = _datetimeToNormal(timestamp)
	const months = _localizedMonths(locale)

	const year = date.getFullYear()
	const month = months[date.getMonth()]
	const day = date.getDate()

  return `${day} ${month} ${year}`
}

const timeAgo = (timestamp, locale) => {
	if (!timestamp) { return null }

  const date = _datetimeToNormal(timestamp)
  const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000

  const today = new Date()
  const yesterday = new Date(today - DAY_IN_MS)
  const seconds = Math.round((today - date) / 1000)
  const minutes = Math.round(seconds / 60)
  const isToday = today.toDateString() === date.toDateString()
  const isYesterday = yesterday.toDateString() === date.toDateString()
  const isThisYear = today.getFullYear() === date.getFullYear()

  if (seconds < 5) {
    return 'now';
  } else if (seconds < 60) {
    return `${ seconds } seconds ago`;
  } else if (seconds < 90) {
    return 'about a minute ago';
  } else if (minutes < 60) {
    return `${ minutes } minutes ago`;
  } else if (isToday) {
    return timeFormat(date, _localizedToday(locale), false, locale);
  } else if (isYesterday) {
    return timeFormat(date, _localizedYesterday(locale), false, locale);
  } else if (isThisYear) {
    return timeFormat(date, false, true, locale);
  }

  return timeFormat(timestamp) // 10 January 2017 at 10:20
}


// ochen' mnogo kostiley
const contentFormat = (value) => {
  let rules = {
    // http://, https://, ftp://
    url: {
      pattern: /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
      replacment: `<a target="_blank" rel="nofollow" href="$&">$&</a>`
    },
    // www. sans http:// or https://
    pseudoUrl: {
      pattern: /(^|[^\/])(www\.[\S]+(\b|$))/gim,
      replacment: `$1<a target="_blank" rel="nofollow" href="https://$2">$2</a>`
    },
    // e-mail addresses
    email: {
      pattern: /[\w.+]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim,
      replacment: `<a href="mailto:$&">$&</a>`
    },
    // hashtags
    tags: {
      pattern: /\B(#([^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]{1,24}))/gi,
      replacment: `<a href="/t/$2" target="_self">$1</a>`
    },
    // Упоминание
    mentions: {
      pattern: /\B(@([^\s!#$%^&*()=+.\/,\[{\]};:'"?><]{1,24}))/gi,
      replacment: `<a href="/u/$2" target="_self">$1</a>`
    },
    // Цитата
    quote: {
      pattern: /(<br>|^)&gt;\s*(?!\s)([\s\S]*?)(?=<br|$)/gmi, // /^&gt;\s*(\S[\s\S]*?)<br>/g
      replacment: `$1<span class="quote">$2</span>`
    },
    // new lines
    newLines: {
      pattern: /(?:\r\n|\r|\n)/g,
      replacment: `<br>`
    }
  }

  // unescape some HTML
  value = value.replace(/&#39;/gi, "'")
               .replace(/&#34;/gi, '"')

  Object.keys(rules).forEach(key => 
    value = value.replace(rules[key].pattern, rules[key].replacment)
  )

  return value
}

const truncateText = (value, length = 50) => {
  // unescape some HTML
  value = value.replace(/(?:\r\n|\r|\n)/g, ` `)
  value = value.replace(/<br>/g, ` `)
               .replace(/&#39;/gi, `'`)
               .replace(/&#34;/gi, `"`)

  return value.length > length ? value.substring(0, length) + '...' : value
}

let filters = { contentFormat, humanizeError, formatBytes, formatDuration, timeFormat, timeFormatOnlyYear, timeAgo, truncateText }

export default new class {
  install(app) {
    Object.keys(filters).forEach((key) => 
      app.config.globalProperties.$filters = {
        ...app.config.globalProperties.$filters,
        [key]: filters[key]
      }
    )
  }
}