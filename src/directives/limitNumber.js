export default {
  // 限制只能输入正数
  limitNum: {
    bind(el) {
      el.handler = function (e) {
        let target = e.target || e.srcElement
        if (target.value) {
          target.value = target.value.replace(/[^\d\.]/g, '')
        }
      }
      el.addEventListener('input', el.handler)
    },
    unbind: function (el) {
      el.removeEventListener('input', el.handler)
    }
  }
}
