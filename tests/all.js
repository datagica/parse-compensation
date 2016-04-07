const chai = require('chai')
chai.use(require('chai-fuzzy'))
const expect = chai.expect

const parseCompensation = require("../lib/parse-compensation");

describe('@datagica/parse-compensation', () => {

  describe('compensation', () => {
    it('should work with english', done => {

      const tests = [

      // dollars
      {
        input: "compensation: $80K",
        output: [{currency:"USD",yearly:80000}]
      },

      // pounds
      {
        input: "salary: £42K",
        output: [{currency:"GBP",yearly:42000}]
      },

      // decimal number
      {
        input: "salary: £55.5K",
        output: [{currency:"GBP",yearly:55500}]
      },
    ]

      Promise.all(tests.map(test => {
        return parseCompensation(test.input).then(output => {
          //console.log("output: " + JSON.stringify(output));
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
    it('should work with french', done => {

      const tests = [
      // french
      {
        input: "salaire : 32K€",
        output: [{currency:"EUR",yearly:32000}]
      },
      {
        input: "salaire annuel 30K €",
        output: [{currency:"EUR",yearly:30000}]
      },
      {
        input: "salaire brut : 80K €",
        output: [{currency:"EUR",yearly:80000}]
      },
      {
        input: "rémunération : 50 K€",
        output: [{currency:"EUR",yearly:50000}]
      }
    ]

      Promise.all(tests.map(test => {
        return parseCompensation(test.input).then(output => {
          //console.log("output: " + JSON.stringify(output));
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
    it('should work with chinese', done => {

      const tests = [
      {
        input: "工钱 350K CNY",
        output: [{currency: "CNY", yearly: 350000}]
      },
      {
        input: "报酬 370K CNY",
        output: [{currency: "CNY", yearly: 370000}]
      }
    ]

      Promise.all(tests.map(test => {
        return parseCompensation(test.input).then(output => {
          //console.log("output: " + JSON.stringify(output));
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
    it('should work with japanese', done => {

      const tests = [
      {
        input: "報酬 ¥ 7M",
        output: [{currency:"JPY",yearly:7000000}]
      }
    ]

      Promise.all(tests.map(test => {
        return parseCompensation(test.input).then(output => {
          //console.log("output: " + JSON.stringify(output));
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

    it('should work with russian', done => {

      const tests = [
      {
        input: "зарплата 3M RUB",
        output: [{currency: "RUB", yearly: 3000000}]
      },
      {
        input: "зарплата 2.5M ₽",
        output: [{currency: "RUB", yearly: 2500000}]
      }
    ]

      Promise.all(tests.map(test => {
        return parseCompensation(test.input).then(output => {
          //console.log("output: " + JSON.stringify(output));
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

    it('should work with spanish', done => {

      const tests = [
      {
        input: "salario 450K MXN",
        output: [{currency: "MXN", yearly: 450000}]
      },
      {
        input: "sueldo 900K Mex$",
        output: [{currency: "MXN", yearly: 900000}]
      }
    ]

      Promise.all(tests.map(test => {
        return parseCompensation(test.input).then(output => {
          //console.log("output: " + JSON.stringify(output));
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


    it('should work with portuguese', done => {

      const tests = [
      {
        input: "salário 35K €",
        output: [{currency: "EUR", yearly: 35000}]
      },
      {
        input: "remuneração 38K€",
        output: [{currency: "EUR", yearly: 38000}]
      },
      {
        input: "remunerações R$ 75K",
        output: [{currency: "BRL", yearly: 75000}]
      },
      {
        input: "vencimento R$ 100K",
        output: [{currency: "BRL", yearly: 100000}]
      },
      {
        input: "ordenado R$ 150K",
        output: [{currency: "BRL", yearly: 150000}]
      }
    ]

      Promise.all(tests.map(test => {
        return parseCompensation(test.input).then(output => {
          //console.log("output: " + JSON.stringify(output));
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
