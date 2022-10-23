const path = require('path');
const fs = require("fs");
const ejs = require("ejs");

function scaner(dir, outdir, vars){
    let rdir = fs.readdirSync(dir);
    for(let component of rdir){
        let stat = fs.statSync(dir+component);
        if(!stat.isFile()){ 
            let path = dir+component+'/';
            scaner(path, outdir, vars);
        } else {
            preprocessor((dir+component), outdir, vars, dir);
        }
    }
}

function preprocessor(file, outdir, vars, dir){
    if(path.extname(file)===".ejs"){
        let realdir = dir.split("/");
        realdir.shift();
        realdir = realdir.join("/");
        let outfilename = path.join(outdir, realdir, path.basename(file, path.extname(file))+".html");
        fs.mkdirSync(path.dirname(outfilename), { recursive: true })
        ejs.renderFile(file, vars, (err, str)=>{
            if(err) throw err;
            fs.writeFile(outfilename, str, {encoding:"utf-8"}, (err)=>{
                if(err) throw err;
                console.log("file", file, "is rendered to", outfilename)
            });
        });
    } else{
        let realdir = dir.split("/");
        realdir.shift();
        realdir = realdir.join("/");
        let outfilename = path.join(outdir, realdir, path.basename(file));
        fs.mkdirSync(path.dirname(outfilename), { recursive: true })
        fs.copyFile(file, outfilename, (err) => {
            if (err) throw err;
            console.log(`file ${file} was copied`);
        });
    }
}

module.exports = (dir, outdir, vars) => { 
    scaner(dir, outdir, vars); 
}