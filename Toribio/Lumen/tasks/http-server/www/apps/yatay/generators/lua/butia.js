/* Automatically Generated Code */
'use strict';

goog.provide('Blockly.Lua.butia');
goog.require('Blockly.Lua');

Blockly.Lua['medir dist. (2)'] = function(block) { 
	var debugTrace = ''; 
	var params = String().replace(/Yatay.vel/g, String(Yatay.vel)); 
	return debugTrace + "robot.execute('bb-distanc:2','getValue',{" + params + "}, M.userId)\n "; 
}; 

Blockly.Lua['sensor de grises (3)'] = function(block) { 
	var debugTrace = ''; 
	var params = String().replace(/Yatay.vel/g, String(Yatay.vel)); 
	return debugTrace + "robot.execute('bb-grey:3','getValue',{" + params + "}, M.userId)\n "; 
}; 

Blockly.Lua['boton (1)'] = function(block) { 
	var debugTrace = ''; 
	var params = String().replace(/Yatay.vel/g, String(Yatay.vel)); 
	return debugTrace + "robot.execute('bb-button:1','getValue',{" + params + "}, M.userId)\n "; 
}; 

Blockly.Lua['medir distancia (4)'] = function(block) { 
	var debugTrace = ''; 
	var params = String().replace(/Yatay.vel/g, String(Yatay.vel)); 
	return debugTrace + "robot.execute('bb-distanc:4','getValue',{" + params + "}, M.userId)\n "; 
}; 

Blockly.Lua['mover adelante'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	var params = String("1,Yatay.vel,1,Yatay.vel").replace(/Yatay.vel/g, String(Yatay.vel)); 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{" + params + "}, M.userId)\n "; 
}; 

Blockly.Lua['mover atras'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	var params = String("0,Yatay.vel,0,Yatay.vel").replace(/Yatay.vel/g, String(Yatay.vel)); 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{" + params + "}, M.userId)\n "; 
}; 

Blockly.Lua['girar derecha'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	var params = String("1,Yatay.vel,0,Yatay.vel").replace(/Yatay.vel/g, String(Yatay.vel)); 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{" + params + "}, M.userId)\n "; 
}; 

Blockly.Lua['girar izquierda'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	var params = String("0,Yatay.vel,1,Yatay.vel").replace(/Yatay.vel/g, String(Yatay.vel)); 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{" + params + "}, M.userId)\n "; 
}; 

Blockly.Lua['detener'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	var params = String("0,0,0,0").replace(/Yatay.vel/g, String(Yatay.vel)); 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{" + params + "}, M.userId)\n "; 
}; 

Blockly.Lua['girar'] = function(block) { 
	var debugTrace = ''; 
	if (Yatay.DebugMode) { 
		debugTrace = "robot.put_debug_result('"+ block.id +"', M.userId)\n"; 
	} 
	var arg1 = Blockly.Lua.statementToCode(block, '1') || '0'; 
	var arg2 = Blockly.Lua.statementToCode(block, '2') || '0'; 
	var arg3 = Blockly.Lua.statementToCode(block, '3') || '0'; 
	var arg4 = Blockly.Lua.statementToCode(block, '4') || '0'; 
	var params = String(arg1 + "," + arg2 + "," + arg3 + "," + arg4).replace(/Yatay.vel/g, String(Yatay.vel)); 
	return debugTrace + "robot.execute('bb-motors','setvel2mtr',{" + params + "}, M.userId)\n "; 
}; 

