/**
 * @name goodMorning
 * @description 说早安
 */
import API from '../../api/loveMsg'
import { wxNotify } from '../WxNotify'
import { textTemplate } from './templates/text'
import { textCardTemplate } from './templates/textcard'

// 美丽短句
const goodWord = async() => {
  try {
    // 并行请求，优响相应
    const dataSource = await Promise.allSettled([
      API.getSaylove(), // 土味情话
      API.getCaihongpi(), // 彩虹屁
      API.getOneWord(), // 一言
      API.getSongLyrics(), // 最美宋词
      API.getOneMagazines(), // one杂志
      API.getNetEaseCloud(), // 网易云热评
      API.getDayEnglish(), // 每日英语
    ])

    // 过滤掉异常数据
    const [sayLove, caiHongpi, oneWord, songLyrics, oneMagazines, netEaseCloud, dayEnglish]
      = dataSource.map(n => (n.status === 'fulfilled' ? n.value : null))

    // 对象写法
    const data: any = {
      sayLove,
      caiHongpi,
      oneWord,
      songLyrics,
      oneMagazines,
      netEaseCloud,
      dayEnglish,
    }

    const template = textTemplate(data)

    await wxNotify(template)
  }
  catch (error) {
    console.log("---美丽短句>" , error)
  }
}

// 天气信息
const weatherInfo = async() => {
  //TODO 天气
  const weather = await API.getWeather('双流')
  if (weather) {
    const lunarInfo = await API.getLunarDate(weather.date)
    const oneWord = await API.getOneWord()
    const template = textCardTemplate({ ...weather, lunarInfo, oneWord })

    // 发送消息
    await wxNotify(template)
  }
}

// goodMorning
export const goodMorning = async() => {
  await weatherInfo()
  await goodWord()
}
