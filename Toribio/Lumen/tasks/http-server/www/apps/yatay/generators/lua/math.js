/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Lua for math blocks.
 * @author fraser@google.com (Neil Fraser)
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to language files.
 */

 'use strict';

goog.provide('Blockly.Lua.math');

goog.require('Blockly.Lua');


Blockly.Lua["math_number"] = function() {
  // Numeric value.
  return window.parseFloat(this.getTitleValue('NUM')).toString().trim();
};

Blockly.Lua["math_arithmetic"] = function(opt_dropParens) {
  // Basic arithmetic operators, and power.
  var argument0 = Blockly.Lua.statementToCode(this, 'A')  || '0' ;
  var argument1 = Blockly.Lua.statementToCode(this, 'B') || '0' ;
  
  var code;

  var mode = this.getTitleValue('OP');
  if (mode == 'POWER') {
    code = 'math.pow(' + argument0 + ', ' + argument1 + ')';
  } else {
    var operator = Blockly.Lua.math_arithmetic.OPERATORS[mode];
    code = "tonumber(" + argument0.trimLeft() + ")" + operator + "tonumber(" + argument1.trimLeft() + ")" ;
    if (!opt_dropParens) {
      code = '(' + code + ')';
    }
  }

  return code;
};

Blockly.Lua["math_arithmetic"].OPERATORS = {
  ADD: ' + ',
  MINUS: ' - ',
  MULTIPLY: ' * ',
  DIVIDE: ' / '
};

Blockly.Lua["math_change"] = function() {
  // Add to a variable in place.
  var argument0 = Blockly.Lua.statementToCode(this, 'DELTA') || '0';
  var varName = Blockly.Lua.variableDB_.getName(this.getTitleText('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + ' = (typeof ' + varName + ' == \'number\' ? ' + varName +
      ' : 0) + ' + argument0 + ';\n';
};

Blockly.Lua["math_single"] = function(opt_dropParens) {
  // Math operators with single operand.
  var argNaked = Blockly.Lua.statementToCode(this, 'NUM', true) || '0';
  var argParen = Blockly.Lua.statementToCode(this, 'NUM', false) || '0';
  var operator = this.getTitleValue('OP');
  var code;
  // First, handle cases which generate values that don't need parentheses wrapping the code.
  switch (operator) {
    case 'ABS':
      code = 'math.abs( tonumber(' + argNaked + '))';
      break;
    case 'ROOT':
      code = 'math.sqrt( tonumber('  + argNaked + '))';
      break;
    case 'LN':
      code = 'math.log( tonumber(' + argNaked + '))';
      break;
    case 'EXP':
      code = 'math.exp( tonumber('  + argNaked + '))';
      break;
    case 'POW10':
      code = 'math.pow(10, tonumber('  + argNaked + '))';
      break;
    case 'ROUND':
      code = 'math.floor( tonumber('  + argNaked + ') + 0.5)';
      break;
    case 'ROUNDUP':
      code = 'math.ceil( tonumber('  + argNaked + '))';
      break;
    case 'ROUNDDOWN':
      code = 'math.floor( tonumber('  + argNaked + '))';
      break;
    case 'SIN':
      code = 'math.sin( tonumber('  + argParen + ') / 180 * math.pi)';
      break;
    case 'COS':
      code = 'math.cos( tonumber('  + argParen + ') / 180 * math.pi)';
      break;
    case 'TAN':
      code = 'math.tan( tonumber('  + argParen + ') / 180 * math.pi)';
      break;
  }
  if (code) {
    return code;
  }
  // Second, handle cases which generate values that may need parentheses wrapping the code.
  switch (operator) {
    case 'NEG':
      code = '-' + argParen;
      break;
    case 'LOG10':
      code = 'math.log(' + argNaked + ') / math.log(10)';
      break;
    case 'ASIN':
      code = 'math.asin(' + argNaked + ') / math.pi * 180';
      break;
    case 'ACOS':
      code = 'math.acos(' + argNaked + ') / math.pi * 180';
      break;
    case 'ATAN':
      code = 'math.atan(' + argNaked + ') / math.pi * 180';
      break;
    default:
      throw 'Unknown math operator.';
  }
  if (!opt_dropParens) {
    code = '(' + code + ')';
  }
  return code;
};

// Rounding functions have a single operand.
Blockly.Lua.math_round = Blockly.Lua.math_single;
// Trigonometry functions have a single operand.
Blockly.Lua.math_trig = Blockly.Lua.math_single;

Blockly.Lua.math_on_list = function() {
  // Rounding functions.
  func = this.getTitleValue('OP');
  list = Blockly.Lua.valueToCode(this, 'LIST', true) || '[]';
  var code;
  switch (func) {
    case 'SUM':
      code = list + '.reduce(function(x, y) {return x + y;})';
      break;
    case 'MIN':
      code = 'math.min.apply(null,' + list + ')';
      break;
    case 'MAX':
      code = 'math.max.apply(null,' + list + ')';
      break;
    case 'AVERAGE':
      code = '(' + list + '.reduce(function(x, y) {return x + y;})/' + list +
      '.length)';
      break;
    case 'MEDIAN':
      if (!Blockly.Lua.definitions_['math_median']) {
        var functionName = Blockly.Lua.variableDB_.getDistinctName(
            'math_median', Blockly.Generator.NAME_TYPE);
        Blockly.Lua.math_on_list.math_median = functionName;
        // Median is not a native Lua function.  Define one.
        // May need to handle null.
        // Currently math_median([null,null,1,3]) == 0.5.
        var func = [];
        func.push('function ' + functionName + '(myList) {');
        func.push('  var localList = myList.filter(function (x) {return typeof x == \'number\';});');
        func.push('  if (!localList.length) return null;');
        func.push('  localList.sort(function(a, b) {return b - a;});');
        func.push('  if (localList.length % 2 == 0) {');
        func.push('    return (localList[localList.length / 2 - 1] + localList[localList.length / 2]) / 2;');
        func.push('  } else {');
        func.push('    return localList[(localList.length - 1) / 2];');
        func.push('  }');
        func.push('}');
        Blockly.Lua.definitions_['math_median'] = func.join('\n');
      }
      code = Blockly.Lua.math_on_list.math_median + '(' + list + ')';
      break;
    case 'MODE':
      if (!Blockly.Lua.definitions_['math_modes']) {
        var functionName = Blockly.Lua.variableDB_.getDistinctName(
            'math_modes', Blockly.Generator.NAME_TYPE);
        Blockly.Lua.math_on_list.math_modes = functionName;
        // As a list of numbers can contain more than one mode,
        // the returned result is provided as an array.
        // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
        var func = [];
        func.push('function ' + functionName + '(values) {');
        func.push('  var modes = [];');
        func.push('  var counts = [];');
        func.push('  var maxCount = 0;');
        func.push('  for (var i = 0; i < values.length; i++) {');
        func.push('    var value = values[i];');
        func.push('    var found = false;');
        func.push('    var thisCount;');
        func.push('    for (var j = 0; j < counts.length; j++) {');
        func.push('      if (counts[j][0] === value) {');
        func.push('        thisCount = ++counts[j][1];');
        func.push('        found = true;');
        func.push('        break;');
        func.push('      }');
        func.push('    }');
        func.push('    if (!found) {');
        func.push('      counts.push([value, 1]);');
        func.push('      thisCount = 1;');
        func.push('    }');
        func.push('    maxCount = math.max(thisCount, maxCount);');
        func.push('  }');
        func.push('  for (var j = 0; j < counts.length; j++) {');
        func.push('    if (counts[j][1] == maxCount) {');
        func.push('        modes.push(counts[j][0]);');
        func.push('    }');
        func.push('  }');
        func.push('  return modes;');
        func.push('}');
        Blockly.Lua.definitions_['math_modes'] = func.join('\n');
      }
      code = Blockly.Lua.math_on_list.math_modes + '(' + list + ')';
      break;
    case 'STD_DEV':
      if (!Blockly.Lua.definitions_['math_standard_deviation']) {
        var functionName = Blockly.Lua.variableDB_.getDistinctName(
            'math_standard_deviation', Blockly.Generator.NAME_TYPE);
        Blockly.Lua.math_on_list.math_standard_deviation = functionName;
        var func = [];
        func.push('function ' + functionName + '(numbers) {');
        func.push('  var n = numbers.length;');
        func.push('  if (!n) return null;');
        func.push('  var mean = numbers.reduce(function(x, y) {return x + y;}) / n;');
        func.push('  var variance = 0;');
        func.push('  for (var j = 0; j < n; j++) {');
        func.push('    variance += math.pow(numbers[j] - mean, 2);');
        func.push('  }');
        func.push('  variance = variance / n;');
        func.push('  standard_dev = math.sqrt(variance);');
        func.push('  return standard_dev;');
        func.push('}');
        Blockly.Lua.definitions_['math_standard_deviation'] = func.join('\n');
      }
      code = Blockly.Lua.math_on_list.math_standard_deviation + '(' + list + ')';
      break;
    case 'RANDOM':
      code = list + '[math.floor(math.random() * ' + list + '.length)]';
      break;
    default:
      throw 'Unknown operator.';
  }
  return code;
};

Blockly.Lua.math_modulo = function(opt_dropParens) {
  // Remainder computation.
  var argument0 = Blockly.Lua.valueToCode(this, 'DIVIDEND') || '0';
  var argument1 = Blockly.Lua.valueToCode(this, 'DIVISOR') || '0';
  var code = argument0 + ' % ' + argument1;
  if (!opt_dropParens) {
    code = '(' + code + ')';
  }
  return code;
};

Blockly.Lua.math_random_int = function() {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.Lua.valueToCode(this, 'FROM') || '0';
  var argument1 = Blockly.Lua.valueToCode(this, 'TO') || '0';
  var rand1 = 'math.floor(math.random() * (' + argument1 + ' - ' + argument0 + ' + 1' + ') + ' + argument0 + ')';
  var rand2 = 'math.floor(math.random() * (' + argument0 + ' - ' + argument1 + ' + 1' + ') + ' + argument1 + ')';
  var code;
  if (argument0.match(/^[\d\.]+$/) && argument1.match(/^[\d\.]+$/)) {
    if (parseFloat(argument0) < parseFloat(argument1)) {
      code = rand1;
    } else {
      code = rand2;
    }
  } else {
    code = argument0 + ' < ' + argument1 + ' ? ' + rand1 + ' : ' + rand2;
  }
  return code;
};

Blockly.Lua.math_random_float = function() {
  // Random fraction between 0 and 1.
  return 'math.random()';
};
