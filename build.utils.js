const shell = require("shelljs");

shell.rm("-Rf", "dist/");
shell.mkdir("dist");
shell.cp("-R", "src/public/", "dist/public/");

if (process.env.SERVER === "local") {
    shell.mkdir("dist/config");
    shell.cp("-f", "src/config/.env", "dist/config/.env");
}