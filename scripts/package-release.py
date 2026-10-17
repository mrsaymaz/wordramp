"""Export the same project layout used by the checkout and Netlify."""
from pathlib import Path
import argparse,json,zipfile

root=Path(__file__).resolve().parent.parent
version=json.loads((root/'package.json').read_text())['version']
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--output',type=Path,default=root/f'Wordramp-v{version}-Netlify.zip')
args=parser.parse_args()
output=args.output.resolve();output.parent.mkdir(parents=True,exist_ok=True)
files=[root/name for name in ['package.json','package-lock.json','netlify.toml','README.md']]
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
    assert not any(name.startswith(('node_modules/','.git/','.openai/')) for name in archive.namelist())
print(f'ZIP validated: {len(files)} files; {output.stat().st_size} bytes; {output}')
