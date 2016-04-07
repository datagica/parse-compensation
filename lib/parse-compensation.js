'use strict';

class ParseCompensation {

  constructor() {

    this.pattern = new RegExp(

      `(?:`+
        // french
        `salaire|salaire brut|salaire annuel|salaire annuel brut|rémunération|rémunération brute|`+

        // english
        `gross salary|salary|compensation|remuneration|wage|pay|`+

        // chinese
        `报酬|酬金|待遇|薪水|工钱|` +

        // japanese
        `給与|給料|サラリー|俸祿|報酬|`+

        // russian
        `платить|заработная плата|зарплата|вознаграждение|`+

        // spanish
        `salario|sueldo|remuneración|` +

        // portuguese
        `salário|remuneração|remunerações|vencimento|ordenado` +

      `)`+

      // separator between the label and the actual value
      `(?:\\s*:)?\\s*`+

      // possible values
      `(?:` +
        `(?:\\$|USD)\\s{0,1}([1-9][0-9][0-9]?(?:(?:\\.|,)[0-9])?)\\s?K` +
      `|` +
        `(?:£|GBP)\\s{0,1}([1-9][0-9][0-9]?(?:(?:\\.|,)[0-9])?)\\s?K` +
      `|` +
        `([1-9][0-9][0-9]?(?:(?:\\.|,)[0-9])?)\\s?K\\s{0,2}(?:€|EUR)` +
      `|` +
        `([1-9][0-9][0-9]?(?:(?:\\.|,)[0-9])?)\\s?K\\s?CNY` +
      `|` +
        `(?:¥|JPY)\\s?([1-9][0-9]?(?:(?:\\.|,)[0-9])?)\\s?M` +
      `|` +
        `([1-9][0-9]?(?:(?:\\.|,)[0-9])?)\\s?M\\s?(?:₽|RUB)` +
      `|` +
        `([1-9][0-9]?[0-9]?(?:(?:\\.|,)[0-9])?)\\s?K\\s?(?:Mex\\$|MXN)` +
      `|` +
        `(?:BRL|R\\$)\\s?([1-9][0-9]?[0-9]?(?:(?:\\.|,)[0-9])?)\\s?K` +
      `)`, "gi"
    )
  }


  parseValue(str){
    return parseFloat(`${str}`.replace(/[, ]/g,'.'));
  }
  parse(input) {

    let text = ""
    if (typeof input === 'string') {
      text = input
    } else if (typeof input.text === 'string') {
      text = input.text
    } else {
      return Promise.reject(new Error(`input is not text but ${typeof input}`))
    }

    text = " " + text + " "

    let match, results = [];
    while ((match = this.pattern.exec(text)) !== null) {
      const usd = match[1];
      const gbp = match[2];
      const eur = match[3];
      const cny = match[4];
      const jpy = match[5];
      const rub = match[6];
      const mxn = match[7];
      const brl = match[8];
      let value, currency;
      if (typeof usd === "string") {
        value = usd;
        currency = "USD";
      } else if (typeof gbp === "string") {
        value = gbp;
        currency = "GBP";
      } else if (typeof eur === "string") {
        value = eur;
        currency = "EUR";
      } else if (typeof cny === "string") {
        value = cny;
        currency = "CNY";
      } else if (typeof jpy === "string") {
        value = jpy;
        currency = "JPY";
      } else if (typeof rub === "string") {
        value = rub;
        currency = "RUB";
      } else if (typeof mxn === "string") {
        value = mxn;
        currency = "MXN";
      } else if (typeof brl === "string") {
        value = brl;
        currency = "BRL";
      }

      const numberValue = this.parseValue(value);
      if (!isNaN(numberValue) && isFinite(numberValue) && numberValue > 1 && numberValue < 1000) {
        results.push({
          currency: currency,
          yearly: numberValue * 1000 * ((currency == 'JPY' || currency == 'RUB') ? 1000 : 1)
        })
      }
    }
    return Promise.resolve(results);
  }
}


const singletonInstance = new ParseCompensation()
const singletonMethod = function() {
  return singletonInstance.parse.apply(singletonInstance, arguments);
}

module.exports = singletonMethod
module.exports.default = singletonMethod
module.exports.parseCompensation = singletonInstance
module.exports.ParseCompensation = ParseCompensation
