const shell = require("shelljs");

if (process.env.NODE_ENV === "rmt-dkr-prod") {
    shell.rm("-Rf", "dist/");
    shell.mkdir("dist");
    shell.cp("-R", "src/public/", "dist/public/");
} else {
    shell.rm("-Rf", "dist/");
    shell.mkdir("dist");
    shell.cp("-R", "src/public/", "dist/public/");
    shell.mkdir("dist/config");
    shell.cp("-f", "src/config/.env", "dist/config/.env");
}