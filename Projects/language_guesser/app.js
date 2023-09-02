const franc = require("franc");
const langs = require("langs");
const color = require("colors");

const lang_code = franc(process.argv[2]);
let language = langs.where("3",lang_code);

if(lang_code=="und"){
    console.log("Undefined language. Write Something else.".red);
}
else{
    if(language){
        console.log(color.green(`${language.name}`));
    }
    else{
        console.log("Could not guess your language.".red)
    }
}

