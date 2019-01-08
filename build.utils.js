const shell = require("shelljs");

if (!shell.test('-d', "dist")) {
    shell.mkdir("dist");
}
if (!shell.test('-d', "dist/public")) {
    shell.mkdir("dist/public");
}
shell.cp("-f","src/public/*", "dist/public/");

if (process.env.NODE_ENV === "prod") {
    if (!shell.test('-d', "dist/public/user-images")) {
        shell.mkdir("dist/public/user-images");
    }
}