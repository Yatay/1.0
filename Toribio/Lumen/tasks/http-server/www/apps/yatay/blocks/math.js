/**
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
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
 * @fileoverview Math blocks for Blockly.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.math');

goog.require('Blockly.Blocks');


Blockly.Blocks['math_number'] = {
  // Numeric value.
  init: function() {
    this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
    this.setColour(225);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldTextInput('0',
        Blockly.FieldTextInput.numberValidator), 'NUM');
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Blockly.Blocks['math_arithmetic'] = {
  // Basic arithmetic operator.
  init: function() {
    var OPERATORS =
        [['+', 'ADD'],
         ['-', 'MINUS'],
         ['\u00D7', 'MULTIPLY'],
         ['\u00F7', 'DIVIDE'],
         ['^', 'POWER']];
    this.setHelpUrl(Blockly.Msg.MATH_ARITHMETIC_HELPURL);
    this.setColour(225);
    this.setOutput(true, 'Number');
    this.appendValueInput('A')
        .setCheck('Number');
    this.appendValueInput('B')
        .setCheck('Number')
        .appendTitle(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getTitleValue('OP');
      var TOOLTIPS = {
        ADD: Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
        MINUS: Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
        MULTIPLY: Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
        DIVIDE: Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE,
        POWER: Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['math_single'] = {
  // Advanced math operators with single operand.
  init: function() {
    var OPERATORS =
        [[Yatay.Msg.MATH_SINGLE_TOOLTIP_ROOT, 'ROOT'],
         [Yatay.Msg.MATH_SINGLE_TOOLTIP_ABS, 'ABS'],
         ['-', 'NEG'],
         ['ln', 'LN'],
         ['log10', 'LOG10'],
         ['e^', 'EXP'],
         ['10^', 'POW10']];
    this.setHelpUrl(Blockly.Msg.MATH_SINGLE_HELPURL);
    this.setColour(225);
    this.setOutput(true, 'Number');
    this.appendValueInput('NUM')
        .setCheck('Number')
        .appendTitle(new Blockly.FieldDropdown(OPERATORS), 'OP');
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getTitleValue('OP');
      var TOOLTIPS = {
        ROOT: Yatay.Msg.MATH_SINGLE_TOOLTIP_ROOT,
        ABS: Yatay.Msg.MATH_SINGLE_TOOLTIP_ABS,
        NEG: Yatay.Msg.MATH_SINGLE_TOOLTIP_NEG,
        LN: Yatay.Msg.MATH_SINGLE_TOOLTIP_LN,
        LOG10: Yatay.Msg.MATH_SINGLE_TOOLTIP_LOG10,
        EXP: Yatay.Msg.MATH_SINGLE_TOOLTIP_EXP,
        POW10: Yatay.Msg.MATH_SINGLE_TOOLTIP_POW10
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['math_trig'] = {
  // Trigonometry operators.
  init: function() {
    var OPERATORS =
        [[Yatay.Msg.MATH_TRIG_TOOLTIP_SIN, 'SIN'],
         ['cos', 'COS'],
         ['tan', 'TAN'],
         [Yatay.Msg.MATH_TRIG_TOOLTIP_ASIN, 'ASIN'],
         ['acos', 'ACOS'],
         ['atan', 'ATAN']];
    this.setHelpUrl(Blockly.Msg.MATH_TRIG_HELPURL);
    this.setColour(225);
    this.setOutput(true, 'Number');
    this.appendValueInput('NUM')
        .setCheck('Number')
        .appendTitle(new Blockly.FieldDropdown(OPERATORS), 'OP');
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getTitleValue('OP');
      var TOOLTIPS = {
        SIN: Yatay.Msg.MATH_TRIG_TOOLTIP_SIN,
        COS: Yatay.Msg.MATH_TRIG_TOOLTIP_COS,
        TAN: Yatay.Msg.MATH_TRIG_TOOLTIP_TAN,
        ASIN: Yatay.Msg.MATH_TRIG_TOOLTIP_ASIN,
        ACOS: Yatay.Msg.MATH_TRIG_TOOLTIP_ACOS,
        ATAN: Yatay.Msg.MATH_TRIG_TOOLTIP_ATAN
      };
      return TOOLTIPS[mode];
    });
  }
};




Blockly.Blocks['math_round'] = {
  // Rounding functions.
  init: function() {
    var OPERATORS =
        [[Yatay.Msg.MATH_ROUND_OPERATOR_ROUND, 'ROUND'],
         [Yatay.Msg.MATH_ROUND_OPERATOR_ROUNDUP, 'ROUNDUP'],
         [Yatay.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN, 'ROUNDDOWN']];
    this.setHelpUrl(Blockly.Msg.MATH_ROUND_HELPURL);
    this.setColour(225);
    this.setOutput(true, 'Number');
    this.appendValueInput('NUM')
        .setCheck('Number')
        .appendTitle(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setTooltip(Blockly.Msg.MATH_ROUND_TOOLTIP);
  }
};





