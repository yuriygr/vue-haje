// ochen' mnogo kostiley
export const contentFormat = (value) => {
  let rules = {
    // http://, https://, ftp://
    //url: {
    //  pattern: /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,
    //  replacement: `<a target="_blank" rel="nofollow" href="$&">$&</a>`
    //},
    url: {
      pattern: /\b(?:https?|ftp):\/\/[\w\u0400-\u04FF-+&@#\/%?=~_|!:,.;]*[\w\u0400-\u04FF-+&@#\/%=~_|]/gim,
      replacement: (match) => {
        const encoded = encodeURI(decodeURI(match))
        return `<a target="_blank" rel="nofollow" href="${encoded}">${match}</a>`
      }
    },
    // www. sans http:// or https://
    //pseudoUrl: {
    //  pattern: /(^|[^\/])(www\.[\S]+(\b|$))/gim,
    //  replacement: `$1<a target="_blank" rel="nofollow" href="https://$2">$2</a>`
    //},
    pseudoUrl: {
      pattern: /(^|[^\/])(www\.[\S]+(\b|$))/gim,
      replacement: (_, prefix, url) => {
        const encoded = encodeURI(decodeURI(url))
        return `${prefix}<a target="_blank" rel="nofollow" href="https://${encoded}">${url}</a>`
      }
    },
    // e-mail addresses
    email: {
      pattern: /[\w.+]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim,
      replacement: `<a href="mailto:$&">$&</a>`
    },
    // hashtags
    tags: {
      pattern: /\B(#([^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]{1,24}))/gi,
      replacement: `<a href="/t/$2" target="_self" class="hashtag">$1</a>`
    },
    // Упоминание
    mentions: {
      pattern: /\B(@([^\s!#$%^&*()=+.\/,\[{\]};:'"?><]{1,24}))/gi,
      replacement: `<a href="/u/$2" target="_self" class="mention">$1</a>`
    },
    // Спойлер %%текст%%
    spoiler: {
      //pattern: /%%([^%\n]+)%%/g,
      pattern: /%%(.+?)%%/gs,
      replacement: `<span class="spoiler">$1</span>`
    },
    // Цитата
    quote: {
      pattern: /(<br>|^)&gt;\s*(?!\s)([\s\S]*?)(?=<br|$)/gmi, // /^&gt;\s*(\S[\s\S]*?)<br>/g
      replacement: `$1<span class="quote">$2</span>`
    },
    // new lines
    newLines: {
      pattern: /(?:\r\n|\r|\n)/g,
      replacement: `<br>`
    }
  }

  // unescape some HTML
  value = value.replace(/&#39;/gi, "'")
               .replace(/&#34;/gi, '"')

  Object.keys(rules).forEach(key => {
    let rule = rules[key]
    rule.pattern.lastIndex = 0
    value = value.replace(rule.pattern, rule.replacement)
  })

  return value
}

// truncateText - обрезает строку до нужной длинны преобразуя переносы в пробелы и экранируя кавычки
export const truncateText = (value, length = 50) => {
  // unescape some HTML
  value = value.replace(/(?:\r\n|\r|\n)/g, ` `)
  value = value.replace(/<br>/g, ` `)
               .replace(/&#39;/gi, `'`)
               .replace(/&#34;/gi, `"`)

  return value.length > length ? value.substring(0, length) + '...' : value
}