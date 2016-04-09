const chai = require('chai')
chai.use(require('chai-fuzzy'))
const expect = chai.expect

const ParseCompensation = require("../lib/parse-compensation").ParseCompensation;
const parseCompensation = new ParseCompensation();

describe('@datagica/parse-compensation', () => {


  describe('English:', () => {

    it('should parse currencies', done => {

      const tests = [{
        input: {
          amount: "$2200/mo",
          locale: "en"
        },
        output: "USD"
      }, {
        input: {
          amount: "$1300 per month",
          locale: "en"
        },
        output: "USD"
      }, {
        input: {
          amount: "£4000 / month",
          locale: "en"
        },
        output: "GBP"
      }, {
        input: {
          amount: "£5000/mo",
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
          amount: "10€/hour",
          locale: "en",
          currency: "EUR"
        },
        output: 10
      }, {
        input: {
          amount: "£15 per hour",
          locale: "en",
          currency: "GBP"
        },
        output: 15
      }, {
        input: {
          amount: "hourly rate: $25",
          locale: "en",
          currency: "USD"
        },
        output: 25
      }, {
        input: {
          amount: "£30/h",
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
          amount: "2500€/month",
          locale: "en",
          currency: "EUR"
        },
        output: 2500
      }, {
        input: {
          amount: "2k€ per month",
          locale: "en",
          currency: "EUR"
        },
        output: 2000
      }, {
        input: {
          amount: "$4000 / month",
          locale: "en",
          currency: "USD"
        },
        output: 4000
      }, {
        input: {
          amount: "£5000/mo",
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

    it('should parse whole sentences (daily)', done => {

      const tests = [
        {
          input: "hourly rate : 10€",
          output: {
            hourly: {
              currency: "EUR",
              value: 10
            },
            monthly: {
              currency: "EUR",
              value: 1600
            }
          }
        }, {
          input: "wage : 12€ / h",
          output: {
            hourly: {
              currency: "EUR",
              value: 12
            },
            monthly: {
              currency:"EUR",
              value: 1920
            }
          }
        }, {
          input: "20€ per hour",
          output: {
            hourly: {
              currency: "EUR",
              value: 20
            },
            monthly: {
              currency: "EUR",
              value: 3200
            }
          }
        }, {
          input: "salary : £15 per hour",
          output: {
            hourly: {
              currency: "GBP",
              value: 15
            },
            monthly: {
              currency: "GBP",
              value: 2400
            }
          }
        }, {
          input: "compensation : $14/hour",
          output: {
            hourly: {
              currency: "USD",
              value: 14
            },
            monthly: {
              currency: "USD",
              value: 2240
            }
          }
        }
      ]

      Promise.all(tests.map(test => {
        return parseCompensation.parse(test.input).then(output => {
          // console.log("output: " + JSON.stringify(output));
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

    it('should parse whole sentences (monthly)', done => {

      const tests = [
        {
          input: "monthly salary : 2500€",
          output: {
            hourly: {
              currency: "EUR",
              value: 16
            },
            monthly: {
              currency: "EUR",
              value: 2500
            }
          }
        }, {
          input: "compensation : 2000€ / month",
          output: {
            hourly: {
              currency: "EUR",
              value: 13
            },
            monthly: {
              currency: "EUR",
              value: 2000
            }
          }
        }, {
          input: "4k€ per month",
          output: {
            hourly: {
              currency: "EUR",
              value: 25
            },
            monthly: {
              currency: "EUR",
              value: 4000
            }
          }
        }, {
          input: "salary : $4k per month",
          output: {
            hourly: {
              currency: "USD",
              value: 25
            },
            monthly: {
              currency: "USD",
              value: 4000
            }
          }
        }, {
          input: "salaire mensuel : £10k per month",
          output: {
            hourly: {
              currency: "GBP",
              value: 63
            },
            monthly: {
              currency: "GBP",
              value: 10000
            }
          }
        }, {
          input: "wage: $1500/mo",
          output: {
            hourly: {
              currency: "USD",
              value: 9
            },
            monthly: {
              currency: "USD",
              value: 1500
            }
          }
        }
      ]

      Promise.all(tests.map(test => {
        return parseCompensation.parse(test.input).then(output => {
          // console.log("output: " + JSON.stringify(output));
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

    it('should parse whole sentences (daily)', done => {

      const tests = [
        {
          input: "salaire horaire : 10€",
          output: {
            hourly: {
              currency: "EUR",
              value: 10
            },
            monthly: {
              currency: "EUR",
              value: 1600
            }
          }
        }, {
          input: "salaire horaire : 12€ / h",
          output: {
            hourly: {
              currency: "EUR",
              value: 12
            },
            monthly: {
              currency:"EUR",
              value: 1920
            }
          }
        }, {
          input: "20€ de l'heure",
          output: {
            hourly: {
              currency: "EUR",
              value: 20
            },
            monthly: {
              currency: "EUR",
              value: 3200
            }
          }
        }, {
          input: "salaire : 15€ par heure",
          output: {
            hourly: {
              currency: "EUR",
              value: 15
            },
            monthly: {
              currency: "EUR",
              value: 2400
            }
          }
        }, {
          input: "salaire : 14€/heure",
          output: {
            hourly: {
              currency: "EUR",
              value: 14
            },
            monthly: {
              currency: "EUR",
              value: 2240
            }
          }
        }
      ]

      Promise.all(tests.map(test => {
        return parseCompensation.parse(test.input).then(output => {
          // console.log("output: " + JSON.stringify(output));
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

    it('should parse whole sentences (monthly)', done => {

      const tests = [
        {
          input: "salaire mensuel : 2500€",
          output: {
            hourly: {
              currency: "EUR",
              value: 16
            },
            monthly: {
              currency: "EUR",
              value: 2500
            }
          }
        }, {
          input: "salaire mensuel : 2000€ / mois",
          output: {
            hourly: {
              currency: "EUR",
              value: 13
            },
            monthly: {
              currency: "EUR",
              value: 2000
            }
          }
        }, {
          input: "4k€ par mois",
          output: {
            hourly: {
              currency: "EUR",
              value: 25
            },
            monthly: {
              currency: "EUR",
              value: 4000
            }
          }
        }, {
          input: "salaire : 4k€ par mois",
          output: {
            hourly: {
              currency: "EUR",
              value: 25
            },
            monthly: {
              currency: "EUR",
              value: 4000
            }
          }
        }, {
          input: "salaire mensuel : 4k€ par mois",
          output: {
            hourly: {
              currency: "EUR",
              value: 25
            },
            monthly: {
              currency: "EUR",
              value: 4000
            }
          }
        }, {
          input: "salaire : 1500€/mois",
          output: {
            hourly: {
              currency: "EUR",
              value: 9
            },
            monthly: {
              currency: "EUR",
              value: 1500
            }
          }
        }
      ]

      Promise.all(tests.map(test => {
        return parseCompensation.parse(test.input).then(output => {
          // console.log("output: " + JSON.stringify(output));
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
