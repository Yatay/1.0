local M = {}

local sched = require 'sched'
local executor = require 'tasks/Executor'

local function url_decode(s)
	return (string.gsub (s, "%%(%x%x)",
		function(str)
		return string.char(tonumber(str, 16))
		end ))
end

local function initTask(code, userId)
	local decoded_task = url_decode(url_decode(code))		
		local c = coroutine.create(
		function ()
				local executor = require 'tasks/Executor'
			executor.create_task(decoded_task, userId)
 		end)
	coroutine.resume(c)
end

local function testRobot(code, userId)
	local decoded_task = url_decode(url_decode(code))		
		local c = coroutine.create(
		function ()
			local executor = require 'tasks/Executor'
			executor.test_robot(decoded_task, userId)
 		end)
	coroutine.resume(c)
end

local function killTasks(userId)
	yataySensorResults[userId] = nil
	yatayDebugResults[userId] = nil
	yatayWebConsole = ''
	local c =	coroutine.create(
		function ()
			local executor = require 'tasks/Executor'
			executor.kill_tasks(userId)
		end)
	coroutine.resume(c)
end

local function saveTask(project, block, code, newborn, blockCount)
	local decoded_task = url_decode(url_decode(code))  
	
	local pjadmin = require 'tasks/ProjectAdmin'    
	return pjadmin.save_task(project, block, decoded_task, newborn, tonumber(blockCount))
end

local function pop_blocking(name, ev_name)
	if (name ~= nil) then
		return name
	end
	local _, event = sched.wait({
		emitter='*', 
		timeout=2, 
		events={ev_name}
	})
	if (name ~= nil) then
		return name
	end
	return "";
end 

local function pop_blocking_user(name, ev_name, userId)
	if (name ~= nil and name[userId] ~= nil) then
		return name[userId]
	end
	local _, event = sched.wait({
		emitter='*', 
		timeout=2, 
		events={ev_name}
	})
	if (name ~= nil and name[userId] ~= nil) then
		return name[userId]
	end
	return "";
end 

local function load_bxs()
	local pjadmin = require 'tasks/ProjectAdmin'		
	return pjadmin.load_bxs()
end

local function load_projs()
	local pjadmin = require 'tasks/ProjectAdmin'		
	return pjadmin.load_projs()
end

local function refresh()
	local robotIface = require 'tasks/RobotInterface'
	if (robotIface.refresh_devices()) then
		return 'yes'
	else 
		return 'no'
	end
end

local function saveTempLocal(xml, filename)
	local decoded_xml = url_decode(url_decode(xml))	
	local decoded_filename = url_decode(url_decode(filename))	
	file, errors = io.open('Lumen/tasks/http-server/www/apps/yatay/_downloads/'..decoded_filename..'.apk', 'w+')	
	print(errors)
	if (errors == nil) then
		file:write(decoded_xml)
		file:close()
	end
	return "";
end

local function select_action(id, project, block, code, newborn, strUserId, blockCount)
	local userId = 0
	if (strUserId ~= nil and strUserId ~= "0") then
		userId = tonumber(strUserId)
	end
	
	if (id == 'init') then 
		initTask(code, userId)
	elseif (id == 'kill') then
		killTasks(userId)
	elseif (id == 'poll') then
		if (yatayWebConsole == nil) then
			yatayWebConsole = ""
		end
		local ret = pop_blocking_user(yataySensorResults, 'NewSensorResult', userId).."#;#"..yatayWebConsole
		return ret
	elseif (id == 'pollDebug') then
		return pop_blocking_user(yatayDebugResults, 'NewDebugResult', userId)		 
	elseif (id == 'save') then
		return saveTask(project, block, code, newborn, blockCount)
	elseif (id == 'test') then
		testRobot(code, userId)
	elseif (id == 'loadBxs') then
		return load_bxs()
	elseif (id == 'loadProjs') then
		return load_projs()
	elseif (id == 'blocks') then	
		return pop_blocking(yatayBlocksRefresh, 'BlocksRefresh')
	elseif (id == 'refreshBlocks') then
		return refresh()
	elseif (id == 'saveTempLocal') then
		return saveTempLocal(code,project)		
	elseif (id == 'getUserId') then
		yatayUserId = yatayUserId + 1
		userId = yatayUserId
		return ''..userId
	end
	return ""
end

M.init = function(conf)	

	local http_server = require "../Lumen/tasks/http-server"	
	http_server.serve_static_content_from_ram('/', 'Lumen/tasks/http-server/www')

	--Inicializando la cola de resultados
	--TODO: hacer una tabla de resultados
	yataySensorResults = {}
	yatayDebugResults = {}
	if yatayBlocksRefresh == nil then
		yatayBlocksRefresh = ''	
	end
	yatayWebConsole = ''
	yatayUserId = 0
	yatayLang = ''

	http_server.set_request_handler(
		'POST',
		'/index.html',
		function(method, path, http_params, http_header)
			if (http_params['lang'] ~= nil) then
				yatayLang = http_params['lang']
				refresh()
			end
			local content = select_action(http_params['id'], http_params['project'], http_params['block'], http_params['code'], http_params['newborn'], http_params['userId'], http_params['blockCount'])
			return 200, {['content-type']='text/html', ['content-length']=#content}, content
		end
	)
	
	--Find out my IP address
	require("socket")
	local someRandomIP = "192.168.1.1"
	local someRandomPort = "3102" 
	local mySocket = socket.udp()
	mySocket:setpeername(someRandomIP,someRandomPort) 
	local myDevicesIpAddress, somePortChosenByTheOS = mySocket:getsockname() 

	local conf = {
		ip = tostring(myDevicesIpAddress),
		port = 8080,
		ws_enable = false,
		max_age = {ico=99999, css=600, html=60},
	}
	http_server.init(conf)
	
	print('YATAY: Server is up...')
end

return M
