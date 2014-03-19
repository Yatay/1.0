/**
 * @fileoverview 
 * @author 
 */

/**
 * Create namespace for mobile applications
 */
 if (!Yatay.Mobile){ 
	Yatay.Mobile = {};
} 

/**
 * Toolbox state  
 * @type {bool}
 */
Yatay.Mobile.openToolbox = false;

/**
 * Initialize Yatay on ready
 */
$(document).ready(function() {
	$('#main_menu').load('./bodies/mobile.html');
	$('#dialogs').load('./bodies/dialogs.html', Yatay.Common.loadDialogs);
	
	//Yatay.Common.setCookie('idUser', '', 1);
	if (Yatay.Common.getCookie("idUser") == '') { 
		Yatay.Common.requestUserId();
	}
	
	Yatay.Mobile.initToolbox();
	Yatay.Mobile.fixConflicts();

	setTimeout(function() {
		Yatay.Mobile.initClasses();
		$('#content_blocks').addClass('content-' + BlocklyApps.LANG);
		Blockly.fireUiEvent(window, 'resize');
	}, 300);
});

/**
 * Open (slide right) toolbox.
 */
Yatay.Mobile.slideToolbox = function(slide_in, resize) {
	var ret = true;
	if (slide_in) {
		if (!Yatay.Mobile.openToolbox) {
			if (Yatay.Common.testMode) { 
				$('#content_blocks').removeClass('content-test');
			} 
			
			$('#content_blocks').removeClass('content-' + BlocklyApps.LANG);
			Yatay.Mobile.openToolbox = true;
			ret = false;			
		}
	} else {
		if (Yatay.Common.testMode) { 
			$('#content_blocks').addClass('content-test');
		} else {
			$('#content_blocks').removeClass('content-test');
			$('#content_blocks').addClass('content-' + BlocklyApps.LANG);
		}
		Yatay.Mobile.openToolbox = false;
	}
	
	if (resize) {
		Blockly.fireUiEvent(window, 'resize');
		Blockly.fireUiEvent(window, 'resize');
	}
	
	return ret;
};

/**
 * Initialize slide toolbox.
 */
Yatay.Mobile.initToolbox = function() {
	//Binding toolbox slide event
	setTimeout(function() {
		$('.blocklyToolboxDiv').bind('click touchend', function(e) {
			return Yatay.Mobile.slideToolbox(true, true);	
		});
	}, 1000);
	
	//Override function onMouseDown_ of block.js
	Blockly.Block.prototype.onMouseDown_ = function(e) {
		if (this.isInFlyout) {
			setTimeout(function() { 
				Yatay.Mobile.slideToolbox(false, true);
			},1000);
			return;
		}
		
		Blockly.svgResize();
		Blockly.terminateDrag_();
		this.select();
		Blockly.hideChaff();
		if (Blockly.isRightButton(e)) {		
			if (Blockly.ContextMenu) {
			  this.showContextMenu_(Blockly.mouseToSvg(e));
			}
		} else if (!this.isMovable()) {
			return;
		} else {
			Blockly.removeAllRanges();
			Blockly.setCursorHand_(true);
			var xy = this.getRelativeToSurfaceXY();
			this.startDragX = xy.x;
			this.startDragY = xy.y;
			this.startDragMouseX = e.clientX;
			this.startDragMouseY = e.clientY;
			Blockly.Block.dragMode_ = 1;
			Blockly.Block.onMouseUpWrapper_ = Blockly.bindEvent_(document,'mouseup', this, this.onMouseUp_);
			Blockly.Block.onMouseMoveWrapper_ = Blockly.bindEvent_(document, 'mousemove', this, this.onMouseMove_);
			this.draggedBubbles_ = [];
			var descendants = this.getDescendants();
			for (var x = 0, descendant; descendant = descendants[x]; x++) {
				var icons = descendant.getIcons();
				for (var y = 0; y < icons.length; y++) {
					var data = icons[y].getIconLocation();
					data.bubble = icons[y];
					this.draggedBubbles_.push(data);
				}
			}
		}
		e.stopPropagation();
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
 * Function to solve conflicts betweet libraries and override functions.
 */
Yatay.Mobile.fixConflicts = function() { 
	//Fix: Blockly vs Bootstrap touch events conflict on Safari.
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

	//Fix: Workspace size
	$('.blocklyTable').css('width', '-=38px');
};

/**
 * Initialize CSS classes dynamically.
 */
Yatay.Mobile.initClasses = function() {
	//Toolbox positions
	var esWidth = $('#content_blocks').css('width', '+=104px').css('width');	
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '.content-es { \n' +
	'	left: -104px !important; \n' + 
	'	width: ' + esWidth + ' !important; \n' +
	'} \n';
	
	var enWidth = $('#content_blocks').css('width', '-=22px').css('width');
	style.innerHTML += '.content-en { \n' +
	'	left: -82px !important; \n' + 
	'	width: ' + enWidth + ' !important; \n' +
	'}\n';
	
	var testWidth = $('#content_blocks').css('width', '-=30px').css('width');
	style.innerHTML += '.content-test { \n' +
	'	left: -52px !important; \n' + 
	'	width: ' + testWidth + ' !important; \n' +
	'}\n';

	document.getElementsByTagName('head')[0].appendChild(style);	
};

