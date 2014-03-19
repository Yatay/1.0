local M = {}

local sched = require 'sched'
local json = require 'json'
local persistence = require 'tasks/Persistence'

M.save_task = function(project, block, code, newborn, blockCount)
	local newname = block
	if (project ~= nil and block ~= nil and code ~= nil) then
		if (newborn == 'true') then	
			local i = 1		
			while (persistence.exist(project, newname)) do
				newname = block .. tostring(i)
				i = i + 1
			end
			if (blockCount > 1) then
				persistence.insert(project, newname, code)
			end
		else
			if (blockCount > 1) then
				persistence.update(project, newname, code)
			end
		end
	end
	return newname
end

M.load_bxs = function()
	local result = {}
	local projs = persistence.get_projects()
	for i=1, #projs do
		result[i] = {}
		result[i].project = projs[i] 
		result[i].behaviours = persistence.get_behaviours(projs[i])
	end
	return json.encode(result)
end

M.load_projs = function()
	local projs = persistence.get_projects()
	return json.encode(projs)
end 

return M
