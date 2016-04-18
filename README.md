# @datagica/parse-compensation

Parse compensation, remuneration, salary, pay, wage.. from a job offer.

Supported languages (but more to come):

* english
* french

May more or less work (not much tested yet):
* japanese
* chinese
* arabic

Supported currencies:

* usd
* gbp
* eur
* cny
* jpy
* rub
* mxn
* brl

## Installation

    $ npm install --save @datagica/parse-compensation

## Usage

```javascript
import parseCompensation from "@datagica/parse-compensation";

/* IMPORTANT: the API is promise-based, use it like this:
parseCompensation("salary: $10/hour").then(result => {
  console.log(result)
})
*/

// english
const prom = parseCompensation("salary: £15 per hour");
// returns a promise that will resolve to:
{
  hourly: {
    currency: "GBP",
    value: 15
  },
  monthly: {
    currency: "GBP",
    value: 2400
  }
}
const prom = parseCompensation("compensation: $4k/mo");
{
  hourly: {
    currency: "USD",
    value: 25
  },
    monthly: {
    currency: "USD",
    value: 4000
  }
}

// french
const prom = parseCompensation("salaire : 14€/heure");
{
  hourly: {
    currency: "EUR",
    value: 14
  },
  monthly: {
    currency: "EUR",
    value: 2240
  }
}
```

## TODO

- support yearly format
- support more languages
- support tax/gross salary informations
- support more complex compensation systems (ex. dividends, shares, variable compensation)
