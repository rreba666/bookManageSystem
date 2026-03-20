     // 封装防抖函数
      // 实现原理：创建一个定时器，在指定的时间间隔之后运行代码。
      // 当在n 秒内再次触发事件时，会自动清除上一次的时间器，再重新等待 n 秒后再执行。
      function debounce(fn, wait = 400) {
        let timer // 闭包变量，为了保存上一次时间器变量
        return function (...arg) {
          // 记录当前事件调用者，便于下面的fn调用
          let _this = this
          if (timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(function () {
            fn.apply(_this, arg)
          }, wait)
        }
      }