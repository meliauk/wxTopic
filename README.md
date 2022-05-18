<h1 align="center">微信消息通知</h1> 


<p align="center">微信通知，每天给女朋友发早安、情话、诗句、天气信息等</p>

<p align="center">微信通知能力的核心链路已完成，就消息内容而言不限，基于此，可以根据个人需求完成各种私人定制</p>

## 已添加功能

- [x] 每天给女友发早安和土味情话
  - 个人定制化信息
  - 天气信息
  - 每日一言
  - 最美宋词
  - 雷人笑话
  - 土味情话
  - 每日英语
  - 睡前故事

## 开发

需要的变量

```txt
WX_COMPANY_ID= 企业ID
WX_APP_ID= 应用ID
WX_APP_SECRET= 应用 Secret
TIAN_API_KEY= 天行数据 key
```

1. 注册企业微信 => 注册内部应用 => 获取到企业ID/应用ID/应用Secret
2. 注册[天行数据](#数据赋能API)会员 => 申请需要使用的接口 => 获取到接口API和KEY

> 企业微信的注册步骤见该仓库 [juejin-auto-checkin](#感谢)
>
> 本项目目前已使用到的天行数据接口见 [src/api/loveMsg](https://github.com/JS-banana/notify-server/src/api/loveMsg.ts)

### 本地开发

复制 `.env.example`文件重命名为 `.env`，并按照要求填写对应值，可以直接测试

### GitHub部署

如果要通过 `GitHub Action`使用，需要在 `Secrets` 中一一添加变量

![secrets](secrets.png)

GitHub Action每天7:30自动执行，脚本配置如下：[ci.yml](https://github.com/JS-banana/notify-server/blob/master/.github/workflows/goodMorning.yml)

```yml
schedule:
  # `分 时 天 月 周` 时按照标准时间 北京时间=标准时间+8 18表示北京时间早上2点
  # 早上 7:30
  - cron: '30 23 * * *'
```

## 数据赋能API

这里我们可以自己选择第三方开放API进行定制，或者自己定制

> 注：免费开源接口需要考虑服务稳定性！

目前接口数据能力主要由天行数据提供，随便注册一个账户会员即可，无门槛

天行数据：<https://www.tianapi.com/>

- 会员免费接口数量：**15个**
- 每日赠送次数：**100次**

注：如果采取该接口，需要在 **5.添加环境变量**这一步中，再添加Key的变量，作为天行数据接口使用时的必填参数

## 交流

欢迎大家一起交流和分享自己的创意和玩法

## 来自

https://github.com/JS-banana/notify-server

