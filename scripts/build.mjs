import {access,cp,mkdir,readFile,readdir,rm} from 'node:fs/promises';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {build} from 'esbuild';

const root=fileURLToPath(new URL('../',import.meta.url));
const assets=join(root,'public'),output=join(root,'dist');
// Check the source before replacing generated output. The ZIP and checkout
// share this exact layout, so a build never relies on a pre-existing dist.
await access(join(assets,'index.html'));
await access(join(root,'app.js'));
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await cp(assets,output,{recursive:true});
await build({absWorkingDir:root,entryPoints:['app.js'],bundle:true,format:'iife',minify:true,outfile:'dist/game.bundle.js',logLevel:'info'});

// Missing HTML, styles or language banks should fail the build, rather than
// leaving an apparently successful deployment with a blank game.
let references=0;
for(const name of await readdir(output)){
  if(!name.endsWith('.html'))continue;
  const page=join(output,name),html=await readFile(page,'utf8');
  for(const match of html.matchAll(/<(?:script|link|img|iframe)\b[^>]*\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)){
    const ref=match[1];if(/^(?:[a-z]+:|\/\/|#)/i.test(ref))continue;
    const path=decodeURIComponent(ref.split(/[?#]/)[0]);if(!path)continue;
    await access(join(dirname(page),path));references++;
  }
}
console.log(`Build complete: dist/index.html and ${references} local HTML asset references verified.`);
