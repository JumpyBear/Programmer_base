// 在生产环境中剔除console语句
if (process.env.NODE_ENV === 'production') {
  console.log = function () {}
  console.warning = function () {}
  console.dir = function () {}
  console.error = function () {}
}
