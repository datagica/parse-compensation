'use strict';

class ParseCompensation {

  constructor() {

    const currencySymbolLeft = `(?:\\$|£|¥|JPY|BRL|USD|R\\$)`;
    const currencySymbolRight = `(?:円|€|CNY|EUR|₽|RUB|MXN|Mex\\$)`;
    const numericValue = `[1-9][0-9]{0,3}(?:(?:\\.|,| )[0-9]{0,3})?`;
    const currencyFactor = `(?:K|k|M|m|万)`;
    const separator = `(?:	|\\s|①|②|:){0,3}`;

    const amountLeft =
      currencySymbolLeft +
      `\\s?` +
      numericValue +
      `\\s?` +
      currencyFactor + `?`;

    const amountRight =
      numericValue +
      `\\s?` +
      currencyFactor + `?` +
      `\\s?` +
      currencySymbolRight;

    const amount = `(${amountLeft}|${amountRight})`
    //console.log("amount: "+amount)
    this.hourly = new RegExp(

      // unpaid
      /*
      `(`+
        // english
        `unpaid`+

        // french
        `|pas de compensation|non rémunéré`+

        // arabic
        `|غير مدفوع`+
      `)`+

      `|`+
      */


      // english
      `(?:` +
          `(?:hourly pay|hourly rate|hourly wage|hourly compensation|hourly gratification|hourly salary|hourly)${separator}${amount}` +
        `|` +
          `${amount} ?(?:/\\s?h|/\\s?hour|per\\s?hour|hr|hour)` +
      `)|` +

      // french
      `(?:` +
          `(?:salaire|gratification|rémunération)\\s(?:horaire|par heure|de l'heure)${separator}${amount}` +
        `|` +
          `${amount} ?(?:de\\s?l(?:'|\\s)?heure|par\\s?heure|heure|/\\s?heure)` +
      `)|` +

      // japanese
      `(?:` +
        `時給${separator}${amount}` +
      `)|` +


      // chinese
      `(?:` +
        `每小时工资${separator}${amount}` + // simplified
        `|`+
        `小时工资${separator}${amount}` + // simplified (alt)
        `|`+
        `每小時工資${separator}${amount}` + // traditional
        `|`+
        `小時工資${separator}${amount}` + // traditional (alt)
        `|`+
        `${amount} ?每小时` + // simplified
        `|`+
        `${amount} ?每小時` + // traditional
        `|` +
        `每小时 ?${amount}`+ // simplified
        `|` +
        `每小時 ?${amount}`+ // traditional
        `|`+
        `${amount} ?/ ?小时`+ // simplified
        `|`+
        `${amount} ?/ ?小時`+ // traditional
      `)` +

      // arabic
      `(?:`+
        `${amount}${separator}`+ `الأجر بالساعة`+
        `|`+
        `ساعة`+ ` ?${amount}`+
      `)`

      , "i"
    )

    this.monthly = new RegExp(


      // english
      `(?:` +
          `(?:monthly pay|monthly wage|monthly compensation|monthly gratification|monthly salary|monthly)${separator}${amount}` +
        `|` +
          `${amount} ?(?:/\\s?m|/\\s?month|per\\s?month|mo|monthly|month)` +
      `)|` +


      // french
      `(?:` +
          `(?:salaire mensuel|rémunération mensuelle|gratification mensuelle)${separator}${amount}` +
        `|` +
          `${amount} ?(?:par\\s?mois|mois|/\\s?mois)` +
      `)|` +

      // japanese
      `(?:` +
        `月給${separator}${amount}` +
      `)|` +

      // chinese
      `(?:` +
        `月工资${separator}${amount}` + // simplified
        `|`+
        `月工資${separator}${amount}` + // traditional
        `|`+
        `${amount} ?元不等` + // simplified
        `|`+
        `${amount} ?元不等` + // traditional (looks the same?)
        `|` +
        `每月${amount}`+ // simplified
        `|` +
        `每月${amount}`+ // traditional
        `|`+
        `${amount} ?/ ?月`+ // traditional (simplified is same?)
      `)|` +

      // arabic
      `(?:`+
        `${amount}${separator}`+ `الأجر الشهري`+
        `|`+
        `شهريا`+ ` ?${amount}`+
      `)`
      , "i"
    )

    /*
    this.yearly = new RegExp(
      ``, "gi"
    )*/

    // extract the currency and the numeric value
    this.currency = new RegExp(
      `(?:` +
        `(\\$|USD)|` +
        `(£|GBP)|` +
        `(€|EUR)|` +
        `(CNY)|` +
        `(円|¥|JPY)|` +
        `(₽|RUB)|` +
        `(Mex\\$|MXN)|` +
        `(BRL|R\\$)` +
      `)`, "i");

    this.value = new RegExp(
      `(${numericValue})${separator}(K|M|万)?`,
      "i");
    //console.log(this.value)
  }


  parseFloatValue(str) {
    return parseFloat(`${str}`.replace(/[, ]/g, '.'));
  }

  parseCurrency(amount, locale) {
    //console.log(`parseCurrency(${amount}, ${locale})`)
    let match, currency;
    while ((match = this.currency.exec(amount)) !== null) {
      if (typeof match[1] === "string") { currency = "USD"; break; }
      if (typeof match[2] === "string") { currency = "GBP"; break; }
      if (typeof match[3] === "string") { currency = "EUR"; break; }
      if (typeof match[4] === "string") { currency = "CNY"; break; }
      if (typeof match[5] === "string") { currency = "JPY"; break; }
      if (typeof match[6] === "string") { currency = "RUB"; break; }
      if (typeof match[7] === "string") { currency = "MXN"; break; }
      if (typeof match[8] === "string") { currency = "BRL"; break; }
    }
    if (currency) return currency;
    if (typeof locale === "en") return "USD";
    if (typeof locale === "fr") return "EUR";
    if (typeof locale === "jp") return "JPY";
    return "USD";
  }
  parseValue(amount, locale, currency, isMonthly) {
    //console.log(`parseValue(${amount}, ${locale}, ${currency})`)
    const match = this.value.exec(amount);
    //console.log(match)
    if (match === null) return 0;

    const strValue = (typeof match[1] === "string") ? match[1] : "";
    const strFactor = ((typeof match[2] === "string") ? match[2] : "").toLowerCase();

    const value = this.parseFloatValue(strValue);

    if (!isNaN(value) && isFinite(value) && value > 0) {

      /*if (currency === "JPY" || currency === "RUB") {
        return value * 1000;
      } else {
        return value;
      }
      */
      if (strFactor.length){
        if (strFactor === "k") {
          return value * 1000;
        } else if (strFactor === "m") {
          return value * 1000 * 1000;
        } else if (strFactor === "万") {
          return value * 10 * 1000;
        } else {
          return value;
        }
      } else {
        return value;
      }
    } else {
      return 0;
    }

    // yearly: numberValue * 1000 * ((currency == 'JPY' || currency == 'RUB') ? 1000 : 1)

  }
  parseHourly(text) {
    let amount, locale, match;

    // first we try to match simple cases
    while ((match = this.hourly.exec(text)) !== null) {
      //console.log("MATCH! "+match)
      if (typeof match[1] === "string") {
        return {
          amount: match[1],
          locale: "en"
        }
      } else if (typeof match[2] === "string") {
        return {
          amount: match[2],
          locale: "en"
        }
      } else if (typeof match[3] === "string") {
        return {
          amount: match[3],
          locale: "fr"
        }
      } else if (typeof match[4] === "string") {
        return {
          amount: match[4],
          locale: "fr"
        }
      } else if (typeof match[5] === "string") {
        return {
          amount: match[5],
          locale: "jp"
        }
      }
    }

    return {
      amount: amount,
      locale: locale
    }
  }

  parseMonthly(text) {
    let amount, locale, match;

    // first we try to match simple cases
    while ((match = this.monthly.exec(text)) !== null) {
      if (typeof match[1] === "string") {
        return {
          amount: match[1],
          locale: "en"
        }
      } else if (typeof match[2] === "string") {
        return {
          amount: match[2],
          locale: "en"
        }
      } else if (typeof match[3] === "string") {
        return {
          amount: match[3],
          locale: "fr"
        }
      } else if (typeof match[4] === "string") {
        return {
          amount: match[4],
          locale: "fr"
        }
      } else if (typeof match[5] === "string") {
        return {
          amount: match[5],
          locale: "jp"
        }
      }
    }

    return {
      amount: amount,
      locale: locale
    }
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

    text = ` ${text} `;

    const hourly = this.parseHourly(text);
    const monthly = this.parseMonthly(text);

    hourly.currency = this.parseCurrency(hourly.amount, hourly.locale);
    hourly.value = this.parseValue(hourly.amount, hourly.locale, hourly.currency);

    monthly.currency = this.parseCurrency(monthly.amount, monthly.locale);
    monthly.value = this.parseValue(monthly.amount, monthly.locale, monthly.currency);

    // TODO: repair hourly or monthly if data is unavailable
    if (hourly.value == 0 && monthly.value != 0) {
      //console.log("repairing hourly")
      // note: we should use the locale to know better how many hours there are
      hourly.value = Math.round(monthly.value / 20 / 8);
      hourly.currency = monthly.currency;
    } else if (monthly.value == 0 && hourly.value != 0) {
      //console.log("repairing month")
        // note: we should use the locale to know better how many hours there are
        monthly.value = hourly.value * 8 * 20;
        monthly.currency = hourly.currency;
    }

    const result = {
      hourly: {
        value: hourly.value,
        currency: hourly.currency
      },
      monthly: {
        value: monthly.value,
        currency: monthly.currency
      }
    }

    //console.log(JSON.stringify(result));

    return Promise.resolve(result);
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
