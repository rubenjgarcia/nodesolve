/* globals describe, it, beforeEach, after */
'use strict'

var expect = require('expect.js')
var lpsolve = require('bindings')('lpsolve')
var path = require('path')
var fs = require('fs')

describe('lpsolvelib', function () {
  var problem

  beforeEach(function () {
    problem = lpsolve.makeLP(0, 2)
  })

  it('should be able to create a instance', function (done) {
    expect(problem).to.not.be.null
    done()
  })

  it('should be able to get number of rows and columns', function (done) {
    expect(problem.rows()).to.be.eql(0)
    expect(problem.columns()).to.be.eql(2)
    done()
  })

  it('should be able to assign and retrive the name', function (done) {
    problem.name('Test')
    expect(problem.name()).to.be.eql('Test')
    done()
  })

  it('should be able to change the "addRowMode"', function (done) {
    expect(problem.addRowMode()).to.be.false

    problem.addRowMode(true)
    expect(problem.addRowMode()).to.be.true

    problem.addRowMode(false)
    expect(problem.addRowMode()).to.be.false
    done()
  })

  it('should be able to set objective function', function (done) {
    expect(problem.obj(0, 1)).to.be.true

    expect(problem.objFn([0, 1, 2])).to.be.true

    expect(problem.objFnEx(2, [0, 1], [1, 2])).to.be.true

    expect(problem.objFnStr('0 1')).to.be.true
    done()
  })

  it('should be able to set objective direction', function (done) {
    expect(problem.maxim()).to.be.false

    problem.maxim(true)
    expect(problem.maxim()).to.be.true

    problem.maxim(false)
    expect(problem.maxim()).to.be.false
    done()
  })

  it('should be able to set binary variables', function (done) {
    expect(problem.binary(1)).to.be.false

    problem.binary(1, true)
    expect(problem.binary(1)).to.be.true

    problem.binary(1, false)
    expect(problem.binary(1)).to.be.false
    done()
  })

  it('should be able to set integer variables', function (done) {
    expect(problem.intVar(1)).to.be.false

    problem.intVar(1, true)
    expect(problem.intVar(1)).to.be.true

    problem.intVar(1, false)
    expect(problem.intVar(1)).to.be.false
    done()
  })

  it('should be able to resize problem', function (done) {
    problem = lpsolve.makeLP(4, 5)
    expect(problem.rows()).to.be.eql(4)
    expect(problem.columns()).to.be.eql(5)

    problem.resize(2, 1)
    expect(problem.rows()).to.be.eql(2)
    expect(problem.columns()).to.be.eql(1)
    done()
  })

  it('should be able to add constraints', function (done) {
    problem.constraint([1, 2], lpsolve.CONSTRAINT_TYPE.GE, 3)
    expect(problem.rows()).to.be.eql(1)

    problem.constraintEx(2, [1, 2], [1, 2], lpsolve.CONSTRAINT_TYPE.LE, 5)
    expect(problem.rows()).to.be.eql(2)

    problem.constraintStr('1 2', lpsolve.CONSTRAINT_TYPE.EQ, 4)
    expect(problem.rows()).to.be.eql(3)

    done()
  })

  it('should be able to set RHS and RHS Range', function (done) {
    problem.constraint([1, 2], lpsolve.CONSTRAINT_TYPE.GE, 3)
    expect(problem.rh(1)).to.be.eql(3)

    problem.rh(1, 5)
    expect(problem.rh(1)).to.be.eql(5)

    problem.rhVec([0, 4])
    expect(problem.rh(1)).to.be.eql(4)

    problem.rhVecStr('7')
    expect(problem.rh(1)).to.be.eql(7)

    problem.rhRange(1, 6)
    expect(problem.rhRange(1)).to.be.eql(6)

    done()
  })

  it('should be able to set variable bounds', function (done) {
    problem.bounds(1, 1, 3)
    expect(problem.upBound(1)).to.be.eql(3)
    expect(problem.lowBound(1)).to.be.eql(1)

    problem.upBound(1, 7)
    expect(problem.upBound(1)).to.be.eql(7)

    problem.lowBound(1, 5)
    expect(problem.lowBound(1)).to.be.eql(5)
    done()
  })

  it('should be able to set breakAtFirst property', function (done) {
    expect(problem.breakAtFirst()).to.be.false

    problem.breakAtFirst(true)
    expect(problem.breakAtFirst(true)).to.be.true

    problem.breakAtFirst(false)
    expect(problem.breakAtFirst(false)).to.be.false
    done()
  })

  it('should be able to set verbosity', function (done) {
    expect(problem.verbose()).to.be.eql(lpsolve.VERBOSITY.NORMAL)

    problem.verbose(lpsolve.VERBOSITY.DETAILED)
    expect(problem.verbose()).to.be.eql(lpsolve.VERBOSITY.DETAILED)
    done()
  })

  it('should be able to set timeout', function (done) {
    expect(problem.timeout()).to.be.eql(0)

    problem.timeout(10)
    expect(problem.timeout()).to.be.eql(10)
    done()
  })

  it('should be able to read from a LP file', function (done) {
    var lpPath = path.join(__dirname, 'lpsolve.lp')
    problem = lpsolve.readLP(lpPath, lpsolve.VERBOSITY.NORMAL, 'problem')

    expect(problem.name()).to.be.eql('problem')
    expect(problem.maxim()).to.be.false
    expect(problem.columns()).to.be.eql(2)
    expect(problem.rows()).to.be.eql(1)
    done()
  })

  it('should be able to write a LP file', function (done) {
    var lpPath = path.join(__dirname, 'lpsolve_test.lp')
    if (fs.existsSync(lpPath)) {
      fs.unlinkSync(lpPath)
    }

    problem.resize(0, 1)
    problem.constraintEx(1, [2], [1], lpsolve.CONSTRAINT_TYPE.GE, 3)
    problem.writeLP(lpPath)

    expect(fs.existsSync(lpPath)).to.be.true
    var file = fs.readFileSync(lpPath, {encoding: 'utf8'})
    var expectedFile = '/* Objective function */\n' +
                        'min: ;\n' +
                        '\n' +
                        '/* Constraints */\n' +
                        'R1: +2 C1 >= 3;\n'
    expect(file).to.be.eql(expectedFile)
    fs.unlinkSync(lpPath)
    done()
  })

  it('should be able to solve a problem asynchronously', function (done) {
    problem.resize(1, 2)
    problem.objFn([0, 1, 1])
    problem.maxim(false)

    problem.intVar(1, true)
    problem.lowBound(1, 1)
    problem.lowBound(2, 1)

    problem.constraint([0, 1, 1], lpsolve.CONSTRAINT_TYPE.GE, 2)

    var lpPath = path.join(__dirname, 'lpsolve_test.lp')
    if (fs.existsSync(lpPath)) {
      fs.unlinkSync(lpPath)
    }

    problem.writeLP(lpPath)

    expect(fs.existsSync(lpPath)).to.be.true
    var file = fs.readFileSync(lpPath, {encoding: 'utf8'})
    var expectedFile = '/* Objective function */\n' +
      'min: +C1 +C2;\n' +
      '\n' +
      '/* Constraints */\n' +
      '+C1 +C2 >= 2;\n' +
      '\n' +
      '/* Variable bounds */\n' +
      'C1 >= 1;\n' +
      'C2 >= 1;\n' +
      '\n' +
      '/* Integer definitions */\n' +
      'int C1;\n'

    expect(file).to.be.eql(expectedFile)
    fs.unlinkSync(lpPath)

    problem.solve(function (err, status) {
      expect(err).to.be.null
      expect(status).to.be.eql(lpsolve.STATUS.OPTIMAL)

      var variables = []
      problem.variables(variables)
      expect(variables).to.be.eql([1, 1])
      done()
    })
  })

  it('should be able to solve a problem synchronously', function (done) {
    problem.resize(1, 2)
    problem.objFn([0, 1, 1])
    problem.maxim(false)

    problem.intVar(1, true)
    problem.lowBound(1, 1)
    problem.lowBound(2, 1)

    problem.constraint([0, 1, 1], lpsolve.CONSTRAINT_TYPE.GE, 2)

    var lpPath = path.join(__dirname, 'lpsolve_test.lp')
    if (fs.existsSync(lpPath)) {
      fs.unlinkSync(lpPath)
    }

    problem.writeLP(lpPath)

    expect(fs.existsSync(lpPath)).to.be.true
    var file = fs.readFileSync(lpPath, {encoding: 'utf8'})
    var expectedFile = '/* Objective function */\n' +
                        'min: +C1 +C2;\n' +
                        '\n' +
                        '/* Constraints */\n' +
                        '+C1 +C2 >= 2;\n' +
                        '\n' +
                        '/* Variable bounds */\n' +
                        'C1 >= 1;\n' +
                        'C2 >= 1;\n' +
                        '\n' +
                        '/* Integer definitions */\n' +
                        'int C1;\n'

    expect(file).to.be.eql(expectedFile)
    fs.unlinkSync(lpPath)

    var status = problem.solveSync()
    expect(status).to.be.eql(lpsolve.STATUS.OPTIMAL)

    var variables = []
    problem.variables(variables)
    expect(variables).to.be.eql([1, 1])
    done()
  })

  after(function () {
    if (problem) {
      problem.delete()
    }
  })

  // TODO Get objective function
})
