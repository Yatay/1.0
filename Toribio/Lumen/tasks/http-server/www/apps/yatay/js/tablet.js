/**
 * @fileoverview 
 * @author 
 */

/**
 * Create namespace for tablet applications
 */
if (!Yatay.Tablet){ 
	Yatay.Tablet = {};
}

/**
 * State of the flyout
 * @type {boolean}
 */
Yatay.Tablet.onTime = true;

/**
 * Initialize Yatay on ready
 */
$(document).ready(function() {	
	$('#main_menu').load('./bodies/tablet.html', Yatay.Tablet.resizeIcons);
	$('#dialogs').load('./bodies/dialogs.html', Yatay.Common.loadDialogs);
	
	var list = $('<ul class="nav" id="bx_list"></ul>');
	list.appendTo($('#behaviours_popup'));
	
	//Yatay.Common.setCookie('idUser', '', 1);
	if (Yatay.Common.getCookie("idUser") == '') { 
		Yatay.Common.requestUserId();
	}

	Yatay.Tablet.fixConflicts();
});

/**
 * Initialize and start the tour
 */
Yatay.Tablet.takeTour = function() {
	$('.blocklyToolboxDiv').addClass('bootstro');
	$('.blocklyToolboxDiv').attr('data-bootstro-step', '0');
	$('.blocklyToolboxDiv').attr('data-bootstro-width', '600px');
	$('.blocklyToolboxDiv').attr('data-bootstro-placement', 'right');
	$('.blocklyToolboxDiv').attr('data-bootstro-title', Yatay.Msg.TOUR_TOOLBOX_TITLE);
	$('.blocklyToolboxDiv').attr('data-bootstro-content', Yatay.Msg.TOUR_TOOLBOX_CONTENT);

	$('#btn_robotest').addClass('bootstro');
	$('#btn_robotest').attr('data-bootstro-step', '1');
	$('#btn_robotest').attr('data-bootstro-width', '400px');
	$('#btn_robotest').attr('data-bootstro-placement', 'right');
	$('#btn_robotest').attr('data-bootstro-title', Yatay.Msg.TOUR_RBTEST_TITLE);
	$('#btn_robotest').attr('data-bootstro-content', Yatay.Msg.TOUR_RBTEST_CONTENT);

	$('#btn_run').addClass('bootstro');
	$('#btn_run').attr('data-bootstro-step', '2');
	$('#btn_run').attr('data-bootstro-width', '600px');
	$('#btn_run').attr('data-bootstro-placement', 'right');
	$('#btn_run').attr('data-bootstro-title', Yatay.Msg.TOUR_RUN_TITLE);
	$('#btn_run').attr('data-bootstro-content', Yatay.Msg.TOUR_RUN_CONTENT);

	$('#btn_bx_ready').addClass('bootstro');
	$('#btn_bx_ready').attr('data-bootstro-step', '3');
	$('#btn_bx_ready').attr('data-bootstro-width', '400px');
	$('#btn_bx_ready').attr('data-bootstro-placement', 'right');
	$('#btn_bx_ready').attr('data-bootstro-title', Yatay.Msg.TOUR_BXREADY_TITLE);
	$('#btn_bx_ready').attr('data-bootstro-content', Yatay.Msg.TOUR_BXREADY_CONTENT);

	$('#btn_edit').addClass('bootstro');
	$('#btn_edit').attr('data-bootstro-step', '4');
	$('#btn_edit').attr('data-bootstro-width', '400px');
	$('#btn_edit').attr('data-bootstro-placement', 'right');
	$('#btn_edit').attr('data-bootstro-title', Yatay.Msg.TOUR_EDIT_TITLE);
	$('#btn_edit').attr('data-bootstro-content', Yatay.Msg.TOUR_EDIT_CONTENT);

	bootstro.start('.bootstro', {
		nextButton: '<button class="btn btn-primary btn-mini bootstro-next-btn">'+ Yatay.Msg.TOUR_NEXT +'</button>',
		prevButton: '<button class="btn btn-primary btn-mini bootstro-prev-btn">'+ Yatay.Msg.TOUR_PREV +'</button>',
		finishButton: ''
	});
};

/**
 * Function to solve conflicts betweet libraries.
 */
Yatay.Tablet.fixConflicts = function() {
	//Fix: Blockly vs Bootstrap touch events conflict on Chrome.
	Blockly.bindEvent_ = function(a,b,c,d){ 
		Blockly.bindEvent_.TOUCH_MAP = {
			mousedown:"touchstart",
			mousemove:"touchmove",
			mouseup:"touchend"
		};	
		var e=[],f; 
		if(!a.addEventListener)
			throw"Element is not a DOM node with addEventListener.";
		
		f = function(a) { 
			d.apply(c,arguments)
		};
		
		a.addEventListener(b,f,!1);
		e.push([a,b,f]);
		b in Blockly.bindEvent_.TOUCH_MAP && ( 
			f=function(a) { 
				if(1==a.changedTouches.length) { 
					var b=a.changedTouches[0];
					a.clientX=b.clientX;
					a.clientY=b.clientY
				}
				d.apply(c,arguments);
				//This line solves the conflict.
				if (a.target.ownerSVGElement != undefined) {
					a.preventDefault();
				}
			}
			, a.addEventListener(Blockly.bindEvent_.TOUCH_MAP[b],f,!1)
			, e.push([a,Blockly.bindEvent_.TOUCH_MAP[b],f]));
		return e
	};
	
	//Fix: Long taps to open the toolbox on Android Browser.
	Blockly.Toolbox.TreeControl.prototype.setSelectedItem = function(node) {
		var nua = navigator.userAgent;
		var is_android_browser = ((nua.indexOf('Mozilla/5.0') > -1 && (nua.indexOf('Mobile') > -1 || nua.indexOf('Android') > -1) && nua.indexOf('AppleWebKit') > -1) && !(nua.indexOf('Chrome') > -1));		
		//Is running on Android Browser?
		if (is_android_browser) {
			//Timer to control flyout show/hide
			if (Yatay.Tablet.onTime) {
				if (this.selectedItem_ == node) {
					return;
				}
				goog.ui.tree.TreeControl.prototype.setSelectedItem.call(this, node);
				if (node && node.blocks && node.blocks.length) {
					Blockly.Toolbox.flyout_.show(node.blocks);
				} else {
					Blockly.Toolbox.flyout_.hide();
				}
				Yatay.Tablet.onTime = false;
				setTimeout(function() {
					Yatay.Tablet.onTime = true;
				}, 1200);
			}
		} else {
			if (this.selectedItem_ == node) {
				return;
			}
			goog.ui.tree.TreeControl.prototype.setSelectedItem.call(this, node);
			if (node && node.blocks && node.blocks.length) {
				Blockly.Toolbox.flyout_.show(node.blocks);
			} else {
				Blockly.Toolbox.flyout_.hide();
			}		
		}
	};
	
	//Fix: Blocks superposition
	var resizeTextarea = function() {
		this.style.height = "";
		var $this = $(this),             
        outerHeight = $this.outerHeight(),
        scrollHeight = this.scrollHeight,
        innerHeight = $this.innerHeight(),
        magic = outerHeight - innerHeight;
		this.style.height = scrollHeight + magic + "px";
	}	
	$('textarea').keydown(resizeTextarea).keyup(resizeTextarea).change(resizeTextarea).focus(resizeTextarea);
};

/**
 * Resize icons depending on screen height.
 */
Yatay.Tablet.resizeIcons = function() {
	if ($(window).height() < 648) {
		$( "#btn_load").children().removeClass('fa-3x');
		$( "#btn_load").children().addClass('fa-2x');
		$( "#btn_save").children().removeClass('fa-3x');
		$( "#btn_save").children().addClass('fa-2x');
		$( "#btn_robotest").children().removeClass('fa-3x');
		$( "#btn_robotest").children().addClass('fa-2x');
		$( "#btn_run").children().removeClass('fa-3x');
		$( "#btn_run").children().addClass('fa-2x');
		$( "#btn_edit").children().removeClass('fa-3x');
		$( "#btn_edit").children().addClass('fa-2x');
		$( "#btn_debug").children().removeClass('fa-3x');
		$( "#btn_debug").children().addClass('fa-2x');
		$( "#btn_bx_ready").children().removeClass('fa-3x');
		$( "#btn_bx_ready").children().addClass('fa-2x');
		$( "#btn_stop").children().removeClass('fa-3x');
		$( "#btn_stop").children().addClass('fa-2x');
		$( "#btn_back").children().removeClass('fa-3x');
		$( "#btn_back").children().addClass('fa-2x');
		$( "#btn_lang").children().removeClass('fa-3x');
		$( "#btn_lang").children().addClass('fa-2x');
		$( "#btn_trash").children().removeClass('fa-3x');
		$( "#btn_trash").children().addClass('fa-2x');
	}
};