const path = require("path");
const fs = require("fs");
const { JSDOM } = require("jsdom");

const framerExportDir = path.join(__dirname, "../src/app/[lang]/framer/");

if (fs.existsSync(framerExportDir)) {
  fs.rmSync(framerExportDir, { recursive: true });
}

fs.mkdirSync(framerExportDir);
fs.mkdirSync(path.join(framerExportDir, "hu/"));
fs.mkdirSync(path.join(framerExportDir, "en/"));

console.log("Welcome to the NeerY Landing Framer Updater!\n");

async function xp(url, dir) {
  const rootReq = await fetch(url);
  const rootHTML = await rootReq.text();
  const root = new JSDOM(rootHTML, { url }).window;

  const modules = await Promise.all([...root.document.querySelectorAll("link[rel=\"modulepreload\"]")].map(x => fetch(x.href).then(async y => ({ name: x.href.split("/").slice(-1)[0], content: await y.text()}))));

  const reactMod = modules.find(x => x.content.includes("@license React "));
  const reactModGlobal = reactMod.content.match(/var (.+?)={};/)[1];
  const rmgi = reactMod.content.indexOf("var " + reactModGlobal + "={};");
  const reactExports = reactMod.content.match(/export{(.+?)};/)[1].split(",").map(x => x.split(" as "));
  const reactVersionDecl = reactMod.content.match(new RegExp(`${reactExports[0][0]}\\.version="(.+?)";`))[0];
  const rvdi = reactMod.content.indexOf(reactVersionDecl);

  reactMod.content = reactMod.content.slice(0, rmgi)
  + `
import ${reactExports[0][0]} from "react";
const ${reactModGlobal} = ${reactExports[0][0]};
` + reactMod.content.slice(rvdi + reactVersionDecl.length);

  for (const mod of modules) {
    fs.writeFileSync(
      path.join(dir, mod.name.startsWith("chunk-") ? mod.name : "Landing.jsx"),
      "/* eslint-disable */\n" + mod.content + "\n",
    );
  }
}

xp("https://multiple-tool-413373.framer.app/", path.join(framerExportDir, "hu/"));
xp("https://multiple-tool-413373.framer.app/en", path.join(framerExportDir, "en/"));
