local M = {}
-- the true parameter makes the catalog strong, thus avoiding garbage collection
local behaviours = require 'catalog'.get_catalog('behaviours', true)
local sched = require 'sched'

local function exist(task)
	for name in behaviours:iterator() do
		if name == task then
			return true	
		end				
	end
	return false
end 

M.kill_tasks = function(userId)
	local none = true
	--Autogen Id for robot calibrations
	RBTManagerActivate = false
	local bxcount = 0
	for name, btable in behaviours:iterator() do
		if (btable.userId == userId) then
			behaviours:unregister(name)
			if (btable.compete_task ~= nil) then
				btable.compete_task:kill()
			end
			if (btable.task ~= nil) then
				btable.task:kill()
			end
			btable = {}
			none = false
		else
			--Not killed so still in the catalog count
			bxcount = bxcount +1
		end
	end	
	yataySensorResults[userId] = nil
	if (bxcount == 0) then
		sched.signal('StopActuators!')
		collectgarbage('restart')
		activeBehaviour = nil
		previousBehaviour = nil
	else
		--resume execution for others behaviours
		RBTManagerActivate = true
	end
	if (none) then 
		print('YATAY: No tasks to kill.')
	else
		print('YATAY: All task killed!')
	end
 end


M.create_task = function(task, userId)
--	yataySensorResults[userId] = nil
	local code, errorCompilacion = loadstring(task)
	if (not errorCompilacion) then	
		local ok, tasktable = pcall(code)
		if (not ok) then
			print("YATAY: task execution error -")
			print(tasktable)
		else
			--Control: tasks already exists?
			if (not exist(tasktable.name)) then
				collectgarbage('stop');
				behaviours:register(tasktable.name, tasktable)
				tasktable.userId = userId
				local newTask = sched.new_task(code)
				tasktable.init(true)
				RBTManagerActivate = true
				print('YATAY: task '.. tasktable.name ..' initialized! UserId:'..tasktable.userId)
			else
				print('YATAY: task '.. tasktable.name ..' already exist.')
			end
		end
	else
			M.kill_tasks(userId)
			print("YATAY: task compilation error - ")
			print(errorCompilacion)
			yataySensorResults[userId] = 'ERROR:'.. errorCompilacion
			sched.signal('NewSensorResult')

	end
end

M.test_robot = function(task, userId)
	local code, errorCompilacion = loadstring(task)
	if (not errorCompilacion) then	
		local ok, tasktable = pcall(code)
		if (not ok) then
			print("YATAY: task execution error -")
			print(tasktable)
		else
			if (not exist(userId)) then
				collectgarbage('stop');
				behaviours:register(userId, tasktable)
				tasktable.userId = userId
				print('YATAY: Setted tasktable.userId=',tasktable.userId)
				local newTask = sched.new_task(code)
				tasktable.init(true)
				print('YATAY: A robot test is running')							
			else
				print('YATAY: Test '.. userId ..' already exist.')
			end
	end
	else
			print("YATAY: task compilation error -")
			print(errorCompilacion)
	end
end


return M



