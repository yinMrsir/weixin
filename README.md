# 基于koa2的微信公众号开发及小程序接口开发

### 运行项目
``` bash
 npm install

 node app
```

### 当前实现的功能
#### 微信公众号 (不使用小程序接口需将app.js中 db(app)注释 )
- [√] 关注公众号获取用户信息并自动回复消息
- [√] 根据用户发送的消息自动回复
- [√] 自定义菜单
- [√] 接入微信JS-SDK实现分享功能(请在微信中打开并关注微信测试号：http://wx.yinchunyu.com/weixin/share)
- 其他功能均可结合现有代码及微信开发者文档实现(https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1472017492_58YV5)

##### 关注测试号体验
![关注微信测试号体验](http://wx.yinchunyu.com/images/ceshihao.jpg)

#### 小程序 (小程序demo移步至：https://github.com/yinMrsir/xcx-cli)
- [√] 登录
- [√] 获取微信步数