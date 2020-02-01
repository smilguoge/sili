
/**
 * 固定末尾小数点
 * @param num
 * @param b
 * @returns {string}
 */
export function toFixedNum(num, b) {
  b = b > 0 ? b : 0

  if (num instanceof String || typeof num === 'string') { num = num * 1 }
  if (num instanceof Number || typeof num === 'number') { return num.toFixed(b) }
  return (0).toFixed(b)
}
