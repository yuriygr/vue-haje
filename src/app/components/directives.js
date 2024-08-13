const clickOutside = {
  beforeMount(el, binding) {
    el.clickOutsideEvent = event => {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        binding.value(event, el)
      }
    };
    document.addEventListener("click", el.clickOutsideEvent)
  },

  unmounted(el) {
    document.removeEventListener("click", el.clickOutsideEvent)
  },

  stopProp(event) { event.stopPropagation() }
}

const CropHighText = {
  beforeMount(el, binding, vnode) {
    let data = binding.value
    if (data.on)
      return
    vnode.context.$nextTick(() => {
      if (el.offsetHeight >= data.height) {
        el.classList.add(data.class)
        el.style.maxHeight = data.height + 'px'
      }
    })
  }
}

const contentFormat = (value) => {
  let
    // http://, https://, ftp://
    urlPattern = /\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,

    // www. sans http:// or https://
    pseudoUrlPattern = /(^|[^\/])(www\.[\S]+(\b|$))/gim,

    // e-mail addresses
    emailAddressPattern = /[\w.+]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,6})+/gim,

    // new lines
    newLinesPattern = /(?:\r\n|\r|\n)/g,

    // hashtags
    tagsPatter = /\B(#([^\s!@#$%^&*()=+.\/,\[{\]};:'"?><]{1,24}))/gi,

    // hashtags
    mentionsPatter = /\B(@([^\s!#$%^&*()=+.\/,\[{\]};:'"?><]{1,24}))/gi

  return value
    .replace(tagsPatter, `<a href="/t/$2" target="_self">$1</a>`)
    .replace(mentionsPatter, `<a href="/u/$2" target="_self">$1</a>`)
    .replace(urlPattern, `<a target="_blank" rel="nofollow" href="$&">$&</a>`)
    .replace(pseudoUrlPattern, `$1<a target="_blank" rel="nofollow" href="https://$2">$2</a>`)
    .replace(emailAddressPattern, `<a href="mailto:$&">$&</a>`)
    .replace(newLinesPattern, `<br />`)
}


const markText = {
  beforeMount(el, binding, vnode) {
    el.innerHTML = contentFormat(el.innerText)
  },

  unmounted(el) {

  }
}

let directives = { clickOutside, markText, CropHighText }

export default new class {
  install(app) {
    Object.keys(directives).forEach((key) => {
      app.directive(key, directives[key])
    })
  }
}