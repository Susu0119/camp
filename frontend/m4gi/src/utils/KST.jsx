// 한국 표준시(UTC+9)로 변환하여 ISO-8601(YYYY-MM-DDTHH:mm:ss) 문자열 반환
export const getKSTDateTime = (date = new Date()) => {
    const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${kst.getUTCFullYear()}-${pad(kst.getUTCMonth() + 1)}-${pad(kst.getUTCDate())}T${pad(kst.getUTCHours())}:${pad(kst.getUTCMinutes())}:${pad(kst.getUTCSeconds())}`;
}; 