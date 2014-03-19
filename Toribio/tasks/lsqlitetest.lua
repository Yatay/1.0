local M = {}

local sqlite3 = require("lsqlite3")

--Create SQLite table
local function create_table()
	local db = sqlite3.open('test.db')

	db:exec[[
	  CREATE TABLE test (id INTEGER PRIMARY KEY, content);

	  INSERT INTO test VALUES (NULL, 'Hello Yatay');
	  INSERT INTO test VALUES (NULL, 'Hello Lua');
	  INSERT INTO test VALUES (NULL, 'Hello Sqlite3')
	]]

	--for row in db:nrows("SELECT * FROM test") do
	--print(row.id, row.content)
	--end
	
	db:exec('commit')
	assert(db:close() == sqlite3.OK)

end

M.init = function(conf)	
	
	--LSQLite test
	create_table()	
end

return M
