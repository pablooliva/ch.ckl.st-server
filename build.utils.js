const shell = require("shelljs");

shell.rm("-Rf", "dist/");
shell.mkdir("dist");
shell.cp("-R", "src/public/", "dist/public/");

if (process.env.SERVER === "prod") {
    if (!shell.test('-d', "dist/public/user-images")) {
        shell.mkdir("dist/public/user-images");
    }
}