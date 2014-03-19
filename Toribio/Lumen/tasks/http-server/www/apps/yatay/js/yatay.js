/**
 * @fileoverview 
 * @author 
 */

/**
 * Supported languages
 */
BlocklyApps.LANGUAGES = ['es','en'];
BlocklyApps.LANG = BlocklyApps.getLang();
document.write('<script type="text/javascript" src="generated/' + BlocklyApps.LANG + '.js"></script>\n');

/**
 * Create namespace for the application
 */
Yatay = {}; 

/**
 * variables 
 * @type {Array}
 */
Yatay.variables = new Array();

/**
 * complex_sensors
 * @type {Array}
 */
Yatay.complex_sensors = new Array();

/**
 * currentWorkspaceXml
 * @type {string}
 */
Yatay.currentWorkspaceXml = "";
Yatay.variablesList = [];
Yatay.sensorsList = [];

/**
 * Initialize Blockly.  Called on page load.
 */
Yatay.init = function() {
	BlocklyApps.init();
	Yatay.DebugMode = false;
	Yatay.DebugBlockIdOffset = 0;
	var rtl = BlocklyApps.isRtl();
	var toolbox = document.getElementById('toolbox');
	Blockly.inject(document.getElementById('content_blocks'), {path: '../../', rtl: rtl, toolbox: toolbox, scrollbars: true});
	Blockly.Lua.addReservedWords('code, timeouts, checkTimeout');

	var container = document.getElementById('content_area');
	var onresize = function(e) {
		var bBox = BlocklyApps.getBBox_(container);
		var el = document.getElementById('content_blocks' );
		el.style.top = bBox.y + 'px';
		el.style.left = bBox.x + 'px';

		el.style.height = bBox.height + 'px';
		el.style.height = (2 * bBox.height - el.offsetHeight) + 'px';
		el.style.width = bBox.width + 'px';
		el.style.width = (2 * bBox.width - el.offsetWidth) + 'px';
	};
	
	window.addEventListener('resize', onresize, false);
	BlocklyApps.loadBlocks('');
	if ('BlocklyStorage' in window) {
		// Hook a save function onto unload.
		BlocklyStorage.backupOnUnload();
	}

	document.getElementById('content_blocks').style.visibility = 'visible';
	Blockly.fireUiEvent(window, 'resize');
	Blockly.fireUiEvent(window, 'resize');

	//Override the toolbox disable filter to hide the blocks i want
	Blockly.Flyout.prototype.filterForCapacity_ = function() {
	  var remainingCapacity = this.targetWorkspace_.remainingCapacity();
	  var blocks = this.workspace_.getTopBlocks(false);
	  for (var i = 0, block; block = blocks[i]; i++) {
		//var allBlocks = block.getDescendants();
		var allBlocks = block.getDescendants();
		var disabled = (Blockly.mainWorkspace.getTopBlocks().length > remainingCapacity) || Yatay.not_available_sensors.indexOf(block.type) != -1;
		if (!disabled)
		{
			if (block.type == "controls_behaviour" || block.type == "controls_conditionalBehaviour")
			{
				disabled = Yatay.workspaceHasBehaviour();
			}
		}
		block.setDisabled(disabled);
	  }
	};

	// Adding change listener to autosave
	Yatay.variables = new Array();
	var startXmlDom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
	Yatay.currentWorkspaceXml = Blockly.Xml.domToText(startXmlDom);
	function change() {
		Yatay.variables = new Array();
		var xmlDom = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
		var xmlText = Blockly.Xml.domToText(xmlDom);
		var justOneBehaviour = Blockly.mainWorkspace.getTopBlocks().length == 1
								&& (Blockly.mainWorkspace.getTopBlocks()[0].type == "controls_behaviour" ||
								Blockly.mainWorkspace.getTopBlocks()[0].type == "controls_conditionalBehaviour");

		if (Yatay.currentWorkspaceXml != xmlText && justOneBehaviour) {
		  Yatay.currentWorkspaceXml = xmlText;
		  Yatay.AutoSave();
		}
		Yatay.currentWorkspaceXml = xmlText;
	}

	//Override the delete trash to kill tests
	Blockly.BlockSvg.prototype.disposeUiEffect = function() {
	  if (Yatay.Common.testMode) {
      	Yatay.Common.killTasks();
	  }
	  Blockly.playAudio('delete');

	  var xy = Blockly.getSvgXY_(/** @type {!Element} */ (this.svgGroup_));
	  // Deeply clone the current block.
	  var clone = this.svgGroup_.cloneNode(true);
	  clone.translateX_ = xy.x;
	  clone.translateY_ = xy.y;
	  clone.setAttribute('transform',
		  'translate(' + clone.translateX_ + ',' + clone.translateY_ + ')');
	  Blockly.svg.appendChild(clone);
	  clone.bBox_ = clone.getBBox();
	  // Start the animation.
	  clone.startDate_ = new Date();
	  Blockly.BlockSvg.disposeUiStep_(clone);
	};

	var bindData = Blockly.addChangeListener(change);
	// Lazy-load the syntax-highlighting.
	window.setTimeout(BlocklyApps.importPrettify, 1);
	
	Blockly.Block.prototype.duplicateYatay_ = Blockly.Block.prototype.duplicate_;
	Blockly.Block.prototype.duplicate_ = function()
	{
		if ((this.type == "controls_behaviour" || this.type == "controls_conditionalBehaviour"  || this.type == "controls_behaviourTrigger") && Blockly.mainWorkspace.getTopBlocks().length > 0)
			return;
		this.duplicateYatay_();
	}

	Blockly.Block.prototype.renderYatay = Blockly.Block.prototype.render;
	Blockly.Block.prototype.render = function()
	{	
		this.renderYatay();
		setTimeout(function()
		{
			Blockly.fireUiEvent(window, 'resize');			
		}, 900);
	}
	
	//Separating variables from sensor variables
	Blockly.FieldVariable.dropdownCreate = function() {
	  var variableList = Blockly.Variables.allVariables();
	  if (this.sourceBlock_ != null)
	  {
	  	  variableList = Yatay.getVariableOrSensorSurroundList(this.sourceBlock_);
	  }
	  // Ensure that the currently selected variable is an option.
	  var name = this.getText();
	  if (name && variableList.indexOf(name) == -1) {
		variableList.push(name);
	  }
	  variableList.sort(goog.string.caseInsensitiveCompare);
	  variableList.push(Blockly.Msg.RENAME_VARIABLE);
	  variableList.push(Blockly.Msg.NEW_VARIABLE);
	  // Variables are not language-specific, use the name as both the user-facing
	  // text and the internal representation.
	  var options = [];
	  for (var x = 0; x < variableList.length; x++) {
		options[x] = [variableList[x], variableList[x]];
	  }
	  return options;
	};
	
	// BlocklyApps.bindClick('trashButton', function() {Yatay.discard();});  	
	setTimeout(function(){Blockly.mainWorkspace.render()},400);  
};


if (window.location.pathname.match(/readonly.html$/)) {
	window.addEventListener('load', BlocklyApps.initReadonly);
} else {
	window.addEventListener('load', Yatay.init);
}

/**
 * Discard all blocks from the workspace.
 */
Yatay.discard = function(param) {
	if (param == 'All') {
		localStorage.yatay_bxs = "";
		localStorage.yatay_bxs_autosaved = "";
		Blockly.mainWorkspace.clear();
		window.location.hash = '';
		Yatay.Common.behaviours.splice(0,Yatay.Common.behaviours.length);
		$("#bx_list").html('');
		if (Yatay.Tablet != undefined) {
			$("#behaviours_popup").hide();
		} else {
			$("#btn_bxs_ready").hide();								
		}
	} else {
		Yatay.clearWorkspace();	
		window.location.hash = '';
	}
	$('#delete_modal').modal('hide');
};

/**
 * clearWorkspace
 */
Yatay.clearWorkspace = function() {
	var justOneBehaviour = Blockly.mainWorkspace.getTopBlocks().length == 1
									&& (Blockly.mainWorkspace.getTopBlocks()[0].type == "controls_behaviour" ||
									Blockly.mainWorkspace.getTopBlocks()[0].type == "controls_conditionalBehaviour");
	if (justOneBehaviour) {
		var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].getValue();
		if (localStorage.yatay_bxs != null && localStorage.yatay_bxs != "") {
			localStgeBxs = JSON.parse(localStorage.yatay_bxs);
			for (var j=0; j< localStgeBxs.length; j++) {
				if (localStgeBxs[j][0] == name) {
					localStgeBxs.splice(j,1);
					break;
				}
			}
			localStorage.yatay_bxs = JSON.stringify(localStgeBxs);
		}
	}
	Blockly.mainWorkspace.clear();
}

/**
 * workspaceHasBehaviour
 */
Yatay.workspaceHasBehaviour = function(){
	var allBlocks = Blockly.mainWorkspace.getAllBlocks();
	for (var i = 0; i < allBlocks.length; i++) {
		if (allBlocks[i].type == "controls_behaviour"  || allBlocks[i].type == "controls_conditionalBehaviour")
			return true;
	}
	return false;
}

/**
 * enterTestMode
 */
Yatay.enterTestMode = function(needsClean) {
	if (needsClean)
		Blockly.mainWorkspace.clear();	
	//Remove all items from toolbox except "Butia"
	Blockly.Toolbox.tree_.children_[0].dispose();
	Blockly.Toolbox.tree_.children_[1].dispose();
	Blockly.Toolbox.tree_.children_[3].dispose();
	Blockly.Toolbox.tree_.children_[4].dispose();
	Blockly.Toolbox.tree_.children_[5].dispose();
	//Only one block allowed
	Blockly.mainWorkspace.maxBlocks = 1;
	

};

/**
 * leaveTestMode
 */
Yatay.leaveTestMode = function() {
	//Remove all items from toolbox (to avoid repeatance of items on init) and init toolbox again
	Blockly.Toolbox.tree_.children_[2].dispose();
	for (var i=0; i<6; i++) {
		Blockly.Toolbox.tree_.children_.pop();
	}
	Blockly.Toolbox.populate_();
	Blockly.mainWorkspace.maxBlocks = "Infinite";
	Blockly.mainWorkspace.clear();
	Yatay.Common.addStyleToBlocklyToolbox();
};

/**
 * ExistVariable
 */
Yatay.ExistVariable = function(variable){
	var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].getValue();
	if (Yatay.variables[name] == null)	{
		Yatay.variables[name] = new Array();
		Yatay.variables[name][variable] = true;
		return false;
	}
	else if (Yatay.variables[name][variable] == null) {
		Yatay.variables[name][variable] = true;
		return false;
	}
	else
		return true;
}

/**
 * ReturnCustomSensor
 */
Yatay.ReturnCustomSensor = function(sensor) {
	if (Yatay.complex_sensors == null) {
		Yatay.complex_sensors = new Array();
		return "";
	} else if (Yatay.complex_sensors[sensor] != null) {
		return Yatay.complex_sensors[sensor];
	}else
		return "";
}

/**
 * CreateCustomSensor
 */
Yatay.CreateCustomSensor = function(sensor, code) {
	if (Yatay.complex_sensors == null) 
		Yatay.complex_sensors = new Array();		

	if (code == undefined && Yatay.complex_sensors[sensor] != undefined)
		return;

	Yatay.complex_sensors[sensor] = code;
	return;
};

/**
 * Autosave Listener
 */
Yatay.AutoSave = function() {
	if (Blockly.mainWorkspace != null && Blockly.mainWorkspace.getAllBlocks().length >=1) {
		Yatay.variables = new Array();
		var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
		var code = Blockly.Xml.domToText(xml);
		var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].getValue();
		var isrepeated = true; var index = 0; var originalname = name;
		while (isrepeated)
		{
			var isrepeated = false;
			for (var i=0; i< Yatay.Common.behaviours.length; i++) {
				if (Yatay.Common.behaviours[i][2] == name) {
					isrepeated = true; 
					index++;
					name = originalname + index.toString();
					break;
				}
			}
			if (name != originalname)
				Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].setValue(name);
		}
		if (Yatay.countBlocks != Blockly.mainWorkspace.getAllBlocks().length) {
			Yatay.countBlocks = Blockly.mainWorkspace.getAllBlocks().length;
			name = Yatay.Common.saveTask(name, code);
		}
		//Saving in browser localstorage to avoid losing behaviours and blocks on reload 
		Yatay.Common.saveInBrowser(name, code);
	}
	Yatay.countBlocks = Blockly.mainWorkspace.getAllBlocks().length;
};

/**
 * SaveToDisk
 */
function SaveToDisk(fileUrl) {
	 $("#download")[0].innerHTML += '<a id="adown" style="display:none" target="_blank" href="'+fileUrl+'" >download</a>';	
	var link = document.getElementById('adown'),
	event = document.createEvent( 'HTMLEvents' );
	event.initEvent( 'click', true, true );
	link.dispatchEvent( event );	
}


Yatay.getVariableOrSensorSurroundList = function(block)
{
	var blocks = Blockly.mainWorkspace.getAllBlocks();		
	var setType = block.type.replace("_get","_set");
	var list = [];
	//If sensor then return the global list of sensors
	if (block.type.indexOf("sensor") != -1)
	{
		for (var x=0; x < Yatay.Common.behaviours.length; x++)
		{
			var matches = Yatay.Common.behaviours[0][1].match(/variables_sensor_set\" inline\=\"true\"><title name\=\"VAR\"\>(.)*?\<\/title\>/g);
			if (matches != null)
			{
				for (var j=0; j<matches.length; j++)
				{
					list.push(matches[j].replace('variables_sensor_set" inline="true"><title name="VAR">', "").replace("</title>", ""));
				}
			}
		}
		var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
		var text = Blockly.Xml.domToText(xml);
		var matches = text.match(/variables_sensor_set\" inline\=\"true\"><title name\=\"VAR\"\>(.)*?\<\/title\>/g);
		if (matches != null)
		{
			for (var j=0; j<matches.length; j++)
			{
				list.push(matches[j].replace('variables_sensor_set" inline="true"><title name="VAR">', "").replace("</title>", ""));
			}
		}
		return list;
	}
	var iterBlock = block.parentBlock_;
	while (iterBlock != null) {
		if (iterBlock.type == setType)
		{
			//founded a variable/sensor on top of the block, add it to the list
			var newItem = iterBlock.inputList[0].titleRow[1].getValue();
			if (list.indexOf(newItem) == -1)
				list.push(newItem);
		}
		iterBlock = iterBlock.parentBlock_;
	}
	return list;
}
