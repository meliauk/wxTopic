import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(duration)
dayjs.extend(LocalizedFormat)

const WEEKS: { [key: number]: string } = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  0: '星期日',
}

export const weekToday = () => {

  var a = new Array("日", "一", "二", "三", "四", "五", "六");
  var currTimestamp =  new Date().getTime()
  var targetTimestamp = currTimestamp + 8 * 3600 * 1000;
  var targetDateTime = new Date(targetTimestamp);
  var week = targetDateTime.getDay();
  return "星期"+ a[week]

  // const week = dayjs().get('days')
  // return WEEKS[week]
}

export default dayjs
