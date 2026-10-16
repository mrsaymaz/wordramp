"""Merge the supplied grade files with stable IDs; rebuild their reviewed road tasks.

Run from any directory. Original runtime items and saved-progress unit IDs are
preserved. Imported items carry provenance and are replaced on a repeat run.
The unmodified source files and human-reviewed question choices live in reference/.
"""
from pathlib import Path
from collections import Counter
import copy, hashlib, json, re, unicodedata

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'reference/language-expansion-2026'
TAG = 'grade-files-2026-10'

def norm(text):
    return re.sub(r'[^\w]+', ' ', unicodedata.normalize('NFC', text).casefold()).strip()

def read_bank(name):
    text = (ROOT / 'public' / (name + '.js')).read_text()
    return json.loads(text[text.index('=') + 1:].strip().rstrip(';'))

def write_bank(name, variable, data):
    text = '/* Wordrift: reviewed grade/unit language material. */\nwindow.' + variable + ' = '
    (ROOT / 'public' / (name + '.js')).write_text(text + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')

bank, matches, repairs = read_bank('language-bank'), read_bank('match-bank'), read_bank('repair-bank')
for grade in bank:
    for unit in list(grade['units']):
        if unit.get('importTag') == TAG:
            grade['units'].remove(unit)
            matches.pop(unit['id'], None)
            repairs.pop(unit['id'], None)
            continue
        for key in ['categories', 'descriptions', 'pictures', 'questions', 'completions', 'sentences', 'translations']:
            unit[key] = [x for x in unit[key] if x.get('importTag') != TAG]
        for key in ['categoryPairs', 'additionalTargets', 'subthemes']:
            unit.pop(key, None)
        matches[unit['id']] = [x for x in matches[unit['id']] if x.get('importTag') != TAG]
        repairs[unit['id']] = [x for x in repairs[unit['id']] if x.get('importTag') != TAG]

before = {g['grade']: {'units': len(g['units']), 'matches': sum(len(matches[u['id']]) for u in g['units']),
                         'repairs': sum(len(repairs[u['id']]) for u in g['units'])} for g in bank}

# IDs in the uploads are local to those files, not interchangeable with the
# existing game IDs. Connect the extra topics as sub-themes of the closest
# existing unit in the same grade, preserving the familiar lesson selection.
REMAPPED = {'g5u9': 'g5u3', 'g5u10': 'g5u10', 'g7u11': 'g7u5',
            'g7u12': 'g7u8', 'g8u11': 'g8u2', 'g8u12': 'g8u2'}
TITLE_ALIASES = {'g5u5': 'Neighbourhood / City Life', 'g5u8': 'Universe & Future',
                 'g6u9': 'Food Shopping and Prices', 'g6u10': 'Healthy Habits'}
questions = json.loads((SOURCE / 'reviewed-questions.json').read_text())

# These source options allowed another reasonable answer, or lacked enough
# context. Retain the source verbatim in reference/, use these reviewed cards.
DESCRIPTION_EDITS = {
 'g6u4d4': {'clue': 'I design bridges and plan how they are built.'},
 'g6u4d5': {'clue': 'A garage worker whose job is to repair car engines.'},
 'g6u8d1': {'options': ['planet', 'telescope', 'rocket']},
 'g6u8d4': {'clue': 'Strong wind with thunder and lightning; no rotating funnel.'},
 'g6u8d5': {'options': ['tornado', 'drought', 'comet']},
 'g6u9d4': {'options': ['cashier', 'customer', 'receipt']},
 'g7u2d4': {'options': ['athlete', 'referee', 'spectator']},
 'g7u2d5': {'clue': 'A person whose job is to train a team and plan its practice.'},
 'g7u2d6': {'options': ['teammate', 'opponent', 'spectator']},
 'g7u9d3': {'clue': 'A hard, clear material made from sand, used for window panes.'},
 'g7u10d5': {'clue': 'The planet famous for wide, bright rings visible through a small telescope.'},
 'g7u12d4': {'options': ['cashier', 'customer', 'receipt']},
 'g8u5d1': {'clue': 'Software that displays web pages, with tabs and an address bar.'}
}
DESCRIPTION_REVIEWS = {
 'g5u3d5': 'I ran all afternoon and need to rest. I feel ___.',
 'g5u3d6': 'I have not eaten and want lunch. I feel ___.',
 'g5u9d6': 'My cat is ill. I take it to a ___.',
 'g6u5d4': 'The boats shelter from rough seas in the ___.',
 'g6u5d5': 'Ancient objects are displayed inside this building: a ___.',
 'g6u5d6': 'Wait for a train on the platform at the ___.',
 'g6u6d6': 'Blow across the hole in this long, thin musical instrument: a ___.',
 'g6u7d5': 'A fire produces tiny particles and gases called ___.',
 'g6u9d5': 'I buy my groceries from a shop. I am a ___.',
 'g6u9d6': 'I own and run this small shop. I am the ___.',
 'g7u2d6': 'A player on your team is your ___.',
 'g7u4d4': 'An area with many trees growing together is a ___.',
 'g7u4d5': 'This dry habitat gets very little rain: a ___.',
 'g7u4d6': 'A huge body of salt water is an ___.',
 'g7u5d4': 'The person who introduces the TV show is its ___.',
 'g7u5d5': 'Someone watching a TV programme is a ___.',
 'g7u5d6': 'The person playing a character in a film is an ___.',
 'g7u6d5': 'You say yes to an invitation. You ___ it.',
 'g7u6d6': 'You say no to an invitation. You ___ it.',
 'g7u9d4': 'Moving air makes the leaves blow. This is ___.',
 'g7u9d5': 'The star that Earth travels around is the ___.',
 'g7u9d6': 'People need this clear liquid to drink: ___.',
 'g8u1d2': 'I give my word that I will help. I make a ___.',
 'g8u1d3': 'A reason I give for not attending is an ___.',
 'g8u2d4': 'I lose interest in this activity. It is ___.',
 'g8u2d5': 'This activity makes me feel thrilled and interested. It is ___.',
 'g8u2d6': 'This activity helps me feel calm and rested. It is ___.',
 'g8u12d4': 'I work with doctors and care for hospital patients. I am a ___.',
 'g8u12d6': 'A sick pet needs treatment from a ___.',
 'g8u5d3': 'Type keywords to find websites using a ___.'
}
REPAIR_EDITS = {
 'g6u10s10': (['Our teacher', 'explains', 'why sleep matters.'], 'Öğretmenimiz uykunun neden önemli olduğunu açıklar.'),
 'g7u4s9': (['Our teacher', 'explained', 'animal protection.'], 'Öğretmenimiz hayvanları korumayı açıkladı.'),
 'g8u3s1': (['We', 'peel', 'the potatoes.'], 'Patatesleri soyarız.'),
 'g8u3s4': (['Add', 'some onions', 'to the pan.'], 'Tavaya biraz soğan ekleyin.'),
 'g8u3s7': (['We', 'serve', 'vegetable soup.'], 'Sebze çorbası servis ederiz.'),
 'g8u4s3': (['Please', 'confirm', 'this number.'], 'Lütfen bu numarayı doğrulayın.'),
 'g8u8s10': (['My mother', 'checks', 'our dishwasher.'], 'Annem bulaşık makinemizi kontrol eder.'),
 'g8u9s9': (['The scientist', 'explains', 'this experiment.'], 'Bilim insanı bu deneyi açıklar.'),
 'g8u12s9': (['Our teacher', 'explains', 'why breaks help.'], 'Öğretmenimiz molaların neden yararlı olduğunu açıklar.')
}

# Reviewed incorrect forms, rather than interchangeable sentence endings.
FORMS = {
 'is':['am','are'], 'are':['is','am'], 'am':['is','are'],
 'has got':['have got','has get'], 'have got':['has got','have get'],
 'likes':['like','liking'], 'read':['reads','reading'], 'checks':['check','checking'],
 'brush':['brushes','brushing'], 'wears':['wear','wearing'], 'shows':['show','showing'],
 'needs':['need','needing'], 'need':['needs','needing'], 'follows':['follow','following'],
 'helps':['help','helping'], 'prepares':['prepare','preparing'], 'gives':['give','giving'],
 'enjoys':['enjoy','enjoying'], 'plays':['play','playing'], 'prefers':['prefer','preferring'],
 'prefers music':['prefer music','preferring music'], 'changes':['change','changing'],
 'supports':['support','supporting'], 'saves':['save','saving'], 'study':['studies','studying'],
 'keeps':['keep','keeping'], 'includes':['include','including'], 'stirs':['stir','stirring'],
 'protect':['protects','protecting'], 'uses':['use','using'], 'leaves':['leave','leaving'],
 'answers':['answer','answering'], 'explains':['explain','explaining'], 'costs':['cost','costing'],
 'cost':['costs','costing'], 'mixes':['mix','mixing'], 'serve':['serves','serving'],
 'peel':['peels','peeling'], 'welcomes':['welcome','welcoming'],
 'must follow':['must follows','must following'], 'cannot fly':['cannot flies','cannot flying'],
 'can fly':['can flies','can flying'], 'can type':['can types','can typing'],
 'should drink':['should drinks','should drinking'], 'should reduce':['should reduces','should reducing'],
 'should respect':['should respects','should respecting'], 'should review':['should reviews','should reviewing'],
 'should get':['should gets','should getting'], 'must share':['must shares','must sharing'],
 'would like to join':['would like to joins','would like to joining'],
 'would rather hike':['would rather hikes','would rather hiking'],
 'have to wash':['have to washes','have to washing'],
 'will study':['will studies','will studying'], 'will explore':['will explores','will exploring'],
 'will become':['will becomes','will becoming'], 'will save':['will saves','will saving'],
 'will learn':['will learns','will learning'], 'will prepare':['will prepares','will preparing'],
 'we will use':['we will uses','we will using'],
 'is reading':['are reading','is read'], 'is playing':['are playing','is play'],
 'is checking':['are checking','is check'], 'are using':['is using','are use'],
 'is testing':['are testing','is test'], 'are recording':['is recording','are record'],
 'is folding':['are folding','is fold'],
 'are going to visit':['is going to visit','are going to visits'],
 'am going to pack':['is going to pack','am going to packs'],
 'is going to take':['are going to take','is going to takes'],
 'are going to use':['is going to use','are going to uses']
}
PAST_FORMS = {'was':['is','were'], 'visited':['visits','visiting'], 'enjoyed':['enjoy','enjoying'],
 'served':['serves','serving'], 'learned':['learn','learning'], 'collected':['collect','collecting'],
 'planted':['plants','planting'], 'won':['wins','winning'], 'published':['publishes','publishing'],
 'rescued':['rescue','rescuing'], 'explained':['explains','explaining']}

ALIAS_GROUPS = ['pupil|student', 'headteacher|principal', 'trainers|sneakers', 'lorry|truck',
 'flat|apartment', 'bin|dustbin|rubbish bin|trash can', 'football|soccer',
 'maths|math|mathematics', 'timetable|schedule', 'glasses|spectacles',
 'mobile phone|cellphone|cell phone|phone', 'plane|aeroplane|airplane', 'film|movie']
ALIASES = {norm(word): {norm(w) for w in group.split('|')} for group in ALIAS_GROUPS for word in group.split('|')}

def equivalent(a, b):
    return norm(a) == norm(b) or norm(b) in ALIASES.get(norm(a), set())

def tr_senses(text):
    return {norm(x) for x in re.split(r'[/;,]|\bveya\b', text) if norm(x)}

def compatible_translation(a, b):
    return not equivalent(a['en'], b['en']) and not (tr_senses(a['tr']) & tr_senses(b['tr']))

report = {'importTag': TAG, 'mappings': [], 'grades': {}, 'skipped': Counter(),
          'descriptionEdits': DESCRIPTION_EDITS, 'repairAdaptations': [], 'sources': []}
base_counts = {k: sum(len(u[k]) for g in bank for u in g['units']) for k in ['questions','translations','sentences','descriptions','categories','pictures','completions']}

for grade in bank:
    file = SOURCE / ('grade' + str(grade['grade']) + '.json')
    data = json.loads(file.read_text())
    assert data['grade'] == grade['grade']
    report['sources'].append({'file': file.name, 'sha256': hashlib.sha256(file.read_bytes()).hexdigest(), 'grade': data['grade'], 'cefr': data['cefr']})
    for incoming in data['units']:
        source_id = incoming['id']
        target_id = REMAPPED.get(source_id, source_id)
        unit = next((u for u in grade['units'] if u['id'] == target_id), None)
        is_new = unit is None
        if unit and source_id not in REMAPPED:
            assert norm(incoming['title']) in [norm(unit['title']), norm(TITLE_ALIASES.get(source_id, ''))], (source_id, incoming['title'], unit['title'])
        elif not unit:
            unit = {key: copy.deepcopy(incoming[key]) for key in ['title','source','targetLanguage']}
            unit.update(id=target_id, importTag=TAG)
            for key in ['categories','descriptions','pictures','questions','completions','sentences','translations']:
                unit[key] = []
            grade['units'].append(unit)
            matches[target_id], repairs[target_id] = [], []
        report['mappings'].append({'grade': grade['grade'], 'sourceId': source_id, 'sourceTitle': incoming['title'], 'targetId': target_id, 'targetTitle': unit['title'], 'newLesson': is_new, 'connectedSubtheme': source_id in REMAPPED})
        targets = unit.setdefault('additionalTargets', [])
        for value in incoming['targetLanguage']:
            if norm(value) not in {norm(y) for y in unit['targetLanguage'] + targets}: targets.append(value)

        def mark(item, collection):
            result = copy.deepcopy(item)
            result['id'] = target_id + '-ext26-' + source_id + '-' + item['id'][len(source_id):]
            result['importTag'] = TAG
            result['origin'] = {'file': file.name, 'unitId': source_id, 'itemId': item['id'], 'collection': collection}
            return result

        source_items = {}
        for key in ['descriptions','pictures','questions','completions','sentences','translations']:
            def signature(x):
                if key == 'descriptions': return (norm(x['clue']), norm(x['answer']))
                if key == 'pictures': return norm(x['word'])
                if key == 'questions': return norm(x['q'])
                if key == 'completions': return (norm(x['start']), norm(x['end']))
                if key == 'sentences': return norm(' '.join(x['blocks']))
                return norm(x['en'])
            seen = {signature(x): x for x in unit[key]}
            for original in incoming[key]:
                candidate = mark(original, key)
                if key == 'completions':
                    candidate['wrongEndings'] = [target_id + '-ext26-' + source_id + '-' + x[len(source_id):] for x in original['wrongEndings']]
                prior = seen.get(signature(candidate))
                if prior:
                    report['skipped'][key] += 1
                    source_items[original['id']] = prior
                else:
                    unit[key].append(candidate)
                    seen[signature(candidate)] = candidate
                    source_items[original['id']] = candidate
        # Store source completions, but do not activate unreviewed endings.
        # Every playable fork below has explicit incorrect grammatical forms.
        completion_ids = {x['id'] for x in unit['completions']}
        for entry in unit['completions']:
            if entry.get('importTag') == TAG and entry['origin']['unitId'] == source_id:
                entry['wrongEndings'] = [source_items[x]['id'] for x in incoming['completions'][int(entry['origin']['itemId'].split('h')[-1])-1]['wrongEndings']]
                assert all(x in completion_ids for x in entry['wrongEndings'])

        existing_pair = [c['id'] for c in unit['categories'][:2]]
        new_categories = [mark(c, 'categories') for c in incoming['categories']]
        # Bare club names can also be subjects (art/science). Compare only the
        # two categories in this pair, rather than unrelated pairs in the bank.
        overlap = {norm(x) for x in new_categories[0]['yes']} & {norm(x) for x in new_categories[1]['yes']}
        for category in new_categories:
            category['yes'] = list(dict.fromkeys(x for x in category['yes'] if norm(x) not in overlap))
        for i, category in enumerate(new_categories):
            category['no'] = new_categories[1-i]['yes'].copy()
            assert len(category['yes']) >= 4
        same_pair = len(unit['categories']) == 2 and all(
            norm(a['title']) == norm(b['title']) and {norm(w) for w in a['yes']} == {norm(w) for w in b['yes']}
            for a,b in zip(unit['categories'],new_categories))
        if not same_pair:
            unit['categories'].extend(new_categories)
        unit.setdefault('categoryPairs', [existing_pair] if len(existing_pair) == 2 else [])
        if not same_pair: unit['categoryPairs'].append([c['id'] for c in new_categories])
        subthemes = unit.setdefault('subthemes', [])
        titles = [incoming['title']] if source_id in REMAPPED else [c['title'].title() for c in incoming['categories']]
        for title in titles:
            if norm(title) not in {norm(x['title']) for x in subthemes}:
                subthemes.append({'title': title, 'sourceUnitId': source_id, 'categoryIds': [c['id'] for c in new_categories] if not same_pair else existing_pair})

        for original in incoming['descriptions']:
            item = mark(original, 'descriptions')
            item.update(DESCRIPTION_EDITS.get(original['id'], {}))
            if any(x['type'] == 'description' and norm(x['prompt']) == norm(item['clue']) and norm(x['answer']) == norm(item['answer']) for x in matches[target_id]):
                continue
            translation = next((x['tr'] for x in unit['translations'] if norm(x['en']) == norm(item['answer'])), '')
            card = {**item, 'type': 'description', 'prompt': item.pop('clue'), 'tr': translation, 'sourceId': source_items[original['id']]['id']}
            if original['id'] in DESCRIPTION_REVIEWS: card['reviewPrompt'] = DESCRIPTION_REVIEWS[original['id']]
            matches[target_id].append(card)

        for index, answer, wrong1, wrong2, review_prompt in questions[source_id]:
            original = incoming['questions'][index-1]
            assert len({norm(answer), norm(wrong1), norm(wrong2)}) == 3
            item = mark(original, 'questions')
            matches[target_id].append({**item, 'type': 'question', 'prompt': original['q'], 'answer': answer,
                                      'options': [answer, wrong1, wrong2], 'reviewPrompt': review_prompt,
                                      'tr': next((x['tr'] for x in unit['translations'] if norm(x['en']) == norm(answer)), ''),
                                      'sourceId': source_items[original['id']]['id']})

        for original in incoming['sentences']:
            item = mark(original, 'sentences')
            blocks, tr = item['blocks'][:2] + [' '.join(item['blocks'][2:])], item['tr']
            if original['id'] in REPAIR_EDITS:
                blocks, tr = REPAIR_EDITS[original['id']]
            assert len(blocks) == 3 and max(map(len,blocks)) <= 34 and len(' '.join(blocks)) <= 80, original['id']
            if any(norm(' '.join(x['blocks'])) == norm(' '.join(blocks)) for x in repairs[target_id]):
                report['skipped']['repairs'] += 1
                continue
            adapted = blocks != original['blocks']
            repairs[target_id].append({**item, 'blocks': blocks, 'tr': tr, 'sourceId': source_items[original['id']]['id'], 'adapted': adapted})
            if adapted: report['repairAdaptations'].append({'source': original['id'], 'id': item['id'], 'blocks': blocks, 'tr': tr})

        grammar_count = 0
        for original in incoming['sentences']:
            blocks = original['blocks'][:2] + [' '.join(original['blocks'][2:])]
            if original['id'] in REPAIR_EDITS: blocks = REPAIR_EDITS[original['id']][0]
            verb = blocks[1]
            decoys = FORMS.get(verb) or PAST_FORMS.get(verb)
            if not decoys: continue
            label = 'PAST TENSE' if verb in PAST_FORMS else 'GRAMMAR'
            prompt = label + ': ' + blocks[0] + ' ___ ' + blocks[2]
            item = mark(original, 'sentences')
            matches[target_id].append({**item, 'id': item['id'] + '-grammar', 'type': 'grammar',
                                      'prompt': prompt, 'answer': verb, 'options': [verb, *decoys],
                                      'tr': REPAIR_EDITS.get(original['id'], (None, original['tr']))[1],
                                      'sourceId': source_items[original['id']]['id']})
            grammar_count += 1
            if grammar_count == 3: break
        assert grammar_count == 3, (source_id, grammar_count)

        # All imported meanings are playable, with both duplicate English
        # labels and Turkish equivalents excluded from the decoy pool.
        for original in incoming['translations']:
            canonical = source_items[original['id']]
            if any(x['type'] == 'translation' and norm(x['answer']) == norm(canonical['en']) for x in matches[target_id]): continue
            decoys = list(dict.fromkeys(x['en'] for x in unit['translations'] if compatible_translation(canonical,x)))
            assert len(decoys) >= 2
            item = mark(original, 'translations')
            matches[target_id].append({**item, 'type': 'translation', 'prompt': 'English for “' + canonical['tr'] + '”: ',
                                      'answer': canonical['en'], 'decoys': decoys, 'tr': canonical['tr'], 'sourceId': canonical['id']})

for grade in bank:
    g = grade['grade']
    counts = Counter(x['type'] for u in grade['units'] for x in matches[u['id']])
    report['grades'][str(g)] = {'unitsBefore': before[g]['units'], 'unitsAfter': len(grade['units']),
        'newPlayableMatches': sum(counts.values()) - before[g]['matches'],
        'newRepairs': sum(len(repairs[u['id']]) for u in grade['units']) - before[g]['repairs'],
        'playableByType': dict(counts)}
report['addedSourceItems'] = {k: sum(len(u[k]) for g in bank for u in g['units']) - base_counts[k] for k in base_counts}
report['skipped'] = dict(report['skipped'])
report['notes'] = ['Six extra source topics are connected as sub-themes; all 44 existing unit IDs and titles are preserved.',
 'All supplied content is retained verbatim in reference/language-expansion-2026/grade*.json.',
 'Three reviewed question signs per supplied unit are playable; other source Q&As remain available for future curation.',
 'Unreviewed source sentence completions are retained as source material, never used as answer options.',
 'Every playable road repair has exactly three blocks. Longer source blocks are regrouped; selected items are shortened.',
 'Imported category pairs use disjoint words and rotate with the existing pair during a race.']
write_bank('language-bank', 'LANGUAGE_BANK', bank)
write_bank('match-bank', 'MATCH_BANK', matches)
write_bank('repair-bank', 'REPAIR_BANK', repairs)
(SOURCE / 'import-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'grades': report['grades'], 'addedSourceItems': report['addedSourceItems'], 'duplicatesSkipped': report['skipped']}, ensure_ascii=False, indent=2))
