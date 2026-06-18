const _datetimeToNormal = (datetime) => {
  if (typeof datetime === 'object') {
    return datetime
  }
  // TODO: убрать после миграции дат в БД на UTC (сейчас сервер отдаёт московское время с суффиксом Z)
  return new Date(datetime.replace('Z', '+03:00'))
}

let _localizedMonths = (locale) => {
  let l = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июнь', 'июль', 'авг', 'сент', 'окт', 'нояб', 'дек'],
    pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    jp: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  }
	return l[locale] || l['en']
}

export const timeAgo = (timestamp, locale) => {
  if (!timestamp) return null

  const date    = _datetimeToNormal(timestamp)
  const DAY_IN_MS = 86400000

  const today      = new Date()
  const yesterday  = new Date(today - DAY_IN_MS)
  const seconds    = Math.round((today - date) / 1000)
  const minutes    = Math.round(seconds / 60)
  const hours      = Math.round(minutes / 60)

  const isYesterday = yesterday.toDateString() === date.toDateString()
  const isThisYear  = today.getFullYear()      === date.getFullYear()

  const months = _localizedMonths(locale)
  const h      = String(date.getHours()).padStart(2, '0')
  const mins   = String(date.getMinutes()).padStart(2, '0')
  const day    = date.getDate()
  const month  = months[date.getMonth()]
  const year   = date.getFullYear()

  if (seconds < 5)   return ['time_ago.now']
  if (seconds < 60)  return ['time_ago.seconds',      { n: seconds }]
  if (seconds < 90)  return ['time_ago.about_a_minute']
  if (minutes < 60)  return ['time_ago.minutes',      { n: minutes }]
  if (hours < 24)    return ['time_ago.hours',         { n: hours }]
  if (isYesterday)   return ['time_ago.yesterday_at', { hours: h, minutes: mins }]
  if (isThisYear)    return ['time_ago.short',         { day, month, hours: h, minutes: mins }]

  return ['time_ago.full', { day, month, year, hours: h, minutes: mins }]
}

export const fullDate = (timestamp, locale) => {
  if (!timestamp) return null

  const date  = _datetimeToNormal(timestamp)
  const today = new Date()

  const months = _localizedMonths(locale)
  const h      = String(date.getHours()).padStart(2, '0')
  const mins   = String(date.getMinutes()).padStart(2, '0')
  const day    = date.getDate()
  const month  = months[date.getMonth()]
  const year   = date.getFullYear()

  const isThisYear = today.getFullYear() === date.getFullYear()

  if (isThisYear) return ['time_ago.short', { day, month, hours: h, minutes: mins }]

  return ['time_ago.full', { day, month, year, hours: h, minutes: mins }]
}

export const timeFormatOnlyYear = (timestamp, locale) => {
	if (!timestamp) { return null }

  const date = _datetimeToNormal(timestamp)
	const months = _localizedMonths(locale)

	const year = date.getFullYear()
	const month = months[date.getMonth()]
	const day = date.getDate()

  return `${day} ${month} ${year}`
}
