"""Build public/emoji-bank.js and public/emoji/ from the reviewed word list.

reference/fluent-emoji/word-emoji.json maps English words to Fluent Emoji and
lists confusable groups. With --assets (the assets folder of the MIT-licensed
@lobehub/fluent-emoji-3d package: 256 px WebP files named by codepoint), the
pictures in use are copied into public/emoji/. Without it, the existing
public/emoji/ files are checked instead, so a rebuild needs no download.
"""
from pathlib import Path
import argparse, json, shutil

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'reference/fluent-emoji/word-emoji.json'
OUT = ROOT / 'public/emoji'
parser = argparse.ArgumentParser()
parser.add_argument('--assets', type=Path)
args = parser.parse_args()

def candidates(emoji):
    points = [f'{ord(c):x}' for c in emoji]
    return ['-'.join(points), '-'.join(p for p in points if p != 'fe0f')]

data = json.loads(SOURCE.read_text())
OUT.mkdir(parents=True, exist_ok=True)
stems = {}
for word, emoji in data['words'].items():
    for stem in candidates(emoji):
        if args.assets and (args.assets / (stem + '.webp')).exists():
            shutil.copyfile(args.assets / (stem + '.webp'), OUT / (stem + '.webp'))
        if (OUT / (stem + '.webp')).exists():
            stems[word] = stem
            break
    else:
        raise SystemExit(f'No picture for {word} {emoji}')
for extra in set(p.stem for p in OUT.glob('*.webp')) - set(stems.values()):
    (OUT / (extra + '.webp')).unlink()
groups = {}
for n, group in enumerate(data['confusable']):
    for word in group:
        assert word in stems, word
        groups[word] = n
bank = {'words': stems, 'groups': groups}
(ROOT / 'public/emoji-bank.js').write_text('/* Wordramp: reviewed Fluent Emoji (MIT, Microsoft) for picture signs. */\nwindow.EMOJI_BANK = '
    + json.dumps(bank, ensure_ascii=False, separators=(',', ':'), sort_keys=True) + ';\n')
print(f'{len(stems)} words, {len(set(stems.values()))} pictures, {sum(f.stat().st_size for f in OUT.glob("*.webp")) // 1024} KB')
