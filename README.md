# @datagica/parse-compensation

Parse compensation, remuneration, salary, pay, wage.. from a job offer

Supported languages:

* english
* french
* chinese
* japanese
* russian
* spanish
* portuguese

Supported currencies:

* usd
* gbp
* eur
* cny
* jpy
* rub
* mxn
* brl

Supported compensation formats:

* <label> <number> <unit> <currency>
* <label> <currency> <number> <unit>


Label is a prefix label (eg. "salary" or "salario").
Number is the actual value (eg. 80, 4.2). Unit is the scale (eg. K, M).
Currency is the currency symbol (eg. €, USD).

## Installation

    $ npm install --save @datagica/parse-compensation

## Usage

```javascript
import parseCompensation from "@datagica/parse-compensation";

parseCompensation("compensation: $90K").then(..).catch(..)
// will output:
[
  {
    currency: "MXN",
    yearly: 450000
  }
]

parseCompensation("salario: 450K MXN").then(..).catch(..)
// will output:
[
  {
    currency: "MXN",
    yearly: 450000
  }
]
```

## TODO

- parse monthly salary format
- parse tax/gross salary informations
- parse more complex compensation systems (ex. dividends, shares, variable compensation)
