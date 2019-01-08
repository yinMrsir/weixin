# 基于koa2的微信公众号开发及小程序接口开发(持续更新中...)

### 关注测试号体验
![关注测试号体验](http://wx.yinchunyu.com/images/ceshihao.jpg)

### 运行项目
``` bash
 npm install

 node app
```

#### 当前实现的功能
##### 微信公众号
- [√] 关注公众号获取用户信息并自动回复消息
- [√] 根据用户发送的消息自动回复
- [√] 接入微信JS-SDK实现分享功能(http://wx.yinchunyu.com/)

##### 小程序 (使用小程序功能请先开启mongodb, 并将app.js中 db(app)打开 )
- [√] 登录
``` bash
 接口地址：/cxc/login
 参数：
 jsonData：通过button(open-type="userinfo") 获取
 code: wx.login 获取
 返回：
 用户信息及auth( auth为每次请求从headers中带入 )
```
- [√] 获取微信步数