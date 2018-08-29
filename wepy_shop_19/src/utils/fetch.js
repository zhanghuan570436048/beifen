
import wepy from 'wepy'

const BASE_URL = 'https://www.zhengzhicheng.cn/'
// fetch函数就是对wx.request的封装
export const fetch = ({url, method = 'GET', data, header}) => {
  wepy.showLoading({
    title: '正在拼命加载中...', // 提示的内容,
    mask: true // 显示透明蒙层，防止触摸穿透
  })

  return new Promise((resolve, reject) => {
    wepy.request({
      url: `${BASE_URL}${url}`, // 开发者服务器接口地址",
      method,
      data, // 请求的参数",
      header,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      },
      complete: () => {
        wepy.hideLoading()
      }
    })
  })
}
