// 中间件函数插件
const directiveObj = {
  install (Vue) {
    // 创建输入框自动聚焦指令
    Vue.directive('InputFocus', {
      inserted (el) {
        // const inputCol = el.querySelector('input')
        // inputCol.focus()
        // el为原生输入框
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          el.focus()
        } else {
          // el不是输入框
          const thisInput = el.querySelector('input')
          const thisTextarea = el.querySelector('textarea')
          if (thisInput) thisInput.focus()
          if (thisTextarea) thisTextarea.focus()
        }
      },
      // 指令所在标签更新时触发
      update (el) {
        if (el.nodeName === 'INPUT' || el.nodeName === 'TEXTAREA') {
          el.focus()
        } else {
          // el不是输入框
          const thisInput = el.querySelector('input')
          const thisTextarea = el.querySelector('textarea')
          if (thisInput) thisInput.focus()
          if (thisTextarea) thisTextarea.focus()
        }
      }
    })
  }
}

export default directiveObj
