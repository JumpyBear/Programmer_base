// 统一封装接口方法
// 每个方法负责请求一个url地址，逻辑页面只需要引入此方法就能调用接口了
// 请求url路径可以在这里统一管理
import request from '@/utils/request'
import { getStorage } from '@/utils/storage'
// import { getToken } from '@/utils/token'

// 登录页面-登录接口
// axios内部会把参数对象转成json字符串发送给后台
// axios会自动携带请求参数(headers)里
// Content-Type: 'application/json' 帮你添加好
export const loginAPI = ({ mobile, code }) => request({
  url: '/v1_0/authorizations',
  method: 'POST',
  data: {
    mobile,
    code
  }
})

// 用户-刷新token
export const refreshTokenAPI = () => request({
  url: '/v1_0/authorizations',
  method: 'PUT',
  // 请求拦截器携带的是token,而这次请求需要携带的是refresh_token
  headers: {
    Authorization: 'Bearer ' + getStorage('refresh_token')
  }
})

// 频道-获取频道
export const getAllChannelsAPI = () => request({
  url: '/v1_0/channels',
  method: 'GET'
})

// 频道-更新频道
export const updateChannelsAPI = ({ channels }) => request({
  url: '/v1_0/user/channels',
  method: 'PUT',
  data: {
    // 用户已选频道数组
    channels
  }
})

// 频道-获取用户选择的频道
// 用户不登陆，返回默认频道页
export const getUserChannelsAPI = () => request({
  url: '/v1_0/user/channels',
  method: 'GET'
  // 请求头
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // }
})

// 获取文章列表
export const getAllArticleListAPI = ({ channel_id, timestamp }) => request({
  url: '/v1_0/articles',
  method: 'GET',
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // },
  // axios会帮助拼接到URL？后面（查询字符串）
  params: {
    channel_id,
    timestamp
  }
})

// 文章-获取文章详情
export const getDetailAPI = ({ id }) => request({
  url: `/v1_0/articles/${id}`,
  method: 'GET'
})

// 文章不感兴趣反馈
export const dislikeArticleAPI = ({ artId }) => request({
  url: '/v1_0/article/dislikes',
  method: 'POST',
  data: {
    target: artId
  }
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // }
})

// 文章反馈-垃圾内容等
export const reportArticleAPI = ({ artId, type }) => request({
  url: '/v1_0/article/reports',
  method: 'POST',
  data: {
    target: artId,
    type: type,
    remark: '举报的问题'
  }
  // headers: {
  //   Authorization: `Bearer ${getToken()}`
  // }
})

// 文章-评论列表
export const getCommentListAPI = ({ id, offset = null, limit = 10 }) => request({
  url: '/v1_0/comments',
  method: 'GET',
  params: {
    // a表示对文章的评论
    type: 'a',
    // id：文章id
    source: id,
    // 偏移量
    offset,
    // 每页限制
    limit
  }
})

// 文章-点赞
export const likeItAPI = ({ commId }) => request({
  url: '/v1_0/comment/likings',
  method: 'POST',
  data: {
    target: commId
  }
})

// 文章-取消点赞
export const dislikeAPI = ({ id }) => request({
  url: `/v1_0/comment/likings/${id}`,
  method: 'DELETE'
})

// 文章评论-发布评论
export const sendCommentAPI = ({ artId, content }) => request({
  url: '/v1_0/comments',
  method: 'POST',
  data: {
    target: artId,
    content
  }
})

// 频道-输入框联想菜单
export const suggestListAPI = ({ keywords }) => request({
  url: '/v1_0/suggestion',
  method: 'GET',
  params: {
    q: keywords
  }
})

// 搜索-搜索结果页
export const SearchResultAPI = ({ q, page }) => request({
  url: '/v1_0/search',
  method: 'GET',
  params: {
    q,
    page
  }
})

// 用户- 关注
export const authorFollowAPI = ({ authorId }) => request({
  url: '/v1_0/user/followings',
  method: 'POST',
  data: {
    target: authorId
  }
})

// 用户- 取消关注
export const authorUnfollowAPI = ({ authorId }) => request({
  url: `/v1_0/user/followings/${authorId}`,
  method: 'DELETE'
})

// 用户 - 点赞
export const thumbUpAPI = ({ artId }) => request({
  url: '/v1_0/article/likings',
  method: 'POST',
  data: {
    target: artId
  }
})

// 用户 - 取消点赞
export const thumbDownAPI = ({ artId }) => request({
  url: `/v1_0/article/likings/${artId}`,
  method: 'DELETE'
})

// 用户-获取基本信息
export const getUserInfoAPI = () => request({
  url: '/v1_0/user',
  method: 'GET'
})

// 用户- 个人资料(获取个人信息)
export const userProfileAPI = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}

// 用户-更新头像
export const userUpdateImg = (fd) => request({
  url: '/v1_0/user/photo',
  method: 'PATCH',
  data: fd // 外面一会传进来的new FormData()表单对象
})

// 用户-更新基本资料
export const updateUserInfoAPI = (dataObj) => {
  const obj = {
    name: '',
    birthday: ''
  }

  for (const prop in obj) { // 遍历参数对象的每一个key
    if (dataObj[prop] === undefined) { // 从外面传入的参数对象匹配，如果没有传入，
      delete obj[prop] // 从obj身上移除这对属性
    } else {
      obj[prop] = dataObj[prop] // 否则则将外面对象的key对应的值传给obj
    }
  }

  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH', // 局部更新 PUT（全部更新）
    data: obj
    // data: {
    //   birthday, // 生日 年-月-日
    //   name // 名字
    // }
  })
}
