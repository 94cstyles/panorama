// 浏览器前缀
const prefixes = ['', '-webkit-', '-moz-', '-o-', '-ms-']

/**
 * CSS测试 来至于: modernizr.com
 * @param rule {String} cssCode 测试规则
 * @param callback {Function} 回调函数
 * @returns {boolean}
 */
const testStyles = function (rule, callback) {
  const style = document.createElement('style')
  style.type = 'text/css'
  style.textContent = rule
  const div = document.createElement('div')
  div.id = 'testStyle'

  document.body.appendChild(style)
  document.body.appendChild(div)

  const ret = callback(div, rule)

  document.body.removeChild(style)
  document.body.removeChild(div)

  return !!ret
}

/**
 * 客户端探测器 探测API支持
 * @type {{
 *  webgl: {Boolean} 是否支持webGL,
 *  touch: {Boolean} 是否支持touch事件
 * }}
 */
const detector = {
  webgl: (function () {
    try {
      const canvas = document.createElement('canvas')
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
    } catch (e) {
      return false
    }
  })(),
  touch: (function () {
    let bool
    if ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
      bool = true
    } else {
      const query = ['@media (', prefixes.join('touch-enabled),('), 'heartz', ')', '{#testStyle{top:9px;position:absolute}}'].join('')
      testStyles(query, function (node) {
        bool = node.offsetTop === 9
      })
    }
    return bool
  })()
}

export default detector
