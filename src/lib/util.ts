import dayjs from 'dayjs'
export default {
  formatSeconds (second : number) : string {
    const oneHour = 60 * 60
    const oneDay = oneHour * 24
    const days = parseInt(second / oneDay)
    const hours = parseInt(second % oneDay / oneHour)
    const minuts = parseInt(second % oneHour / 60)
    const seconds = parseInt(second % 60)
    const zeroPad = (num, places) => String(num).padStart(places, '0')
    return [
      days ? days + 'd ' : '',
      hours ? zeroPad(hours, 2) + ':' : '00:',
      minuts ? zeroPad(minuts, 2) + ':' : '00:',
      seconds ? zeroPad(seconds, 2) + '' : '00'
    ]
      .join('')
      .replace(/\b(\d)\b/g, '0$1') // 自动补零
      .replace(/(\s00\s([^\s]+))?/g, '') // 移除 00 时间
  },
  formatTime (nS : number, format  = 'YYYY-MM-DD hh:mm:ss') : string {
    return dayjs(nS).format(format)
  },
  formatBytes: (n : number, d : number = 1) : string => {
    // set defaults
    if (typeof n !== 'number' || isNaN(n) || n == 0) return '0 B'

    if (!d || typeof d !== 'number') d = 1
    // set scale index 1000,100000,... becomes 1,2,...
    const i = Math.floor(Math.floor(Math.log(n) * Math.LOG10E) / 3)
    // set rounding factor
    const f = Math.pow(10, d)
    // scale n down and round
    const s = Math.round(n / Math.pow(10, i * 3) * f) / f
    // concat (no trailing 0s) and choose scale letter
    return (
      s.toString().replace(/\.0+$/, '') +
      ' ' +
      ['', 'K', 'M', 'G', 'T', 'P', 'Z'][i] +
      'B'
    )
  }
}
