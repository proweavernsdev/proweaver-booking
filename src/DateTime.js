import axios from 'axios'

let UTCObj = {}
const timeZoneOffset = -300

export async function getUTCTime() {
  let res = await axios.get(`${import.meta.env.VITE_APIURL}/datetime-curl.php`)

  UTCObj = res.data
  UTCObj.datetime_easy = UTCObj.utc_datetime
    .replace('T', ' ')
    .replace('Z', '')
    .match(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/g)[0]
  UTCObj.clientOffset = Date.now() - new Date(UTCObj.datetime_easy).getTime()

  UTCObj.clientOffset = Math.round(UTCObj.clientOffset / 60000) * 60000
}

export default class DateFunc {
  get date() {
    return this.dateObj.getUTCDate()
  }
  get day() {
    return this.dateObj.getUTCDay()
  }
  get year() {
    return this.dateObj.getUTCFullYear()
  }
  get hours() {
    return this.dateObj.getUTCHours()
  }
  get milliseconds() {
    return this.dateObj.getUTCMilliseconds()
  }
  get minutes() {
    return this.dateObj.getUTCMinutes()
  }
  get month() {
    return this.dateObj.getUTCMonth()
  }
  get seconds() {
    return this.dateObj.getUTCSeconds()
  }
  get time() {
    return this.dateObj.getUTCTime()
  }
  get timezoneOffset() {
    return UTCObj.clientOffset
  }
  get sql() {
    return this.iso
      .replace('T', ' ')
      .match(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/g)[0]
  }

  get iso() {
    return this.dateObj.toISOString()
  }

  setDate(date) {
    return this.dateObj.setDate(date)
  }
  setDay(day) {
    return this.dateObj.setDay(day)
  }
  setYear(year) {
    return this.dateObj.setFullYear(year)
  }
  setHours(hours) {
    return this.dateObj.setHours(hours)
  }
  setMilliseconds(milliseconds) {
    return this.dateObj.setMilliseconds(milliseconds)
  }
  setMinutes(minutes) {
    return this.dateObj.setMinutes(minutes)
  }
  setMonth(month) {
    return this.dateObj.setMonth(month)
  }
  setSeconds(seconds) {
    return this.dateObj.setSeconds(seconds)
  }
  setTime(time) {
    return this.dateObj.setTime(time)
  }

  entries = []

  constructor(
    yearOrDateString = null,
    month = null,
    day = null,
    hours = 0,
    minutes = 0,
    seconds = 0
  ) {
    this.entries = [yearOrDateString, month, day, hours, minutes, seconds]
    if (yearOrDateString == null || yearOrDateString == '') {
      this.yearOrDateString = yearOrDateString
      this.dateObj = new Date()
    } else if (month != null) {
      this.dateObj = new Date(yearOrDateString, month, day, hours, minutes, seconds)
      this.yearOrDateString = yearOrDateString
    } else {
      if (typeof yearOrDateString == 'string') yearOrDateString = yearOrDateString.trim()
      if (
        typeof yearOrDateString == 'string' &&
        (yearOrDateString.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g) ||
          yearOrDateString.match(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/g))
      ) {
        yearOrDateString = yearOrDateString.replace(/-00-/g, '-01-')

        yearOrDateString += ' 00:00:00'
      }

      this.dateObj = new Date(yearOrDateString)
      this.yearOrDateString = yearOrDateString
    }
  }

  utc() {
    let [yearOrDateString, month, day, hours, minutes, seconds] = this.entries
    if (yearOrDateString == null || yearOrDateString == '') {
      this.yearOrDateString = yearOrDateString
      this.dateObj = new Date()
    } else if (month != null) {
      this.dateObj = new Date(yearOrDateString, month, day, hours, minutes, seconds)
      this.yearOrDateString = yearOrDateString
    } else {
      if (typeof yearOrDateString == 'string') yearOrDateString = yearOrDateString.trim()
      if (
        typeof yearOrDateString == 'string' &&
        (yearOrDateString.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g) ||
          yearOrDateString.match(/^[0-9]{2}-[0-9]{2}-[0-9]{4}$/g))
      ) {
        yearOrDateString = yearOrDateString.replace(/-00-/g, '-01-')

        yearOrDateString += ' 00:00:00'
      }

      this.dateObj = new Date(yearOrDateString)
      this.yearOrDateString = yearOrDateString
    }

    this.dateObj.setTime(this.dateObj.getTime() - UTCObj.clientOffset)
    return this
  }

  offset() {
    this.utc()
    const timeOffset = timeZoneOffset * 60 * 1000
    this.offsetMS = timeOffset
    this.dateObj.setTime(this.dateObj.getTime() + timeOffset)
    return this
  }

  format(format) {
    const dater = new Date(this.dateObj.getTime() + UTCObj.clientOffset)
    const dateTime = dater
      .toISOString()
      .replace('T', ' ')
      .match(/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/g)[0]
    const monthsOfTheYear = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    const monthsOfTheYearFull = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    let [y, m2, D, H, M, S] = dateTime.split(/[/:,\s-]/).filter((el) => el != '' && el != null)

    const m_ = m2.replace(/^0/g, '')
    const sm = monthsOfTheYear[parseInt(m_) - 1]
    const lm = monthsOfTheYearFull[parseInt(m_) - 1]
    const [d, H1, m, s] = [
      D.replace(/^0/g, ''),
      H.replace(/^0/g, ''),
      M.replace(/^0/g, ''),
      S.replace(/^0/g, '')
    ]
    const A = parseInt(H) >= 12 ? 'PM' : 'AM'
    const h1 = parseInt(H) == 0 ? '12' : parseInt(H) > 12 ? parseInt(H) - 12 : parseInt(H)
    const h = h1 < 10 ? '0' + h1 : h1
    let a = A.toLowerCase()

    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]

    const replacements = [
      { pattern: /%M/g, value: m2 },
      { pattern: /%m/g, value: m_ },
      { pattern: /%lm/g, value: lm },
      { pattern: /%sm/g, value: sm },
      { pattern: /%d/g, value: d },
      { pattern: /%D/g, value: D },
      { pattern: /%y/g, value: y },
      { pattern: /%h1/g, value: h1 },
      { pattern: /%H1/g, value: H1 },
      { pattern: /%h/g, value: h },
      { pattern: /%H/g, value: H },
      { pattern: /%i/g, value: m },
      { pattern: /%I/g, value: M },
      { pattern: /%s/g, value: s },
      { pattern: /%S/g, value: S },
      { pattern: /%A/g, value: A },
      { pattern: /%a/g, value: a },
      { pattern: /%w/g, value: daysOfWeek[dater.getUTCDay()] },
      { pattern: /%sw/g, value: daysOfWeek[dater.getUTCDay()].substring(0, 3) }
    ]

    for (const { pattern, value } of replacements) format = format.replace(pattern, value)

    return format
  }
}
