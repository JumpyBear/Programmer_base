// 此文件封装3个方法,专门操作token
// 目的:代码更清晰,以后修改更方便
// 设置
const key = 'FlappyBear'
export const setToken = (token) => {
  return localStorage.setItem(key, token)
}

// 获取
export const getToken = () => {
  return localStorage.getItem(key)
}

// 删除
export const removeToken = () => {
  return localStorage.removeItem(key)
}
