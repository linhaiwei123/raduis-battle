let  fs = require('fs');
let  join = require('path').join;
let  m_path = require('path');
/**
 *
 * @param startPath  起始目录文件夹路径
 * @returns {Array}
 */
function findSync(startPath) {
    let result=[];
    function finder(path) {
        let files=fs.readdirSync(path);
        files.forEach((val,index) => {
            let fPath=join(path,val);
            let stats=fs.statSync(fPath);
            if(stats.isDirectory()) finder(fPath);
            if(stats.isFile()) result.push(fPath);
        });

    }
    finder(startPath);
    return result;
}
let fileNames=findSync('./');
fileNames.forEach(fileName => {
	console.log(`old:${fileName}|new:${fileName.replace(' ','')}`)
    //fs.rename(fileName,fileName.replace(' ',''));
    if(`${fileName}`.endsWith('.meta')){
        fs.unlink(fileName);
    }
})
