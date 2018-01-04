const path = require('path');
const fs = require('fs');
const xls2json = require('xls-to-json-2');

const dirPath = path.resolve(__dirname,'../excel');

fs.readdir(dirPath, (err, files) => {
    files.forEach((v, i) => {
        let filePath = path.join(dirPath, v);
        if(!filePath.endsWith('.xlsx')){return;}
        let outPath = filePath.replace('.xlsx', '.ts')
        let stats = fs.statSync(filePath);
        if (stats.isFile()) {
            parse(filePath,outPath);
        }
    })
})

function parse(filePath,outPath) {
    xls2json({
        input: filePath,
        output: outPath,
        sheet: 'Sheet1',
        filed_name_row: 0,
    }, (err, data) => {
        if (err) throw err;
        //console.log(data);
        fs.readFile(outPath, (err, data) => {
            const code = `const out = ${data};export default out`;
            fs.writeFile(outPath, code);
        })
    })
}