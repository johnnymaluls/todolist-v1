# ejs-preprocessor
 use ejs like preprocessor

# installation
```npm i ejsp -g```

# usage
create the ejsp.json file(this is config for ejs preprocessor)
example
```json 
{
    "dir":"testinput/",
    "outdir":"test/",
    "vars":{"test":"hello"}
}
```
dir - directory with ejs files  
outdir - directory with rendered ejs files  
vars - ejs vars  

then run the command ```ejsp``` in the cmd