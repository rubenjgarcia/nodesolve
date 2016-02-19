'use strict'

var lpsolve = require('bindings')('lpsolve')
var _ = require('lodash')

/**
 * Creates a new NodeSolve problem
 * @constructor
 */
function NodeSolve () {
  this._name = 'nodesolve'
  this._breakAtFirst = false
  this._verbosity = NodeSolve.VERBOSITY.NORMAL
  this._timeout = 0
  this._nRows = 0
  this._rows = []
  this._constraints = []
  this._nCols = 0
  this._columns = []
  this._objective = []
  this._maxim = false
  this._variables = []
  this._lpsolve = null
  this._status = null
  this._solveVariables = null
}

NodeSolve.VERBOSITY = {
  NEUTRAL: lpsolve.VERBOSITY.NEUTRAL,
  CRITICAL: lpsolve.VERBOSITY.CRITICAL,
  SEVERE: lpsolve.VERBOSITY.SEVERE,
  IMPORTANT: lpsolve.VERBOSITY.IMPORTANT,
  NORMAL: lpsolve.VERBOSITY.NORMAL,
  DETAILED: lpsolve.VERBOSITY.DETAILED,
  FULL: lpsolve.VERBOSITY.FULL
}

NodeSolve.CONSTRAINT_TYPE = {
  LE: lpsolve.CONSTRAINT_TYPE.LE,
  GE: lpsolve.CONSTRAINT_TYPE.GE,
  EQ: lpsolve.CONSTRAINT_TYPE.EQ
}

NodeSolve.STATUS = {
  NOMEMORY: lpsolve.STATUS.NOMEMORY,
  OPTIMAL: lpsolve.STATUS.OPTIMAL,
  SUBOPTIMAL: lpsolve.STATUS.SUBOPTIMAL,
  INFEASIBLE: lpsolve.STATUS.INFEASIBLE,
  UNBOUNDED: lpsolve.STATUS.UNBOUNDED,
  DEGENERATE: lpsolve.STATUS.DEGENERATE,
  NUMFAILURE: lpsolve.STATUS.NUMFAILURE,
  USERABORT: lpsolve.STATUS.USERABORT,
  TIMEOUT: lpsolve.STATUS.TIMEOUT,
  PRESOLVED: lpsolve.STATUS.PRESOLVED,
  PROCFAIL: lpsolve.STATUS.PROCFAIL,
  PROCBREAK: lpsolve.STATUS.PROCBREAK,
  FEASFOUND: lpsolve.STATUS.FEASFOUND,
  NOFEASFOUND: lpsolve.STATUS.NOFEASFOUND

}

/**
 * @example
 * problem.name() // returns 'nodesolve'
 *
 * @example
 * problem.name('myproblem') // Set the problem name to 'myproblem'
 *
 * @param {String|undefined} name
 * @returns {String} name of the problem
 */
NodeSolve.prototype.name = function (name) {
  if (name) {
    this._name = name
  }

  return this._name
}

/**
 * @example
 * problem.breakAtFirst() // returns false
 *
 * @example
 * problem.breakAtFirst(true) // Set breakAtFirst to true
 *
 * @param {Boolean|undefined} breakAtFirst
 * @returns {Boolean} value of breakAtFirst option
 */
NodeSolve.prototype.breakAtFirst = function (breakAtFirst) {
  if (breakAtFirst !== undefined) {
    this._breakAtFirst = breakAtFirst
  }
  return this._breakAtFirst
}

/**
 * @example
 * problem.verbose() // returns NodeSolve.VERBOSITY.NORMAL
 *
 * @example
 * problem.verbose(true) // Set breakAtFirst to true
 *
 * @param {Boolean|undefined} verbosity
 * @returns {Boolean} value of verbosity option
 */
NodeSolve.prototype.verbose = function (verbosity) {
  if (verbosity !== undefined) {
    switch (verbosity) {
      case NodeSolve.VERBOSITY.NEUTRAL:
      case NodeSolve.VERBOSITY.CRITICAL:
      case NodeSolve.VERBOSITY.SEVERE:
      case NodeSolve.VERBOSITY.IMPORTANT:
      case NodeSolve.VERBOSITY.NORMAL:
      case NodeSolve.VERBOSITY.DETAILED:
      case NodeSolve.VERBOSITY.FULL:
        this._verbosity = verbosity
        break
      default:
        throw new Error('Invalid value')
    }
  }
  return this._verbosity
}

/**
 * @example
 * problem.timeout() // returns false
 *
 * @example
 * problem.timeout(5) // Set timeout to 5 seconds
 *
 * @param {Number|undefined} timeout
 * @returns {Number} value of timeout option
 */
NodeSolve.prototype.timeout = function (timeout) {
  if (timeout !== undefined) {
    if (!_.isNumber(timeout)) {
      throw new Error('Argument must be a Number')
    }

    this._timeout = timeout
  }
  return this._timeout
}

/**
 * @example
 * problem.rows() // return 0
 *
 * @returns {Number} Number of rows
 */
NodeSolve.prototype.rows = function () {
  return this._nRows
}

/**
 * @example
 * problem.columns() // return 0
 *
 * @returns {Number} Number of columns
 */
NodeSolve.prototype.columns = function () {
  return this._nCols
}

/**
 * @example
 * problem.objective() // return problem objective function
 *
 * @example
 * problem.objective(0, 1) // Set the problem objective function column 0 to value 1
 *
 * @example
 * problem.objective([0, 1]) // Set the problem objective function to [0, 1]
 *
 * @example
 * problem.objective([[0, 1], [4, 5]]) // Set the problem objective function columns 0 and 1 to values 4 and 5
 *
 * @example
 * problem.objective('0 1') // Set the problem objective columns to [0, 1]
 *
 * @param {...*|undefined} args
 * @returns {Array} objective function
 */
NodeSolve.prototype.objective = function () {
  if (arguments.length > 0) {
    if (_.isString(arguments[0])) {
      var objective = arguments[0].split(' ')

      objective = objective.map(function (value) {
        return Number(value)
      })

      this._objective = objective
    } else if (_.isArray(arguments[0])) {
      if (_.isArray(arguments[0][0])) {
        for (var i = 0; i < arguments[0][0].length; i++) {
          this._objective[arguments[0][0][i]] = arguments[0][1][i]
        }
      } else {
        this._objective = arguments[0]
      }
    } else if (arguments.length > 1 && _.isNumber(arguments[0]) && _.isNumber(arguments[1])) {
      this._objective[arguments[0]] = arguments[1]
    } else {
      throw new Error('Invalid arguments')
    }
  }

  return this._objective
}

/**
 * @example
 * problem.maxim() // return false
 *
 * @example
 * problem.maxim(true) // Set maxim to true
 *
 * @param {Boolean|undefined} args
 * @returns {Boolean} value of maxim option
 */
NodeSolve.prototype.maxim = function (maxim) {
  if (maxim !== undefined) {
    this._maxim = maxim
  }
  return this._maxim
}

function variableType (type, args) {
  if (args.length === 0) {
    return this._variables.map(function (v) {
      return v.type === type
    })
  }

  if (args.length >= 2) {
    if (args[0] > this._nCols - 1) {
      throw new Error('Error setting ' + type === 'b' ? 'binary' : 'int' + ' variable for variable ' + args[0] + '. There are only ' + (this._nCols) + ' variable(s)')
    }

    if (!this._variables[args[0]]) {
      this._variables[args[0]] = {type: ''}
    }

    this._variables[args[0]].type = args[1] ? type : this._variables[args[0]].type === type ? '' : this._variables[args[0]] === type
  }

  return this._variables[args[0]].type === type
}

/**
 * @example
 * problem.binary() // return problem binaries columns
 *
 * @example
 * problem.binary(0) // Return if the problem column 0 is a binary variable
 *
 * @example
 * problem.binary(0, true) // Set the problem column 0 as a binary variable
 *
 * @param {Number|Boolean|undefined} args
 * @returns {Boolean|Array} binaries columns
 */
NodeSolve.prototype.binary = function () {
  return variableType.call(this, 'b', arguments)
}

/**
 * @example
 * problem.intVar() // return problem integer variables
 *
 * @example
 * problem.intVar(0) // Return if the problem column 0 is an intenger variable
 *
 * @example
 * problem.intVar(0, true) // Set the problem column 0 as an intenger variable
 *
 * @param {Number|Boolean|undefined} args
 * @returns {Boolean|Array} binaries columns
 */
NodeSolve.prototype.intVar = function () {
  return variableType.call(this, 'i', arguments)
}

/**
 * @example
 * problem.bounds(1, 2, 3) // set the lower bound fo the variable with index 1 to 2 and the upper bound to 3
 *
 * @param {Number} variable index
 * @param {Number} lower bound
 * @param {Number} upper bound
 */
NodeSolve.prototype.bounds = function (variable, lower, upper) {
  if (!_.isNumber(variable)) {
    throw new Error('First parameter must be a Number')
  }

  if (this._nCols <= variable) {
    throw new Error('Error setting bounds for variable ' + variable + '. There are only ' + this._nCols + ' column(s)')
  }

  if (!_.isNumber(lower)) {
    throw new Error('Second parameter must be a Number')
  }

  if (!_.isNumber(upper)) {
    throw new Error('Third parameter must be a Number')
  }

  if (!this._variables[variable]) {
    this._variables[variable] = {}
  }

  this._variables[variable].bounds = [lower, upper]
}

function bound (type, variable, value) {
  if (!_.isNumber(variable)) {
    throw new Error('First parameter must be a Number')
  }

  if (value) {
    if (this._nCols <= variable) {
      throw new Error('Error setting ' + type + ' bound for variable ' + variable + '. There are only ' + this._nCols + ' column(s)')
    }

    if (!this._variables[variable]) {
      this._variables[variable] = {bounds: [0, Infinity]}
    } else if (!this._variables[variable].bounds) {
      this._variables[variable].bounds = [0, Infinity]
    }

    this._variables[variable].bounds[type === 'lower' ? 0 : 1] = value
  } else {
    if (this._nCols <= variable) {
      throw new Error('Error getting ' + type + ' bound for variable ' + variable + '. There are only ' + this._nCols + ' column(s)')
    }

    return this._variables[variable] && this._variables[variable].bounds ? this._variables[variable].bounds[type === 'lower' ? 0 : 1] : Infinity
  }
}

/**
 * @example
 * problem.upBound(1) // return the upper bound for variable with index 1
 *
 * @example
 * problem.upBound(1, 3) // set the upper bound for variable with index 1 to 3
 *
 * @param {Number} variable index
 * @param [Number] value upper bound
 * @returns {Number} variable upper bound
 */
NodeSolve.prototype.upBound = function (variable, value) {
  return bound.call(this, 'upper', variable, value)
}

/**
 * @example
 * problem.lowBound(1) // return the lower bound for variable with index 1
 *
 * @example
 * problem.lowBound(1, 3) // set the lower bound for variable with index 1 to 3
 *
 * @param {Number} variable index
 * @param [Number] value lower bound
 * @returns {Number} variable lower bound
 */
NodeSolve.prototype.lowBound = function (variable, value) {
  return bound.call(this, 'lower', variable, value)
}

/**
 * @example
 * problem.resize(1, 3) // set rows length to 1 and rows length to 0
 *
 * @param {Number} rows
 * @param {Number} columns
 */
NodeSolve.prototype.resize = function (rows, columns) {
  /*
  var resize = function (dimension, size) {
    if (dimension.length < size) {
      var z = Array(size - dimension.length)
      z = _.fill(z, 0)
      dimension = _.concat(dimension, z)
    } else {
      dimension = _.slice(dimension, 0, size)
    }

    return dimension
  }

  this._rows = resize(this._rows, rows)
  this._columns = resize(this._columns, columns)
  */
  this._nRows = rows
  this._nCols = columns
}

/**
 * @example
 * problem.constraint() // Return the problem constraints
 *
 * @example
 * problem.constraint(0) // Return the constraint with index 0
 *
 * @example
 * problem.constraint([0, 1], NodeSolve.CONSTRAINT_TYPE.GE, 5) // Add a constraint with values [0, 1] and set it to be greater than or equals 5
 *
 * @example
 * problem.constraint([[0, 3], [4, 5]], NodeSolve.CONSTRAINT_TYPE.EQ, 2, 1) // Set the constraint 1 columns 0 and 3 to values 4 and 5 and set it to be equals 2
 *
 * @example
 * problem.constraint('0 1', NodeSolve.CONSTRAINT_TYPE.LE, 3) // Add a constraint with values [0, 1] and set it to be less than or equals 5
 *
 * @param {...*|undefined} args
 * @returns {Array|undefined} constraints
 */
NodeSolve.prototype.constraint = function () {
  if (arguments.length > 4) {
    throw new Error('Invalid number of arguments')
  }

  if (arguments.length === 0) {
    var self = this
    var constraints = _.clone(this._constraints).map(function (constraint, index) {
      constraint.row = _.clone(self._rows[index])
      return constraint
    })
    return constraints
  }

  if (arguments.length === 1) {
    if (!_.isNumber(arguments[0])) {
      throw new Error('First parameter must be a Number')
    }

    if (!this._constraints[arguments[0]]) {
      return
    }

    var constraint = _.clone(this._constraints[arguments[0]])
    constraint.row = _.clone(this._rows[arguments[0]])
    return constraint
  }

  if (arguments.length > 1) {
    if (arguments[1] !== NodeSolve.CONSTRAINT_TYPE.LE &&
      arguments[1] !== NodeSolve.CONSTRAINT_TYPE.GE &&
      arguments[1] !== NodeSolve.CONSTRAINT_TYPE.EQ) {
      throw new Error('Second argument must be a NodeSolve.CONSTRAINT_TYPE value')
    }

    if (!_.isNumber(arguments[2])) {
      throw new Error('Third parameter must be a Number')
    }

    if (_.isString(arguments[0])) {
      var row = arguments[0].split(' ')

      row = row.map(function (value) {
        return Number(value)
      })

      if (row.length > this._nCols) {
        throw new Error('Error setting column ' + this._nCols + '. There are only ' + this._nCols + ' column(s)')
      }

      this._rows.push(row)
      this._nRows = this._rows.length > this._nRows ? this._rows.length : this._nRows
      this._constraints.push({type: arguments[1], rhs: arguments[2]})
    } else if (_.isArray(arguments[0])) {
      if (_.isArray(arguments[0][0])) {
        if (arguments.length !== 4) {
          throw new Error('You must indicate the constraint target to set the values')
        }

        if (!_.isNumber(arguments[3])) {
          throw new Error('Fourth parameter must be a Number')
        }

        if (arguments[3] > this._nRows - 1) {
          throw new Error('Constraint ' + arguments[3] + ' is not set')
        }

        var max = _.max(arguments[0][0])
        if (max > this._nCols) {
          throw new Error('Error setting column ' + max + '. There are only ' + this._nCols + ' column(s)')
        }

        var arr
        if (!this._rows[arguments[3]]) {
          arr = Array(max)
          arr = _.fill(arr, 0)
        } else {
          arr = _.clone(this._rows[arguments[3]])
        }

        for (var i = 0; i < arguments[0][0].length; i++) {
          arr[arguments[0][0][i]] = arguments[0][1][i]
        }

        this._rows[arguments[3]] = arr
        this._constraints[arguments[3]] = {type: arguments[1], rhs: arguments[2]}
      } else {
        if (arguments[0].length > this._nCols) {
          throw new Error('Error setting column ' + this._nCols + '. There are only ' + this._nCols + ' column(s)')
        }

        this._rows.push(arguments[0])
        this._nRows = this._rows.length > this._nRows ? this._rows.length : this._nRows
        this._constraints.push({type: arguments[1], rhs: arguments[2]})
      }
    } else {
      throw new Error('Invalid arguments')
    }
  }
}

/**
 * @example
 * problem.rh(0) // Return the rhs from the constraint 0
 *
 * @example
 * problem.rh(0, 3) // Set to 3 the value of the rhs from the constraint with index 0
 *
 * @param {...Number|Number} args
 * @returns {Number|undefined} rhs
 */
NodeSolve.prototype.rh = function () {
  if (arguments.length < 1 || arguments.length > 2) {
    throw new Error('Invalid number of arguments')
  }

  if (!_.isNumber(arguments[0])) {
    throw new Error('First parameter must be a Number')
  }

  if (arguments.length === 1) {
    if (!this._constraints[arguments[0]]) {
      return
    }

    return this._constraints[arguments[0]].rhs
  } else {
    if (!_.isNumber(arguments[1])) {
      throw new Error('Second parameter must be a Number')
    }

    if (arguments[0] > this._nRows - 1) {
      throw new Error('Error setting rhs from row ' + arguments[0] + '. There are only ' + this._nRows + ' row(s)')
    }

    this._constraints[arguments[0]].rhs = arguments[1]
  }
}

/**
 * @example
 * problem.rhVec() // Returns the rhs vector from the constraints
 *
 * @example
 * problem.rhVec([0, 1]) // Set to [0, 1] the rhs vector from the constraints
 *
 * @example
 * problem.rh('0 3') // Set to [0, 3] the rhs vector from the constraints
 *
 * @param {Array|String|undefined} args
 * @returns {Array|undefined} rhs
 */
NodeSolve.prototype.rhVec = function () {
  if (arguments.length > 1) {
    throw new Error('Invalid number of arguments')
  }

  if (arguments.length === 0) {
    return this._constraints.map(function (constraint) {
      return constraint.rhs
    })
  }

  var arr
  if (_.isArray(arguments[0])) {
    arr = arguments[0]
  } else if (_.isString(arguments[0])) {
    arr = arguments[0].split(' ').map(function (value) {
      return Number(value)
    })
  } else {
    throw new Error('Invalid arguments')
  }

  if (arr.length !== this._nRows) {
    throw new Error('Error setting rhs vector with size of ' + arr.length + '. There are ' + this._nRows + ' row(s)')
  }

  this._constraints.map(function (constraint, index) {
    constraint.rhs = arr[index]
  })
}

/**
 * @example
 * problem.rhRange(0) // Return the rhs range from the constraint 0
 *
 * @example
 * problem.rhRange(0, 3) // Set the rhs range from the constraint with index 0 to a 3 delta value
 *
 * @param {...Number|Number} args
 * @returns {Number|undefined} rhs
 */
NodeSolve.prototype.rhRange = function () {
  if (arguments.length < 1 || arguments.length > 2) {
    throw new Error('Invalid number of arguments')
  }

  if (!_.isNumber(arguments[0])) {
    throw new Error('First parameter must be a Number')
  }

  if (arguments.length === 1) {
    if (!this._constraints[arguments[0]]) {
      return
    }

    return this._constraints[arguments[0]].range
  } else {
    if (!_.isNumber(arguments[1])) {
      throw new Error('Second parameter must be a Number')
    }

    if (arguments[0] > this._nRows - 1) {
      throw new Error('Error setting rhs range from row ' + arguments[0] + '. There are only ' + this._nRows + ' row(s)')
    }

    this._constraints[arguments[0]].range = arguments[1]
  }
}

/**
 * Reads a LP file and returns a NodeSolve instance
 *
 * @example
 * NodeSolve.readLP('file.lp') // Returns a NodeSolve instance with NORMAL verbosity level and name 'problem' from file 'file.lp'
 *
 * @example
 * NodeSolve.readLP('file.lp', 'myname') // Returns a NodeSolve instance with NORMAL verbosity level and name 'myname' from file 'file.lp'
 *
 * @example
 * NodeSolve.readLP('file.lp', NodeSolve.VERBOSITY.CRITICAL) // Returns a NodeSolve instance with CRITICAL verbosity level and name 'problem' from file 'file.lp'
 *
 * @example
 * NodeSolve.readLP('file.lp', NodeSolve.VERBOSITY.CRITICAL, 'myname') // Returns a NodeSolve instance with CRITICAL verbosity level and name 'myname' from file 'file.lp'
 *
 * @param {String} path
 * @param [NodeSolve.VERBOSITY] verbosity
 * @param [String] name
 * @returns {NodeSolve}
 */
NodeSolve.readLP = function (path, verbosity, name) {
  if (!_.isString(path) || !path) {
    throw new Error('First parameter must be a String')
  }

  if (_.isString(verbosity)) {
    name = verbosity
    verbosity = NodeSolve.VERBOSITY.NORMAL
  }

  if (!name) {
    name = 'problem'
  }

  var nodesolve = new NodeSolve()
  nodesolve._lpsolve = lpsolve.readLP(path, verbosity, name)
  nodesolve._name = nodesolve._lpsolve.name()
  nodesolve._nRows = nodesolve._lpsolve.rows()
  nodesolve._nCols = nodesolve._lpsolve.columns()
  nodesolve._maxim = nodesolve._lpsolve.maxim()

  // TODO Generate constraints, rows, cols, etc...
  return nodesolve
}

function generateLP () {
  this._lpsolve = lpsolve.makeLP(0, this._nCols)
  this._lpsolve.resize(this._nRows, this._nCols)

  this._lpsolve.name(this._name)
  this._lpsolve.breakAtFirst(this._breakAtFirst)
  this._lpsolve.verbose(this._verbosity)
  this._lpsolve.timeout(this._timeout)

  this._lpsolve.addRowMode(true)

  if (this._objective.length) {
    var obj = _.concat([ 0 ], _.clone(this._objective))
    this._lpsolve.objFn(obj)
  }

  this._lpsolve.maxim(this._maxim)

  var self = this

  this._variables.forEach(function (variable, index) {
    if (variable.type === 'b') {
      self._lpsolve.binary(index + 1, true)
    } else if (variable.type === 'i') {
      self._lpsolve.intVar(index + 1, true)
    }
  })

  this._constraints.forEach(function (constraint, index) {
    var row = _.clone(self._rows[ index ])
    var indexes = []
    for (var i = 0; i < self._nCols; i++) {
      indexes.push(i + 1)
    }
    self._lpsolve.constraintEx(self._nCols, row, indexes, constraint.type, constraint.rhs)
  })

  this._variables.forEach(function (variable, index) {
    if (variable.bounds) {
      if (variable.bounds[ 0 ] !== 0 && variable.bounds[ 1 ] !== Infinity) {
        self._lpsolve.bounds(index + 1, variable.bounds[ 0 ], variable.bounds[ 1 ])
      } else if (variable.bounds[ 0 ] !== 0) {
        self._lpsolve.lowBound(index + 1, variable.bounds[ 0 ])
      } else {
        self._lpsolve.upperBound(index + 1, variable.bounds[ 1 ])
      }
    }
  })

  this._lpsolve.addRowMode(false)
}
/**
 * Writes a LP file based on the NodeSolve properties
 *
 * @example
 * problem.writeLP('file.lp') // Writes a LP file to the file 'file.lp'
 *
 * @param {String} path
 */
NodeSolve.prototype.writeLP = function (path) {
  if (!_.isString(path) || !path) {
    throw new Error('First parameter must be a String')
  }

  if (this._lpsolve == null) {
    generateLP.call(this)
  }

  this._lpsolve.writeLP(path)
}

/**
 * Solve the problem synchronously o asynchronously
 *
 * @example
 * problem.solve() // solve the problem synchronously and returns the status
 *
 * @example
 * problem.solve(callback) // solve the problem asynchronously and call the callback function with arguments error and status
 *
 * @params [callback]
 * @returns {NodeSolve.STATUS}
 */
NodeSolve.prototype.solve = function (callback) {
  if (this._lpsolve == null) {
    generateLP.call(this)
  }

  if (callback && _.isFunction(callback)) {
    var self = this
    this._lpsolve.solve(function (err, status) {
      self._status = status
      if (status === NodeSolve.STATUS.OPTIMAL || status === NodeSolve.STATUS.SUBOPTIMAL) {
        self.variables()
        self._lpsolve.delete()
      }
      return callback(err, status)
    })
  } else {
    this._status = this._lpsolve.solveSync()
    if (this._status === NodeSolve.STATUS.OPTIMAL || this._status === NodeSolve.STATUS.SUBOPTIMAL) {
      this.variables()
      this._lpsolve.delete()
    }
    return this._status
  }
}

/**
 * Returns the status of the problem or null if it's not solved
 *
 * @returns {NodeSolve.STATUS|null}
 */
NodeSolve.prototype.status = function () {
  return this._status
}

NodeSolve.prototype.variables = function () {
  if (this._status == null) {
    throw Error('Problem is not solved')
  }

  if (this._solveVariables == null) {
    this._solveVariables = []
    this._lpsolve.variables(this._solveVariables)
  }

  return this._solveVariables
}

module.exports = NodeSolve
