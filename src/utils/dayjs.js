import dayjs from 'dayjs'
import 'dayjs/locale/ja'

import relativeTime from 'dayjs/plugin/relativeTime'
import advancedFormat from 'dayjs/plugin/advancedFormat'

dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)

export const isToday = (date) => dayjs().diff(date, 'day') === 0
export const isYesterday = (date) => dayjs().subtract(1, 'day').diff(date, 'day') === 0

export default dayjs
