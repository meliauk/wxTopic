/**
 * @name goodEvening
 * @description 说晚安
 */
import API from '../../api/loveMsg'
import {getVoiceId, wxNotify} from '../WxNotify'
import {newsTemplate} from './templates/news'
import {getToken} from "../WxNotify/getToken";

// 读取 .env环境变量
const {WX_COMPANY_ID, WX_APP_ID, WX_APP_SECRET} = process.env

// 获取新闻
const getNews = async () => {
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
        } else {
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
    } catch (error) {
    }
}

// 获今日取故事
const getStory = async () => {
    const res = await API.getStorybook()
    const template = {
        msgtype: 'text',
        text: {
            content: `🌑🌒🌓🌔🌕🌝😛 今天的故事是：${res.title}』`,
        },
    }

    await wxNotify(template)
    return res
}


//今日故事转语音
const getVoice = async (text: StorybookProps | undefined) => {
    //上传文件
    // await getVoiceId();
    const {subscriptionKey, serviceRegion, language, filename} = process.env;
    // const voice = voiceTemplate(await getVoiceId())
    // tts({subscriptionKey, serviceRegion, language}, filename, "你在干嘛啊", async (voiceBufferData:ArrayBuffer)=>{
    //
    // });

    let texts:string[] = []
    let content = text.content;

    texts.push("晚上好呀,今日的睡前故事来喽,今天的故事是："+text.title)

    for (let i = 0; i <content.length ; i+=150) {
        let items = content.slice(i,i+150);
        items.replaceAll(" ","")
        items.replaceAll("&hellip;","")
        items.replaceAll("&nbsp;","")
        texts.push(items)
    }


    // 获取token
    const accessToken = await getToken({
        id: WX_COMPANY_ID as string,
        secret: WX_APP_SECRET as string,
    })

    console.log("->语音条数：",texts.length)
    for (let i = 0; i < texts.length; i++) {
        console.log("->====",texts[i])
        await getVoiceId(texts[i], accessToken);
    }


    // const voice = voiceTemplate(voiceId)
    // console.log("->voice",voice)
    // await wxNotify(voice)


}

// 执行函数
export const goodEvening = async () => {
    // await getVoice(await getStory())
    //新闻
    await getNews()
}
