/**
 * @name WXbot
 * @description 获取环境变量参数，执行微信消息通知函数
 */

import dotenv from 'dotenv'
import {getToken} from './getToken'
import {postMsg} from './postMsg'
import axios from 'axios'
import FormData from 'form-data'
import {voiceTemplate} from "../LoveMsg/templates/voice";


// 读取 .env环境变量
dotenv.config()
const {WX_COMPANY_ID, WX_APP_ID, WX_APP_SECRET} = process.env

// 主函数
export async function wxNotify(config: any) {
    try {
        // 获取token
        const accessToken = await getToken({
            id: WX_COMPANY_ID as string,
            secret: WX_APP_SECRET as string,
        })

        // 发送消息
        const defaultConfig = {
            msgtype: 'text',
            agentid: WX_APP_ID,
            ...config,
        }
        const option = {...defaultConfig, ...config}
        console.log("->option", option)
        const res = await postMsg(accessToken, option)
        console.log("->res", res)
        return true
    } catch (error) {
        return false
    }
}

function toBuffer(ab:ArrayBuffer,len:number) {

    console.log("->1111 ",len)
    var buf =  Buffer.alloc(len)
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

//获取语音id
// @ts-ignore
export const getVoiceId = async(text:string,accessToken:string) => {

    const formData:any = new FormData();
    var buffer;
    //little_idea项目
    //https://v0710.top/app/ms/tts?text=
    //http://localhost:1004/app/ms/tts?text=
    await axios.get("https://v0710.top/app/ms/tts?text="+encodeURI(text),{responseType:'arraybuffer'}).then(res=>{
        // buffer = toBuffer(res.data,res.data.length);
        buffer = Buffer.from(res.data);
        // Fs.writeFileSync("D:\\tts.amr", buffer)
    });

    // var buffer = Fs.readFileSync("C:\\Users\\MEliauk\\Desktop\\cognitive-services-speech-sdk-master\\test111.amr");

    formData.append('media', buffer, {
        filename: Math.random()+"",
        contentType: 'multipart/form-data',
        knownLength: buffer.length
    });
    const res = axios({
        url: `https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=${accessToken}&type=voice`,
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data: formData,
    }).then(res=>{

        console.log("->res1111", res.data)
        wxNotify(voiceTemplate(res.data.media_id))
        return  res.data.media_id;
    })

}

