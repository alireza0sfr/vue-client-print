import en from './locales/en.json';
import fa from './locales/fa.json';

const messages = {
  en,
  fa
}

export function fetchLangList() {
  return Object.keys(messages)
}
export default messages