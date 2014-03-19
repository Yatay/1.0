/**
 * @fileoverview 
 * @author 
 */
 
if (typeof apps == 'undefined') { var apps = {}; }

apps.messages = function(opt_data, opt_ignored, opt_ijData) {
  return '';
};

apps.dialog = function(opt_data, opt_ignored, opt_ijData) {
  return '';
};

apps.codeDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '';
};

apps.storageDialog = function(opt_data, opt_ignored, opt_ijData) {
  return '';
};

apps.ok = function(opt_data, opt_ignored, opt_ijData) {
  return '';
};

if (typeof codepage == 'undefined') { var codepage = {}; }

codepage.messages = function(opt_data, opt_ignored, opt_ijData) {
  return apps.messages(null, null, opt_ijData) + '';
};

codepage.start = function(opt_data, opt_ignored, opt_ijData) {
  return codepage.messages(null, null, opt_ijData) + '<script type="text/javascript" src="../../blockly_compressed.js"><\/script><script type="text/javascript" src="../../' + soy.$$escapeHtml(opt_ijData.langSrc) + '"><\/script><script type="text/javascript" src="./languages/common.js"><\/script><script type="text/javascript" src="./languages/es.js"><\/script><table class="blocklyTable"><tr><td height="100%" colspan=2 id="content_area">' + codepage.toolbox(opt_data, null, opt_ijData) + '</td></tr></table><div id="content_blocks" class="content"></div>' + apps.dialog(null, null, opt_ijData) + apps.storageDialog(null, null, opt_ijData);
};

codepage.toolbox = function(opt_data, opt_ignored, opt_ijData) {
  return '<xml id="toolbox" style="display: none"><category name="Acciones"><block type="controls_conditionalBehaviour"><value name="BEHAVIOUR_CONDITION"><block type="controls_behaviourTrigger"></block></value></block><block type="controls_behaviour"></block></category><category name="Control"><block type="controls_if"></block><block type="controls_whileUntil"></block><block type="controls_repeat"></block><block type="controls_sleep"></block><block type="controls_timesExecuted"></block></category><category name="Butiá">' + opt_data + '</category><category name="Lógica"><block type="logic_compare"></block><block type="logic_operation"></block><block type="logic_constrain"><value name="LOW"><block type="math_number"><title name="NUM">1</title></block></value><value name="HIGH"><block type="math_number"><title name="NUM">100</title></block></value></block><block type="logic_negate"></block><block type="logic_boolean"></block></category><category name="Matemáticas"><block type="math_number"></block><block type="math_arithmetic"></block><block type="math_single"></block><block type="math_trig"></block><block type="math_round"></block></category><category name="Variables"><block type="variables_get"></block><block type="variables_set"></block><block type="variables_print"></block><block type="variables_print_stat"></block><block type="variables_sensor_set"></block><block type="variables_sensor_get"></block></category></xml>';
};

codepage.readonly = function(opt_data, opt_ignored, opt_ijData) {
  return codepage.messages(null, null, opt_ijData) + '';
};
