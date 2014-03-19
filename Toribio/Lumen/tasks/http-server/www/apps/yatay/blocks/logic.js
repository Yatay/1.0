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
 * @fileoverview Blocks for YataY application.
 * @author YataY Group
 */
'use strict';

Blockly.Blocks['logic_compare'] = {
  // Comparison operator.
  init: function() {
    if (Blockly.RTL) {
      var OPERATORS = [
        ['=', 'EQ'],
        ['\u2260', 'NEQ'],
        ['>', 'LT'],
        ['\u2265', 'LTE'],
        ['<', 'GT'],
        ['\u2264', 'GTE']
      ];
    } else {
      var OPERATORS = [
        ['=', 'EQ'],
        ['\u2260', 'NEQ'],
        ['<', 'LT'],
        ['\u2264', 'LTE'],
        ['>', 'GT'],
        ['\u2265', 'GTE']
      ];
    }
    this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setColour(24);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendTitle(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getTitleValue('OP');
      var TOOLTIPS = {
        EQ: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
        NEQ: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
        LT: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
        LTE: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
        GT: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
        GTE: Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
      };
      return TOOLTIPS[op];
    });
  }
};

Blockly.Blocks['logic_operation'] = {
  // Logical operations: 'and', 'or'.
  init: function() {
    var OPERATORS =
        [[Yatay.Msg.CONTROL_OPERATION_AND, 'AND'],
         [Yatay.Msg.CONTROL_OPERATION_OR, 'OR']];
    this.setHelpUrl(Yatay.Msg.CONTROL_OPERATION_HELPURL);
    this.setColour(24);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A')
        .setCheck('Boolean');
    this.appendValueInput('B')
        .setCheck('Boolean')
        .appendTitle(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getTitleValue('OP');
      var TOOLTIPS = {
        AND: Yatay.Msg.LOGIC_OPERATION_TOOLTIP_AND,
        OR: Yatay.Msg.LOGIC_OPERATION_TOOLTIP_OR
      };
      return thisBlock.TOOLTIPS[op];
    });
  }
};

Blockly.Blocks['logic_negate'] = {
  // Negation.
  init: function() {
    this.setHelpUrl(Yatay.Msg.CONTROL_NEGATE_HELPURL);
    this.setColour(24);
    this.setOutput(true, 'Boolean');
    this.interpolateMsg(Yatay.Msg.CONTROL_NEGATE_TITLE,
                        ['BOOL', 'Boolean', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT)
    this.setTooltip(Yatay.Msg.CONTROL_NEGATE_TOOLTIP);
  }
};

Blockly.Blocks['logic_constrain'] = {
  // Constrain a number between two limits.
  init: function() {
    this.setHelpUrl(Yatay.Msg.MATH_CONSTRAIN_HELPURL);
    this.setColour(24);
    this.setOutput(true, 'Boolean');
    this.interpolateMsg(Yatay.Msg.MATH_CONSTRAIN_TITLE,
                        ['VALUE', 'Number', Blockly.ALIGN_RIGHT],
                        ['LOW', 'Number', Blockly.ALIGN_RIGHT],
                        ['HIGH', 'Number', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT)
    this.setInputsInline(true);
    this.setTooltip(Yatay.Msg.MATH_CONSTRAIN_TOOLTIP);
  }
};

Blockly.Blocks['logic_boolean'] = {
  // Boolean data type: true and false.
  init: function() {
    var BOOLEANS =
        [[Yatay.Msg.CONTROL_BOOLEAN_TRUE, 'TRUE'],
         [Yatay.Msg.CONTROL_BOOLEAN_FALSE, 'FALSE']];
    this.setHelpUrl(Yatay.Msg.CONTROL_BOOLEAN_HELPURL);
    this.setColour(24);
    this.setOutput(true, 'Boolean');
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(BOOLEANS), 'BOOL');
    this.setTooltip(Yatay.Msg.CONTROL_BOOLEAN_TOOLTIP);
  }
};
