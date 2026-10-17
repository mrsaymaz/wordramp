"""Export the merged, reviewed language content as one JSON file per grade.

The files follow the supplied grade-file layout (grade, cefr, units with
categories, descriptions, pictures, questions, completions, sentences and
translations), so they can be read and edited like the originals. They hold
everything the game uses: the original lessons plus both imported batches, with
the reviewed versions of what is played. IDs are renumbered per unit in the
supplied style (g5u1d1, g5u1d2, ...). Extra keys record how items are played:

- categoryPairs: which two categories share a crossing.
- descriptions[].reviewClue: the clue shown when a missed item returns.
- questions[].sign: the reviewed road sign (answer, two wrong answers, review prompt).
- sentences[].repair / repairBlocks / repairTr: used as a three-block road
  repair; repairBlocks only when the played blocks differ from blocks.
- sentences[].grammar: the grammar choices built from the sentence.

Run after scripts/expand-language-bank.py. Output: reference/merged-grades/.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'reference/merged-grades'

def read_bank(name):
    text = (ROOT / 'public' / (name + '.js')).read_text()
    return json.loads(text[text.index('=') + 1:].strip().rstrip(';'))

bank, matches, repairs = read_bank('language-bank'), read_bank('match-bank'), read_bank('repair-bank')
version = json.loads((ROOT / 'package.json').read_text())['version']
OUT.mkdir(parents=True, exist_ok=True)
summary = {}

for grade in bank:
    units = []
    for unit in grade['units']:
        uid, cards, unit_repairs = unit['id'], matches[unit['id']], repairs[unit['id']]
        def numbered(letter, items):
            return {item['id']: f'{uid}{letter}{n}' for n, item in enumerate(items, 1)}

        pairs = unit.get('categoryPairs') or [[c['id'] for c in unit['categories'][:2]]]
        ordered = [next(c for c in unit['categories'] if c['id'] == cid) for pair in pairs for cid in pair]
        category_ids = numbered('c', ordered)
        categories = [{'id': category_ids[c['id']], 'title': c['title'], 'yes': c['yes'], 'no': c['no']} for c in ordered]

        descriptions = []
        for card in (x for x in cards if x['type'] == 'description'):
            entry = {'clue': card['prompt'], 'options': card['options'], 'answer': card['answer']}
            if card.get('reviewPrompt'): entry['reviewClue'] = card['reviewPrompt']
            descriptions.append(entry)
        for n, entry in enumerate(descriptions, 1): entry['id'] = f'{uid}d{n}'
        descriptions = [{'id': d.pop('id'), **d} for d in descriptions]

        signs = {x['sourceId']: x for x in cards if x['type'] == 'question'}
        question_ids = numbered('q', unit['questions'])
        questions = []
        for q in unit['questions']:
            entry = {'id': question_ids[q['id']], 'q': q['q'], 'a': q['a']}
            sign = signs.get(q['id'])
            if sign:
                entry['sign'] = {'answer': sign['answer'], 'wrong': [x for x in sign['options'] if x != sign['answer']], 'reviewPrompt': sign['reviewPrompt']}
            questions.append(entry)

        completion_ids = numbered('h', unit['completions'])
        completions = [{'id': completion_ids[c['id']], 'start': c['start'], 'end': c['end'],
                        'wrongEndings': [completion_ids[w] for w in c['wrongEndings'] if w in completion_ids]} for c in unit['completions']]

        played = {x['sourceId']: x for x in unit_repairs}
        grammar = {}
        for x in cards:
            if x['type'] == 'grammar': grammar.setdefault(x['sourceId'], []).append(x)
        sentence_ids = numbered('s', unit['sentences'])
        sentences = []
        for s in unit['sentences']:
            entry = {'id': sentence_ids[s['id']], 'blocks': s['blocks'], 'difficulty': s.get('difficulty', 1), 'tr': s['tr']}
            repair = played.get(s['id'])
            if repair:
                entry['repair'] = True
                if repair['blocks'] != s['blocks']: entry['repairBlocks'] = repair['blocks']
                if repair['tr'] != s['tr']: entry['repairTr'] = repair['tr']
            if s['id'] in grammar:
                entry['grammar'] = [{'prompt': c['prompt'], 'answer': c['answer'], 'wrong': [x for x in c['options'] if x != c['answer']]} for c in grammar[s['id']]]
            sentences.append(entry)

        picture_ids, translation_ids = numbered('p', unit['pictures']), numbered('t', unit['translations'])
        units.append({
            'id': uid, 'title': unit['title'], 'source': unit['source'],
            'targetLanguage': unit['targetLanguage'] + [x for x in unit.get('additionalTargets', []) if x not in unit['targetLanguage']],
            'subthemes': [x['title'] for x in unit.get('subthemes', [])],
            'categories': categories,
            'categoryPairs': [[category_ids[c] for c in pair] for pair in pairs],
            'descriptions': descriptions,
            'pictures': [{'id': picture_ids[p['id']], 'word': p['word'], 'drawing': p['drawing']} for p in unit['pictures']],
            'questions': questions,
            'completions': completions,
            'sentences': sentences,
            'translations': [{'id': translation_ids[t['id']], 'en': t['en'], 'tr': t['tr']} for t in unit['translations']],
        })
    data = {'grade': grade['grade'], 'cefr': grade['cefr'],
            'note': f'Wordramp {version}: original lessons merged with both reviewed grade-file batches.',
            'units': units}
    (OUT / f"grade{grade['grade']}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n')
    count = lambda key: sum(len(u[key]) for u in units)
    summary[grade['grade']] = {'units': len(units), **{k: count(k) for k in ['categories','descriptions','pictures','questions','completions','sentences','translations']},
        'questionSigns': sum(1 for u in units for q in u['questions'] if 'sign' in q),
        'repairs': sum(1 for u in units for s in u['sentences'] if s.get('repair')),
        'grammar': sum(len(s.get('grammar', [])) for u in units for s in u['sentences'])}
print(json.dumps(summary, indent=1))
