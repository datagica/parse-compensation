const chai = require('chai')
chai.use(require('chai-fuzzy'))
const expect = chai.expect

const ParseCompensation = require("../lib/parse-compensation").ParseCompensation;
const parseCompensation = new ParseCompensation();

describe('@datagica/parse-compensation', () => {

  describe('French:', () => {

    it('should parse currencies', done => {

      const tests = [{
        input: {
          amount: "2200€/mo",
          locale: "en"
        },
        output: "EUR"
      }, {
        input: {
          amount: "1300€ par mois",
          locale: "fr"
        },
        output: "EUR"
      }, {
        input: {
          amount: "$4000 / mois",
          locale: "en"
        },
        output: "USD"
      }, {
        input: {
          amount: "£5000 par mois",
          locale: "en"
        },
        output: "GBP"
      }]

      Promise.all(tests.map(test => {
        const output = parseCompensation.parseCurrency(test.input.amount, test.input.locale)
        //console.log("output: " + JSON.stringify(output));
        expect(output).to.be.like(test.output)
        return Promise.resolve(true)
      })).then(ended => {
        //console.log(`test ended`)
        done()
        return true
      }).catch(exc => {
        console.error(exc)
      })

    })
    it('should parse singly values (daily)', done => {

      const tests = [{
        input: {
          amount: "10€/heure",
          locale: "fr",
          currency: "EUR"
        },
        output: 10
      }, {
        input: {
          amount: "15€ de l'heure",
          locale: "fr",
          currency: "EUR"
        },
        output: 15
      }, {
        input: {
          amount: "$25 / hour",
          locale: "en",
          currency: "USD"
        },
        output: 25
      }, {
        input: {
          amount: "£30 per hour",
          locale: "en",
          currency: "GBP"
        },
        output: 30
      }]

      Promise.all(tests.map(test => {
        const output = parseCompensation.parseValue(test.input.amount, test.input.locale, test.input.currency)
        //console.log("output: " + JSON.stringify(output));
        expect(output).to.be.like(test.output)
        return Promise.resolve(true)
      })).then(ended => {
        //console.log(`test ended`)
        done()
        return true
      }).catch(exc => {
        console.error(exc)
      })


    })
    it('should parse single values (monthly)', done => {

      const tests = [{
        input: {
          amount: "2500€/mois",
          locale: "fr",
          currency: "EUR"
        },
        output: 2500
      }, {
        input: {
          amount: "2k€ par mois",
          locale: "fr",
          currency: "EUR"
        },
        output: 2000
      }, {
        input: {
          amount: "$4000 / mois",
          locale: "en",
          currency: "USD"
        },
        output: 4000
      }, {
        input: {
          amount: "£5000 par mois",
          locale: "en",
          currency: "GBP"
        },
        output: 5000
      }]

      Promise.all(tests.map(test => {
        const output = parseCompensation.parseValue(test.input.amount, test.input.locale, test.input.currency)
        //console.log("output: " + JSON.stringify(output));
        expect(output).to.be.like(test.output)
        return Promise.resolve(true)
      })).then(ended => {
        //console.log(`test ended`)
        done()
        return true
      }).catch(exc => {
        console.error(exc)
      })


    })

    it('should parse complex sentences', done => {

      const tests = [
        // french
        {
          input: "salaire mensuel : 2500€",
          output: {
            hourly: {
              currency:"EUR",
              value:16
            },
            monthly:{
              currency:"EUR",
              value:2500
            }
          }
        }, {
          input: "salaire : 4K€ par mois",
          output: {}
        }, {
          input: "salaire : 8K€ / mois",
          output: {}
        }, {
          input: "rémunération : 10 K€ / mois",
          output: {}
        }
      ]

      Promise.all(tests.map(test => {
        return parseCompensation.parse(test.input).then(output => {
          console.log("output: " + JSON.stringify(output));
          expect(output).to.be.like(test.output)
          return Promise.resolve(true)
        })
      })).then(ended => {
        //console.log(`test ended`)
        done()
        return true
      }).catch(exc => {
        console.error(exc)
      })
    })

  })

})
