// Vercel and Netlify publish the same game: vercel.json must build and
// publish like netlify.toml and carry the same header, redirect and rewrite
// rules as netlify.toml and any _headers/_redirects file. No network.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=name=>fs.existsSync(path.join(root,name))?fs.readFileSync(path.join(root,name),'utf8'):null;
const vercel=JSON.parse(read('vercel.json')),toml=read('netlify.toml');
// Netlify's "/*" splat is Vercel's "/(.*)"; ":name" placeholders stay as they are.
const toVercel=source=>source.replace(/\*$/,'(.*)');
const unquote=v=>v.trim().replace(/^"(.*)"$/,'$1').replace(/^'(.*)'$/,'$1');
// A small reader for the netlify.toml parts that matter here.
function netlifyRules(text){
  const headers=[],redirects=[],build={};let section=null,current=null;
  for(const raw of text.split(/\r?\n/)){
    const line=raw.replace(/\s+#.*$/,'').trim();if(!line||line.startsWith('#'))continue;
    if(line==='[[headers]]'){current={source:null,headers:[]};headers.push(current);section='headers';continue;}
    if(line==='[headers.values]'){section='values';continue;}
    if(line==='[[redirects]]'){current={};redirects.push(current);section='redirects';continue;}
    if(/^\[/.test(line)){section=line==='[build]'?'build':'other';continue;}
    const m=line.match(/^([\w.-]+|"[^"]+")\s*=\s*(.+)$/);if(!m)continue;
    const key=unquote(m[1]),value=unquote(m[2]);
    if(section==='build')build[key]=value;
    else if(section==='headers'&&key==='for')current.source=value;
    else if(section==='values')current.headers.push({key,value});
    else if(section==='redirects')current[key]=value;
  }
  return {headers,redirects,build};
}
function headersFile(text){
  const rules=[];let current=null;
  for(const raw of (text||'').split(/\r?\n/)){
    if(!raw.trim()||raw.trim().startsWith('#'))continue;
    if(!/^\s/.test(raw)){current={source:raw.trim(),headers:[]};rules.push(current);continue;}
    const i=raw.indexOf(':');current.headers.push({key:raw.slice(0,i).trim(),value:raw.slice(i+1).trim()});
  }
  return rules;
}
function redirectsFile(text){
  return (text||'').split(/\r?\n/).map(l=>l.trim()).filter(l=>l&&!l.startsWith('#')).map(l=>{const [from,to,status='301']=l.split(/\s+/);return {from,to,status};});
}
const netlify=netlifyRules(toml);
// Build: same command and published folder; no framework guessing on Vercel.
assert.equal(vercel.framework,null);assert.equal(vercel.buildCommand,netlify.build.command);assert.equal(vercel.outputDirectory,netlify.build.publish);
assert.equal(vercel.outputDirectory,'dist');assert.equal(vercel.installCommand,'npm ci','Locked dependencies, as in the README');
// Header rules: netlify.toml + _headers (in the project root or the published folder) ↔ vercel.json.
const expected=[...netlify.headers,...headersFile(read('_headers')),...headersFile(read('public/_headers'))].map(r=>({source:toVercel(r.source),headers:r.headers}));
const norm=rules=>(rules||[]).map(r=>({source:r.source,headers:r.headers.map(h=>({key:h.key.toLowerCase(),value:h.value})).sort((a,b)=>a.key.localeCompare(b.key))})).sort((a,b)=>a.source.localeCompare(b.source));
assert(Array.isArray(vercel.headers),'vercel.json lists its header rules (an empty list while Netlify has none)');
assert.deepEqual(norm(vercel.headers),norm(expected),'vercel.json has the same header rules as the Netlify files');
// Redirects and rewrites: Netlify status 200 is a rewrite on Vercel.
const moves=[...netlify.redirects,...redirectsFile(read('_redirects')),...redirectsFile(read('public/_redirects'))];
const wantRedirects=moves.filter(r=>String(r.status||301)!=='200').map(r=>({source:toVercel(r.from),destination:r.to.replace(/:splat/g,'$1'),permanent:String(r.status||301)==='301'}));
const wantRewrites=moves.filter(r=>String(r.status)==='200').map(r=>({source:toVercel(r.from),destination:r.to.replace(/:splat/g,'$1')}));
assert.deepEqual(vercel.redirects||[],wantRedirects);assert.deepEqual(vercel.rewrites||[],wantRewrites);
// Nothing Netlify-only to move: no functions, edge functions, forms or identity.
for(const dir of ['netlify','netlify/functions','netlify/edge-functions'])assert(!fs.existsSync(path.join(root,dir)),dir);
assert(!/\[functions\]|\[\[edge_functions\]\]|\[\[plugins\]\]/.test(toml),'netlify.toml has no functions or plugins');
const published=fs.readdirSync(path.join(root,'public'),{recursive:true}).filter(n=>/\.(html|js)$/.test(n)).map(n=>fs.readFileSync(path.join(root,'public',n),'utf8')).join('\n')+read('app.js');
assert(!/\/\.netlify\/|netlify-identity|data-netlify|netlify-honeypot/.test(published),'No Netlify-only paths, forms or Identity in the game');
assert(!/process\.env/.test(read('scripts/build.mjs')),'The build reads no environment variables');
// The League stays on Netlify for every host.
assert.match(read('public/config.js'),/ultiApi: 'https:\/\/mrsaymaz\.netlify\.app\/api\/ulti'/);
// netlify.toml is kept as it was, so Netlify deploys keep working.
assert.equal(netlify.build.command,'npm run build');assert.equal(netlify.build.publish,'dist');
console.log(`PASS: vercel.json builds with npm run build and publishes dist like netlify.toml; ${expected.length} header rule(s), ${wantRedirects.length} redirect(s) and ${wantRewrites.length} rewrite(s) match the Netlify files; no Netlify Functions, Edge Functions, Forms, Identity or build-time environment variables.`);
