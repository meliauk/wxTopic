/**
 * @name goodEvening
 * @description 说晚安
 */
import API from '../../api/loveMsg'
import {getVoiceId, wxNotify} from '../WxNotify'
import { newsTemplate } from './templates/news'
import { voiceTemplate } from './templates/voice'

// 获取新闻
const getNews = async() => {
  try {
    // 每日简报
    // const dailyBriefing = await API.getDailyBriefing()
    // const formateData: TodayHeadlines[] = dailyBriefing.map((n) => ({
    //   ...n,
    //   title: n.title,
    //   description: n.digest,
    //   picUrl: n.imgsrc,
    //   ctime: n.mtime,
    // }))
    // 今日头条
    const todayTopNews = await API.getTianTopNews()

    // 每次信息最多8个
    // 设定发送两次一共16个信息，数据如果不够则请求另一个接口
    let result: any = []
    const len = todayTopNews.length

    if (len >= 16) {
      // 则这条接口满足条件 2 * 8 = 16
      result = todayTopNews.slice(0, 16)
    }
    else {
      // 取 0- 8 条
      result = todayTopNews.slice(0, len >= 8 ? 8 : len)
      // 数据不够，请求另一个接口
      const dailyBriefing = await API.getDailyBriefing()
      const formateData: TodayHeadlines[] = dailyBriefing.map(n => ({
        ...n,
        title: n.title,
        description: n.digest,
        picUrl: n.imgsrc,
        ctime: n.mtime,
      }))

      // 已经有8条
      if (result.length === 8) {
        result = [
          ...result,
          ...formateData.slice(0, formateData.length >= 8 ? 8 : formateData.length),
        ]
      }

      // 少于 8 条数据的情况
      if (result.length < 8) {
        const sencondLen = result.length + formateData.length
        if (sencondLen >= 16)
          result = [...result, ...formateData.slice(result.length, 16)]
        else
          result = [...result, ...formateData.slice(result.length, formateData.length)]
      }
    }

    // 发送消息
    const times = Math.ceil(result.length / 8)
    for (let i = 0; i < times; i++) {
      const start = 8 * i
      const end = 8 * i + 8 < result.length ? 8 * i + 8 : result.length

      const template = newsTemplate(result.slice(start, end))
      await wxNotify(template)
    }
  }
  catch (error) {
  }
}

// 获今日取故事
const getStory = async() => {
  const res = await API.getStorybook()
  const template = {
    msgtype: 'text',
    text: {
      content: `今日的睡前故事来喽：
🌑🌒🌓🌔🌕🌝😛\n
『${res.title}』
${res.content}`,
    },
  }

  await wxNotify(template)
}


//今日故事转语音
const getVoice = async() => {
  //上传文件
  const voice = voiceTemplate(await getVoiceId())
  // const voice = voiceTemplate("3RFu8TUdFZ1zn4-OW_SR5P4Byxxp9CApxxf7028MkfKcZTXzCJsSTX7Afn2gDi9Lv")
  await wxNotify(voice)
}

// 执行函数
export const goodEvening = async() => {
  await getStory()
  await getVoice()
  //新闻
  // await getNews()
}
