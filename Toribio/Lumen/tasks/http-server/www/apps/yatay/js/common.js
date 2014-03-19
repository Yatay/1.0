/**
 * @fileoverview 
 * @author 
 */

/**
 * Create namespace for tablet and mobile applications
 */
if (!Yatay.Common){ 
	Yatay.Common = {};
}; 

/**
 * Xml workspace code of file being loaded 
 * @type {string}
 */
Yatay.Common.fileCode = ''; 

/**
 * Xml workspace code of behaviours being loaded 
 * @type {[[string, string]]}
 */
Yatay.Common.bxsCode = [];

/**
 * Selected project to be join
 * @type {string}
 */
Yatay.Common.joinProj = '';

/**
 * Selected behaviours to be load 
 * @type {[string][string]}
 */
Yatay.Common.activesBxs = [];

/**
 * Selected project to be load 
 * @type {[string]}
 */
Yatay.Common.activesProj = [];

/**
 * Behaviours ready 
 * @type {[[int, string]]}
 */
Yatay.Common.behaviours = [];

/**
 * Yatay need to refresh blocks? 
 * @type {[bool]}
 */
Yatay.Common.refresh = false;

/**
 * Edited Behaviours  
 * @type {[[int, string]]}
 */
Yatay.Common.editedBxs = []; 

/**
 * Active edited Behaviours  
 * @type {[int]}
 */
Yatay.Common.editedBxs.active = -1; 

/**
 * Test mode status
 * @type {[bool]}
 */
Yatay.Common.testMode = false;

/**
 * Butia block selected and trying to be tested
 * @type {[bool]}
 */
Yatay.Common.isButiaBlockSelected = false;

/**
 * CodeMirror Editor
 * @type {[Object]}
 */
Yatay.Common.editor = undefined;

/**
 * Initialize Yatay on load
 */
$(window).load(function() {
	setTimeout(function() {
		//Restoring browser persistance of blocks
		try {
			if (localStorage.yatay_bxs != null && localStorage.yatay_bxs != "") {
				var behaviours = JSON.parse(localStorage.yatay_bxs);
				for(var j=0; j< behaviours.length; j++) {
					if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
						Yatay.Common.bxReady();
					}
					var alreadyExists = false;
					for(var i=0; i< Yatay.Common.behaviours.length; i++) {
						if (Yatay.Common.behaviours[i][2] == behaviours[j][0]) {
							alreadyExists = true;
							break;
						}
					}			
					if (!alreadyExists)	{
						var success = false;
						while (!success) {
							var code = Blockly.Xml.textToDom(behaviours[j][1]);
							var codeText = behaviours[j][1];
							try {       
							
								Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, code);	
								success = true;
							} catch(e) {
								//A block doesn't exist anymore. Is necesary to know it's type so you know to what it is connected.
								Blockly.mainWorkspace.clear();
								if (e.message != null && e.message.split('"').length > 2) {
									var blockInFault = e.message.split('"')[1];
									Yatay.Common.tryToRecover(blockInFault, codeText);
									Yatay.not_available_sensors.push(blockInFault);
								} else {	
									//Couldn't recover
									Yatay.Common.ShowMessage(Yatay.Msg.CANNOT_PARSE_BLOCKS);
									success = true;
								}							
							}
						}
					}
				}
			}
			Yatay.Common.bxReady();
		} catch(e) {}
		try {Yatay.Common.addStyleToBlocklyToolbox();} catch(e) {}

		//Mystical fix for the blockly-bootstrap scrollbar conflict
		try {$("foreignObject img").css("max-width","none");} catch(e) {}
	}, 100);
});

/**
 * Initialize (start refresh blocks poll)
 */
$(document).ready(function() {
	Yatay.Common.refreshBlocksPoll();
});

/**
 * Load all dialogs (multilanguage)
 */
Yatay.Common.loadDialogs = function() {
	$('#code_label').html(Yatay.Msg.DIALOG_CODE_LABEL);
	$('#btn_save2').html(Yatay.Msg.DIALOG_SAVE);
	$('#btn_run2').html(Yatay.Msg.DIALOG_RUN);
	$('#btn_openfile').html(Yatay.Msg.DIALOG_OPEN);
	$('#loader_label').html(Yatay.Msg.DIALOG_LOADER_LABEL);	
	$('#txt_local_input').html(Yatay.Msg.DIALOG_LOCAL_INPUT);
	$('#txt_remote_input').html(Yatay.Msg.DIALOG_REMOTE_INPUT);
	$('#btn_remote_loader').before(Yatay.Msg.DIALOG_TXT_REMOTE_INPUT);
	$('#btn_remote_loader').html(Yatay.Msg.DIALOG_REMOTE_LOADER);
	$('#projmanager_label').html(Yatay.Msg.DIALOG_PROJMANAGER_LABEL);
	$('#txt_new_proj').html(Yatay.Msg.DIALOG_NEW_PROJ);
	$('#proj_input').before(Yatay.Msg.DIALOG_PROJ_NAME);
	$('#txt_remote_proj').html(Yatay.Msg.DIALOG_REMOTE_PROJ);
	$('#btn_remote_proj').before(Yatay.Msg.DIALOG_TXT_REMOTE_PROJ);
	$('#btn_remote_proj').html(Yatay.Msg.DIALOG_REMOTE_LOADER);	
	$('#btn_openproj').html(Yatay.Msg.DIALOG_START);
	$('#btn_delete_all').html(Yatay.Msg.DIALOG_DELETE_ALL);
	$('#btn_delete_workspace').html(Yatay.Msg.DIALOG_DELETE_WORKSPACE);
	$('#delete_label').html(Yatay.Msg.DIALOG_DELETE_LABEL);
	$('#edition_error_title').html(Yatay.Msg.DIALOG_EDITION_ERROR_TITLE);
	$('#btn_error_detail').html(Yatay.Msg.DIALOG_EDITION_ERROR_BTN);
	$('#edition_error_msg').html(Yatay.Msg.DIALOG_EDITION_ERROR_MSG);
};

/**
 * Bootstrap-multiselect list builder
 */ 
Yatay.Common.buildMultiSelector = function(select, selectAll) {
	selectAll = typeof selectAll != 'undefined' ? selectAll : true;
	if (selectAll) {
		select.multiselect({
			includeSelectAllOption: true,
			onChange: Yatay.Common.BxsChangeSelection,
			selectAllValue: 'multiselect-select-all',
			selectAllText: Yatay.Msg.DIALOG_MULTISELECT_ALL,
			nonSelectedText: Yatay.Msg.DIALOG_MULTISELECT_NONE
		});
	} else {
		select.multiselect({
			onChange: Yatay.Common.ProjChangeSelection,
			nonSelectedText: Yatay.Msg.DIALOG_MULTISELECT_NONE
		});
	}
	return false;
};

/**
 * Handle onChange of Behaviours Bootstrap-multiselect list
 */
Yatay.Common.BxsChangeSelection = function(element, checked) {
	$(".modal-body").scrollTop($(".modal-body")[0].scrollHeight);
        
	var project = element['context']['id'];
	var selected = $('#' + project).val();                

	Yatay.Common.activesBxs[project] = [];

	if (selected == null) {
		 Yatay.Common.activesProj.pop(project);
	} else {
		 for (var i=0; i < selected.length; i++) {
		         if (selected[i] != 'multiselect-select-all') {                        
		                 if (Yatay.Common.activesProj.indexOf(project) == -1) {
		                         Yatay.Common.activesProj.push(project);
		                 }
		                 if (Yatay.Common.activesBxs[project].indexOf(selected[i]) == -1) {
		                         Yatay.Common.activesBxs[project].push(selected[i]);                                
		                 }
		         }
		 }
	}
}; 

/**
 * Handle onChange of Projects Bootstrap-multiselect list
 */
Yatay.Common.ProjChangeSelection = function(element, checked) {
	$(".modal-body").scrollTop($(".modal-body")[0].scrollHeight);
	Yatay.Common.joinProj = element['context']['value'];
}; 

/**
* Opens the Delete popup
*/	
Yatay.Common.openDeleteModal = function() {
	$('#btn_trash')[0].onclick = function(){return false;};
	if (Yatay.Common.testMode) {
		Blockly.mainWorkspace.clear();
		Yatay.Common.killTasks();
	}
	else
		$("#delete_modal").modal('show');
	setTimeout(function() {	$('#btn_trash')[0].onclick = Yatay.Common.openDeleteModal;} , 800);
};

/**
 * Send task to server
 */
Yatay.Common.sendTasks = function(code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A").replace(/\+/,"%2B");
	var idUser = Yatay.Common.getCookie("idUser");
	if (idUser == null) {
		location.reload(); 
		return;
	}
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'init', code:values, userId: idUser},
		success: function() {
			$('#results_popup').show();
		},
		error:function() {}
	});
};

/**
 * Send Robot Test block to server
 */
Yatay.Common.testRobot = function(code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A").replace(/\+/,"%2B");
	var idUser = Yatay.Common.getCookie("idUser");
	if (idUser == null) {
		location.reload(); 
		return;
	}
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'test', code:values, userId: idUser},
		success: function() {
			$('#results_popup').show();
		},
		error:function() {}
	});
}

/**
 * Kill all tasks running
 */
Yatay.Common.killTasks = function() {
	$('#btn_stop')[0].onclick = function(){return false;};
	var idUser = Yatay.Common.getCookie("idUser");
	if (idUser == null) {
		location.reload(); 
		return;
	}
	Yatay.DebugMode = false;
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'kill', code:'', userId: idUser},
		success: function(){
			$('#results_popup').hide();
		},
		error:function(){}
	});
	setTimeout(function() {	$('#btn_stop')[0].onclick = Yatay.Common.killTasks;} , 800);
};

/**
 * Save current task
 */
Yatay.Common.saveTask = function(block, code) {
	var values = escape(code).replace(/\./g, "%2E").replace(/\*/g,"%2A").replace(/\+/,"%2B");
	var project = Yatay.Common.getCookie('project_name');
	//var newborn = (Yatay.Common.getCookie(project+'_'+block) != '') ? false : true;
	var newborn = true;
	var localStgeBxs = [];
	if (localStorage.yatay_bxs_autosaved != null && localStorage.yatay_bxs_autosaved != "")
		localStgeBxs = JSON.parse(localStorage.yatay_bxs_autosaved);
	for (var j=0; j< localStgeBxs.length; j++) {
		if (localStgeBxs[j] == block) 
		{
			newborn = false;
			break;
		}
	}

	var totalBlockCount = Blockly.mainWorkspace.getAllBlocks().length;
	//The trigger doesn't count
	if (totalBlockCount == 2 && Blockly.mainWorkspace.getTopBlocks()[0].type == "controls_conditionalBehaviour")
		totalBlockCount = 1;

	if (project != '' && values != '') {
		$.ajax({
			url: "/index.html",
			type: "POST",
			data: { id:'save', newborn:newborn, project:project, block:block, code:values, blockCount: totalBlockCount}, 
			success: function(content){
				if (content.length > 0) {
					if (newborn) {
						if (totalBlockCount>1)
						{
							localStgeBxs.push(content);
							localStorage.yatay_bxs_autosaved = JSON.stringify(localStgeBxs);
						}	
						//Yatay.Common.setCookie(project+'_'+content, content, 1);
						if (block != content) {

							Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].setValue(content);
							return content;
						}
					}
				}		
			},
			error:function(){}
		});
	}
	return block;
};

/**
 * Load stored behaviours from server
 */
Yatay.Common.loadBxs = function() {
	$('#remote_proj').html('');
	$('#btn_remote_loader').attr('disabled', 'disabled').html(Yatay.Msg.DIALOG_LOADING);

	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'loadBxs' },
		success: function(content) {
			$('#btn_remote_loader').removeAttr('disabled').html(Yatay.Msg.DIALOG_REMOTE_LOADER);
			$('#btn_remote_loader').hide();
			var data = JSON.parse(content);
			if (data.length > 0) {
				$("#loadMainWindow").hide();
				var multiselector = '<tr>' + '<th>' + Yatay.Msg.DIALOG_PROJECT + '</th>' +
									'<th>' + Yatay.Msg.DIALOG_BEHAVIOURS + '</th>' + '</tr>';
				for (var i=0; i<data.length; i++) {
					var elem = data[i];
					if (elem.project != '') {
						multiselector += '<tr><td>' + elem.project + '</td><td>'
						multiselector += '<select id=\'' + elem.project + '\' multiple=\'multiple\'>';                                
						for (var j=0; j<elem.behaviours.length; j++) {
							var bx = elem.behaviours[j];
							if (Yatay.Common.bxsCode[elem.project] == undefined) {
								Yatay.Common.bxsCode[elem.project] = [];
							}
							Yatay.Common.bxsCode[elem.project][bx.block] = bx.code;
							multiselector += '<option value=\'' + bx.block + '\'>' + bx.block + '</option>';
						}
						multiselector += '</select></td></tr>';  
					}                              
				}
				$(multiselector).appendTo($('#remote_proj'));    
				
				for (var i=0; i<data.length; i++) {
					if (data[i].project != '') {
						Yatay.Common.buildMultiSelector($('#' + data[i].project));        
					}
				}
			} else {
				$('#btn_remote_loader').removeAttr('disabled').html(Yatay.Msg.DIALOG_REMOTE_LOADER);
				$('#btn_remote_loader').hide();
				$('#projects').remove();
				var multiselector = '<p id=\'projects\' style=\'display:inline\'>' + Yatay.Msg.DIALOG_NO_BEHAVIOURS + '</p>';
				$(multiselector).insertBefore($('#btn_remote_loader'));
			}
		},
		error:function() {}
	});
};

/**
 * Load code from xml
 */
Yatay.Common.fromXml = function() {
	Yatay.Common.leaveOnlyBehavioursInWspace();
	if (Yatay.Common.fileCode != '') {
		var xmlEndTag = '</xml>';
		if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
				Yatay.Common.bxReady();
		}
		var splittedBlocks = Yatay.Common.fileCode.split(xmlEndTag);
		splittedBlocks.pop();
		for (var j=0; j< splittedBlocks.length; j++)
		{
				var blockToRender = Blockly.Xml.textToDom(splittedBlocks[j] + xmlEndTag);
				Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, blockToRender);
				Yatay.Common.bxReady();
		}

		Yatay.Common.fileCode = '';
		$('#loader_modal').modal('hide');        
	} else if (Yatay.Common.activesProj.length > 0) {
		for (var i=0; i<Yatay.Common.activesProj.length; i++) {
				var project = Yatay.Common.activesProj[i];
				for (var j=0; j<Yatay.Common.activesBxs[project].length; j++) {
						if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
								Yatay.Common.bxReady();
						} 
						var success = false;
						while (!success)
						{
							var codeText = Yatay.Common.bxsCode[project][Yatay.Common.activesBxs[project][j]];
							var code = Blockly.Xml.textToDom(codeText);
							try
							{       
							
								Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, code);
								success = true;
							}
							catch(e){
								//A block doesn't exist anymore. Is necesary to know it's type so you know to what it is connected.
								Blockly.mainWorkspace.clear();
								if (e.message != null && e.message.split('"').length > 2)
								{
									var blockInFault = e.message.split('"')[1];
									Yatay.Common.tryToRecover(blockInFault, codeText);
									Yatay.not_available_sensors.push(blockInFault);
								}
								else
								{	//Couldn't recover
									Yatay.Common.ShowMessage(Yatay.Msg.CANNOT_PARSE_BLOCKS);
									success = true;
								}
							}
						}
				}
		}                
		Yatay.Common.bxsCode = [];
		Yatay.Common.activesBxs = [];        
		Yatay.Common.activesProj = [];
		$('#loader_modal').modal('hide');     
		Yatay.Common.bxReady();
	} else {
		$('#loader_modal').effect('shake');
	}
};

/**
 * Handle save click
 */
Yatay.Common.toXml = function() {
	$('#btn_save')[0].onclick = function(){return false;};
	if (Blockly.mainWorkspace.getAllBlocks().length > 0 || Yatay.Common.behaviours.length >0) {	
		var text = "";
		// Si hay bloques sin minimizar los marco listos
		if (Blockly.mainWorkspace.getAllBlocks().length >0) {
			Yatay.Common.bxReady()
		}
		for (var i = 0; i < Yatay.Common.behaviours.length; i++) {
			var codeXML = Yatay.Common.behaviours[i][1];	
			text += codeXML.toString();
		}		
	
		var nua = navigator.userAgent;
		var is_android_browser = ((nua.indexOf('Mozilla/5.0') > -1 && (nua.indexOf('Mobile') > -1 || nua.indexOf('Android') > -1) && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

		if (is_android_browser){
			Yatay.Common.saveTempLocal(escape(text).replace(/\./g, "%2E").replace(/\*/g,"%2A").replace(/\+/,"%2B"), false);
		} else {	
			var blob = new Blob([text], {type: "text/xml;charset=utf-8"});
			saveAs(blob, Yatay.Msg.FILE_BLOCKS + ".xml");
		}
	}
	setTimeout(function() {	$('#btn_save')[0].onclick = Yatay.Common.toXml;} , 800);
};

/**
 * Read local file
 */
Yatay.Common.readFile = function(evt) {
	var f = evt.target.files[0];
	if (f) {
		var r = new FileReader();
		r.onload = function(e) { 
			Yatay.Common.fileCode = e.target.result; 
		}
		r.readAsText(f);
	} else { 
		alert("Failed to load file");
	}
};

/**
 * Show file chooser modal
 */
Yatay.Common.openFileChooser = function() {
	$('#btn_load')[0].onclick = function(){return false;};
	$('#loader_modal').modal('show');
	$('#btn_remote_loader').show();
	$("#loadMainWindow").show();
	$('#remote_proj').html('');
	$('#projects').html('');
	document.getElementById('file_input').addEventListener('change', Yatay.Common.readFile, false);
	setTimeout(function() {	$('#btn_load')[0].onclick = Yatay.Common.openFileChooser;} , 800);
};

/**
 * Close edition error modal
 */
Yatay.Common.closeEditionError = function() {
	$('#edition_error_detail').hide();
	$('#btn_error_detail').show();
	$('#edition_error_modal').modal('hide');
	Yatay.Common.goBack();
};

/**
 * Long Poll for results
 */
function pollResults() {
	setTimeout(function() {
		var idUser = Yatay.Common.getCookie("idUser");
		if (idUser == null) {
			location.reload(); 
			return;
		}
		//If it's running (boton stop is showing) then poll
		if ($('#btn_back').css("display") != "none")	{
			$.ajax({
				url: "/index.html",
				type: "POST",
				data: {id:'poll', name:'', code:'', userId: idUser},
				success: function(html) {
					if (html.length > 0) {
						if (html.indexOf('ERROR:') != -1) {
							if (Yatay.Common.editedBxs.active != -1) {
								$('#edition_error_modal').modal({ backdrop:'static', keyboard:false });
								$('#edition_error_detail').html(html.replace("#;#","").replace("ERROR:",""));
							}
						} else {
							var sensorHtml = html.split('#;#')[0];
							var console = html.split('#;#')[1];
							if (!Yatay.Common.testMode) {
								var msg_console = Yatay.Msg.POPUP_RESULTS_CONSOLE;
								if (Yatay.Tablet != undefined) { 
									msg_console = ' - ' + msg_console;
								}
								$("#result_console").html('<strong>' + msg_console + '</strong>' + console);
							}
							var sensor = sensorHtml.split(' ')[0];
							var value = sensorHtml.replace(sensor,'');
							$("#result_sensor").html('<strong>' + Yatay.Msg.POPUP_RESULTS_ROBOTINFO + '</strong>' + sensor + value);
						}
					} else {
						$("#result_sensor").html('');
						$("#result_console").html('');
					}
				},
				error:function() {},
				complete: pollResults
			});
		} else {
				$("#result_sensor").html('');
				$("#result_console").html('');
		}
	}, 100);
};

/**
 * Long Poll for debug
 */
function debugPoll() {
	setTimeout(function(){
		var idUser = Yatay.Common.getCookie("idUser");
		if (idUser == null) {
			location.reload(); 
			return;
		} 
		//If it's running (boton stop is showing) then poll
		if ($('#btn_back').css("display") != "none" && Yatay.DebugMode)	{
			$.ajax({
				url: "/index.html",
				type: "POST",
				data: {id:'pollDebug', name:'', code:'', userId: idUser},
				success: function(html) {
					if (html.length > 0) {
						var behaviourName = html.split(':')[0];
						var behavioursAfterThisOne = false;
						var offset = 0;
						for (var i = 0; i < Yatay.Common.behaviours.length; i++) {
							if (Yatay.Common.behaviours[i][2] == behaviourName) {
								$('#'+Yatay.Common.behaviours[i][0]).click();
								break;
							}	
						}
						offset = Blockly.mainWorkspace.getTopBlocks()[0].id - parseInt(html.split(':')[1]);
						var blockId = parseInt(html.split(':')[2]) + offset;
						Yatay.DebugLastBlock = blockId;
						Blockly.mainWorkspace.getBlockById(blockId).select()
					}
				},
				error:function() {
				},
				complete: debugPoll
			});
		} else {
			if (Blockly.mainWorkspace.getBlockById(Yatay.DebugLastBlock) != null)	{
				Blockly.mainWorkspace.getBlockById(Yatay.DebugLastBlock).unselect()
			}
		}	
	}, 500);
};

/**
 * Refresh Butiá blocks
 */
Yatay.Common.refreshBlocksPoll = function() {
	setTimeout(function(){
		$.ajax({
			url: "/index.html",
			type: "POST",
			data: { id:'refreshBlocks' },
			success: function(content) {
				Yatay.Common.refresh = Yatay.Common.refresh || (content == 'yes');
				//If isn't running, then refresh!
				if (Yatay.Common.refresh && $('#btn_back').css('display') == 'none'){
					Yatay.Common.refresh = false;
					location.reload(true);					
				}
			},
			error:function() {}, 
			complete: Yatay.Common.refreshBlocksPoll
		});
	}, 5000);
};

/**
 * Save in browser's localStorage
 */
Yatay.Common.saveInBrowser = function(name, code) {
	var localStgeBxs = [];
	if (localStorage.yatay_bxs != null && localStorage.yatay_bxs != "")
		localStgeBxs = JSON.parse(localStorage.yatay_bxs);
	for (var j=0; j< localStgeBxs.length; j++) {
		if (localStgeBxs[j][0] == name) {
			localStgeBxs[j][1] = code;
			localStorage.yatay_bxs = JSON.stringify(localStgeBxs);
			return;					
		} else {
			var found = false;
			//Checking if this behaviour in the local storage is actually being used now, if not is obsolete data and is deleted
			for (var i=0; i< Yatay.Common.behaviours.length; i++) {
				if (Yatay.Common.behaviours[i][2] == localStgeBxs[j][0]) {
					found = true;
					break;
				}
			}
			if (!found)
				localStgeBxs.splice(j,1);
		}
	}
	localStgeBxs[localStgeBxs.length] = [name, code];
	localStorage.yatay_bxs = JSON.stringify(localStgeBxs);
};

/**
 * Set Cookie
 */
Yatay.Common.setCookie = function(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = 'expires='+d.toGMTString();
	document.cookie = cname + '=' + cvalue + '; ' + expires;
};

/**
 * Get Cookie
 */
Yatay.Common.getCookie = function(cname) {
	var name = cname + '=';
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return '';
};

/**
* Projects cookie save
*/ 
Yatay.Common.projectSaver = function() {
	var proj_name = '';
	if (Yatay.Common.joinProj == '') {
		proj_name = $('#proj_input').val();        
	} else {
		proj_name = Yatay.Common.joinProj;        
	}

	if (proj_name != null && proj_name.trim() != '') {
		Yatay.Common.setCookie('project_name', proj_name.replace(/ /g, "_"), 1); 
		$('#projmaneger_modal').modal('hide');
		if (Yatay.Tablet != undefined) {
			Yatay.Tablet.takeTour();
		}
	} else {
		$('#projmaneger_modal').effect( "shake" );
	}
};

/**
 * Handle robotest click
 */
Yatay.Common.robotest = function() {	
	$('#btn_robotest')[0].onclick = function(){return false;};

	var needsClean = true;
	var isButiaBlockSelected = false;
	if (Blockly.selected != null)
	{
		for (var j=0; j<Blockly.Toolbox.tree_.children_[2].blocks.length; j++)
		{
			if (Blockly.Toolbox.tree_.children_[2].blocks[j].attributes["type"].value == Blockly.selected.type)
			{
				isButiaBlockSelected = true;
				break;
			}
		}
	}
	if (isButiaBlockSelected)
	{
		Yatay.Common.isButiaBlockSelected = true;
		// if there's something selected and is in the butia pallete, then test it
		needsClean = false;
		var width = Blockly.svgSize().width;
  		var xml = goog.dom.createDom('xml');
	    var element = Blockly.Xml.blockToDom_(Blockly.selected);
	    var xy = Blockly.selected.getRelativeToSurfaceXY();
	    element.setAttribute('x', Blockly.RTL ? width - xy.x : xy.x);
	    element.setAttribute('y', xy.y);
	    xml.appendChild(element);

		try { 
			Yatay.Common.bxReady();
		} catch(e) {}

		Blockly.mainWorkspace.clear();	
		Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);

		setTimeout(function() {
				Yatay.countBlocks = Blockly.mainWorkspace.getAllBlocks().length;
				var topM = Math.round(Blockly.mainWorkspace.getMetrics().viewTop);
				var leftM = Math.round(Blockly.mainWorkspace.getMetrics().viewLeft);
				Blockly.mainWorkspace.getTopBlocks()[0].setDragging_(true);
				var blockPos = Blockly.mainWorkspace.getTopBlocks()[0].getRelativeToSurfaceXY();
				Blockly.mainWorkspace.getTopBlocks()[0].moveBy(leftM - blockPos.x +15, topM - blockPos.y +15);
				Blockly.mainWorkspace.getTopBlocks()[0].setDragging_(false);
				Blockly.mainWorkspace.getTopBlocks()[0].select();
			}, 100);
		
	}
	else
	{
		try {	
			Yatay.Common.bxReady();
		} catch(e) {}
	}

	if (Yatay.Tablet != undefined) {
		$("#behaviours_popup").hide();
	}

	Yatay.enterTestMode(needsClean);
	Yatay.Common.testMode = true;

	if (Yatay.Tablet != undefined) {
		$('#btn_robotest').toggle('slow');
		$('#btn_load').toggle('slow');
		$('#btn_save').toggle('slow');
		$('#btn_bx_ready').toggle('slow');		
		$('#btn_edit').toggle('slow');
		$('#btn_lang').toggle('slow');
	} else {
		$('#btn_more').toggle('slow');
		if($('#btn_bxs_ready').is(":visible")) {			
			$('#btn_bxs_ready').toggle('slow');
		}
		Yatay.Mobile.slideToolbox(false);
	}
	$('#btn_back').toggle();

	if (isButiaBlockSelected)
		setTimeout(function() {$("#btn_run").click();} , 100);
	setTimeout(function() {	$('#btn_robotest')[0].onclick = Yatay.Common.robotest;} , 800);
	
};

/**
 * Handle run click
 */
Yatay.Common.runTasks = function() {
	$('#btn_run')[0].onclick = function(){return false;};
	//Close the toolbox if open. Prevents a bug where it enables bxs dispite an existing one
	Blockly.Toolbox.flyout_.hide();
	Yatay.Common.leaveOnlyBehavioursInWspace();
	if ($('#btn_back').css('display') == 'none') {
		if (Yatay.Common.editedBxs.active == -1) {
			$('#btn_debug').toggle('slow');	   
		}	
		$('#btn_stop').toggle('slow');
		$('#btn_back').toggle('slow');
		
		if (Yatay.Tablet != undefined) {
			$('#btn_robotest').toggle('slow');	
			$('#btn_load').toggle('slow');
			$('#btn_save').toggle('slow');		
			$('#btn_trash').toggle('slow');		
			$('#btn_edit').toggle('slow');
			$('#btn_bx_ready').toggle('slow');
			$('#btn_lang').toggle('slow');
		} else {
			$('#btn_more').toggle('slow');
		}
	} else {
		if (Yatay.Common.testMode) {
			if (Blockly.mainWorkspace.getAllBlocks().length >0) {
				var testTask = "" +
				"local M = {}\n" +                        
				"local robot = require 'tasks/RobotInterface'\n" +
				"local sched = require 'sched'\n" +
				"local run = function ()\n" +
					Blockly.Lua.workspaceToCode() +
				"end\n"+
				"M.init = function(conf)\n" +
				"         M.task = sched.sigrun({'TestsMayNowRun'}, run)\n" +
				"end\n"+
				"return M\n";
				Yatay.Common.testRobot(testTask);
				pollResults();
			}
		} else {
			Blockly.mainWorkspace.maxBlocks = 0;
			if (Blockly.mainWorkspace.getAllBlocks().length>0) {
				Yatay.Common.bxReady()
			}

			var codes = new Array();
			for (var i = 0; i < Yatay.Common.behaviours.length; i++) {
				var code = '';
				//Has behaviours code been edited?
				if (Yatay.Common.editedBxs.active != -1) {
					code = Yatay.Common.editedBxs[i];
				} else {
					Yatay.variables = new Array();
					var codeXML = Blockly.Xml.textToDom(Yatay.Common.behaviours[i][1]);        
					Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, codeXML);
					code = Blockly.Lua.workspaceToCode();
				}
				codes.push(code);
				Blockly.mainWorkspace.clear();
			}		

			for (var i = 0; i < codes.length; i++) {
				Yatay.Common.sendTasks(codes[i]);
			}
			pollResults();
		}
	}
	setTimeout(function() {	$('#btn_run')[0].onclick = Yatay.Common.runTasks;} , 800);
};

/**
 * Handle code edited tabs switch 
 */
Yatay.Common.switchTabs = function(selected) {	
	var behaviourId = selected.id.replace("tablink","");
	if (Yatay.Common.editedBxs.active != -1) {
		$('#tab' + Yatay.Common.editedBxs.active).removeClass('active');
		Yatay.Common.editedBxs[Yatay.Common.editedBxs.active] = Yatay.Common.editor.getCode();
	}

	Yatay.Common.editor.setCode(Yatay.Common.editedBxs[behaviourId]);
	
	$('#tab' + behaviourId).addClass('active');
	Yatay.Common.editedBxs.active = behaviourId;

//	$('#code_modal').on('shown.bs.modal', function() {
//		Yatay.Common.editor.refresh();
//	});
};

/**
 * Handle hide edition modal
 */
Yatay.Common.closeEditor = function() {
	Yatay.Common.editedBxs.active = -1;
};

/**
 * Handle edit code click
 */
Yatay.Common.edit = function() {
	$('#btn_edit')[0].onclick = function(){return false;};
	Yatay.Common.editedBxs = [];
	Yatay.Common.editedBxs.active = -1;

	if (Blockly.mainWorkspace.getAllBlocks().length>0) {
		Yatay.Common.bxReady()
	}

	if (Yatay.Common.behaviours.length>0){
		var tabs = '';
		Yatay.variables = new Array();
		for (var i=0; i<Yatay.Common.behaviours.length; i++) {
			var codeXml = Blockly.Xml.textToDom(Yatay.Common.behaviours[i][1]);	
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, codeXml);
			Yatay.Common.editedBxs[i] = Blockly.Lua.workspaceToCode();
			Blockly.mainWorkspace.clear();
			tabs += '<li id="tab'+i+'"><a id="tablink'+i+'" onClick="Yatay.Common.switchTabs(this)" href="#">'+Yatay.Common.behaviours[i][2]+'</a></li>'	
		}
		$('#modal_tabs').html(tabs);

		$('#tab0').addClass('active');
		Yatay.Common.editedBxs.active = 0;



		$('#code_modal').modal({backdrop:'static', keyboard:false });
		if (Yatay.Common.editor == undefined)
		{
			$('#code_editable')[0].innerHTML = Yatay.Common.editedBxs[0];
			Yatay.Common.editor = CodeMirror.fromTextArea("code_editable", {
			  basefiles: ["lib/codemirror/parselua.js"],
			  stylesheet: ["lib/codemirror/luacolors.css"]
			});
		}
		else
			Yatay.Common.editor.setCode(Yatay.Common.editedBxs[0]);


	}
	setTimeout(function() {	$('#btn_edit')[0].onclick = Yatay.Common.edit;} , 800);
};

/**
 * Handle run edited code
 */
Yatay.Common.runEditedTasks = function() {
	var selected = [];
	selected.id = Yatay.Common.editedBxs.active;
	if (selected.id.toString().indexOf("tablink") == -1)
		selected.id = "tablink"+selected.id
	Yatay.Common.switchTabs(selected);

	//Has behaviours code been edited?
	if (Yatay.Common.editedBxs.active != -1) {
		$('#code_modal').modal('hide');
	}

	Yatay.Common.runTasks();
};	

/**
 * Handle save edited code
 */
Yatay.Common.saveEditedCode = function() {
	var text = '';
	for (var i=0; i<Yatay.Common.editedBxs.length; i++) {
		text += '-- Block: ' + Yatay.Common.behaviours[i][2] + '\n';
		text += Yatay.Common.editedBxs[i] + '\n';
	}	
	
	if (text != '') {
		var nua = navigator.userAgent;
		var is_android_browser = ((nua.indexOf('Mozilla/5.0') > -1 && (nua.indexOf('Mobile') > -1 || nua.indexOf('Android') > -1) && 			nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));

		if (is_android_browser){
			Yatay.Common.saveTempLocal(escape(text).replace(/\./g, "%2E").replace(/\*/g,"%2A").replace(/\+/,"%2B"), true);
		} else {	
			var blob = new Blob([text], {type: "text/lua;charset=utf-8"});
			saveAs(blob, Yatay.Msg.FILE_CODE + ".lua");
		}
	}
};

/**
 * Handle debug click
 */
Yatay.Common.debug = function() {		
	$('#btn_debug')[0].onclick = function(){return false;};
	Yatay.Common.leaveOnlyBehavioursInWspace();
	Yatay.DebugBlockIdOffset = 0;
	Yatay.DebugMode = true;   
	Blockly.mainWorkspace.maxBlocks = 0;
	if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
		Yatay.Common.bxReady()
	}

	var codes = new Array();
	Yatay.variables = new Array();
	for (var i = 0; i < Yatay.Common.behaviours.length; i++) {	
		var codeXML = Blockly.Xml.textToDom(Yatay.Common.behaviours[i][1]);        
		Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, codeXML);
		var code = Blockly.Lua.workspaceToCode();
		codes.push(code);
		Yatay.DebugBlockIdOffset += Blockly.mainWorkspace.getAllBlocks().length;
		Blockly.mainWorkspace.clear();
	}		

	for (var i = 0; i < codes.length; i++) {
		Yatay.Common.sendTasks(codes[i]);
	}

	pollResults();
	debugPoll();
	setTimeout(function() {	$('#btn_debug')[0].onclick = Yatay.Common.debug;} , 800);
};

/**
 * Handle go back click
 */
Yatay.Common.goBack = function() {	
	$('#btn_back')[0].onclick = function(){return false;};
	Yatay.Common.isButiaBlockSelected = false;
	Blockly.mainWorkspace.maxBlocks = 'Infinity';
	//Has behaviours code been edited?
	if (Yatay.Common.editedBxs.active != -1) {
		$('#code_modal').modal({ backdrop:'static' });
	}

	if (Yatay.Common.testMode) {
		if (Yatay.Common.behaviours.length > 0) {
			if (Yatay.Tablet != undefined) {
				$("#behaviours_popup").show();
			} else {
				$("#btn_bxs_ready").show();								
			}			
		}
		
		Yatay.Common.testMode = false;
		Yatay.Common.killTasks();
		try {
			Yatay.leaveTestMode();
		} catch(e) {}
		
		if (Yatay.Mobile != undefined) {
			Yatay.Mobile.slideToolbox(false, true);
		}
	} else {
		Yatay.DebugBlockIdOffset = 0;
		Yatay.Common.killTasks();
		if (Yatay.Common.editedBxs.active == -1) {
			$('#btn_debug').toggle('slow');	   
		}	   
	}
	
	if (Yatay.Tablet != undefined) {
		$('#btn_robotest').toggle('slow');		
		$('#btn_edit').toggle('slow');
		$('#btn_load').toggle('slow');
		$('#btn_save').toggle('slow');
		$('#btn_bx_ready').toggle('slow');
		$('#btn_lang').toggle('slow');
	} else {
		$('#btn_more').toggle('slow');
	}
	
	if(!$('#btn_trash').is(":visible")) {			
		$('#btn_trash').toggle('slow');
	}
	if($('#btn_stop').is(":visible")) {
		$('#btn_stop').toggle('slow');
	}
	$('#btn_back').toggle('slow');
	
	Yatay.DebugMode = false;
	for (var j=0; j < Blockly.mainWorkspace.getAllBlocks().length; j++) {
		Blockly.mainWorkspace.getAllBlocks()[j].setEditable(true);
		var blockType = Blockly.mainWorkspace.getAllBlocks()[j].type;
		if (blockType != "controls_behaviourTrigger") {//&& blockType != "controls_behaviour" && blockType != "controls_conditionalBehaviour")
			Blockly.mainWorkspace.getAllBlocks()[j].setMovable(true);
		}
	}
	setTimeout(function() {	$('#btn_back')[0].onclick = Yatay.Common.goBack;} , 800);
};

/**
* Projects cookie check
*/
Yatay.Common.projectChecker = function() {
	//Yatay.Common.setCookie('project_name', '', 1);   
	var proj_name = Yatay.Common.getCookie('project_name');  
	if (proj_name == '') {        
		$('#projmaneger_modal').modal({ backdrop:'static', keyboard:false });
	}
};

/**
* Load stored projects from server
*/
Yatay.Common.loadProj = function() {
        $('#btn_remote_proj').attr('disabled', 'disabled').html(Yatay.Msg.DIALOG_LOADING);
        $('#projects').multiselect('destroy');
        $('#projects').remove();

        $.ajax({
                url: "/index.html",
                type: "POST",
                data: { id:'loadProjs' },
                success: function(content) {
                        $('#btn_remote_proj').removeAttr('disabled').html(Yatay.Msg.DIALOG_REMOTE_LOADER);
                        var projs = JSON.parse(content);
                        if (projs.length > 0) {
                                Yatay.Common.joinProj = projs[0];
                        var multiselector = '<select id=\'projects\'>';
                                for (var i=0; i<projs.length; i++) {
                                        multiselector += '<option value=\'' + projs[i] + '\'>' + projs[i] + '</option>';
                                }
                                multiselector += '</select>';
                                $(multiselector).insertBefore($('#btn_remote_proj'));
                                Yatay.Common.buildMultiSelector($('#projects'), false);
                                $('.btn-group').addClass('dropup');
                        } else {
                                var multiselector = '<p id=\'projects\' style=\'display:inline\'>' + Yatay.Msg.DIALOG_NO_PROJS + '</p>';
                                $(multiselector).insertBefore($('#btn_remote_proj'));
                        }
						$('#btn_remote_proj').hide();
                },
                error:function(){}
        });
};

/**
 * saveTempLocal
 */
Yatay.Common.saveTempLocal = function(xml, edited) {
	//Warning the user
	alert("Tu navegador Android solo permite descargar extensiones conocidas. Se descargará el archivo como .apk, puedes cambiarle la extension luego :)");
	var project = Yatay.Common.getCookie('project_name');
	var userId = Yatay.Common.getCookie('idUser');
	var fileName = project+"_"+userId;
	if (edited)
		fileName += "_edited";
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'saveTempLocal', code:xml, project:fileName},
		success: function(content){
				var url = window.location.href.split("/yatay/")[0] + "/yatay/_downloads/" + fileName + ".apk";
				SaveToDisk(url);
		},
		error:function(){}
	});
};

/**
 * Adding style to toolbox
 */
Yatay.Common.addStyleToBlocklyToolbox = function() {
	$(".blocklyTreeRow").css('border-bottom-right-radius', '15px');	
	$(".blocklyTreeRow").css('border-bottom', '1px solid white');	
	$(".blocklyTreeRow").css('height', '35px');	
	$(".blocklyToolboxDiv div[role='treeitem']")[5].style.color = "#CF3F6F";
	$(".blocklyToolboxDiv div[role='treeitem']")[4].style.color = "#2F57CF";		
	$(".blocklyToolboxDiv div[role='treeitem']")[3].style.color = "tomato";	
	$(".blocklyToolboxDiv div[role='treeitem']")[2].style.color = "#349A00";	
	$(".blocklyToolboxDiv div[role='treeitem']")[1].style.color = "#9501AA";	
	$(".blocklyToolboxDiv div[role='treeitem']")[0].style.color = '#5CA9CB';
};

/**
 * Request a userId
 */
Yatay.Common.requestUserId = function() {
	$.ajax({
		url: "/index.html",
		type: "POST",
		data: { id:'getUserId'},
		success: function(html){
			Yatay.Common.setCookie("idUser", html, 1);
		},
		error:function(err){
			alert(err);
		}
	});
};

/**
 * Set behaviour as ready
 */
Yatay.Common.bxReady = function() {
	$('#btn_bx_ready')[0].onclick = function(){return false;};
	Yatay.Common.leaveOnlyBehavioursInWspace();
	if (Blockly.mainWorkspace.getAllBlocks()[0] != undefined) {
		if (Blockly.mainWorkspace.getAllBlocks()[0].type == "controls_behaviour" || 
		    Blockly.mainWorkspace.getAllBlocks()[0].type == "controls_conditionalBehaviour") {	
			Yatay.variables = new Array();
			var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
			var text = Blockly.Xml.domToText(xml);
			var name = Blockly.mainWorkspace.getAllBlocks()[0].inputList[0].titleRow[0].getValue();
			var shortname = name; 
			var size = Blockly.mainWorkspace.getAllBlocks().length;
			if (name.length > 13) {
				shortname = name.substring(0, 12) + "...";
			}
			var id = Blockly.mainWorkspace.getAllBlocks()[0].id;
			Yatay.Common.behaviours.push([id, text, name, size]);

			var list = $('<li style="display:none;">' +
						'<div id="' + id + '" class="image-container">' +
							'<div class="image-inner-container">' +
								'<p class="overlay">' + shortname + '</p>' + Yatay.Msg.SVG_BEHAVIOURS +
							'</div>' +
						'</div>' +
					'</li>');
			
			if (Yatay.Tablet != undefined) {
				$('#behaviours_popup').show();
			} else {
				$('#btn_bxs_ready').show();								
			}
			
			list.appendTo($('#bx_list')).slideDown('slow');
			document.getElementById(id).onclick = Yatay.Common.bxToWorkspace;
			Blockly.mainWorkspace.clear();
			Yatay.countBlocks = 0;
		}
	}
	setTimeout(function() {	$('#btn_bx_ready')[0].onclick = Yatay.Common.bxReady;} , 800);
};

/**
 * Draw selected behaviour to workspace
 */
Yatay.Common.bxToWorkspace = function() {
	for (i = 0; i < Yatay.Common.behaviours.length; ++i) {
		if (Yatay.Common.behaviours[i][0] == this.id) {
			code = Blockly.Xml.textToDom(Yatay.Common.behaviours[i][1]);
			var item = "#" + this.id;
			$(item).animate({height:'toggle'}, 'slow', function () {$(item).remove()});
			Yatay.Common.behaviours.splice(i, 1);
			if (Blockly.mainWorkspace.getAllBlocks().length > 0) {
				Yatay.Common.bxReady();
			}
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, code);
			//Disabling missing sensors
			for (var j=0; j < Blockly.mainWorkspace.getAllBlocks().length; j++) {
				if (Yatay.DebugMode) {
					Blockly.mainWorkspace.getAllBlocks()[j].setEditable(false);
					Blockly.mainWorkspace.getAllBlocks()[j].setMovable(false);
				} else {
					Blockly.mainWorkspace.getAllBlocks()[j].setEditable(true);
					var blockType = Blockly.mainWorkspace.getAllBlocks()[j].type;
					if (blockType != "controls_behaviourTrigger") { //&& blockType != "controls_behaviour" && blockType != "controls_conditionalBehaviour")
						Blockly.mainWorkspace.getAllBlocks()[j].setMovable(true);
					}
				}
				if (Yatay.missing_sensors.indexOf(Blockly.mainWorkspace.getAllBlocks()[j].type) != -1 || Yatay.not_available_sensors.indexOf(Blockly.mainWorkspace.getAllBlocks()[j].type) != -1)
					Blockly.mainWorkspace.getAllBlocks()[j].setDisabled(true);
				else if (Blockly.mainWorkspace.getAllBlocks()[j].disabled)
					Blockly.mainWorkspace.getAllBlocks()[j].setDisabled(false);		
			}
		}
	}
	if (Yatay.Common.behaviours.length == 0) {
		if (Yatay.Tablet != undefined) {
			$("#behaviours_popup").hide();
		} else {
			$("#btn_bxs_ready").hide();								
		}
	}
	Yatay.countBlocks = Blockly.mainWorkspace.getAllBlocks().length;
	setTimeout(function() {
		Yatay.countBlocks = Blockly.mainWorkspace.getAllBlocks().length;
		var topM = Math.round(Blockly.mainWorkspace.getMetrics().viewTop);
		var leftM = Math.round(Blockly.mainWorkspace.getMetrics().viewLeft);
		Blockly.mainWorkspace.getTopBlocks()[0].setDragging_(true);
		var blockPos = Blockly.mainWorkspace.getTopBlocks()[0].getRelativeToSurfaceXY();
		Blockly.mainWorkspace.getTopBlocks()[0].moveBy(leftM - blockPos.x +15, topM - blockPos.y +15);
		Blockly.mainWorkspace.getTopBlocks()[0].setDragging_(false);
		Blockly.mainWorkspace.getTopBlocks()[0].select();
	}, 100);
};

/**
 * Change app language.
 */
Yatay.Common.changeLanguage = function() {
	$('#btn_lang')[0].onclick = function(){return false;};
	if (BlocklyApps.LANG == 'es') {
		BlocklyApps.LANG = 'en';	
	} else {
		BlocklyApps.LANG = 'es';
	}
	
	var search = window.location.search;
	if (search.length <= 1) {
		search = '?lang=' + BlocklyApps.LANG;
	} else if (search.match(/[?&]lang=[^&]*/)) {
		search = search.replace(/([?&]lang=)[^&]*/, '$1' + BlocklyApps.LANG);
	} else {
		search = search.replace(/\?/, '?lang=' + BlocklyApps.LANG + '&');
	}
	window.location = window.location.protocol + '//' + window.location.host + window.location.pathname + search;
	setTimeout(function() {	$('#btn_lang')[0].onclick = Yatay.Common.changeLanguage;} , 800);
};

/**
* Clear Workspace from non-behaviour blocks
*/

Yatay.Common.leaveOnlyBehavioursInWspace = function(){
	if (!Yatay.Common.isButiaBlockSelected && !Yatay.Common.testMode) // if you're trying to test a butia block then this does not apply
	{
		var topBlocks = Blockly.mainWorkspace.getTopBlocks();
		var warn = false;
		for (var j=topBlocks.length-1 ; j>=0; j--)
		{
			if (topBlocks[j].type != "controls_behaviour" && topBlocks[j].type != "controls_conditionalBehaviour")
			{	
				topBlocks[j].dispose();
				warn = true;
			}
		}
		if (warn)
			Yatay.Common.ShowMessage(Yatay.Msg.DIALOG_NONBXS_BLOCKS_WARN);
	}
}

Yatay.Common.ShowMessage = function(text)
{
	$("#result_console").html('');
	$("#result_sensor").html(text);
	$("#results_popup").show();
	setTimeout(function(){
		$("#result_sensor").html('');
		$("#results_popup").hide();
	}, 3000);
}

Yatay.Common.tryToRecover = function(blockInFault, code)
{
	var blockStruct = "<block type=\""+blockInFault+"\">";
	code = code.replace(/ disabled=\"true\"/g,'');
	var actuator = false;
	var inputsInline = false;
	if (code.split(blockStruct).length == 1)
	{
		blockStruct = "<block type=\""+blockInFault+"\" inline=\"true\">";
		inputsInline = true;
	}
	if (code.split(blockStruct).length > 1 && code.split(blockStruct)[1].indexOf("<next>") == 0)
		actuator = true;
	Blockly.Blocks[blockInFault] = { 
		init: function() { 
	
			this.setColour(120); 
			this.appendDummyInput().appendTitle(blockInFault); 
			this.setInputsInline(true); 
			if (actuator)
			{
				this.setPreviousStatement(true); 
				this.setNextStatement(true); 
			}
			else
				this.setOutput(true, 'Number'); 
			if (inputsInline)
			{
				this.appendValueInput('1'); 
				this.appendDummyInput().appendTitle(','); 
				this.appendValueInput('2'); 
				this.appendDummyInput().appendTitle(','); 
				this.appendValueInput('3'); 
				this.appendDummyInput().appendTitle(','); 
				this.appendValueInput('4'); 
			}
			this.setTooltip(''); 
		} 
	};
	Blockly.Lua[blockInFault] = function(block) { return "";}
}
