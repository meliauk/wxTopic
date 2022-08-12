/**
 * @name WXbot
 * @description 获取环境变量参数，执行微信消息通知函数
 */

import dotenv from 'dotenv'
import { getToken } from './getToken'
import {postMsg} from './postMsg'
import axios from 'axios'
import FormData from 'form-data'
import Fs from 'fs'
import Http from 'http'
import Https from 'https'
import {Blob} from "buffer";


// 读取 .env环境变量
dotenv.config()
const { WX_COMPANY_ID, WX_APP_ID, WX_APP_SECRET } = process.env

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
    const option = { ...defaultConfig, ...config }
    console.log("->option",option)
    const res = await postMsg(accessToken, option)
    console.log("->res",res)
    return true
  }
  catch (error) {
    return false
  }
}

//获取语音id
export const getVoiceId = async() => {

  // 获取token
  const accessToken = await getToken({
    id: WX_COMPANY_ID as string,
    secret: WX_APP_SECRET as string,
  })

  // const response = await axios({
  //   url: "http://image.v0710.top/amr.amr",
  //   method: 'GET',
  //   responseType:'blob',
  // })
  let data: any[] = [];
  const response = await Http.get(
      "http://image.v0710.top/amr.amr",
      (res) => {

        // 监听并将二进制数据写入到数组储存
        res.on("data", (chunk) => {
          data.push(chunk);
        });

        // 数据请求完毕后
        res.on("close", () => {
          // 拼接数组中的二进制数据
          const buf = Buffer.concat(data);
          Fs.writeFileSync("D:\\tts.amr", buf);
          return buf;
          // 写入本地文件，完事

        });
      }
  );


  console.log("->response.data",response)
  const formData:any = new FormData();

  // @ts-ignore
  formData.append('media', response, {
    filename: Math.random()+"",
    contentType: 'multipart/form-data',
    filelength: data.length
  });


  const res = await axios({
    url: `https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=${accessToken}&type=voice`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
  })
  console.log("->voice====",response)

  console.log("->res",res)
  return res.data.media_id

}
