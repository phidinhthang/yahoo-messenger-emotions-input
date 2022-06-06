import emoteData from './emotes.json';
export { emoteData };
export const emoteMap = Object.entries(emoteData).reduce((acc, [id, value]) => {
  value.codes.forEach((code) => {
    acc[code] = id;
  });
  return acc;
}, {} as Record<string, string>);
const emoteCodes = Object.keys(emoteMap);

const emoteRegex = new RegExp(
  emoteCodes
    .map((code) => `(${code.replace(/[()[\]{}*+?^$|#.,\/\\\s-]/g, '\\$&')})`)
    .sort((a, b) => b.length - a.length)
    .join('|'),
  'g'
);

const getType = (str: string) => {
  if (str.match(emoteRegex)) {
    return {
      type: 'emote' as const,
      value: str,
      raw: str,
    };
  }

  return str;
};

export const parseText = (text: string) => {
  const vals = text.split(emoteRegex).filter((v) => Boolean(v));

  return vals.map((e) => getType(e));
};
