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
 * Power by: Yatay
 * Due to the frequency of long strings, the 80-column wrap rule need not apply
 * to language files.
 */
'use strict';



Blockly.Blocks['controls_if'] = {
  // If/elseif/else condition.
  init: function() {
	this.setTooltip(Yatay.Msg.CONTROLS_IF_TOOLTIP);
    this.setHelpUrl(Yatay.Msg.CONTROLS_IF_HELPURL);
    this.setColour(295);
    this.appendValueInput('IF0')
        .setCheck('Boolean')
        .appendTitle(Yatay.Msg.CONTROLS_IF_MSG_IF);
    this.appendStatementInput('DO0')
        .appendTitle(Yatay.Msg.CONTROLS_IF_MSG_THEN);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['controls_if_elseif',
                                         'controls_if_else']));
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
  },
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.elseifCount_) {
      container.setAttribute('elseif', this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute('else', 1);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
    for (var x = 1; x <= this.elseifCount_; x++) {
      this.appendValueInput('IF' + x)
          .setCheck('Boolean')
          .appendTitle(Yatay.Msg.CONTROLS_IF_MSG_ELSEIF);
      this.appendStatementInput('DO' + x)
          .appendTitle(Yatay.Msg.CONTROLS_IF_MSG_THEN);
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
          .appendTitle(Yatay.Msg.CONTROLS_IF_MSG_ELSE);
    }
  },
  decompose: function(workspace) {
    var containerBlock = new Blockly.Block(workspace, 'controls_if_if');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var x = 1; x <= this.elseifCount_; x++) {
      var elseifBlock = new Blockly.Block(workspace, 'controls_if_elseif');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = new Blockly.Block(workspace, 'controls_if_else');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    // Disconnect the else input blocks and remove the inputs.
    if (this.elseCount_) {
      this.removeInput('ELSE');
    }
    this.elseCount_ = 0;
    // Disconnect all the elseif input blocks and remove the inputs.
    for (var x = this.elseifCount_; x > 0; x--) {
      this.removeInput('IF' + x);
      this.removeInput('DO' + x);
    }
    this.elseifCount_ = 0;
    // Rebuild the block's optional inputs.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          this.elseifCount_++;
          var ifInput = this.appendValueInput('IF' + this.elseifCount_)
              .setCheck('Boolean')
              .appendTitle(Yatay.Msg.CONTROLS_IF_MSG_ELSEIF);
          var doInput = this.appendStatementInput('DO' + this.elseifCount_);
          doInput.appendTitle(Yatay.Msg.CONTROLS_IF_MSG_THEN);
          // Reconnect any child blocks.
          if (clauseBlock.valueConnection_) {
            ifInput.connection.connect(clauseBlock.valueConnection_);
          }
          if (clauseBlock.statementConnection_) {
            doInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        case 'controls_if_else':
          this.elseCount_++;
          var elseInput = this.appendStatementInput('ELSE');
          elseInput.appendTitle(Yatay.Msg.CONTROLS_IF_MSG_ELSE);
          // Reconnect any child blocks.
          if (clauseBlock.statementConnection_) {
            elseInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  saveConnections: function(containerBlock) {
    // Store a pointer to any connected child blocks.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    var x = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          var inputIf = this.getInput('IF' + x);
          var inputDo = this.getInput('DO' + x);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          x++;
          break;
        case 'controls_if_else':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  }
};

Blockly.Blocks['controls_if_if'] = {
  // If condition.
  init: function() {
    this.setColour(295);
    this.appendDummyInput()
        .appendTitle(Yatay.Msg.CONTROLS_IF_MSG_IF);
    this.appendStatementInput('STACK');
    this.setTooltip(Yatay.Msg.CONTROLS_IF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_if_elseif'] = {
  // Else-If condition.
  init: function() {
    this.setColour(295);
    this.appendDummyInput()
        .appendTitle(Yatay.Msg.CONTROLS_IF_MSG_ELSEIF);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Yatay.Msg.CONTROLS_IF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_if_else'] = {
  // Else condition.
  init: function() {
    this.setColour(295);
    this.appendDummyInput()
        .appendTitle(Yatay.Msg.CONTROLS_IF_MSG_ELSE);
    this.setPreviousStatement(true);
    this.setTooltip(Yatay.Msg.CONTROLS_IF_TOOLTIP);
    this.contextMenu = false;
  }
};
//***********************************FIN BLOQUE IF ***********************************

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
    this.setColour(295);
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
    var OPER =
        [[Yatay.Msg.CONTROL_OPERATION_AND, 'AND'],
         [Yatay.Msg.CONTROL_OPERATION_OR, 'OR']];
	
    this.setHelpUrl(Yatay.Msg.CONTROL_OPERATION_HELPURL);
    this.setColour(295);
    this.setOutput(true, 'Boolean');
    this.appendValueInput('A')
        .setCheck('Boolean');
    this.appendValueInput('B')
        .setCheck('Boolean')
        .appendTitle(new Blockly.FieldDropdown(OPER), 'OP');
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
    this.setColour(295);
    this.setOutput(true, 'Boolean');
    this.interpolateMsg(Yatay.Msg.CONTROL_NEGATE_TITLE,
                        ['BOOL', 'Boolean', Blockly.ALIGN_RIGHT],
                        Blockly.ALIGN_RIGHT)
    this.setTooltip(Yatay.Msg.CONTROL_NEGATE_TOOLTIP);
  }
};

Blockly.Blocks['logic_boolean'] = {
  // Boolean data type: true and false.
  init: function() {
    var BOOLEANS =
        [[Yatay.Msg.CONTROL_BOOLEAN_TRUE, 'TRUE'],
         [Yatay.Msg.CONTROL_BOOLEAN_FALSE, 'FALSE']];
    this.setHelpUrl(Yatay.Msg.CONTROL_BOOLEAN_HELPURL);
    this.setColour(295);
    this.setOutput(true, 'Boolean');
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldDropdown(BOOLEANS), 'BOOL');
    this.setTooltip(Yatay.Msg.CONTROL_BOOLEAN_TOOLTIP);
  }
};


Blockly.Blocks['controls_whileUntil'] = {
  // Do while/until loop.
  category: 'Control',
  helpUrl: 'http://code.google.com/p/blockly/wiki/Repeat',
  init: function() {
    this.setColour(295);
    
	this.appendValueInput('BOOL')
        .setCheck('Boolean')
		.appendTitle(Yatay.Msg.CONTROL_WHILE);
    this.appendStatementInput('DO');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(Yatay.Msg.CONTROL_WHILE_TOOLTIP);
  }
};


Blockly.Blocks['controls_behaviour'] = {
  init: function() {
    this.setColour(198);
	//this.setMovable(false);
    this.appendDummyInput().appendTitle(new Blockly.FieldTextInput(Yatay.Msg.CONTROL_BEHAVIOUR), 'TEXT')
    .appendTitle(Yatay.Msg.CONTROL_BEHAVIOUR_PRIORITY)
    .appendTitle(new Blockly.FieldTextInput('1', function(text) {
	  var n = window.parseFloat(text || 0);
	  return window.isNaN(n) ? null : String(n);
	}), 'PR');
	this.appendStatementInput('BEHAVIOUR_CODE').appendTitle(Yatay.Msg.CONTROLS_BEHAVIOUR_ACTION);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
	this.setTooltip(Yatay.Msg.CONTROL_BEHAVIOUR_TOOLTIP);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;    
  }
};


Blockly.Blocks['controls_conditionalBehaviour'] = {
  init: function() {
    this.setColour(198);
	//this.setMovable(false);
    this.appendDummyInput().appendTitle(new Blockly.FieldTextInput(Yatay.Msg.CONTROL_BEHAVIOUR), 'TEXT')
    .appendTitle(Yatay.Msg.CONTROL_BEHAVIOUR_PRIORITY)
    .appendTitle(new Blockly.FieldTextInput('1', function(text) {
	  var n = window.parseFloat(text || 0);
	  return window.isNaN(n) ? null : String(n);
	}), 'PR');

    this.appendStatementInput('BEHAVIOUR_CONDITION')
        .appendTitle(Yatay.Msg.CONTROLS_BEHAVIOUR_CONDITION);

	this.appendStatementInput('BEHAVIOUR_CODE').appendTitle(Yatay.Msg.CONTROLS_BEHAVIOUR_ACTION);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
	this.setTooltip(Yatay.Msg.CONTROL_BEHAVIOUR_TOOLTIP);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;    
  }
};

Blockly.Blocks['controls_behaviourTrigger'] = {
  init: function() {
	this.setInputsInline(true);
    this.setColour(198);
	this.appendValueInput('BOOL')
        .setCheck('Boolean').appendTitle("   ");
    this.appendDummyInput().appendTitle("   ");
    this.setPreviousStatement(true);
    this.setNextStatement(false);
	this.setMovable(false);
	this.setTooltip(Yatay.Msg.CONTROL_BEHAVIOUR_TOOLTIP);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;    
  }
};



Blockly.Blocks['controls_sleep'] = {
  // Sleep x seconds.
  init: function() {
    this.setColour(295);
    var thisBlock = this;
    this.appendDummyInput().appendTitle(Yatay.Msg.CONTROL_SLEEP)
    .appendTitle(new Blockly.FieldTextInput('0', function(text) {
      // Ensure that only a number may be entered.
      // TODO: Handle cases like 'o', 'ten', '1,234', '3,14', etc.
      var n = window.parseFloat(text || 0);
      return window.isNaN(n) ? null : String(n);
    }), 'NUM');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Yatay.Msg.CONTROL_SLEEP_TOOLTIP);
  }
};

Blockly.Blocks['controls_repeat'] = {
  category: 'Control',
  init: function() {
    this.setColour(295);
	this.appendDummyInput().appendTitle(Yatay.Msg.CONTROL_REPEAT)
    this.appendDummyInput().appendTitle(new Blockly.FieldTextInput('1', function(text) {
	  var n = window.parseFloat(text || 0);
	  return window.isNaN(n) ? null : String(n);
	}), 'TIMES');
    this.appendDummyInput().appendTitle(Yatay.Msg.CONTROL_REPEAT_TIMES);
    this.setInputsInline(true);
    this.appendStatementInput('DO');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(Yatay.Msg.CONTROL_REPEAT_TOOLTIP);
  }
};

Blockly.Blocks['controls_timesExecuted'] = {
  category: 'Control',
   // Numeric value.
  init: function() {
    this.setHelpUrl(Blockly.Msg.MATH_NUMBER_HELPURL);
    this.setColour(295);
	this.appendDummyInput().appendTitle(Yatay.Msg.CONTROL_TIMES_EXECUTED);
    this.setOutput(true, 'Number');
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

