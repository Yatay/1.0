local M = {}

require 'LuaXml' 

--devices.xml parser
--param: file path
local function devices_parser(path)
	local file = xml.load(path)
	local devices = file:find("devices")
	for i=1, #devices do
		--print(devices[i].name, devices[i].alias)
		local functions = devices[i]:find("device")
		for j=1, #functions do
			--print(functions[j].name, functions[j].alias, functions[j].params)
			--TODO: do something with the data.
		end
	end	
end

M.init = function(conf)	
	
	--Parser test
	devices_parser("devices.xml")	
end

return M
