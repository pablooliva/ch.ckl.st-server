const shell = require("shelljs");

shell.rm("-Rf", "dist/");
shell.mkdir("dist");
shell.cp("-R", "src/public/", "dist/public/");