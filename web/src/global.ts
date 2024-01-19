import dayjs from 'dayjs';
import zhCN from 'dayjs/locale/zh-cn';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import 'normalize.css';

dayjs.locale(zhCN);
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(localeData);
dayjs.extend(dayOfYear);
