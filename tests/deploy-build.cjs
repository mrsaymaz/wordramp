const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),fresh=fs.mkdtempSync(path.join(os.tmpdir(),'wordramp-build-'));
try{
 for(const name of ['public','scripts'])fs.cpSync(path.join(root,name),path.join(fresh,name),{recursive:true});
 for(const name of ['package.json','package-lock.json','netlify.toml',...fs.readdirSync(root).filter(n=>n.endsWith('.js'))])fs.copyFileSync(path.join(root,name),path.join(fresh,name));
 fs.symlinkSync(path.join(root,'node_modules'),path.join(fresh,'node_modules'),'dir');
 assert(!fs.existsSync(path.join(fresh,'dist')),'The regression starts without deployment output');
 execFileSync(process.execPath,['scripts/build.mjs'],{cwd:fresh,stdio:'pipe'});
 const config=fs.readFileSync(path.join(fresh,'netlify.toml'),'utf8'),publish=config.match(/publish\s*=\s*"([^"]+)"/)[1];
 assert.equal(publish,'dist');assert(config.includes('command = "npm run build"'));
 const output=path.join(fresh,publish),assets=fs.readdirSync(path.join(root,'public'));
 assert.deepEqual(fs.readdirSync(output).sort(),[...assets,'game.bundle.js'].sort(),'Publish includes every static game file and the built bundle');
 // Compare every published file, including images in subfolders such as img/.
 const files=fs.readdirSync(path.join(root,'public'),{recursive:true}).filter(n=>fs.statSync(path.join(root,'public',n)).isFile());assert(files.some(n=>n.startsWith('img')),'Host images are published');
 for(const name of files)assert.deepEqual(fs.readFileSync(path.join(output,name)),fs.readFileSync(path.join(root,'public',name)),name);
 assert(fs.statSync(path.join(output,'game.bundle.js')).size>100000);
 for(const name of ['index.html','style.css','game-core.js','language-bank.js','repair-bank.js','match-bank.js','emoji-bank.js','config.js','icon.svg','phone-preview.html'])assert(fs.existsSync(path.join(output,name)),name);
 // Browser translation must never turn the English answers into Turkish.
 for(const name of ['index.html','phone-preview.html']){const html=fs.readFileSync(path.join(output,name),'utf8');assert.match(html,/<html[^>]*translate="no"[^>]*class="notranslate"/,name);assert.match(html,/<body[^>]*translate="no"[^>]*class="notranslate"/,name);assert.match(html,/<head>[\s\S]*<meta name="google" content="notranslate">[\s\S]*<\/head>/,name);}
 assert(!fs.existsSync(path.join(output,'package.json')));assert(!fs.existsSync(path.join(output,'app.js')));
 // A second build replaces stale output instead of accidentally publishing it.
 fs.writeFileSync(path.join(output,'stale-file.txt'),'old build');
 execFileSync(process.execPath,['scripts/build.mjs'],{cwd:fresh,stdio:'pipe'});
 assert(!fs.existsSync(path.join(output,'stale-file.txt')));
 console.log('PASS: empty-dist build and repeat build create the complete Netlify publish directory; HTML, CSS, language banks, icon and preview copy correctly, stale output is removed, and both pages opt out of browser translation.');
}finally{fs.rmSync(fresh,{recursive:true,force:true});}
