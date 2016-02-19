/* globals describe, it, beforeEach */
'use strict'

var expect = require('expect.js')
var NodeSolve = require('../index')
var path = require('path')
var fs = require('fs')

describe('nodesolve', function () {
  var problem

  beforeEach(function () {
    problem = new NodeSolve()
  })

  it('should be able to create a instance', function (done) {
    expect(problem).to.not.be.null
    done()
  })

  it('should be able to get number of rows and columns', function (done) {
    expect(problem.rows()).to.be.eql(0)
    expect(problem.columns()).to.be.eql(0)
    done()
  })

  it('should be able to assign and retrive the name', function (done) {
    expect(problem.name()).to.be.eql('nodesolve')
    problem.name('Test')
    expect(problem.name()).to.be.eql('Test')
    done()
  })

  it('should be able to set and retrieve objective function', function (done) {
    expect(problem.objective()).to.be.eql([])

    expect(problem.objective('0 1')).to.be.eql([0, 1])

    expect(problem.objective(0, 3)).to.be.eql([3, 1])

    expect(problem.objective([0, 1, 2])).to.be.eql([0, 1, 2])

    expect(problem.objective([[1, 2], [8, 9]])).to.be.eql([0, 8, 9])

    expect(function () {
      problem.objective(0, [1, 2])
    }).to.throwError(/Invalid arguments/)

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
    problem.resize(0, 2)
    problem.binary(0, true)
    expect(problem.binary(0)).to.be.true

    problem.binary(0, false)
    expect(problem.binary(0)).to.be.false

    problem.binary(1, true)
    expect(problem.binary(1)).to.be.true

    expect(problem.binary()).to.be.eql([false, true])
    done()
  })

  it('should be able to set integer variables', function (done) {
    problem.resize(0, 2)
    problem.intVar(0, true)
    expect(problem.intVar(0)).to.be.true

    problem.intVar(0, false)
    expect(problem.intVar(0)).to.be.false

    problem.intVar(1, true)
    expect(problem.intVar(1)).to.be.true

    expect(problem.intVar()).to.be.eql([false, true])
    done()
  })

  it('should be able to resize problem', function (done) {
    expect(problem.rows()).to.be.eql(0)
    expect(problem.columns()).to.be.eql(0)

    problem.resize(2, 1)
    expect(problem.rows()).to.be.eql(2)
    expect(problem.columns()).to.be.eql(1)

    problem.resize(1, 2)
    expect(problem.rows()).to.be.eql(1)
    expect(problem.columns()).to.be.eql(2)
    done()
  })

  it('should be able to add constraints', function (done) {
    expect(function () {
      problem.constraint([1, 2], NodeSolve.CONSTRAINT_TYPE.GE, 3)
    }).throwError(/setting column 0.*only 0 column/)

    problem.resize(0, 2)

    expect(function () {
      problem.constraint([1, 2, 3], NodeSolve.CONSTRAINT_TYPE.GE, 3)
    }).to.throwError(/setting column 2.*only 2 column/)

    expect(function () {
      problem.constraint('1 2 3', NodeSolve.CONSTRAINT_TYPE.GE, 3)
    }).to.throwError(/setting column 2.*only 2 column/)

    problem.constraint([1, 2], NodeSolve.CONSTRAINT_TYPE.GE, 3)
    expect(problem.rows()).to.be.eql(1)

    var expected = {
      row: [1, 2],
      type: NodeSolve.CONSTRAINT_TYPE.GE,
      rhs: 3
    }

    expect(problem.constraint(0)).to.be.eql(expected)

    problem.constraint([[0, 1], [5, 6]], NodeSolve.CONSTRAINT_TYPE.LE, 5, 0)
    expect(problem.rows()).to.be.eql(1)

    problem.constraint('1 2', NodeSolve.CONSTRAINT_TYPE.EQ, 4)
    expect(problem.rows()).to.be.eql(2)

    expected = [
      {
        row: [5, 6],
        type: NodeSolve.CONSTRAINT_TYPE.LE,
        rhs: 5
      },
      {
        row: [1, 2],
        type: NodeSolve.CONSTRAINT_TYPE.EQ,
        rhs: 4
      }
    ]
    expect(problem.constraint()).to.be.eql(expected)
    done()
  })

  it('should be able to set RHS and RHS Range', function (done) {
    problem.resize(0, 2)

    problem.constraint([1, 2], NodeSolve.CONSTRAINT_TYPE.GE, 3)
    expect(problem.rh(0)).to.be.eql(3)

    expect(problem.rh(1)).to.be.eql(undefined)

    expect(function () {
      problem.rh(1, 2)
    }).to.throwError(/setting rhs from row 1.*only 1 row/)

    problem.rh(0, 5)
    expect(problem.rh(0)).to.be.eql(5)

    problem.rhVec([4])
    expect(problem.rh(0)).to.be.eql(4)

    expect(function () {
      problem.rhVec([4, 5])
    }).to.throwError(/setting rhs vector with size of 2.*are 1 row/)

    problem.rhVec('7')
    expect(problem.rh(0)).to.be.eql(7)

    expect(function () {
      problem.rhVec('7 8')
    }).to.throwError(/setting rhs vector with size of 2.*are 1 row/)

    expect(problem.rhVec()).to.be.eql([7])

    expect(problem.rhRange(0)).to.be.eql(undefined)

    problem.rhRange(0, 6)
    expect(problem.rhRange(0)).to.be.eql(6)

    expect(function () {
      problem.rhRange(1, 3)
    }).to.throwError(/setting rhs range from row 1.*only 1 row/)

    done()
  })

  it('should be able to set variable bounds', function (done) {
    expect(function () {
      problem.bounds(1, 1, 3)
    }).to.throwError(/setting bounds for variable 1. There are only 0 column/)

    problem.resize(0, 2)

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
    expect(problem.verbose()).to.be.eql(NodeSolve.VERBOSITY.NORMAL)

    problem.verbose(NodeSolve.VERBOSITY.DETAILED)
    expect(problem.verbose()).to.be.eql(NodeSolve.VERBOSITY.DETAILED)

    expect(function () {
      problem.verbose(19)
    }).to.throwError(/Invalid value/)

    done()
  })

  it('should be able to set timeout', function (done) {
    expect(problem.timeout()).to.be.eql(0)

    problem.timeout(10)
    expect(problem.timeout()).to.be.eql(10)

    expect(function () {
      problem.timeout('X')
    }).to.throwError(/Argument must be a Number/)
    done()
  })

  it('should be able to read from a LP file', function (done) {
    var lpPath = path.join(__dirname, 'lpsolve.lp')
    problem = NodeSolve.readLP(lpPath, NodeSolve.VERBOSITY.NORMAL, 'problem')

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
    problem.constraint([2], NodeSolve.CONSTRAINT_TYPE.GE, 3)
    problem.writeLP(lpPath)

    expect(fs.existsSync(lpPath)).to.be.true
    var file = fs.readFileSync(lpPath, {encoding: 'utf8'})
    var expectedFile = '/* nodesolve */\n' +
      '\n' +
      '/* Objective function */\n' +
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
    problem.objective([1, 1])
    problem.maxim(false)

    problem.intVar(0, true)
    problem.lowBound(0, 1)
    problem.lowBound(1, 1)

    problem.constraint([1, 1], NodeSolve.CONSTRAINT_TYPE.GE, 2)

    var lpPath = path.join(__dirname, 'lpsolve_test.lp')
    if (fs.existsSync(lpPath)) {
      fs.unlinkSync(lpPath)
    }

    problem.writeLP(lpPath)

    expect(fs.existsSync(lpPath)).to.be.true
    var file = fs.readFileSync(lpPath, {encoding: 'utf8'})
    var expectedFile = '/* nodesolve */\n' +
                      '\n' +
                      '/* Objective function */\n' +
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
      expect(status).to.be.eql(NodeSolve.STATUS.OPTIMAL)

      var variables = problem.variables()
      expect(variables).to.be.eql([1, 1])
      done()
    })
  })

  it('should be able to solve a problem synchronously', function (done) {
    problem.resize(1, 2)
    problem.objective([1, 1])
    problem.maxim(false)

    problem.intVar(0, true)
    problem.lowBound(0, 1)
    problem.lowBound(1, 1)

    problem.constraint([1, 1], NodeSolve.CONSTRAINT_TYPE.GE, 2)

    var lpPath = path.join(__dirname, 'lpsolve_test.lp')
    if (fs.existsSync(lpPath)) {
      fs.unlinkSync(lpPath)
    }

    problem.writeLP(lpPath)

    expect(fs.existsSync(lpPath)).to.be.true
    var file = fs.readFileSync(lpPath, {encoding: 'utf8'})
    var expectedFile = '/* nodesolve */\n' +
                      '\n' +
                      '/* Objective function */\n' +
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

    var status = problem.solve()
    expect(status).to.be.eql(NodeSolve.STATUS.OPTIMAL)

    var variables = problem.variables()
    expect(variables).to.be.eql([1, 1])
    done()
  })
})
