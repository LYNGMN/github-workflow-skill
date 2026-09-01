import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const requiredFiles = [
  'SKILL.md', 'README.md', 'README.ko.md', 'CONTRIBUTING.md', 'LICENSE',
  'references/writing-guidelines.md', 'references/github-authentication.md', 'references/github-concepts.md', 'references/github-workflow.md',
  'references/collaboration-policy.md', 'references/workflow-modes.md', 'references/delivery-contract.md',
  'agents/openai.yaml', 'evaluation/README.md', 'evaluation/scenarios.json',
  'evaluation/results/2026-09-01-codex.md',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/PULL_REQUEST_TEMPLATE.md'
];

function expectText(text, patterns, context) {
  for (const pattern of patterns) {
    assert.match(text, pattern, `${context} must include ${pattern}`);
  }
}

function markdownPaths(directory = root, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    const absolute = join(directory, entry.name);
    const path = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) return markdownPaths(absolute, path);
    return entry.isFile() && extname(entry.name) === '.md' ? [path] : [];
  });
}

function markdownTableCellCount(line) {
  const content = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  let count = 1;
  let escaped = false;
  for (const character of content) {
    if (character === '|' && !escaped) count += 1;
    escaped = character === '\\' && !escaped;
    if (character !== '\\') escaped = false;
  }
  return count;
}

function sectionAfter(text, heading, nextHeading = '^## ') {
  const start = text.indexOf(heading);
  assert.notEqual(start, -1, `missing heading: ${heading}`);
  const bodyStart = start + heading.length;
  const rest = text.slice(bodyStart);
  const next = rest.search(new RegExp(nextHeading, 'm'));
  return rest.slice(0, next === -1 ? rest.length : next);
}

function topLevelSection(text, heading) {
  const start = text.indexOf(`## ${heading}\n`);
  assert.notEqual(start, -1, `missing top-level section: ${heading}`);
  const end = text.indexOf('\n## ', start + heading.length + 3);
  return text.slice(start, end === -1 ? text.length : end);
}

function subsection(text, heading) {
  const start = text.indexOf(`### ${heading}\n`);
  assert.notEqual(start, -1, `missing subsection: ${heading}`);
  const bodyStart = start + heading.length + 5;
  const rest = text.slice(bodyStart);
  const next = rest.search(/^### |^## /m);
  return rest.slice(0, next === -1 ? rest.length : next);
}

function checklistItems(section, heading, context) {
  const body = subsection(section, heading);
  const items = [...body.matchAll(/^- \[[ xX]\] (.+)$/gm)].map((match) => match[1]);
  assert.ok(items.length > 0, `${context} must contain Markdown checklist items`);
  return items;
}

function conceptTopicBody(section, topic, language) {
  const start = section.indexOf(`### ${topic}\n`);
  assert.notEqual(start, -1, `missing ${language} concept topic: ${topic}`);
  const rest = section.slice(start + topic.length + 5);
  const next = rest.search(/^### /m);
  const body = rest.slice(0, next === -1 ? rest.length : next);
  assert.match(body, /\S/, `${language} concept topic must have a non-empty body before the next heading: ${topic}`);
  return body;
}

function stateLearningEntry(section, state, nextState) {
  const marker = `- \`${state}\``;
  const start = section.indexOf(marker);
  assert.notEqual(start, -1, `missing separate state-learning item: ${state}`);
  assert.ok(start === 0 || section[start - 1] === '\n', `state-learning item must start at a list-item boundary: ${state}`);
  const bodyStart = start + marker.length;
  let body;
  if (nextState) {
    const nextMarker = `- \`${nextState}\``;
    const nextStart = section.indexOf(nextMarker, bodyStart);
    assert.notEqual(nextStart, -1, `missing separate state-learning item: ${nextState}`);
    const separator = section.slice(bodyStart, nextStart);
    assert.match(separator, /\n\n$/, `state-learning item requires an isolated list-item boundary before: ${nextState}`);
    body = separator.trim();
  } else {
    body = section.slice(bodyStart).trim();
  }
  assert.match(body, /\S/, `state-learning item must have a non-empty body: ${state}`);
  return body;
}

function formItemById(form, id) {
  const idStart = form.indexOf(`id: ${id}`);
  assert.notEqual(idStart, -1, `missing form item: ${id}`);
  const start = form.lastIndexOf('\n  - type:', idStart);
  assert.notEqual(start, -1, `missing YAML form-item start for: ${id}`);
  const end = form.indexOf('\n  - type:', start + 1);
  return form.slice(start, end === -1 ? form.length : end);
}

function expectRequiredFormItem(form, id) {
  const item = formItemById(form, id);
  assert.match(item, /validations:\s*\{\s*required:\s*true\s*\}/, `${id} must be required in its own form item`);
  return item;
}

test('publishes the complete public skill package', () => {
  for (const path of requiredFiles) {
    assert.ok(existsSync(resolve(root, path)), `missing ${path}`);
  }
});

test('validation workflow uses current Node 24-based GitHub Actions', () => {
  const workflow = read('.github/workflows/validate.yml');
  expectText(workflow, [
    /uses:\s*actions\/checkout@v7/,
    /uses:\s*actions\/setup-node@v7/
  ], 'validation workflow');
  assert.doesNotMatch(workflow, /actions\/(?:checkout|setup-node)@v4/, 'validation workflow must not use Node 20-based action majors');
});

test('all Markdown tables have matching header, delimiter, and body column counts', () => {
  const delimiter = /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/;
  for (const path of markdownPaths()) {
    const lines = read(path).split('\n');
    for (let index = 0; index < lines.length; index += 1) {
      if (!delimiter.test(lines[index])) continue;
      assert.ok(index > 0, `${path}:${index + 1} table delimiter needs a header row`);
      const expected = markdownTableCellCount(lines[index - 1]);
      assert.equal(
        markdownTableCellCount(lines[index]),
        expected,
        `${path}:${index + 1} table delimiter must match the ${expected}-column header`
      );
      for (let bodyIndex = index + 1; bodyIndex < lines.length && /^\s*\|/.test(lines[bodyIndex]); bodyIndex += 1) {
        assert.equal(
          markdownTableCellCount(lines[bodyIndex]),
          expected,
          `${path}:${bodyIndex + 1} table row must match the ${expected}-column header`
        );
      }
    }
  }
});

test('SKILL frontmatter names a discriminating GitHub workflow use case', () => {
  const skill = read('SKILL.md');
  assert.match(skill, /^---\s*\nname: managing-github-workflows\s*\ndescription: Use when .*\b(?:GitHub|Git|Pull Request|Issue|Merge)\b/im);
  expectText(skill, [
    /github-concepts\.md/i, /github-workflow\.md/i, /collaboration-policy\.md/i,
    /Tool availability does not grant permission/i
  ], 'SKILL.md');
});

test('uses a unique portable skill identity that matches every install folder', () => {
  const skill = read('SKILL.md');
  const readmes = [read('README.md'), read('README.ko.md')];
  assert.match(skill, /^---\s*\nname: managing-github-workflows\s*$/m);
  assert.doesNotMatch(skill, /^name: managing-git-safely\s*$/m);

  const destinations = [
    '~/.agents/skills/managing-github-workflows',
    '~/.claude/skills/managing-github-workflows',
    '~/.cursor/skills/managing-github-workflows',
    '~/.gemini/config/skills/managing-github-workflows',
    '~/.gemini/antigravity-cli/skills/managing-github-workflows'
  ];
  for (const readme of readmes) {
    for (const destination of destinations) {
      assert.match(readme, new RegExp(destination.replaceAll('/', '\\/')), `README must install the unique skill at ${destination}`);
    }
    assert.doesNotMatch(readme, /skills\/managing-git-safely/, 'README must not reuse the conflicting install folder');
    assert.doesNotMatch(readme, /~\/\.gemini\/antigravity\/skills/, 'README must not use the superseded Antigravity path');
  }
});

test('ships Codex UI metadata for discoverable explicit and implicit invocation', () => {
  const metadata = read('agents/openai.yaml');
  expectText(metadata, [
    /^interface:\s*$/m,
    /^\s+display_name: "Managing GitHub Workflows"\s*$/m,
    /^\s+short_description: ".{25,64}"\s*$/m,
    /^\s+default_prompt: ".*\$managing-github-workflows.*"\s*$/m,
    /^policy:\s*$/m,
    /^\s+allow_implicit_invocation: true\s*$/m
  ], 'agents/openai.yaml');
});

test('default prompt requests reader-language progress labels and bilingual technical terms', () => {
  const metadata = read('agents/openai.yaml');
  expectText(metadata, [
    /^\s+default_prompt: ".*\$managing-github-workflows.*(?:user|reader).*language.*(?:technical|specialized).*Korean.*English original.*"\s*$/mi
  ], 'agents/openai.yaml localized default prompt');
});

test('package metadata supports reproducible dry-run packing without npm publication', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.name, 'managing-github-workflows-skill');
  assert.match(pkg.version, /^\d+\.\d+\.\d+$/);
  assert.equal(pkg.private, true);
  assert.equal(pkg.license, 'MIT');

  const cache = mkdtempSync(join(tmpdir(), 'managing-github-workflows-pack-'));
  try {
    const result = spawnSync(
      process.platform === 'win32' ? 'npm.cmd' : 'npm',
      ['pack', '--dry-run', '--json', '--ignore-scripts', '--cache', cache],
      { cwd: root, encoding: 'utf8' }
    );
    assert.equal(result.status, 0, `npm pack --dry-run failed: ${result.stderr}`);
    const [pack] = JSON.parse(result.stdout);
    const files = pack.files.map(({ path }) => path);
    for (const required of ['SKILL.md', 'agents/openai.yaml', 'evaluation/scenarios.json']) {
      assert.ok(files.includes(required), `dry-run package must contain ${required}`);
    }
  } finally {
    rmSync(cache, { recursive: true, force: true });
  }
});

test('provides reusable cross-runtime behavior evaluation scenarios', () => {
  const evaluation = JSON.parse(read('evaluation/scenarios.json'));
  assert.equal(evaluation.schemaVersion, 1);
  assert.equal(evaluation.skill, 'managing-github-workflows');
  assert.ok(Array.isArray(evaluation.scenarios));
  const requiredIds = [
    'unique-installation',
    'selective-workflow',
    'split-independent-outcomes',
    'complete-delivery-pressure',
    'public-privacy-gate',
    'bilingual-writing-clarity',
    'localized-progress-reporting'
  ];
  assert.deepEqual(evaluation.scenarios.map(({ id }) => id), requiredIds);
  for (const scenario of evaluation.scenarios) {
    assert.match(scenario.prompt, /\S/);
    assert.ok(scenario.pressures.length >= 3, `${scenario.id} needs at least three realistic pressures`);
    assert.ok(scenario.expected.length >= 2, `${scenario.id} needs observable expected behavior`);
    assert.ok(scenario.forbidden.length >= 1, `${scenario.id} needs a forbidden behavior`);
  }
  const installation = evaluation.scenarios.find(({ id }) => id === 'unique-installation');
  const installationContract = installation.expected.join(' ');
  for (const state of ['source', 'installed', 'discovered', 'activated', 'authenticated', 'authorized', 'usable']) {
    assert.match(installationContract, new RegExp(state, 'i'), `unique-installation must require the ${state} state`);
  }
  const localizedProgress = evaluation.scenarios.find(({ id }) => id === 'localized-progress-reporting');
  expectText(localizedProgress.expected.join(' '), [
    /현재 단계:[\s\S]{0,160}남은 단계:[\s\S]{0,160}다음 단계:/,
    /풀 리퀘스트\(Pull Request\)/,
    /헤드 SHA\(Head SHA\)/
  ], 'localized progress behavior scenario');
  expectText(read('evaluation/README.md'), [
    /RED/i, /GREEN/i, /fresh context/i, /without the skill/i, /with the skill/i,
    /record the actual response/i, /manual semantic review/i
  ], 'behavior evaluation guide');
});

test('records an actual RED and GREEN behavior comparison without claiming untested runtimes', () => {
  const result = read('evaluation/results/2026-09-01-codex.md');
  expectText(result, [
    /unique-installation/i,
    /split-independent-outcomes/i,
    /complete-delivery-pressure/i,
    /RED[\s\S]{0,500}GREEN/i,
    /fresh Codex process[\s\S]{0,220}managing-github-workflows/i,
    /Antigravity[\s\S]{0,180}(?:not executed|not run|실행하지)/i,
    /no GitHub mutation/i
  ], 'behavior result');
  for (const id of ['unique-installation', 'complete-delivery-pressure', 'split-independent-outcomes']) {
    const section = topLevelSection(result, id);
    for (const run of ['RED', 'GREEN']) {
      const evidence = subsection(section, run);
      expectText(evidence, [
        /Runtime:/i,
        /Model:/i,
        /Configuration:/i,
        /Skill discovery:/i,
        /Invocation:/i,
        /Expected checks:/i,
        /Forbidden checks:/i,
        /Evidence excerpt:/i,
        /Verdict:/i
      ], `${id} ${run} evidence`);
    }
  }
});

test('Codex installation guidance uses automatic detection and supported invocation controls', () => {
  for (const path of ['README.md', 'README.ko.md']) {
    const readme = read(path);
    expectText(readme, [
      /Codex[\s\S]{0,280}(?:detects?[\s\S]{0,120}automatically|자동[\s\S]{0,120}감지)/i,
      /Codex[\s\S]{0,420}`\/skills`[\s\S]{0,180}`\$managing-github-workflows`/i,
      /Codex[\s\S]{0,520}(?:does not appear|보이지 않)[\s\S]{0,140}(?:restart|재시작)/i,
      /https:\/\/developers\.openai\.com\/codex\/skills/i
    ], `${path} Codex discovery guidance`);
  }
});

test('SKILL requires semantic-parity updates for every maintained README language', () => {
  const skill = read('SKILL.md');
  expectText(skill, [
    /update\s+[“"]?the README[”"]?[\s\S]{0,180}(?:first )?identify[\s\S]{0,160}every maintained language README[\s\S]{0,180}update all[\s\S]{0,180}semantic parity/i,
    /before completing[\s\S]{0,180}compare[\s\S]{0,120}commands[\s\S]{0,120}links[\s\S]{0,120}installation paths[\s\S]{0,120}license facts[\s\S]{0,120}examples[\s\S]{0,120}safety rules[\s\S]{0,180}every maintained language variant/i,
    /record[\s\S]{0,120}per-category parity result[\s\S]{0,180}(?:PR body|verification checklist|test output)[\s\S]{0,180}(?:evidence|verification)/i
  ], 'SKILL.md');
});

test('bilingual READMEs link to one another and synchronize unqualified README updates', () => {
  const english = read('README.md');
  const korean = read('README.ko.md');
  assert.match(english.slice(0, 700), /\[.*한국어.*\]\(README\.ko\.md\)/i);
  assert.match(korean.slice(0, 700), /\[.*English.*\]\(README\.md\)/i);
  for (const text of [english, korean]) {
    expectText(text, [
      /Update the README[\s\S]{0,220}(?:all|every|모든)[\s\S]{0,100}(?:language|언어)/i,
      /new to GitHub[\s\S]{0,160}experienced|GitHub 초보[\s\S]{0,160}숙련/i,
      /~\/.agents\/skills\/managing-github-workflows/i,
      /~\/.claude\/skills\/managing-github-workflows/i,
      /~\/.cursor\/skills\/managing-github-workflows/i,
      /~\/.gemini\/config\/skills\/managing-github-workflows/i,
      /~\/.gemini\/antigravity-cli\/skills\/managing-github-workflows/i,
      /installed[\s\S]{0,220}(?:activated|discovered)[\s\S]{0,220}authenticated[\s\S]{0,220}usable/i,
      /LICENSE/i
    ], 'README');
  }
});

test('both READMEs provide concrete clone commands and natural Korean guidance', () => {
  const english = read('README.md');
  const korean = read('README.ko.md');
  const destinations = [
    '~/.agents/skills/managing-github-workflows',
    '~/.claude/skills/managing-github-workflows',
    '~/.cursor/skills/managing-github-workflows',
    '~/.gemini/config/skills/managing-github-workflows',
    '~/.gemini/antigravity-cli/skills/managing-github-workflows'
  ];
  for (const text of [english, korean]) {
    for (const destination of destinations) {
      assert.match(text, new RegExp(`git clone https://github\\.com/LYNGMN/github-workflow-skill\\.git ${destination.replaceAll('/', '\\/')}`), `README needs a clone command for ${destination}`);
    }
  }
  assert.doesNotMatch(korean, /all maintained language README|no warranty/i);
  expectText(korean, [/모든 관리 대상 언어 README/, /보증 없이 제공/], 'Korean README');
});

test('workflow contains all seven bilingual stages with inputs, actions, and exit criteria', () => {
  const workflow = read('references/github-workflow.md');
  const stages = ['Issue', 'Branch', 'Commit', 'Push', 'Pull Request', 'Review', 'Merge'];
  for (const stage of stages) {
    const section = topLevelSection(workflow, stage);
    expectText(section, [/### English\n[\s\S]{0,1000}\*\*Required input:\*\*[\s\S]{0,1600}\*\*Actions:\*\*[\s\S]{0,2000}\*\*Exit criteria:\*\*/i, /### 한국어\n[\s\S]{0,1000}\*\*필수 입력:\*\*[\s\S]{0,1600}\*\*작업:\*\*[\s\S]{0,2000}\*\*완료 기준:\*\*/], stage);
  }
  expectText(workflow, [
    /English[\s\S]{0,140}(?:publication|publish)[\s\S]{0,320}Korean[\s\S]{0,140}(?:review|검토)/i,
    /Summary[\s\S]{0,800}Open Questions/i,
    /Purpose[\s\S]{0,1000}Draft blockers/i,
    /Draft Pull Request/i, /new Head SHA[\s\S]{0,220}(?:review|re-review)/i,
    /explicit final Merge approval/i, /Squash Merge/i,
    /deployment is separate/i, /branch deletion[\s\S]{0,160}separate/i
  ], 'workflow');
});

test('Korean Commit guidance keeps the English single-purpose grouping rule', () => {
  const workflow = read('references/github-workflow.md');
  const commit = topLevelSection(workflow, 'Commit');
  expectText(commit, [
    /Multiple files with one purpose may share one Commit; multiple purposes require separate Commits and may require separate Pull Requests\./,
    /같은 한 가지 목적[\s\S]{0,100}여러 파일[\s\S]{0,100}하나의 Commit[\s\S]{0,160}목적이 여러 개[\s\S]{0,100}Commit을 나누고[\s\S]{0,100}Pull Request도 나눕니다\./
  ], 'Commit guidance');
});

test('first public Push defaults commit identity to noreply and stops on personal metadata in both languages', () => {
  const workflow = read('references/github-workflow.md');
  const push = topLevelSection(workflow, 'Push');
  const [english, korean] = push.split('### 한국어');
  expectText(english, [
    /Before the first Push to a PUBLIC remote[\s\S]{0,220}all reachable Git history intended for publication[\s\S]{0,180}author\/committer identity[\s\S]{0,140}email metadata/i,
    /GitHub-provided [`']?noreply[`']?[\s\S]{0,220}(?:default|default-safe)/i,
    /general public(?:ation)? approval[\s\S]{0,180}(?:does not|never)[\s\S]{0,180}(?:personal|non-noreply)[\s\S]{0,100}email/i,
    /(?:personal|unapproved non-noreply)[\s\S]{0,180}(?:stop|do not Push|must not Push)/i,
    /already published[\s\S]{0,220}(?:affected Commit count|number of affected Commits)[\s\S]{0,220}(?:do not repeat|without repeating)[\s\S]{0,160}(?:email|address)/i
  ], 'English public Push gate');
  expectText(korean, [
    /PUBLIC remote에 처음 Push하기 전[\s\S]{0,220}공개될 모든 도달 가능한 Git 이력[\s\S]{0,180}author\/committer 신원[\s\S]{0,140}이메일 메타데이터/i,
    /GitHub가 제공하는 [`']?noreply[`']?[\s\S]{0,220}기본/i,
    /일반적인 공개 승인[\s\S]{0,180}(?:개인|non-noreply)[\s\S]{0,100}이메일[\s\S]{0,180}(?:승인하지 않습니다|승인이 아닙니다)/i,
    /(?:개인|승인되지 않은 non-noreply)[\s\S]{0,180}(?:중단|Push하지)/i,
    /이미 공개[\s\S]{0,220}영향받은 Commit 수[\s\S]{0,220}(?:이메일|주소)[\s\S]{0,160}(?:반복|출력)하지/i
  ], 'Korean public Push gate');
  for (const path of ['SKILL.md', 'references/collaboration-policy.md']) {
    expectText(read(path), [
      /Before the first Push to a PUBLIC remote[\s\S]{0,220}all reachable Git history intended for publication[\s\S]{0,180}author\/committer identity[\s\S]{0,140}email metadata/i,
      /GitHub-provided [`']?noreply[`']?[\s\S]{0,220}(?:default|default-safe)/i,
      /(?:personal|unapproved non-noreply)[\s\S]{0,180}(?:stop|do not Push|must not Push)/i
    ], path);
  }
  for (const path of ['README.md', 'README.ko.md']) {
    expectText(read(path), [/noreply/i, /author\/committer/i, /reachable Git history|도달 가능한 Git 이력/i], path);
  }
});

test('bilingual publication rules require complete Korean field translations without shortcuts', () => {
  const skill = read('SKILL.md');
  const workflow = read('references/github-workflow.md');
  const template = read('.github/PULL_REQUEST_TEMPLATE.md');
  for (const text of [skill, workflow, template]) {
    expectText(text, [
      /Korean review copy[\s\S]{0,180}(?:every|required)[\s\S]{0,120}(?:field|section)[\s\S]{0,180}(?:complete|completely)/i,
      /must not[\s\S]{0,120}same as above[\s\S]{0,120}위와 동일[\s\S]{0,120}(?:summary|cross-reference)/i
    ], 'bilingual publication rule');
  }
  const prSections = [
    ['Purpose', '목적'], ['Related Issue / Pull Request', '관련 Issue / Pull Request'], ['Changes', '변경 내용'],
    ['User Impact', '사용자 영향'], ['Verification', '검증'], ['Scope Note \\(optional\\)', '범위 참고 \\(선택 사항\\)'],
    ['Risk/Recovery \\(when relevant\\)', '위험 및 복구 \\(필요한 경우\\)'],
    ['Screenshots/Evidence \\(when relevant\\)', '스크린샷 및 증거 \\(필요한 경우\\)'],
    ['Search keywords', '검색 키워드'], ['Draft blockers', 'Draft 해제 전 남은 작업']
  ];
  assert.match(template, /## English\n[\s\S]*?## 한국어/i);
  for (const [english, korean] of prSections) {
    expectText(template, [new RegExp(`## English[\\s\\S]*?### ${english}\\n[\\s\\S]*?## 한국어[\\s\\S]*?### ${korean}`)], `Pull Request section pair: ${english}`);
  }
});

test('Pull Request fields separate actual changes, optional scope notes, draft blockers, and future Issues', () => {
  const workflow = topLevelSection(read('references/github-workflow.md'), 'Pull Request');
  const template = read('.github/PULL_REQUEST_TEMPLATE.md');

  expectText(workflow, [
    /Changes[\s\S]{0,180}reviewed diff[\s\S]{0,180}stated purpose/i,
    /Scope Note[\s\S]{0,220}optional[\s\S]{0,220}adjacent behavior[\s\S]{0,220}misunderstood/i,
    /future work[\s\S]{0,180}own Issue[\s\S]{0,220}not[\s\S]{0,100}Scope Note/i,
    /Draft blockers[\s\S]{0,220}required before this Pull Request[\s\S]{0,180}Ready for review/i,
    /omit[\s\S]{0,80}unrelated concurrent work/i,
    /변경 내용[\s\S]{0,180}Review한 diff[\s\S]{0,180}명시한 목적/i,
    /범위 참고[\s\S]{0,220}선택[\s\S]{0,220}인접 동작[\s\S]{0,220}오해/i,
    /향후 작업[\s\S]{0,180}자체 Issue[\s\S]{0,220}범위 참고[\s\S]{0,100}적지/i,
    /Draft 해제 전 남은 작업[\s\S]{0,220}Ready for review로 전환하기 전[\s\S]{0,180}반드시/i,
    /동시에 진행[\s\S]{0,180}관련이 없는 작업[\s\S]{0,180}적지 않습니다/i
  ], 'Pull Request scope classification');

  expectText(template, [
    /### Changes\n\n<!--[\s\S]{0,260}reviewed diff[\s\S]{0,180}stated Purpose/i,
    /### Scope Note \(optional\)\n\n<!--[\s\S]{0,360}adjacent behavior[\s\S]{0,180}misunderstood[\s\S]{0,180}future work/i,
    /### Draft blockers\n\n<!--[\s\S]{0,320}required before this Pull Request[\s\S]{0,180}Ready for review/i,
    /### 변경 내용\n\n<!--[\s\S]{0,260}Review한 diff[\s\S]{0,180}목적/i,
    /### 범위 참고 \(선택 사항\)\n\n<!--[\s\S]{0,360}인접 동작[\s\S]{0,180}오해[\s\S]{0,180}향후 작업/i,
    /### Draft 해제 전 남은 작업\n\n<!--[\s\S]{0,320}Ready for review로 전환하기 전[\s\S]{0,180}반드시/i
  ], 'Pull Request template scope prompts');
  assert.doesNotMatch(template, /^### (?:Excluded|제외|Included|포함|Remaining Work|남은 작업)$/m);
});

test('CONTRIBUTING defines one independently reviewable outcome per Pull Request', () => {
  const contributing = read('CONTRIBUTING.md');
  const english = topLevelSection(contributing, 'English');
  const korean = topLevelSection(contributing, '한국어');

  assert.match(contributing, /## English\n[\s\S]*?## 한국어/);
  expectText(english, [
    /read[\s\S]{0,120}(?:target )?Repository(?:'s)?[\s\S]{0,100}CONTRIBUTING/i,
    /one independently reviewable outcome per Pull Request/i,
    /not[\s\S]{0,120}one Pull Request per file[\s\S]{0,180}(?:feature label|word “feature”)/i,
    /same root cause[\s\S]{0,180}(?:code|implementation)[\s\S]{0,120}tests[\s\S]{0,120}documentation[\s\S]{0,120}configuration[\s\S]{0,180}one Pull Request/i,
    /reviewed, verified, merged, and reverted independently[\s\S]{0,180}separate Issue[\s\S]{0,120}separate Pull Request/i,
    /future work[\s\S]{0,180}separate Issue[\s\S]{0,180}not[\s\S]{0,100}Scope Note/i,
    /create (?:its |a )?Branch[\s\S]{0,180}implementation begins/i,
    /`Closes #N`[\s\S]{0,200}fully completes[\s\S]{0,180}`Refs #N`[\s\S]{0,200}(?:partial|dependency)/i,
    /Scope Note[\s\S]{0,160}only when[\s\S]{0,180}adjacent behavior[\s\S]{0,180}misunderstood/i
  ], 'English contribution contract');
  expectText(korean, [
    /대상 Repository[\s\S]{0,120}CONTRIBUTING[\s\S]{0,120}먼저/i,
    /독립적으로 Review[\s\S]{0,100}검증[\s\S]{0,100}Merge[\s\S]{0,100}되돌릴 수 있는 결과마다 Pull Request 하나/i,
    /파일마다 Pull Request 하나[\s\S]{0,180}(?:기능이라는 단어|기능 이름)/i,
    /같은 근본 원인[\s\S]{0,180}코드[\s\S]{0,120}테스트[\s\S]{0,120}문서[\s\S]{0,120}설정[\s\S]{0,180}하나의 Pull Request/i,
    /독립적으로[\s\S]{0,120}Review[\s\S]{0,120}검증[\s\S]{0,120}Merge[\s\S]{0,120}되돌릴[\s\S]{0,180}별도 Issue[\s\S]{0,120}별도 Pull Request/i,
    /향후 작업[\s\S]{0,180}별도 Issue[\s\S]{0,180}범위 참고[\s\S]{0,100}적지/i,
    /구현을 시작할 때[\s\S]{0,140}Branch/i,
    /`Closes #N`[\s\S]{0,200}완전히 완료[\s\S]{0,180}`Refs #N`[\s\S]{0,200}(?:부분|의존)/i
  ], 'Korean contribution contract');

  expectText(contributing, [
    /docs\.github\.com\/en\/communities\/setting-up-your-project-for-healthy-contributions\/setting-guidelines-for-repository-contributors/i,
    /docs\.github\.com\/en\/get-started\/writing-on-github\/working-with-advanced-formatting\/using-keywords-in-issues-and-pull-requests/i
  ], 'official contribution references');
});

test('entrypoint, READMEs, and Issue Forms route contributors to the scope contract', () => {
  expectText(read('SKILL.md'), [
    /target Repository(?:'s)?[\s\S]{0,120}CONTRIBUTING[\s\S]{0,180}before[\s\S]{0,120}(?:Issue|Pull Request)/i,
    /one independently reviewable outcome per Pull Request/i
  ], 'SKILL contribution routing');
  for (const path of ['README.md', 'README.ko.md']) {
    expectText(read(path), [/CONTRIBUTING\.md/, /independently reviewable|독립적으로 Review/], path);
  }
  for (const path of ['.github/ISSUE_TEMPLATE/bug_report.yml', '.github/ISSUE_TEMPLATE/feature_request.yml']) {
    expectText(read(path), [
      /one problem or requested outcome per Issue/i,
      /independently deliverable[\s\S]{0,160}separate Issue/i,
      /umbrella Issue[\s\S]{0,160}sub-issues/i
    ], path);
  }
});

test('title contracts cover grammar, metadata boundaries, and anti-patterns', () => {
  const workflow = read('references/github-workflow.md');
  expectText(workflow, [
    /at most one[\s\S]{0,100}square brackets[\s\S]{0,100}Issue/i,
    /one optional scope/i, /omit (?:the )?scope[\s\S]{0,120}no honest shared scope/i,
    /colon separates/i, /lowercase type\/scope/i, /scope[\s\S]{0,160}not[\s\S]{0,80}filenames/i,
    /Do not duplicate type, priority, or status[\s\S]{0,180}(?:Issue type|Label|Draft state)/i,
    /`Update`, `Changes`, `Fix issue`/, /\[BUG\]\[HIGH\]\[INSTALL\]/
  ], 'title contract');
});

test('default-branch protection applies to the actual configured default branch', () => {
  const documents = ['SKILL.md', 'README.md', 'README.ko.md', 'references/github-workflow.md', 'references/collaboration-policy.md'].map(read);
  for (const text of documents) {
    expectText(text, [/actual default Branch|실제 기본 브랜치/i, /main.*master.*examples|main.*master.*예시/i], 'default-branch policy');
  }
});

test('titles, search guidance, and Git safety rules are consistently documented', () => {
  const docs = ['README.md', 'README.ko.md', 'SKILL.md', 'references/github-workflow.md', 'references/collaboration-policy.md'].map(read).join('\n');
  expectText(docs, [
    /\[Area\] Problem or requested outcome/, /<owner>\/<type>\/<purpose>/,
    /type\(scope\): completed outcome/, /Do not end titles with a period/i,
    /Search keywords/i, /search existing Issues\/Pull Requests first/i,
    /direct(?:ly)? Push to (?:the repository's )?actual default Branch|실제 기본 브랜치/i,
    /Force Push/i, /unapproved public publication/i,
    /one author per Branch\/Worktree/i
  ], 'workflow documentation');
});

test('English Issue Forms expose distinct contract fields and the PR template remains safe', () => {
  const bug = read('.github/ISSUE_TEMPLATE/bug_report.yml');
  const feature = read('.github/ISSUE_TEMPLATE/feature_request.yml');
  const pr = read('.github/PULL_REQUEST_TEMPLATE.md');
  for (const issue of [bug, feature]) {
    expectText(issue, [/name:/i, /English/i, /search.*existing.*Issues/i, /Search keywords/i, /Acceptance Criteria/i, /Evidence/i, /Open Questions/i], 'Issue template');
  }
  for (const id of ['summary', 'context', 'reproduction', 'actual-result', 'expected-result', 'impact', 'priority', 'labels', 'assignee', 'acceptance', 'evidence', 'keywords', 'questions']) {
    assert.match(bug, new RegExp(`id: ${id}`), `bug form must expose ${id}`);
  }
  for (const id of ['requested-outcome', 'context', 'impact', 'priority', 'labels', 'assignee', 'acceptance', 'evidence', 'keywords', 'questions']) {
    assert.match(feature, new RegExp(`id: ${id}`), `feature form must expose ${id}`);
  }
  const issueWorkflow = topLevelSection(read('references/github-workflow.md'), 'Issue');
  expectText(issueWorkflow, [
    /Shared input:[\s\S]{0,500}(?:Summary or Requested Outcome)[\s\S]{0,500}Context[\s\S]{0,500}Acceptance Criteria/i,
    /Bug-specific input:[\s\S]{0,300}Reproduction[\s\S]{0,300}Actual Result[\s\S]{0,300}Expected Result/i,
    /Feature-specific input:[\s\S]{0,300}Requested Outcome/i,
    /공통 입력:[\s\S]{0,500}Summary 또는 Requested Outcome[\s\S]{0,500}Context[\s\S]{0,500}Acceptance Criteria/,
    /Bug 전용 입력:[\s\S]{0,300}Reproduction[\s\S]{0,300}Actual Result[\s\S]{0,300}Expected Result/,
    /Feature 전용 입력:[\s\S]{0,300}Requested Outcome/
  ], 'Issue type-specific input contract');
  for (const issue of [bug, feature]) {
    expectText(issue, [
      /id: existing-search-results/, /label: Existing search results/i,
      /query/i, /repository\/scope searched/i, /result status\/count/i,
      /Issue\/PR URLs|Issue or Pull Request URLs/i
    ], 'Issue search traceability');
    expectRequiredFormItem(issue, 'existing-search-results');
  }
  expectText(pr, [
    /Purpose/i, /Related Issue \/ Pull Request/i, /Changes/i, /User Impact/i,
    /Verification/i, /Scope Note \(optional\)/i, /Risk\/Recovery \(when relevant\)/i,
    /Screenshots\/Evidence \(when relevant\)/i, /Search keywords/i, /Draft blockers/i,
    /Review Checklist/i, /Merge Checklist/i,
    /does not grant Merge approval/i
  ], 'Pull Request template');
});

test('Existing search results requiredness stops at its exact YAML form item', () => {
  const priorOptionalForm = `body:
  - type: textarea
    id: existing-search-results
    attributes: { label: Existing search results }
  - type: input
    id: summary
    validations: { required: true }
`;
  assert.throws(() => expectRequiredFormItem(priorOptionalForm, 'existing-search-results'), /must be required in its own form item/);
});

test('workflow records duplicate-search results when related work exists', () => {
  const workflow = read('references/github-workflow.md');
  expectText(workflow, [
    /record[\s\S]{0,120}(?:query|queries)[\s\S]{0,120}repository\/scope searched[\s\S]{0,120}result status\/count/i,
    /matches or near-duplicates[\s\S]{0,180}(?:related )?Issue\/PR URLs/i
  ], 'duplicate-search traceability');
});

test('priority uses only confirmed repository taxonomy', () => {
  const docs = [read('SKILL.md'), read('references/github-workflow.md')].join('\n');
  expectText(docs, [
    /never translate impact into an unknown priority (?:code|scale)/i,
    /confirmed (?:repository )?taxonomy/i,
    /Priority[\s\S]{0,120}Needs confirmation/i,
    /Open Questions/i
  ], 'priority policy');
});

test('concepts provide English and Korean sections with explanations for every required term', () => {
  const concepts = read('references/github-concepts.md');
  const englishSection = sectionAfter(concepts, '## English');
  const koreanSection = sectionAfter(concepts, '## 한국어');
  const terms = [
    ['Repository', '리포지터리'], ['Remote', '원격 저장소'], ['Clone', '클론'], ['Pull', '풀'], ['Push', '푸시'],
    ['Branch', '브랜치'], ['Worktree', '워크트리'], ['Stage', '스테이지'], ['Commit', '커밋'], ['Issue', '이슈'],
    ['Pull Request', '풀 리퀘스트'], ['Review', '리뷰'], ['Merge', '병합'], ['Squash Merge', '스쿼시 병합'],
    ['Draft Pull Request', '드래프트 풀 리퀘스트'], ['SHA', 'SHA'], ['Label', '레이블'], ['Assignee', '담당자'],
    ['Authentication', '인증'], ['Authorization', '권한 승인'], ['OAuth Scope', 'OAuth 권한 범위'],
    ['Acceptance Criteria', '완료 조건'], ['License', '라이선스']
  ];
  for (const [english, korean] of terms) {
    conceptTopicBody(englishSection, english, 'English');
    conceptTopicBody(koreanSection, korean, 'Korean');
  }
  const emptyTopicFixture = '### Repository\n\n### Remote\n\nA Remote has a body.\n';
  assert.throws(() => conceptTopicBody(emptyTopicFixture, 'Repository', 'fixture'), /non-empty body before the next heading/);
});

test('writing guidelines preserve referents, readable source structure, and bilingual headings', () => {
  const guidelines = read('references/writing-guidelines.md');
  const english = topLevelSection(guidelines, 'English');
  const korean = topLevelSection(guidelines, '한국어');
  expectText(guidelines, [
    /## English\n[\s\S]*?## 한국어/i,
    /explicit subjects, objects, and property names[\s\S]{0,180}more than one interpretation/i,
    /Do not insert a source newline inside a word, product name, URL, inline code span, or Markdown link/i,
    /Do not hard-wrap prose at a fixed column/i,
    /one blank line around paragraphs, lists, tables, and code blocks/i,
    /Markdown table[\s\S]{0,260}header[\s\S]{0,120}delimiter[\s\S]{0,120}body row[\s\S]{0,160}same number of columns/i,
    /마크다운 표\(Markdown table\)[\s\S]{0,260}헤더[\s\S]{0,120}구분선[\s\S]{0,120}본문 행[\s\S]{0,160}열 수[\s\S]{0,80}같/i,
    /Under an existing `##` topic, use `### English` and `### 한국어`/i,
    /complete English and Korean sections/i
  ], 'writing guidelines');
  expectText(english, [
    /Discord bot display name:\s*`Google News`/,
    /Discord bot icon:\s*the project's Google News icon/i,
    /Discord bot display name:\s*`YouTube`/,
    /Discord bot icon:\s*the project's YouTube icon/i
  ], 'English explicit Discord bot targets');
  expectText(korean, [
    /디스코드 봇\(Discord bot\)의 표시 이름:\s*`Google News`/,
    /디스코드 봇의 아이콘:\s*프로젝트의 Google News 아이콘/,
    /디스코드 봇의 표시 이름:\s*`YouTube`/,
    /디스코드 봇의 아이콘:\s*프로젝트의 YouTube 아이콘/
  ], 'Korean explicit Discord bot targets');
  assert.doesNotMatch(guidelines, /Google News Bot|YouTube Bot|emoji|trademark/i);
});

test('conversation progress reports use the user language without mixed-language field labels', () => {
  const skill = read('SKILL.md');
  const delivery = read('references/delivery-contract.md');
  const guidelines = read('references/writing-guidelines.md');
  const readmes = [read('README.md'), read('README.ko.md')];
  const contractDocuments = [skill, delivery, guidelines, ...readmes];

  for (const document of contractDocuments) {
    assert.doesNotMatch(document, /`(?:Current stage|Remaining stages|Next step) \/ (?:현재 단계|남은 단계|다음 단계):`/, 'progress labels must not mix English and Korean in one field');
    assert.doesNotMatch(document, /`Status: (?:IN PROGRESS|ACTION REQUIRED|BLOCKED|COMPLETE|MERGED) \/ 상태:/, 'status labels must not mix English and Korean in one field');
  }

  expectText(skill, [
    /match the user(?:'s)? language/i,
    /Korean[\s\S]{0,220}`현재 단계:`[\s\S]{0,160}`남은 단계:`[\s\S]{0,160}`다음 단계:`/i,
    /English[\s\S]{0,220}`Current stage:`[\s\S]{0,160}`Remaining stages:`[\s\S]{0,160}`Next step:`/i,
    /Korean[\s\S]{0,220}`상태: 진행 중 — 완료 아님`[\s\S]{0,180}`상태: 사용자 조치 필요 — 완료 아님`/i,
    /English[\s\S]{0,220}`Status: IN PROGRESS`[\s\S]{0,180}`Status: ACTION REQUIRED`/i,
    /technical terms[\s\S]{0,220}Korean[\s\S]{0,160}English original[\s\S]{0,220}first occurrence/i
  ], 'SKILL localized progress contract');

  expectText(delivery, [
    /English-language report[\s\S]{0,220}`Current stage:`[\s\S]{0,160}`Remaining stages:`[\s\S]{0,160}`Next step:`/i,
    /Korean-language report[\s\S]{0,220}`현재 단계:`[\s\S]{0,160}`남은 단계:`[\s\S]{0,160}`다음 단계:`/i,
    /풀 리퀘스트\(Pull Request\)/,
    /스쿼시 병합\(Squash Merge\)/
  ], 'delivery localized progress structure');

  expectText(guidelines, [
    /conversation[\s\S]{0,220}(?:user|reader)[\s\S]{0,180}language/i,
    /technical[\s\S]{0,220}Korean[\s\S]{0,160}English original[\s\S]{0,180}first occurrence/i,
    /풀 리퀘스트\(Pull Request\)/,
    /헤드 SHA\(Head SHA\)/
  ], 'writing guidelines localized conversation rules');
});

test('Korean guidance consistently writes Korean before the English original', () => {
  const documents = [
    'SKILL.md',
    'README.md',
    'README.ko.md',
    'references/delivery-contract.md',
    'references/writing-guidelines.md',
    'references/github-concepts.md',
    'references/github-authentication.md',
    'references/workflow-modes.md',
    'evaluation/scenarios.json'
  ];

  const forbiddenEnglishFirstTerms = [
    'Pull Request\\(풀 리퀘스트\\)',
    'Head SHA\\(헤드 SHA\\)',
    'Squash Merge\\(스쿼시 병합\\)',
    'Issue\\(이슈\\)',
    'Branch\\(브랜치\\)',
    'Commit\\(커밋\\)',
    'Push\\(푸시\\)',
    'Review\\(리뷰\\)',
    'Merge\\(병합\\)',
    'Installed\\(설치됨\\)',
    'Authenticated\\(인증됨\\)',
    'Authorized\\(권한 승인됨\\)'
  ];

  for (const path of documents) {
    const document = read(path);
    for (const pattern of forbiddenEnglishFirstTerms) {
      assert.doesNotMatch(document, new RegExp(pattern), `${path} must not use English(Korean) ordering for ${pattern}`);
    }
  }

  expectText(read('SKILL.md'), [
    /`풀 리퀘스트\(Pull Request\)`/,
    /`헤드 SHA\(Head SHA\)`/,
    /`스쿼시 병합\(Squash Merge\)`/
  ], 'SKILL Korean-first terminology examples');
});

test('READMEs keep equivalent examples and complete installation options', () => {
  const readmes = [read('README.md'), read('README.ko.md')];
  const destinations = [
    '~/.agents/skills/managing-github-workflows', '~/.claude/skills/managing-github-workflows',
    '~/.cursor/skills/managing-github-workflows', '~/.gemini/config/skills/managing-github-workflows',
    '~/.gemini/antigravity-cli/skills/managing-github-workflows'
  ];
  for (const readme of readmes) {
    expectText(readme, [/Issue drafting|Issue 초안/i, /multiple files[\s\S]{0,100}one purpose|여러 파일[\s\S]{0,100}한 가지 목적/i, /Draft Pull Request/i, /Squash Merge/i]);
    expectText(readme, [/Applicable runtimes|적용 런타임/i, /When to choose|선택할 때/i, /Required input|필수 입력/i, /Copy-ready example|바로 쓸 수 있는 예시/i, /Expected result|예상 결과/i, /Collision\/rescan\/restart caution|충돌\/재검색\/재시작 주의/i], 'installation option columns');
    for (const destination of destinations) {
      const row = readme.split('\n').find((line) => line.includes(destination));
      assert.ok(row, `missing installation row for ${destination}`);
      assert.ok(row.split('|').length >= 8, `installation row must document every option field: ${destination}`);
      assert.match(row, /git clone https:\/\/github\.com\/LYNGMN\/github-workflow-skill\.git/, `installation row needs a copy-ready clone command: ${destination}`);
    }
  }
});

test('workflow modes select only the stages required by user intent', () => {
  const modes = read('references/workflow-modes.md');
  const skill = read('SKILL.md');
  const koreanReadOnlyRow = modes.split('\n').find((line) => line.includes('설명, 상태 확인 또는 읽기 전용'));
  assert.ok(koreanReadOnlyRow, 'missing Korean read-only mode row');
  expectText(koreanReadOnlyRow, [/Git 실행 단계를 실행하거나[\s\S]{0,40}변경하지 않/i], 'Korean read-only mode');
  expectText(modes, [
    /^# Workflow Modes \/ 워크플로 모드/m,
    /^## English$[\s\S]*^## 한국어$/m,
    /Explain, status, or read-only[\s\S]{0,280}do not execute Git stages/i,
    /Issue-only[\s\S]{0,280}search[\s\S]{0,180}Issue[\s\S]{0,180}(?:stop|endpoint)/i,
    /Local implementation[\s\S]{0,320}Branch[\s\S]{0,120}Commit[\s\S]{0,180}(?:Review|verification)/i,
    /Draft delivery[\s\S]{0,360}Push[\s\S]{0,180}Draft Pull Request[\s\S]{0,220}(?:overall|delivery)[\s\S]{0,100}incomplete/i,
    /Complete delivery[\s\S]{0,500}optional Issue[\s\S]{0,220}Branch[\s\S]{0,120}Commit[\s\S]{0,120}Push[\s\S]{0,160}Draft Pull Request[\s\S]{0,160}Review[\s\S]{0,180}final authorization[\s\S]{0,180}Ready for review[\s\S]{0,180}Squash Merge[\s\S]{0,180}actual default Branch/i,
    /Existing Branch or Pull Request[\s\S]{0,320}resume[\s\S]{0,160}current stage[\s\S]{0,220}(?:reuse|recreate)/i,
    /완전 배달[\s\S]{0,520}선택적 Issue[\s\S]{0,200}최종 승인[\s\S]{0,180}Ready for review[\s\S]{0,180}Squash Merge[\s\S]{0,180}실제 기본 브랜치/i
  ], 'workflow modes');
  expectText(skill, [
    /workflow-modes\.md/i,
    /seven stages[\s\S]{0,180}(?:reference map|not universally required)/i,
    /(?:implement|fix|change)[\s\S]{0,160}default to \*\*Complete delivery\*\*/i
  ], 'SKILL workflow routing');
  assert.doesNotMatch(skill, /Follow all seven stages/i, 'the seven stages must not be unconditionally mandatory');
});

test('delivery contract uses two gates and makes unfinished work unmistakable', () => {
  const delivery = read('references/delivery-contract.md');
  const skill = read('SKILL.md');
  const startGate = sectionAfter(delivery, '### Gate 1: Start authorization', '^### ');
  expectText(startGate, [
    /Start authorization covers/i, /purpose Branch/i, /Commit checkpoints/i, /non-force Push/i,
    /creating or updating the same Draft Pull Request/i, /Review/i
  ], 'Start authorization coverage');
  expectText(skill, [/delivery-contract\.md/i], 'SKILL delivery entrypoint');
  expectText(delivery, [
    /^# Delivery Contract \/ 배달 계약/m,
    /^## English$[\s\S]*^## 한국어$/m,
    /Start authorization[\s\S]{0,420}Repository[\s\S]{0,120}visibility[\s\S]{0,120}included scope[\s\S]{0,120}excluded scope[\s\S]{0,120}endpoint[\s\S]{0,120}Branch[\s\S]{0,160}authentication/i,
    /do not ask for another stage-by-stage approval/i,
    /Final Merge authorization[\s\S]{0,360}exact Pull Request[\s\S]{0,120}base[\s\S]{0,120}Head Branch[\s\S]{0,120}Head SHA[\s\S]{0,120}checks[\s\S]{0,120}reviews[\s\S]{0,120}Squash title/i,
    /pending-to-passing[\s\S]{0,220}does not invalidate[\s\S]{0,180}(?:wait|re-check)[\s\S]{0,180}without another approval/i,
    /new commit[\s\S]{0,120}base[\s\S]{0,120}title[\s\S]{0,120}method[\s\S]{0,140}failing check[\s\S]{0,140}conflict[\s\S]{0,140}blocking review[\s\S]{0,240}invalidates[\s\S]{0,180}Draft[\s\S]{0,140}retest[\s\S]{0,140}re-review/i,
    /English-language report[\s\S]{0,640}Status: IN PROGRESS[\s\S]{0,180}Status: ACTION REQUIRED[\s\S]{0,180}Status: BLOCKED[\s\S]{0,180}Status: COMPLETE[\s\S]{0,180}Status: MERGED/i,
    /한국어 답변[\s\S]{0,640}상태: 진행 중[\s\S]{0,180}상태: 사용자 조치 필요[\s\S]{0,180}상태: 차단됨[\s\S]{0,180}상태: 요청 결과 완료[\s\S]{0,180}상태: 병합 완료/i,
    /English-language report[\s\S]{0,220}Current stage:[\s\S]{0,180}Remaining stages:/i,
    /Korean-language report[\s\S]{0,220}현재 단계:[\s\S]{0,180}남은 단계:/i,
    /Commit, Push, or Draft Pull Request[\s\S]{0,220}(?:must not|cannot)[\s\S]{0,140}overall complete/i,
    /`gh pr merge <PR> --squash --match-head-commit <SHA> --subject "<approved Pull Request title>"`/,
    /separate CLI arguments[\s\S]{0,180}(?:shell interpolation|constructed shell command)/i,
    /never use `--admin`/i,
    /Branch deletion[\s\S]{0,160}separate approval/i,
    /시작 승인[\s\S]{0,420}Repository[\s\S]{0,120}공개 범위[\s\S]{0,140}포함 범위[\s\S]{0,140}제외 범위[\s\S]{0,140}완료 지점[\s\S]{0,140}Branch[\s\S]{0,160}인증/i,
    /단계마다 다시 승인받지 않/i,
    /최종 Merge 승인[\s\S]{0,360}정확한 Pull Request[\s\S]{0,120}base[\s\S]{0,120}Head Branch[\s\S]{0,120}Head SHA[\s\S]{0,120}검사[\s\S]{0,120}리뷰[\s\S]{0,120}Squash 제목/i
  ], 'delivery contract');
});

test('completion labels match the selected endpoint without hiding required action', () => {
  const skill = read('SKILL.md');
  const delivery = read('references/delivery-contract.md');
  const modes = read('references/workflow-modes.md');
  const readmes = [read('README.md'), read('README.ko.md')];
  expectText(skill, [
    /Every intermediate and final user-facing report[\s\S]{0,260}(?:user|reader)[\s\S]{0,120}language[\s\S]{0,240}(?:`Next step:`|`다음 단계:`)/i
  ], 'SKILL final next-step field');
  expectText(delivery, [
    /`Status: COMPLETE`[\s\S]{0,260}requested non-Merge endpoint[\s\S]{0,220}(?:Issue|Local|Draft Pull Request)/i,
    /`상태: 요청 결과 완료`[\s\S]{0,260}요청한 병합이 아닌 완료 지점[\s\S]{0,220}(?:이슈|로컬|초안 풀 리퀘스트)/i,
    /`Status: ACTION REQUIRED`[\s\S]{0,600}Final Merge authorization/i,
    /`상태: 사용자 조치 필요 — 완료 아님`[\s\S]{0,600}최종 병합 승인/i,
    /`Status: MERGED`[\s\S]{0,220}verified[\s\S]{0,140}default Branch/i,
    /`상태: 병합 완료`[\s\S]{0,220}기본 브랜치[\s\S]{0,140}확인/i,
    /Every intermediate and final user-facing report[\s\S]{0,320}(?:`Next step:`|`다음 단계:`)[\s\S]{0,220}(?:last field|nothing follows)/i,
    /If the requested endpoint is complete[\s\S]{0,260}No action required[\s\S]{0,220}optional next action/i,
    /모든 중간 보고와 최종 보고[\s\S]{0,320}(?:`Next step:`|`다음 단계:`)[\s\S]{0,220}(?:마지막 필드|뒤에는 아무 내용도)/i,
    /요청한 완료 지점[\s\S]{0,220}완료[\s\S]{0,220}사용자가 해야 할 필수 작업[\s\S]{0,120}없[\s\S]{0,180}선택 가능한 다음 행동/i
  ], 'endpoint completion labels');
  expectText(modes, [
    /Draft delivery[\s\S]{0,420}Draft URL[\s\S]{0,160}(?:endpoint|complete)[\s\S]{0,180}`Status: COMPLETE/i,
    /초안 배달\(Draft delivery\)[\s\S]{0,420}초안 URL[\s\S]{0,180}(?:완료 지점|완료)[\s\S]{0,180}`상태: 요청 결과 완료/i
  ], 'Draft endpoint status');
  expectText(readmes[0], [
    /IN PROGRESS[\s\S]{0,180}ACTION REQUIRED[\s\S]{0,180}BLOCKED/i,
    /COMPLETE[\s\S]{0,220}requested non-Merge endpoint/i,
    /MERGED[\s\S]{0,180}verified Merge/i
  ], 'English README status semantics');
  expectText(readmes[1], [
    /진행 중[\s\S]{0,180}사용자 조치 필요[\s\S]{0,180}차단됨/,
    /요청 결과 완료[\s\S]{0,220}요청한 병합이 아닌 완료 지점/,
    /병합 완료[\s\S]{0,180}병합 결과/
  ], 'Korean README status semantics');
});

test('both READMEs support AI-assisted, Git, and no-Git installation', () => {
  const readmes = [read('README.md'), read('README.ko.md')];
  for (const readme of readmes) {
    expectText(readme, [
      /Ask your AI assistant|AI에게 설치 요청/i,
      /https:\/\/github\.com\/LYNGMN\/github-workflow-skill/i,
      /managing-github-workflows/i,
      /built-in skill installer|내장 스킬 설치 기능/i,
      /do not overwrite|덮어쓰지 않/i,
      /Download ZIP|ZIP 다운로드/i,
      /without Git|Git 없이/i,
      /<install path>\/SKILL\.md/i,
      /nested (?:repository )?folder|중첩된 (?:저장소 )?폴더/i,
      /built-in skill installer[\s\S]{0,220}Git[\s\S]{0,220}(?:ZIP|Download ZIP)|내장 스킬 설치 기능[\s\S]{0,220}Git[\s\S]{0,220}ZIP/i,
      /installed[\s\S]{0,180}(?:discovered|activated)[\s\S]{0,180}(?:restart|rescan)|설치[\s\S]{0,180}(?:검색|활성)[\s\S]{0,180}(?:재시작|재검색)/i
    ], 'README easy installation');
  }
});

test('GitHub CLI authentication separates account access from action approval', () => {
  const authenticationPath = resolve(root, 'references/github-authentication.md');
  assert.ok(existsSync(authenticationPath), 'missing references/github-authentication.md');

  const authentication = read('references/github-authentication.md');
  const skill = read('SKILL.md');
  const workflow = topLevelSection(read('references/github-workflow.md'), 'GitHub CLI Authentication');
  const readmes = [read('README.md'), read('README.ko.md')];

  expectText(skill, [
    /github-authentication\.md/i,
    /installed[\s\S]{0,140}authenticated[\s\S]{0,140}authorized[\s\S]{0,140}usable/i,
    /authentication[\s\S]{0,180}(?:does not|never)[\s\S]{0,160}Push[\s\S]{0,160}Merge/i
  ], 'SKILL authentication entrypoint');

  expectText(authentication, [
    /^# GitHub Authentication \/ GitHub 인증/m,
    /^## English$[\s\S]*^## 한국어$/m,
    /`gh --version`[\s\S]{0,180}`gh auth status -h github\.com`/i,
    /`gh auth login -h github\.com -p https -w`/i,
    /same execution environment[\s\S]{0,180}(?:sandbox|keyring)/i,
    /one-time device code[\s\S]{0,180}sensitive[\s\S]{0,180}(?:never|do not)[\s\S]{0,180}(?:documentation|Issue|Pull Request|Commit|log)/i,
    /verify[\s\S]{0,140}(?:account|identity)[\s\S]{0,180}(?:OAuth )?scopes/i,
    /account-wide[\s\S]{0,180}not limited to one Repository/i,
    /`gh repo view OWNER\/REPO --json nameWithOwner,visibility,viewerPermission`/i,
    /read-only[\s\S]{0,180}(?:Push|write operation)[\s\S]{0,180}(?:not|never)/i,
    /(?:organization|조직)[\s\S]{0,180}(?:SSO|OAuth app access restriction)/i,
    /no universal[\s\S]{0,180}(?:scope|권한 범위)[\s\S]{0,180}(?:minimum|최소)/i,
    /(?:switch|logout|revoke)[\s\S]{0,220}explicit approval/i,
    /Authentication[\s\S]{0,180}(?:does not|never)[\s\S]{0,160}Push[\s\S]{0,160}Merge/i,
    /같은 실행 환경[\s\S]{0,180}(?:sandbox|keyring)/i,
    /일회용 기기 코드[\s\S]{0,180}민감[\s\S]{0,180}(?:문서|Issue|Pull Request|Commit|로그)/i,
    /계정[\s\S]{0,160}(?:OAuth )?권한 범위[\s\S]{0,180}확인/i,
    /계정 전체[\s\S]{0,180}하나의 Repository에만 적용되지 않/i,
    /(?:전환|로그아웃|해제)[\s\S]{0,220}명시적 승인/i,
    /인증[\s\S]{0,180}(?:Push|푸시)[\s\S]{0,160}(?:Merge|병합)[\s\S]{0,180}승인[\s\S]{0,120}(?:아니|분리)/i
  ], 'GitHub authentication reference');
  expectText(authentication, [
    /browser-only interactive authentication/i,
    /detect whether `GH_TOKEN` or `GITHUB_TOKEN` is set[\s\S]{0,180}never print/i,
    /environment token[\s\S]{0,140}(?:takes precedence|overrides)[\s\S]{0,180}(?:do not|never)[\s\S]{0,120}(?:unset|remove)/i,
    /Do not use[\s\S]{0,120}(?:personal access token|PAT)[\s\S]{0,120}`--with-token`[\s\S]{0,180}interactive authentication/i,
    /keep the CLI process running[\s\S]{0,180}wait for browser authorization[\s\S]{0,200}resume automatically/i,
    /do not ask the user to say[\s\S]{0,120}(?:next|done)/i,
    /plain-text credential storage[\s\S]{0,180}(?:stop|decision)/i,
    /command-scoped environment[\s\S]{0,220}`env -u GH_TOKEN -u GITHUB_TOKEN`[\s\S]{0,240}(?:does not|without)[\s\S]{0,160}(?:parent shell|shell configuration)/i,
    /login and every subsequent `gh` verification or action[\s\S]{0,240}same command-scoped exclusion/i,
    /authentication state is unchanged[\s\S]{0,180}one `ACTION REQUIRED` notice/i,
    /브라우저 전용 대화형 인증/i,
    /`GH_TOKEN`[\s\S]{0,80}`GITHUB_TOKEN`[\s\S]{0,180}값은 출력하지 않/i,
    /CLI 프로세스[\s\S]{0,120}실행[\s\S]{0,140}브라우저 승인[\s\S]{0,180}자동으로 재개/i,
    /명령 범위 환경[\s\S]{0,220}`env -u GH_TOKEN -u GITHUB_TOKEN`[\s\S]{0,240}(?:부모 shell|shell 설정)[\s\S]{0,160}(?:변경하지 않|건드리지 않)/i,
    /인증 상태가 그대로[\s\S]{0,180}`ACTION REQUIRED` 안내 한 번/i
  ], 'browser-only authentication contract');
  assert.doesNotMatch(authentication, /LYNGMN/, 'portable authentication guidance must not hardcode a personal account');

  expectText(workflow, [
    /### English[\s\S]{0,240}Required input:[\s\S]{0,240}Actions:[\s\S]{0,240}Exit criteria:/i,
    /### 한국어[\s\S]{0,240}필수 입력:[\s\S]{0,240}작업:[\s\S]{0,240}완료 기준:/i
  ], 'GitHub CLI authentication workflow preflight');

  for (const readme of readmes) {
    expectText(readme, [
      /GitHub CLI authentication|GitHub CLI 인증/i,
      /`gh auth status -h github\.com`/i,
      /`gh auth login -h github\.com -p https -w`/i,
      /`gh repo view OWNER\/REPO --json nameWithOwner,visibility,viewerPermission`/i,
      /github-authentication\.md/i,
      /Push[\s\S]{0,160}Merge[\s\S]{0,180}(?:separate|별도|다른) approval|인증[\s\S]{0,180}(?:Push|Merge)[\s\S]{0,180}승인/i
    ], 'README authentication guidance');
  }
});

test('README examples stay inside each language Usage examples section', () => {
  const englishExamples = topLevelSection(read('README.md'), 'Usage examples');
  const koreanExamples = topLevelSection(read('README.ko.md'), '사용 예시');
  expectText(englishExamples, [
    /Issue drafting/, /Multiple files with one purpose/, /Draft publication/, /Approved Draft-to-Squash-Merge work/
  ], 'English README Usage examples');
  expectText(koreanExamples, [
    /Issue 초안/, /여러 파일의 한 가지 목적 편집/, /Draft 게시/, /승인된 Draft에서 Squash Merge까지의 작업/
  ], 'Korean README 사용 예시');
});

test('Draft-to-Merge guidance gates exact state, required review, and recovery', () => {
  const workflow = read('references/github-workflow.md');
  const policy = read('references/collaboration-policy.md');
  const template = read('.github/PULL_REQUEST_TEMPLATE.md');
  const pullRequest = topLevelSection(workflow, 'Pull Request');
  const review = topLevelSection(workflow, 'Review');
  const merge = topLevelSection(workflow, 'Merge');
  const policyReviewMerge = topLevelSection(policy, 'Review and Merge');
  expectText(pullRequest, [
    /Draft Pull Request[\s\S]{0,240}State[\s\S]{0,160}Allowed action[\s\S]{0,160}Next/i,
    /Draft Pull Request[\s\S]{0,240}상태[\s\S]{0,160}허용[\s\S]{0,160}다음/i,
    /Ready for review[\s\S]{0,200}Review[\s\S]{0,200}Merge[\s\S]{0,200}Squash Merge/i
  ], 'workflow state learning');
  expectText(review, [
    /After Ready for review[\s\S]{0,180}Head, base, title, and method[\s\S]{0,200}Code Owner reviews and checks/i
  ], 'workflow Review section');
  expectText(merge, [
    /one explicit final Merge approval/i,
    /failing check[\s\S]{0,180}invalidates the existing final approval/i,
    /Allow only Squash Merge through the Pull Request/i
  ], 'workflow Merge section');
  expectText(policyReviewMerge, [
    /Draft[\s\S]{0,180}final authorization/i,
    /exact Pull Request[\s\S]{0,120}Base Branch[\s\S]{0,120}Head Branch[\s\S]{0,120}Head SHA[\s\S]{0,120}current checks[\s\S]{0,160}unresolved reviews[\s\S]{0,160}required reviews[\s\S]{0,160}mergeability[\s\S]{0,120}method[\s\S]{0,160}expected Squash title/i,
    /one explicit final approval[\s\S]{0,180}Ready for review[\s\S]{0,180}Squash Merge/i,
    /re-check[\s\S]{0,160}Head[\s\S]{0,120}base[\s\S]{0,120}title[\s\S]{0,120}method[\s\S]{0,160}mergeability[\s\S]{0,160}Squash Merge is enabled/i,
    /Code Owner reviews[\s\S]{0,140}checks/i,
    /new commit[\s\S]{0,140}base\/title\/method change[\s\S]{0,140}stops Merge/i,
    /convert back to Draft[\s\S]{0,180}retest[\s\S]{0,160}re-review[\s\S]{0,160}new final approval/i,
    /Do not rewrite[\s\S]{0,100}Force Push[\s\S]{0,160}combine branch commits/i,
    /default-branch Squash SHA[\s\S]{0,160}Pull Request merged state[\s\S]{0,160}linked Issue closure/i
  ], 'Draft-to-Merge policy');
  expectText(template, [/## English\n[\s\S]*?### Purpose[\s\S]*?## 한국어\n[\s\S]*?### 목적/i, /exact Pull Request[\s\S]{0,120}Base Branch[\s\S]{0,120}Head Branch[\s\S]{0,120}Head SHA[\s\S]{0,120}current checks[\s\S]{0,160}unresolved reviews[\s\S]{0,160}required reviews[\s\S]{0,160}mergeability[\s\S]{0,120}method[\s\S]{0,160}expected Squash title/i, /Code Owner/i, /Squash Merge is enabled/i], 'Pull Request template');
});

test('Pull Request Review and Merge checklists are complete in English and Korean', () => {
  const template = read('.github/PULL_REQUEST_TEMPLATE.md');
  const english = topLevelSection(template, 'English');
  const korean = topLevelSection(template, '한국어');

  const englishReview = checklistItems(english, 'Review Checklist', 'English Review Checklist');
  const koreanReview = checklistItems(korean, '리뷰 체크리스트', 'Korean Review Checklist');
  const englishMerge = checklistItems(english, 'Merge Checklist', 'English Merge Checklist');
  const koreanMerge = checklistItems(korean, '병합 체크리스트', 'Korean Merge Checklist');

  assert.equal(englishReview.length, 7, 'English Review Checklist must contain exactly seven checklist items');
  assert.equal(koreanReview.length, 7, 'Korean Review Checklist must contain exactly seven checklist items');
  assert.equal(englishMerge.length, 4, 'English Merge Checklist must contain exactly four checklist items');
  assert.equal(koreanMerge.length, 4, 'Korean Merge Checklist must contain exactly four checklist items');

  const reviewParity = [
    [/Draft until final authorization/i, /최종 승인 전까지 Draft/i],
    [/Requirements, Acceptance Criteria, and scope/i, /요구사항, Acceptance Criteria, 범위/i],
    [/Quality, security, tests, and operational risk/i, /품질, 보안, 테스트, 운영 위험/i],
    [/exact Pull Request[\s\S]*Base Branch[\s\S]*Head Branch[\s\S]*Head SHA[\s\S]*current checks[\s\S]*unresolved reviews[\s\S]*required reviews[\s\S]*mergeability[\s\S]*method[\s\S]*expected Squash title/i, /정확한 Pull Request[\s\S]*Base Branch[\s\S]*Head Branch[\s\S]*Head SHA[\s\S]*현재 checks[\s\S]*미해결 reviews[\s\S]*필수 reviews[\s\S]*병합 가능 여부[\s\S]*병합 방식[\s\S]*예상 Squash title/i],
    [/After final authorization[\s\S]*first changed[\s\S]*Draft to Ready for review/i, /최종 승인 뒤[\s\S]*먼저 Draft에서 Ready for review로 전환/i],
    [/After Ready for review[\s\S]*Code Owner reviews and checks[\s\S]*awaited and passed/i, /Ready for review 전환 뒤[\s\S]*Code Owner reviews와 checks[\s\S]*기다리고 통과/i],
    [/New changes received new tests and review/i, /새 변경[\s\S]*새 테스트와 Review/i]
  ];

  for (const [index, [englishPattern, koreanPattern]] of reviewParity.entries()) {
    assert.match(englishReview[index], englishPattern, `English Review item ${index + 1} must keep its required meaning and order`);
    assert.match(koreanReview[index], koreanPattern, `Korean Review item ${index + 1} must match English Review item ${index + 1}`);
  }

  const mergeParity = [
    [/final approval[\s\S]*first authorizes[\s\S]*Draft to Ready for review[\s\S]*After that transition[\s\S]*reviews and checks[\s\S]*pass[\s\S]*only then[\s\S]*Squash Merge/i, /최종 승인[\s\S]*먼저 Draft에서 Ready for review[\s\S]*전환 뒤[\s\S]*reviews와 checks[\s\S]*통과[\s\S]*그때만[\s\S]*Squash Merge/i],
    [/new commit[\s\S]*invalidated the existing final approval/i, /새 Commit[\s\S]*기존 최종 승인[\s\S]*무효/i],
    [/expected Squash Commit title[\s\S]*approved Pull Request title/i, /예상 Squash Commit 제목[\s\S]*승인된 Pull Request 제목/i],
    [/After Merge[\s\S]*default-branch Squash SHA[\s\S]*linked Issue closure/i, /Merge 뒤[\s\S]*default-branch Squash SHA[\s\S]*연결된 Issue 종료/i]
  ];

  for (const [index, [englishPattern, koreanPattern]] of mergeParity.entries()) {
    assert.match(englishMerge[index], englishPattern, `English Merge item ${index + 1} must keep its required meaning and order`);
    assert.match(koreanMerge[index], koreanPattern, `Korean Merge item ${index + 1} must match English Merge item ${index + 1}`);
  }

  expectText(english, [
    /^### Review Checklist$/m,
    /remains Draft until final authorization/i,
    /Requirements, Acceptance Criteria, and scope/i,
    /Quality, security, tests, and operational risk/i,
    /exact Pull Request[\s\S]{0,120}Base Branch[\s\S]{0,120}Head Branch[\s\S]{0,120}Head SHA[\s\S]{0,120}current checks[\s\S]{0,160}unresolved reviews[\s\S]{0,160}required reviews[\s\S]{0,160}mergeability[\s\S]{0,120}method[\s\S]{0,160}expected Squash title/i,
    /After Ready for review[\s\S]{0,220}Squash Merge is enabled/i,
    /Required Code Owner reviews and checks/i,
    /New changes received new tests and review/i,
    /^### Merge Checklist$/m,
    /One explicit final approval[\s\S]{0,220}Ready for review[\s\S]{0,220}Squash Merge/i,
    /new commit[\s\S]{0,160}invalidated the existing final approval/i,
    /expected Squash Commit title[\s\S]{0,180}approved Pull Request title/i,
    /After Merge[\s\S]{0,180}default-branch Squash SHA[\s\S]{0,180}linked Issue closure/i
  ], 'English Review and Merge checklists');

  expectText(korean, [
    /^### 리뷰 체크리스트$/m,
    /최종 승인 전까지 Draft/i,
    /요구사항, Acceptance Criteria, 범위/i,
    /품질, 보안, 테스트, 운영 위험/i,
    /정확한 Pull Request[\s\S]{0,120}Base Branch[\s\S]{0,120}Head Branch[\s\S]{0,120}Head SHA[\s\S]{0,120}현재 checks[\s\S]{0,160}미해결 reviews[\s\S]{0,160}필수 reviews[\s\S]{0,160}병합 가능 여부[\s\S]{0,120}병합 방식[\s\S]{0,160}예상 Squash title/i,
    /Ready for review 전환 뒤[\s\S]{0,220}Squash Merge 허용/i,
    /필수 Code Owner reviews와 checks/i,
    /새 변경[\s\S]{0,120}새 테스트와 Review/i,
    /^### 병합 체크리스트$/m,
    /명시적인 최종 승인 한 번[\s\S]{0,220}Ready for review[\s\S]{0,220}Squash Merge/i,
    /새 Commit[\s\S]{0,180}기존 최종 승인[\s\S]{0,120}무효/i,
    /예상 Squash Commit 제목[\s\S]{0,180}승인된 Pull Request 제목/i,
    /Merge 뒤[\s\S]{0,180}default-branch Squash SHA[\s\S]{0,180}연결된 Issue 종료/i
  ], 'Korean Review and Merge checklists');
});

test('Pull Request state learning uses five separate English and Korean entries', () => {
  const pullRequest = topLevelSection(read('references/github-workflow.md'), 'Pull Request');
  const english = subsection(pullRequest, 'English');
  const korean = subsection(pullRequest, '한국어');
  const states = ['Draft Pull Request', 'Ready for review', 'Review', 'Merge', 'Squash Merge'];
  for (const [index, state] of states.entries()) {
    const nextState = states[index + 1];
    expectText(stateLearningEntry(english, state, nextState), [/State:/, /Allowed action:/, /Next:/], `English state-learning item: ${state}`);
    expectText(stateLearningEntry(korean, state, nextState), [/상태:/, /허용 행동:/, /다음:/], `Korean state-learning item: ${state}`);
  }
  expectText(stateLearningEntry(korean, 'Draft Pull Request', 'Ready for review'), [
    /정확한 Pull Request[\s\S]{0,120}Base Branch[\s\S]{0,120}Head Branch[\s\S]{0,120}Head SHA[\s\S]{0,120}현재 checks[\s\S]{0,160}미해결 reviews[\s\S]{0,160}필수 reviews[\s\S]{0,160}병합 가능 여부[\s\S]{0,120}병합 방식[\s\S]{0,160}예상 Squash title/i
  ], 'Korean Draft Pull Request exact-state fields');
});

test('state-learning entries reject an unbounded empty item before a later state', () => {
  const malformedEntryFixture = [
    '- `Draft Pull Request`',
    '',
    '`Ready for review` — State: final authorization is recorded.',
    'Allowed action: wait for checks.',
    'Next: re-check the unchanged state.'
  ].join('\n');
  assert.throws(
    () => stateLearningEntry(malformedEntryFixture, 'Draft Pull Request', 'Ready for review'),
    /isolated list-item boundary|missing separate state-learning item/
  );
});

test('Issue actions distinguish English publication from complete Korean review sections', () => {
  const issue = topLevelSection(read('references/github-workflow.md'), 'Issue');
  const [english, korean] = issue.split('### 한국어');
  expectText(english, [/English publication section[\s\S]{0,160}followed by[\s\S]{0,160}complete Korean review section/i], 'English Issue actions');
  expectText(korean, [/영어 게시 섹션[\s\S]{0,160}다음[\s\S]{0,160}완전한 한국어 검토 섹션/i], 'Korean Issue actions');
});

test('changed Merge state invalidates final approval and requires Draft recovery', () => {
  const workflow = read('references/github-workflow.md');
  const merge = topLevelSection(workflow, 'Merge');
  const policy = topLevelSection(read('references/collaboration-policy.md'), 'Review and Merge');
  for (const text of [merge, policy]) {
    expectText(text, [
      /Any new commit, base\/title\/method change, failing check, conflict, or blocking review[\s\S]{0,220}invalidates the existing final approval[\s\S]{0,220}new exact-state final approval after resolution/i,
      /new commit, base\/title\/method change, or any corrective development[\s\S]{0,180}return the Pull Request to Draft[\s\S]{0,180}retest[\s\S]{0,140}re-review/i,
      /transient failed check, conflict, or blocking review[\s\S]{0,180}stops Merge[\s\S]{0,180}invalidates approval/i
    ], 'Merge approval invalidation');
  }
  const wordingElsewhereFixture = [
    '## Ownership',
    '',
    'Any new commit, base/title/method change, failing check, conflict, or blocking review invalidates the existing final approval.',
    '',
    '## Review and Merge',
    '',
    'Keep the Pull Request as Draft.'
  ].join('\n');
  assert.throws(
    () => expectText(topLevelSection(wordingElsewhereFixture, 'Review and Merge'), [/invalidates the existing final approval/i], 'scoped fixture'),
    /scoped fixture must include/
  );
});

test('SKILL entrypoint surfaces the exact-state Merge authorization invariant', () => {
  const skill = read('SKILL.md');
  expectText(skill, [
    /final authorization applies only to the displayed exact Pull Request, Base Branch, Head Branch, Head SHA, current checks, unresolved reviews, required reviews, mergeability, method, and expected Squash title/i,
    /Any new commit, base\/title\/method change, failing check, conflict, or blocking review invalidates it and requires a new approval/i,
    /normal pending-to-passing check after Ready does not invalidate approval/i,
    /return to Draft before corrective or new-state development/i,
    /After Ready for review, wait and re-check GitHub requirements/i,
    /only Squash Merge through the Pull Request/i
  ], 'SKILL Merge invariant');
  assert.doesNotMatch(skill, /base\/title\/method\/check\/conflict\/blocking-review change/i, 'normal pending-to-passing checks must not invalidate approval');
  const broadCheckChangeFixture = 'Any new commit, base/title/method/check/conflict/blocking-review change invalidates it and requires a new approval.';
  assert.doesNotMatch(broadCheckChangeFixture, /base\/title\/method change, failing check, conflict, or blocking review/i, 'the exact-state rule must reject broad check-change wording');
});

test('MIT terms and plain-language license explanation are complete', () => {
  const license = read('LICENSE');
  const concepts = read('references/github-concepts.md');
  expectText(license, [
    /MIT License/, /Copyright \(c\) 2026 LYNGMN/,
    /Permission is hereby granted, free of charge/, /The above copyright notice and this permission notice shall be included/,
    /THE SOFTWARE IS PROVIDED "AS IS"/
  ], 'LICENSE');
  expectText(concepts, [
    /^# Git and GitHub Concepts/m, /permission/i, /copyright.*license notice|notice.*copyright.*license/i, /no warranty/i
  ], 'concept reference');
});

test('internal Markdown links resolve to files in the package', () => {
  const markdownFiles = requiredFiles.filter((path) => ['.md'].includes(extname(path)));
  for (const path of markdownFiles) {
    const text = read(path);
    for (const match of text.matchAll(/\[[^\]]*\]\(([^)#]+)(?:#[^)]+)?\)/g)) {
      const target = match[1];
      if (/^(?:https?:|mailto:)/.test(target)) continue;
      assert.ok(existsSync(resolve(root, dirname(path), target)), `${path} has broken internal link: ${target}`);
    }
  }
});
