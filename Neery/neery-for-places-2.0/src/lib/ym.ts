/**
 * Number of months, AD
 * 
 * Used for easy comparison of year and month of dates,
 * and also for sanely iterating month ranges.
 * 
 * @param {Date} date Date
 * @returns {number} YM value
 */
export function ym(date: Date) {
  return date.getFullYear() * 12 + date.getMonth();
}

/**
 * Extracts year from a YM value.
 * 
 * @param {number} ym YM value
 * @returns {number} Full year
 */
export function y(ym: number) {
  return Math.floor(ym / 12);
}

/**
 * Extracts month from a YM value.
 * 
 * @param {number} ym YM value
 * @returns {number} Month (0-based)
 */
export function m(ym: number) {
  return ym % 12;
}
