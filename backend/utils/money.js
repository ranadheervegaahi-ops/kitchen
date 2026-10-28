// Safe money handling — avoid floating point errors
const toFixed2 = (val) => Math.round(Number(val) * 100) / 100;
const isValidPrice = (val) => typeof val === "number" && isFinite(val) && val >= 0;
const multiply = (price, qty) => toFixed2(price * qty);
const add = (...vals) => toFixed2(vals.reduce((a, b) => a + b, 0));

module.exports = { toFixed2, isValidPrice, multiply, add };
