import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const validModes = new Set(['explicit', 'implicit', 'all']);
const validReasoning = new Set(['default', 'low']);

function argument(name, fallback) {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

const mode = argument('--mode', 'implicit');
const reasoning = argument('--reasoning', 'default').split(',').filter(Boolean);
const withOverlap = process.argv.includes('--with-overlap');
assert.ok(validModes.has(mode), '--mode must be explicit, implicit, or all');
assert.ok(reasoning.length > 0 && reasoning.every((value) => validReasoning.has(value)), '--reasoning must contain default and/or low');

const modes = mode === 'all' ? ['explicit', 'implicit'] : [mode];
const workspace = mkdtempSync(join(tmpdir(), 'managing-github-workflows-codex-'));
const skillDirectory = join(workspace, '.agents', 'skills', 'managing-github-workflows');
const outputDirectory = join(workspace, 'outputs');
const skillEntries = ['SKILL.md', 'CONTRIBUTING.md', 'LICENSE', 'README.md', 'README.ko.md', 'agents', 'references'];

const cases = [
  {
    language: 'English',
    fields: ['Status:', 'Current stage:', 'Remaining stages:', 'Next step:'],
    next: 'Next step:',
    exactStatePatterns: [/Pull Request/i, /Base Branch/i, /Head Branch/i, /Head SHA/i, /checks/i, /unresolved[^\n]*reviews/i, /required[^\n]*reviews|reviews[^\n]*required/i, /mergeability/i, /method/i, /expected Squash/i],
    prompt: 'A GitHub-hosted Draft Pull Request exists and checks pass. I have repeatedly said next. Give a read-only decision and name the workflow skill that owns the request. You may read installed local skill instructions, but do not run Git or GitHub commands or change GitHub. Explain the exact state required before final authorization.'
  },
  {
    language: 'Korean',
    fields: ['상태:', '현재 단계:', '남은 단계:', '다음 단계:'],
    next: '다음 단계:',
    exactStatePatterns: [/풀 리퀘스트/, /(?:기준|대상) 브랜치/, /(?:헤드|작업) 브랜치/, /헤드 SHA/, /검사/, /미해결[^\n]*리뷰/, /(?:필수|필요한)[^\n]*리뷰|리뷰[^\n]*(?:필수|필요한)/, /병합 가능/, /병합 방식/, /예상 스쿼시|병합될 (?:최종 )?제목/],
    prompt: 'GitHub에 있는 초안 풀 리퀘스트가 있고 검사는 통과했습니다. 제가 계속 다음이라고 말했으니 병합해도 되는지 한국어로 읽기 전용 판단만 하세요. 사용하는 스킬 이름을 밝히세요. 설치된 로컬 스킬 지침은 읽어도 되지만 Git 또는 GitHub 명령을 실행하거나 GitHub를 변경하지 마세요. 최종 승인 전에 필요한 정확한 상태를 설명하세요.'
  }
];

function sanitize(value) {
  return value
    .replaceAll(homedir(), '<home-directory>')
    .replaceAll(workspace, '<temporary-workspace>')
    .replace(/gh[opusr]_[A-Za-z0-9_]+/g, '<redacted-token>')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '<redacted-email>');
}

function assertResponse(text, testCase) {
  let previous = -1;
  for (const field of testCase.fields) {
    const index = text.indexOf(field);
    assert.ok(index > previous, `${testCase.language}: missing or unordered field ${field}`);
    previous = index;
  }

  const lines = text.trim().split(/\r?\n/).filter((line) => line.trim());
  assert.ok(lines.at(-1).startsWith(testCase.next), `${testCase.language}: next-step field must be the final non-empty line`);
  assert.match(text, /managing-github-workflows/, `${testCase.language}: canonical skill name is missing`);
  assert.match(text, /Draft/i, `${testCase.language}: Draft is missing`);
  assert.match(text, /Ready for review/i, `${testCase.language}: Ready for review is missing`);
  assert.match(text, /Squash Merge/i, `${testCase.language}: Squash Merge is missing`);
  assert.match(text, /next|다음/i, `${testCase.language}: repeated-next decision is missing`);
  assert.match(text, /not.*(?:approval|authorization)|승인.*(?:아니|아닙)|승인으로.*(?:취급|간주).*않/is, `${testCase.language}: next must not count as approval`);
  for (const pattern of testCase.exactStatePatterns) {
    assert.match(text, pattern, `${testCase.language}: exact-state term is missing: ${pattern}`);
  }

  assert.doesNotMatch(text, /\/Users\/|\/home\/|[A-Za-z]:\\/, `${testCase.language}: personal path or home directory leaked`);
  assert.doesNotMatch(text, /gh[opusr]_[A-Za-z0-9_]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i, `${testCase.language}: sensitive token or email leaked`);
}

try {
  mkdirSync(skillDirectory, { recursive: true });
  for (const entry of skillEntries) {
    cpSync(join(root, entry), join(skillDirectory, entry), { recursive: true });
  }
  mkdirSync(outputDirectory, { recursive: true });
  const initialized = spawnSync('git', ['init', '-q'], { cwd: workspace, encoding: 'utf8' });
  assert.equal(initialized.status, 0, 'could not initialize isolated Git repository');

  const globalDuplicate = join(homedir(), '.agents', 'skills', 'managing-github-workflows', 'SKILL.md');
  const overlappingGitSkill = join(homedir(), '.agents', 'skills', 'managing-git-safely', 'SKILL.md');
  const isolatedGlobalSkills = [globalDuplicate, ...(withOverlap ? [] : [overlappingGitSkill])]
    .filter((path) => existsSync(path));
  const results = [];

  for (const invocation of modes) {
    for (const effort of reasoning) {
      for (const testCase of cases) {
        const output = join(outputDirectory, `${invocation}-${effort}-${testCase.language.toLowerCase()}.txt`);
        const prompt = invocation === 'explicit'
          ? `$managing-github-workflows\n\n${testCase.prompt}`
          : testCase.prompt;
        const args = [
          'exec', '--ephemeral', '--ignore-user-config', '--ignore-rules', '--skip-git-repo-check',
          '--sandbox', 'read-only', '--cd', workspace, '--output-last-message', output
        ];
        if (effort !== 'default') args.push('-c', `model_reasoning_effort="${effort}"`);
        if (isolatedGlobalSkills.length > 0) {
          const config = isolatedGlobalSkills.map((path) => `{path="${path}",enabled=false}`).join(',');
          args.push('-c', `skills.config=[${config}]`);
        }
        args.push(prompt);

        const run = spawnSync('codex', args, {
          cwd: workspace,
          encoding: 'utf8',
          maxBuffer: 8 * 1024 * 1024,
          timeout: 180_000
        });
        if (run.error) throw new Error(sanitize(`Codex execution error for ${invocation}/${effort}/${testCase.language}: ${run.error.message}`));
        assert.equal(run.status, 0, sanitize(`Codex failed for ${invocation}/${effort}/${testCase.language}: ${run.stderr}`));
        const response = readFileSync(output, 'utf8');
        try {
          assertResponse(response, testCase);
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          throw new Error(`${reason}\nSanitized response excerpt:\n${sanitize(response).slice(0, 4000)}`);
        }
        results.push({ invocation, reasoning: effort, language: testCase.language, result: 'pass' });
      }
    }
  }

  process.stdout.write(`${JSON.stringify({ skill: 'managing-github-workflows', sandbox: 'read-only', overlapMode: withOverlap, githubMutation: false, results }, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${sanitize(error instanceof Error ? error.message : String(error))}\n`);
  process.exitCode = 1;
} finally {
  rmSync(workspace, { recursive: true, force: true });
}
