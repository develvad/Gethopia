const {execSync} = require('child_process')
const result = execSync(`docker start eth3`)
console.log(result.toString());

