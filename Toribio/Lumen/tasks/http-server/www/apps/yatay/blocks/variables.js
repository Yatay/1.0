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
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';


Blockly.Blocks['variables_sensor_get'] = {
  // Variable getter.
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle(Yatay.Msg.COMPLEX_SENSOR_GET_TITLE)
        .appendTitle(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_GET_ITEM), 'VAR')
        .appendTitle(" ");
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_sensor_set';
  },
  getVars: function() {
    return [this.getTitleValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  },
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getTitleValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlTitle = goog.dom.createDom('title', null, name);
    xmlTitle.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlTitle);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  }
};

Blockly.Blocks['variables_sensor_set'] = {
  // Variable setter.
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(330);
    this.appendValueInput('VALUE')
        .appendTitle(Yatay.Msg.COMPLEX_SENSOR_SET_TITLE)
        .appendTitle(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_SET_ITEM), 'VAR')
        .appendTitle(" ");
    this.setPreviousStatement(true);
	this.setInputsInline(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_sensor_get';
	Yatay.CreateCustomSensor(Blockly.Msg.VARIABLES_SET_ITEM, "");
  },
  getVars: function() {
    return [this.getTitleValue('VAR')];
  },
  renameVar: function(oldName, newName) {
	Yatay.CreateCustomSensor(oldName, undefined);
	Yatay.CreateCustomSensor(newName, "");
    if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_sensor_get'].customContextMenu
};

Blockly.Blocks['variables_print'] = {
  // Text value.
  init: function() {
    this.setColour(330);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
		.appendTitle(Yatay.Msg.VARIABLES_PRINT + "  ")
        .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote0.png', 12, 12))
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT')
        .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote1.png', 12, 12)); 
  }
};


Blockly.Blocks['variables_print_stat'] = {
  // Text value.
  init: function() {
    this.setColour(330);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
		.appendTitle(Yatay.Msg.VARIABLES_PRINT + "  ")
        this.appendValueInput('VALUE'); 
    this.setInputsInline(true);
  }
};


Blockly.Blocks['variables_get'] = {
  // Variable getter.
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle(Yatay.Msg.VARIABLES_GET_TITLE)
        .appendTitle(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_GET_ITEM), 'VAR')
        .appendTitle(Yatay.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Yatay.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Yatay.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
  },
  getVars: function() {
    return [this.getTitleValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  },
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getTitleValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlTitle = goog.dom.createDom('title', null, name);
    xmlTitle.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlTitle);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  }
};

Blockly.Blocks['variables_set'] = {
  // Variable setter.
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(330);
    this.appendValueInput('VALUE')
        .appendTitle(Yatay.Msg.VARIABLES_SET_TITLE)
        .appendTitle(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_SET_ITEM), 'VAR')
        .appendTitle(Yatay.Msg.VARIABLES_SET_TAIL);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },
  getVars: function() {
    return [this.getTitleValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getTitleValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};

Blockly.Blocks['variables_text'] = {
  // Text value.
  init: function() {
    this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.setColour(330);
    this.appendDummyInput()
        .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote0.png', 12, 12))
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT')
        .appendTitle(new Blockly.FieldImage(Blockly.pathToBlockly +
        'media/quote1.png', 12, 12));
    this.setOutput(true, 'String');
    this.setTooltip(Blockly.Msg.TEXT_TEXT_TOOLTIP);
  }
};


