/**
 * @name WXbot
 * @description 获取环境变量参数，执行微信消息通知函数
 */

import dotenv from 'dotenv'
import { getToken } from './getToken'
import {postMsg} from './postMsg'
import axios from 'axios'
import FormData from 'form-data'

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
    const res = await postMsg(accessToken, option)
    return true
  }
  catch (error) {
    return false
  }
}

//获取语音id
export const getVoiceId = () => {
  // 获取token
  const accessToken = getToken({
    id: WX_COMPANY_ID as string,
    secret: WX_APP_SECRET as string,
  })
  let newVar = axios({
    url: 'http://fanyi.baidu.com/gettts?spd=3&lan=zh&text=%E8%80%81%E7%8E%8B%E5%95%8A%E8%80%81%E7%8E%8B&source=web',
    method: 'GET',
  });
  const formData:any = new FormData();
  formData.append('media', newVar);
  const response = axios({
    url: `https://qyapi.weixin.qq.com/cgi-bin/media/upload?access_token=${accessToken}&type=voice`,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData,
  })
  return response.media_id;
}
