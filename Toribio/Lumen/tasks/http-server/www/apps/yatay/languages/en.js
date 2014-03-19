/**
 * @fileoverview 
 * @author 
 */
 
if (!Yatay.Msg){ 
	Yatay.Msg = {};
}

// Dialogs Messages
Yatay.Msg.DIALOG_CODE_LABEL = "Generated code";	
Yatay.Msg.DIALOG_RUN = "Run";
Yatay.Msg.DIALOG_SAVE = "Save";
Yatay.Msg.DIALOG_LOADER_LABEL = "Project chooser!";		
Yatay.Msg.DIALOG_OPEN = "Open";
Yatay.Msg.DIALOG_LOCAL_INPUT = "Local";
Yatay.Msg.DIALOG_REMOTE_INPUT = "Remote";
Yatay.Msg.DIALOG_TXT_REMOTE_INPUT = "Stored data: ";
Yatay.Msg.DIALOG_REMOTE_LOADER = "load";
Yatay.Msg.DIALOG_LOADING = "loading...";
Yatay.Msg.DIALOG_PROJECT = "Projects";
Yatay.Msg.DIALOG_BEHAVIOURS = "Behaviours";
Yatay.Msg.DIALOG_NO_BEHAVIOURS = "there is none.";
Yatay.Msg.DIALOG_START = "Start";
Yatay.Msg.DIALOG_PROJMANAGER_LABEL = "Welcome to Yatay!";
Yatay.Msg.DIALOG_NEW_PROJ = "New project";
Yatay.Msg.DIALOG_REMOTE_PROJ = "Join project";
Yatay.Msg.DIALOG_TXT_REMOTE_PROJ = "Stored projects: ";
Yatay.Msg.DIALOG_PROJ_NAME = "Name: ";
Yatay.Msg.DIALOG_NO_PROJS = "there is none.";
Yatay.Msg.DIALOG_DELETE_ALL = "All";
Yatay.Msg.DIALOG_DELETE_WORKSPACE = "Only workspace";
Yatay.Msg.DIALOG_DELETE_LABEL = "What do you want to delete?";
Yatay.Msg.DIALOG_MULTISELECT_NONE = "None selected";
Yatay.Msg.DIALOG_MULTISELECT_ALL = " Select all";
Yatay.Msg.DIALOG_EDITION_ERROR_TITLE = "Ooops!";
Yatay.Msg.DIALOG_EDITION_ERROR_BTN = "View detail";
Yatay.Msg.DIALOG_EDITION_ERROR_MSG = "Something is wrong with that code. Please check it."
Yatay.Msg.DIALOG_NONBXS_BLOCKS_WARN = "Blocks out of the main block are not taken into account.";	
Yatay.Msg.CANNOT_PARSE_BLOCKS = "Some of the blocks loaded are not available now. The system could not made them up.";

// File saver Messages
Yatay.Msg.FILE_BLOCKS = "blocks";
Yatay.Msg.FILE_CODE = "code";

// Tour Messages
Yatay.Msg.TOUR_TOOLBOX_TITLE = 'Where are the blocks?';
Yatay.Msg.TOUR_TOOLBOX_CONTENT = 'You will find the blocks here, starts with behaviour blocks!';
Yatay.Msg.TOUR_RBTEST_TITLE = 'Do you want to calibrate the robot?'; 
Yatay.Msg.TOUR_RBTEST_CONTENT = 'Here you can test sensors and actuators from robot Butiá.';
Yatay.Msg.TOUR_RUN_TITLE = 'Do you want to run your behaviours?';
Yatay.Msg.TOUR_RUN_CONTENT = 'Execute your behaviours and also you can debug it!';
Yatay.Msg.TOUR_EDIT_TITLE = 'What code is being generated?';
Yatay.Msg.TOUR_EDIT_CONTENT = 'You can edit and test the generated code.';
Yatay.Msg.TOUR_BXREADY_TITLE = 'Did you finish assembling your behavior?'; 
Yatay.Msg.TOUR_BXREADY_CONTENT = 'You can check your behaviour as ready and start with another!';
Yatay.Msg.TOUR_NEXT = 'next';
Yatay.Msg.TOUR_PREV = 'prev';

// Popup Messages 
Yatay.Msg.POPUP_RESULTS_ROBOTINFO = 'Robot Info: ';
Yatay.Msg.POPUP_RESULTS_CONSOLE = 'Console: ';

// Control Messages
Yatay.Msg.CONTROLS_IF_TOOLTIP = "If the first condition is true execute first things, otherwise the second ones.";
Yatay.Msg.CONTROLS_IF_HELPURL = "";
Yatay.Msg.CONTROLS_IF_MSG_IF = "if";
Yatay.Msg.CONTROLS_IF_MSG_THEN = "then";
Yatay.Msg.CONTROLS_IF_MSG_ELSEIF = "else if";
Yatay.Msg.CONTROLS_IF_MSG_ELSE = "else";

Yatay.Msg.CONTROL_OPERATION_AND = "and";
Yatay.Msg.CONTROL_OPERATION_OR = "or";
Yatay.Msg.CONTROL_OPERATION_HELPURL = "";
Yatay.Msg.LOGIC_OPERATION_TOOLTIP_AND = "If both condition are true, this block will be true.";
Yatay.Msg.LOGIC_OPERATION_TOOLTIP_OR = "If at least one condition is true, this block will be true.";

Yatay.Msg.CONTROL_NEGATE_HELPURL = "";
Yatay.Msg.CONTROL_NEGATE_TITLE = "not %1";
Yatay.Msg.CONTROL_NEGATE_TOOLTIP = "The block will be true if is true the opposite to the condition.";

Yatay.Msg.CONTROL_BOOLEAN_TRUE = "true";
Yatay.Msg.CONTROL_BOOLEAN_FALSE = "false";
Yatay.Msg.CONTROL_BOOLEAN_HELPURL = "";
Yatay.Msg.CONTROL_BOOLEAN_TOOLTIP = "True or false block";

Yatay.Msg.CONTROL_WHILE = "while";
Yatay.Msg.CONTROL_WHILE_TOOLTIP = "While the condition is satisfied the blocks inside this will be executed.";

Yatay.Msg.CONTROL_BEHAVIOUR = "name";
Yatay.Msg.CONTROL_BEHAVIOUR_PRIORITY = "   priority";
Yatay.Msg.CONTROL_BEHAVIOUR_TOOLTIP = "Build a new behaviour with a name and prority.";
Yatay.Msg.CONTROLS_BEHAVIOUR_ACTION = "action";
Yatay.Msg.CONTROLS_BEHAVIOUR_CONDITION = "trigger";

Yatay.Msg.CONTROL_SLEEP = "wait";
Yatay.Msg.CONTROL_SLEEP_TOOLTIP = "The behaviour will pause for the time chosen.";

Yatay.Msg.CONTROL_REPEAT = "repeat" ;
Yatay.Msg.CONTROL_REPEAT_TIMES = " times";
Yatay.Msg.CONTROL_REPEAT_TOOLTIP = "Repeat something a number of times ";
Yatay.Msg.CONTROL_TIMES_EXECUTED = "times executed";

//Variable Messages
Yatay.Msg.VARIABLES_GET_TITLE = "";
Yatay.Msg.VARIABLES_GET_TAIL = "";
Yatay.Msg.VARIABLES_GET_TOOLTIP = "Get value of variable";
Yatay.Msg.VARIABLES_GET_CREATE_SET = "";
Yatay.Msg.VARIABLES_SET_TITLE = "set as";
Yatay.Msg.VARIABLES_SET_TAIL = "";
Yatay.Msg.VARIABLES_PRINT = "print";
Yatay.Msg.COMPLEX_SENSOR_SET_TITLE = "build sensor ";
Yatay.Msg.COMPLEX_SENSOR_GET_TITLE = "sensor"

//Math Messages 
Yatay.Msg.MATH_CONSTRAIN_HELPURL = "";
Yatay.Msg.MATH_CONSTRAIN_TITLE = "%1 between %2 and %3";
Yatay.Msg.MATH_CONSTRAIN_TOOLTIP = ""; 
Yatay.Msg.MATH_ROUND_OPERATOR_ROUND = "round";
Yatay.Msg.MATH_ROUND_OPERATOR_ROUNDUP = "round up";
Yatay.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN = "round down";
Yatay.Msg.MATH_TRIG_TOOLTIP_SIN = "sin";
Yatay.Msg.MATH_TRIG_TOOLTIP_ASIN = "asin";
Yatay.Msg.MATH_SINGLE_TOOLTIP_ROOT = "square root";
Yatay.Msg.MATH_SINGLE_TOOLTIP_ABS = "abs";
Yatay.Msg.MATH_SINGLE_TOOLTIP_NEG = "opposite";

//Code comments
Yatay.Msg.CODE_INITIALIZEVARS = "--Initializing libraries and attributes:\n";
Yatay.Msg.CODE_COMPETE = "--Competing for execution:\n";
Yatay.Msg.CODE_RUN = "--Behaviour's action when executes:\n";
Yatay.Msg.CODE_DONE = "--Done, leave empty the active behaviour place:\n";
Yatay.Msg.CODE_INIT = "--Registers the behaviour so it can compete:\n";
Yatay.Msg.CODE_RELEASE = "--Function that runs when this behaviour is switched:\n";
Yatay.Msg.CODE_WHILE = "--The sleep prevents to flood the system with too many repetitions:\n";

// SVG Behaviours popup
Yatay.Msg.SVG_BEHAVIOURS = '<svg width="128pt" height="32pt"><path fill="#5B8FA6" d=" M 17.37 7.50 C 20.56 7.07 23.79 7.34 27.00 7.30 C 62.28 7.31 97.57 7.32 132.85 7.30 C 133.23 15.87 132.89 24.45 133.03 33.03 C 103.00 33.00 72.98 32.98 42.96 33.03 C 38.77 32.67 36.46 38.03 32.17 37.03 C 29.90 36.01 28.04 34.28 25.80 33.20 C 20.97 32.72 16.10 33.29 11.26 32.82 C 11.35 27.21 11.26 21.59 11.29 15.98 C 10.94 12.15 13.94 8.74 17.37 7.50 Z" /></svg>';
