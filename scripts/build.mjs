import {build} from 'esbuild';
import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
mkdirSync('dist/assets',{recursive:true});
const result=await build({entryPoints:['src/app.js'],bundle:true,format:'iife',target:'es2022',loader:{'.png':'dataurl'},write:false});
const js=result.outputFiles[0].text,css=readFileSync('src/style.css','utf8').replace("url('../assets/Bungee-Regular.ttf')",'url(data:font/ttf;base64,'+readFileSync('assets/Bungee-Regular.ttf').toString('base64')+')');
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta name="description" content="Ten original birthday scams for Faith. A pink-and-lilac arcade wheel with editable prizes, demos, and a transparent stream view."><title>Faith | Birthday Scam Wheel</title><style>'+css+'</style></head><body><script>'+js.replace(/<\/script/gi,'<\\/script')+'</script></body></html>';
writeFileSync('dist/index.html',html);writeFileSync('Birthday-Scam-Wheel.html',html);copyFileSync('assets/Bungee-OFL.txt','dist/assets/Bungee-OFL.txt');writeFileSync('dist/.nojekyll','');
console.log('Built birthday wheel and portable HTML.');
