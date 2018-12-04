import moment from 'moment'

// SEE: https://gist.github.com/dunn/0a4082597eede80e5a57
export const fromTwitterDate = (date) => moment(date, 'ddd MMM D HH:mm:ss ZZ YYYY')

export const isToday = (date) => moment().startOf('day').isSame(date, 'day')
export const isYesterday = (date) => {
  const yesterday = moment().startOf('day').subtract(1, 'day')
  return date.isSame(yesterday, 'day')
}
export const isThisYear = (date) => moment().startOf('year').isSame(date, 'year')

export default moment
