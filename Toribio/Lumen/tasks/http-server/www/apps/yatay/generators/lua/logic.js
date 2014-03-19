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
 * @fileoverview Generating Lua for logic blocks.
 * @author fraser@google.com (Neil Fraser)
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to language files.
 */

 'use strict';

goog.provide('Blockly.Lua.logic');
goog.require('Blockly.Lua');

Blockly.Lua["logic_compare"] = function(opt_dropParens) {
  // Comparison operator. 
  var OPERATORS = {
    EQ: '==',
    NEQ: '~=',
    LT: '<',
    LTE: '<=',
    GT: '>',
    GTE: '>='
  };
  var operator = OPERATORS[this.getTitleValue('OP')];
  var argument0 = Blockly.Lua.statementToCode(this, 'A') || '0';
  var argument1 = Blockly.Lua.statementToCode(this, 'B') || '0';
  var code = argument0.trimLeft() + ' ' + operator + ' ' + argument1.trimLeft();
  if (!opt_dropParens) {
    code = '(' + code + ')';
  }
  return code;
};

Blockly.Lua["logic_operation"] = function(opt_dropParens) {
  // Operations 'and', 'or'.
  var argument0 = Blockly.Lua.statementToCode(this, 'A') || 'false';
  var argument1 = Blockly.Lua.statementToCode(this, 'B') || 'false';
  var operator = (this.getTitleValue('OP') == 'AND') ? 'and' : 'or';
  var code = "(" +argument0.trimLeft() + ') ' + operator + ' (' + argument1.trimLeft() +")";
  if (!opt_dropParens) {
    code = '(' + code + ')';
  }
  return code;
};

Blockly.Lua["logic_negate"] = function(opt_dropParens) {
  // Negation.
  var argument0 = Blockly.Lua.statementToCode(this, 'BOOL') || 'false';
  var code = 'not ' + '(' + argument0 + ')';
  if (!opt_dropParens) {
    code = '(' + code + ')';
  }
  return code;
};

Blockly.Lua["logic_constrain"] = function() {
  // Constrain a number between two limits.
  var argument0 = Blockly.Lua.statementToCode(this, 'VALUE', true) || '0';
  var argument1 = Blockly.Lua.statementToCode(this, 'LOW', true) || '0';
  var argument2 = Blockly.Lua.statementToCode(this, 'HIGH', true) || '0';
  return '('+ argument0 + '>=' + argument1 + ' and ' + argument0 + '<=' + argument2 + ')';
};


Blockly.Lua["logic_boolean"] = function() {
  // Boolean values true and false.
  return (this.getTitleValue('BOOL') == 'TRUE') ? 'true' : 'false';
};


