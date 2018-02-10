const shell = require("shelljs");

shell.cp("-R", "src/public/", "dist/public/");
shell.cp("-R", "src/bin", "dist/bin/");