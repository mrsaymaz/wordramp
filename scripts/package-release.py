"""Export the release ZIPs.

Wordramp-vX-Netlify.zip: the project layout used by the checkout, Netlify and
Vercel (Git import or a build on upload), with the prebuilt dist folder.
Wordramp-vX-Vercel.zip: the published folder itself for Vercel drag and drop
(index.html at the top), plus a vercel.json with only the header, redirect
and rewrite rules, because a dropped folder is published as it is."""
from pathlib import Path
import argparse,json,zipfile

root=Path(__file__).resolve().parent.parent
version=json.loads((root/'package.json').read_text())['version']
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output',type=Path,default=root/f'Wordramp-v{version}-Netlify.zip')
parser.add_argument('--vercel-output',type=Path,default=root/f'Wordramp-v{version}-Vercel.zip')
args=parser.parse_args()
output=args.output.resolve();output.parent.mkdir(parents=True,exist_ok=True)
files=[root/name for name in ['package.json','package-lock.json','netlify.toml','vercel.json','README.md']]
files+=list(root.glob('*.js'))
for directory in ['public','dist','scripts','tests','reference']:
    files += [p for p in (root/directory).rglob('*') if p.is_file() and '__pycache__' not in p.parts and '-compiled.cjs' not in p.name and not p.name.endswith('.pyc')]
for required in ['dist/index.html','dist/game.bundle.js','public/index.html','scripts/build.mjs']:
    if not (root/required).is_file():raise SystemExit(f'Missing {required}; run npm run build before packaging.')
with zipfile.ZipFile(output,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
    for path in sorted(set(files)):archive.write(path,path.relative_to(root))
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    for path in files:assert archive.read(str(path.relative_to(root)))==path.read_bytes()
    assert 'dist/index.html' in archive.namelist()
    assert 'netlify.toml' in archive.namelist()
    assert 'vercel.json' in archive.namelist()
    assert not any(name.startswith(('node_modules/','.git/','.openai/')) for name in archive.namelist())
print(f'ZIP validated: {len(files)} files; {output.stat().st_size} bytes; {output}')

# Vercel drag and drop: the contents of dist at the top level, no build step.
vercel_output=args.vercel_output.resolve();vercel_output.parent.mkdir(parents=True,exist_ok=True)
config=json.loads((root/'vercel.json').read_text())
drop={key:config[key] for key in ['headers','redirects','rewrites'] if key in config}
published=[p for p in (root/'dist').rglob('*') if p.is_file()]
with zipfile.ZipFile(vercel_output,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
    for path in sorted(published):archive.write(path,path.relative_to(root/'dist'))
    archive.writestr('vercel.json',json.dumps(drop,indent=2)+'\n')
with zipfile.ZipFile(vercel_output) as archive:
    names=archive.namelist()
    assert archive.testzip() is None
    for required in ['index.html','game.bundle.js','style.css','config.js','vercel.json']:assert required in names,required
    assert json.loads(archive.read('vercel.json'))==drop
    assert set(drop)<={'headers','redirects','rewrites'}
    assert not any(name.startswith(('dist/','public/','node_modules/','.git/')) or name in ('package.json','app.js','netlify.toml') for name in names)
    for path in published:assert archive.read(str(path.relative_to(root/'dist')))==path.read_bytes()
print(f'ZIP validated: {len(published)+1} files; {vercel_output.stat().st_size} bytes; {vercel_output}')
