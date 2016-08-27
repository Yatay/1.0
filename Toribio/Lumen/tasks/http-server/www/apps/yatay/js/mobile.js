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
 * Dialog is being shown
 * @type {bool}
 */
Yatay.Mobile.DisplayingDialog = false;

/**
 * Initialize Yatay on ready
 */
$(document).ready(function() {
	$("#results_popup").css("zoom","3");
	$('#main_menu').load('./bodies/mobile.html');
	$('#dialogs').load('./bodies/mdialogs.html', Yatay.Common.loadDialogs);
	$('.modal').removeClass("modal fade");
	if (navigator.userAgent.indexOf("Firefox") != -1){  //Fixing mozilla showing letters godzilla-size in phones comparing chrome
		$(".page").css("font-size","40%");
		$(".mmod-body").css("font-size","250%");			
	}
	jQuery.fn.toggleYatay = function() {
		var o = $(this[0]);
		if (! o.is(":hidden"))
			o.parent().parent()[0].style.setProperty("display","none", "important");
		else
			o.parent().parent()[0].style.setProperty("display","", "");
		o.toggle("slow");		
	};	
	jQuery.fn.showYatay = function() {
		var o = $(this[0]);
		o.parent().parent()[0].style.setProperty("display","", "");
		o.show("slow");		
	};	
	
	//Yatay.Common.setCookie('idUser', '', 1);
	if (Yatay.Common.getCookie("idUser") == '') { 
		Yatay.Common.requestUserId();
	}

	Yatay.Mobile.initToolbox();
	Yatay.Mobile.fixConflicts();

	setTimeout(function() {
		Yatay.Mobile.initClasses();
		$('#content_blocks').addClass('content-' + BlocklyApps.LANG);
		Blockly._oldFireUiEvent = Blockly.fireUiEvent;
		Blockly.fireUiEvent = function (a, b){
			Blockly._oldFireUiEvent(a,b);
			var left_marg = (Blockly.mainWorkspace.trashcan.left_ / 2);
			var top_marg = (Blockly.mainWorkspace.trashcan.top_ /2.1);
			Blockly.mainWorkspace.trashcan.svgGroup_.setAttribute("transform","translate("+left_marg+","+top_marg+")");
		}
		Blockly.mainWorkspace.trashcan.svgGroup_.classList.add("hidden");
		Blockly.fireUiEvent(window, 'resize');
		Blockly.fireUiEvent(window, 'resize');		
	}, 300);	
});

/**
 * Initialize and start the tour
 */
Yatay.Mobile.takeTour = function() {
	$('.blocklyToolboxDiv').addClass('bootstro');
	$('.blocklyToolboxDiv').attr('data-bootstro-step', '0');
	$('.blocklyToolboxDiv').attr('data-bootstro-width', '600px');
	$('.blocklyToolboxDiv').attr('data-bootstro-placement', 'right');
	$('.blocklyToolboxDiv').attr('data-bootstro-title', Yatay.Msg.TOUR_TOOLBOX_TITLE);
	$('.blocklyToolboxDiv').attr('data-bootstro-content', Yatay.Msg.TOUR_TOOLBOX_CONTENT);

	$('#btn_run').addClass('bootstro');
	$('#btn_run').attr('data-bootstro-step', '1');
	$('#btn_run').attr('data-bootstro-width', '600px');
	$('#btn_run').attr('data-bootstro-placement', 'bottom');
	$('#btn_run').attr('data-bootstro-title', Yatay.Msg.TOUR_RUN_TITLE);
	$('#btn_run').attr('data-bootstro-content', Yatay.Msg.TOUR_RUN_CONTENT);

	$('#btn_more').addClass('bootstro');
	$('#btn_more').attr('data-bootstro-step', '2');
	$('#btn_more').attr('data-bootstro-width', '400px');
	$('#btn_more').attr('data-bootstro-placement', 'bottom');
	$('#btn_more').attr('data-bootstro-title', Yatay.Msg.TOUR_MORE_TITLE);
	$('#btn_more').attr('data-bootstro-content', Yatay.Msg.TOUR_MORE_CONTENT);

	bootstro.start('.bootstro', {
		nextButton: '<button class="btn btn-primary btn-mini bootstro-next-btn">'+ Yatay.Msg.TOUR_NEXT +'</button>',
		prevButton: '<button class="btn btn-primary btn-mini bootstro-prev-btn">'+ Yatay.Msg.TOUR_PREV +'</button>',
		finishButton: '<button class="btn btn-success btn-mini bootstro-finish-btn">'+ Yatay.Msg.TOUR_QUIT +'</button>',
	});
};

/**
 * Open (slide right) toolbox.
 */
Yatay.Mobile.slideToolbox = function(slide_in, resize) {
	var ret = true;
	if (slide_in) {
		if ($("#content_blocks").css("left") != "0px") { //When Toolbox hidden
			if (Yatay.Common.testMode) { 
				$('#content_blocks').removeClass('content-test');
			} 
			
			$('#content_blocks').removeClass('content-' + BlocklyApps.LANG);
			ret = false;			
		}
	} else {
		if (Yatay.Common.testMode) { 
			$('#content_blocks').addClass('content-test');
		} else {
			$('#content_blocks').removeClass('content-test');
			$('#content_blocks').addClass('content-' + BlocklyApps.LANG);
		}		
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
	var toolboxHiddenPart = parseInt($(".blocklyToolboxDiv").css("width")) *2 /3;
	var esWidth = $('#content_blocks').css('width', '+=104px').css('width');	
	var style = document.createElement('style');
	style.type = 'text/css';	
	style.innerHTML = '.content-es { \n' +
	'	left: -'+toolboxHiddenPart+'px !important; \n' + 
	'	width: ' + esWidth + ' !important; \n' +
	'} \n';
	
	var enWidth = $('#content_blocks').css('width', '-=22px').css('width');
	style.innerHTML += '.content-en { \n' +
	'	left: -'+toolboxHiddenPart+'px !important; \n' + 
	'	width: ' + enWidth + ' !important; \n' +
	'}\n';
	
	var testWidth = $('#content_blocks').css('width', '-=30px').css('width');
	style.innerHTML += '.content-test { \n' +
	'	left: -52px !important; \n' + 
	'	width: ' + testWidth + ' !important; \n' +
	'}\n';

	document.getElementsByTagName('head')[0].appendChild(style);	
};


Yatay.toggleEditionCode = function(){
	if (!$("#code_modal").is( ":hidden" ))
	{
		$(".tickDiv").toggle();
		$(".collapseDiv").toggle();
		if($('#btn_stop').is(":visible")) {
			$('#btn_stop').toggleYatay();
			Yatay.Common.killTasks()
		}
		$(".container").css("text-align","");
		$("#code_modal").hide();
		Yatay.Mobile.DisplayingDialog = false;
		$('#content_blocks').addClass('content-' + BlocklyApps.LANG);
		$("#content_blocks").show();
		$(".blocklyTable").show();
		Blockly.fireUiEvent = Yatay.BlocklyFireEventBlocked;
		$('#btn_more').toggle();
		$('#btn_bxs_ready').toggleYatay();
		$('#btn_run').toggleYatay();
		$('#btn_trash').toggleYatay();
		$('#btn_back').toggleYatay();
		Blockly.fireUiEvent(window, 'resize');
		setTimeout(function(){$("#content_blocks").animate({left: '0px'}); Blockly.fireUiEvent(window, 'resize'); Blockly.fireUiEvent(window, 'resize'); },300);
	}
	else
	{
		$(".tickDiv").toggle();
		$(".collapseDiv").toggle();
		$(".container").css("text-align","left");
		Yatay.Mobile.DisplayingDialog = true;
		$('#content_blocks').removeClass('content-' + BlocklyApps.LANG);
		$("#code_modal").show();
		$(".blocklyTable").hide();
		Yatay.BlocklyFireEventBlocked = Blockly.fireUiEvent;
		Blockly.fireUiEvent = function (){ return;};
		$('#btn_more').toggle();
		if (!$('#btn_bxs_ready').is( ":hidden" ))
			$('#btn_bxs_ready').toggleYatay();
		$('#btn_run').toggleYatay();
		$('#btn_trash').toggleYatay();
		$('#btn_back').toggleYatay();
		setTimeout(function(){$("#content_blocks").animate({left: '-1000%'}, 400, function(){
			$("#content_blocks").hide();				
		}); },200);
	}
}

Yatay.toggleFileChooser = function(isGoBack){
	if (!$("#loader_modal").is(":hidden")) //If it´s visible then, else..
	{
		$(".tickDiv").toggle();
		$(".collapseDiv").toggle();
		$(".container").css("text-align","");
		$("#loader_modal").hide();
		Yatay.Mobile.DisplayingDialog = false;
		$('#content_blocks').addClass('content-' + BlocklyApps.LANG);
		$("#content_blocks").show();
		$(".blocklyTable").show();
		$('#btn_openfile').removeClass("dobleButton pull-left");
		$('#btn_openfile').addClass("singleButton");
		Blockly.fireUiEvent = Yatay.BlocklyFireEventBlocked;
		$('#btn_more').toggle();
		if (Yatay.Common.behaviours.length > 0 && isGoBack)
			$('#btn_bxs_ready').toggleYatay();
		$('#btn_run').toggleYatay();
		$('#btn_trash').toggleYatay();
		$('#btn_back').toggleYatay();
		Blockly.fireUiEvent(window, 'resize');
		setTimeout(function(){$("#content_blocks").animate({left: '0px'}); Blockly.fireUiEvent(window, 'resize'); Blockly.fireUiEvent(window, 'resize'); },300);
	}
	else
	{
		$(".tickDiv").toggle();
		$(".collapseDiv").toggle();
		$(".container").css("text-align","left");
		Yatay.Mobile.DisplayingDialog = true;
		$('#content_blocks').removeClass('content-' + BlocklyApps.LANG);
		$("#loader_modal").show();
		$(".blocklyTable").hide();
		Yatay.BlocklyFireEventBlocked = Blockly.fireUiEvent;
		Blockly.fireUiEvent = function (){ return;};
		$('#btn_more').toggle();
		if (!$('#btn_bxs_ready').is( ":hidden" ))
			$('#btn_bxs_ready').toggleYatay();
		$('#btn_run').toggleYatay();
		$('#btn_trash').toggleYatay();
		$('#btn_back').toggleYatay();
		setTimeout(function(){$("#content_blocks").animate({left: '-1000%'}, 400, function(){
			$("#content_blocks").hide();				
		}); },200);
	}
}

Yatay.Mobile.settings  = function(){
	var modalVisible = !$("#settings_modal").is(":hidden");
	if (modalVisible) //If it´s visible then, else..
	{
		if ($("#cmb_language").val() != localStorage.yatay_lang)
			Yatay.Common.changeLanguage();	
		$(".tickDiv").toggle();
		$(".collapseDiv").toggle();
		$(".container").css("text-align","");
		$("#settings_modal").hide();
		Yatay.Mobile.DisplayingDialog = false;
		$('#content_blocks').addClass('content-' + BlocklyApps.LANG);
		$("#content_blocks").show();
		$(".blocklyTable").show();
		$('#btn_openfile').removeClass("dobleButton pull-left");
		$('#btn_openfile').addClass("singleButton");
		Blockly.fireUiEvent = Yatay.BlocklyFireEventBlocked;
		$('#btn_more').toggle();
		if (Yatay.Common.behaviours.length > 0)
			$('#btn_bxs_ready').toggleYatay();
		$('#btn_run').toggleYatay();
		$('#btn_trash').toggleYatay();
		$('#btn_back').toggleYatay();
		Blockly.fireUiEvent(window, 'resize');
		setTimeout(function(){$("#content_blocks").animate({left: '0px'}); Blockly.fireUiEvent(window, 'resize'); Blockly.fireUiEvent(window, 'resize'); },300);
	}
	else
	{
		localStorage.yatay_lang = BlocklyApps.LANG;
		$("#cmb_language").val(BlocklyApps.LANG);
		$(".tickDiv").toggle();
		$(".collapseDiv").toggle();
		$(".container").css("text-align","left");
		Yatay.Mobile.DisplayingDialog = true;
		$('#content_blocks').removeClass('content-' + BlocklyApps.LANG);
		$("#settings_modal").show();
		$(".blocklyTable").hide();
		Yatay.BlocklyFireEventBlocked = Blockly.fireUiEvent;
		Blockly.fireUiEvent = function (){ return;};
		$('#btn_more').toggle();
		if (!$('#btn_bxs_ready').is( ":hidden" ))
			$('#btn_bxs_ready').toggleYatay();
		$('#btn_run').toggleYatay();
		$('#btn_trash').toggleYatay();
		$('#btn_back').toggleYatay();
		setTimeout(function(){$("#content_blocks").animate({left: '-1000%'}, 400, function(){
			$("#content_blocks").hide();				
		}); },200);
	}
}

Yatay.Mobile.proymodal  = function(){
	if (!$(projmaneger_modal).is(":hidden")) //If it´s visible then, else..
	{
		$(".tickDiv").toggle();
		$(".collapseDiv").toggle();
		$(".container").css("text-align","");
		$("#projmaneger_modal").hide();
		Yatay.Mobile.DisplayingDialog = false;
		$('#content_blocks').addClass('content-' + BlocklyApps.LANG);
		$("#content_blocks").show();
		$(".blocklyTable").show();
		$('#btn_openfile').removeClass("dobleButton pull-left");
		$('#btn_openfile').addClass("singleButton");
		Blockly.fireUiEvent = Yatay.BlocklyFireEventBlocked;
		$('#btn_more').toggle();
		if (Yatay.Common.behaviours.length > 0)
			$('#btn_bxs_ready').toggleYatay();
		$('#btn_run').toggleYatay();
		$('#btn_trash').toggleYatay();
		Blockly.fireUiEvent(window, 'resize');
		setTimeout(function(){$("#content_blocks").animate({left: '0px'}); Blockly.fireUiEvent(window, 'resize'); Blockly.fireUiEvent(window, 'resize'); },300);
	}
	else
	{
		$(".tickDiv").toggle();
		$(".collapseDiv").toggle();
		$(".container").css("text-align","left");
		Yatay.Mobile.DisplayingDialog = true;
		$('#content_blocks').removeClass('content-' + BlocklyApps.LANG);
		$("#projmaneger_modal").show();
		$(".blocklyTable").hide();
		Yatay.BlocklyFireEventBlocked = Blockly.fireUiEvent;
		Blockly.fireUiEvent = function (){ return;};
		$('#btn_more').toggle();
		if (!$('#btn_bxs_ready').is( ":hidden" ))
			$('#btn_bxs_ready').toggleYatay();
		$('#btn_run').toggleYatay();
		$('#btn_trash').toggleYatay();
		setTimeout(function(){$("#content_blocks").animate({left: '-1000%'}, 400, function(){
			$("#content_blocks").hide();				
		}); },200);
	}
}