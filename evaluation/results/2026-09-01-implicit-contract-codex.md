# Codex Invocation Contract Regression — 2026-09-01

## Environment and boundary

- Runtime: Codex CLI 0.145.0.
- Source: the current work Branch copied into an isolated temporary Repository as `managing-github-workflows`.
- Safety: ephemeral execution, read-only sandbox, no Git or GitHub commands requested, and no GitHub mutation.
- Privacy: temporary paths were redacted from diagnostics; saved evidence contains no personal path, token, or email address.
- Scope: Codex was executed. Antigravity was not executed because its runtime was unavailable in this environment.

## RED findings

Before the response contract was strengthened, explicit discovery passed but implicit responses could omit the four progress fields, misspell the canonical name, or compress the Draft-to-Ready-to-Squash authorization rule. A Korean low-reasoning sample used mixed-language progress labels.

When the globally installed broad `managing-git-safely` skill remained visible, some implicit runs selected that overlapping skill before `managing-github-workflows`. This is a discovery collision: the target skill body cannot enforce its ownership rule before the runtime activates it.

## GREEN: isolated implicit invocation

The normal regression gate isolated the package under test from globally installed duplicate or overlapping Git workflow skills.

| Invocation | Reasoning | Language | Result |
| --- | --- | --- | --- |
| implicit | default | English | pass |
| implicit | default | Korean | pass |
| implicit | low | English | pass |
| implicit | low | Korean | pass |

Every run used the exact canonical skill name, emitted the four response fields in the reader's language with the next-step field last, rejected repeated `next` messages as Merge approval, listed the exact-state inputs, and preserved the Draft → Ready for review → unchanged requirements → Squash Merge sequence.

## GREEN: isolated explicit invocation

| Invocation | Reasoning | Language | Result |
| --- | --- | --- | --- |
| explicit | default | English | pass |
| explicit | default | Korean | pass |
| explicit | low | English | pass |
| explicit | low | Korean | pass |

The Korean runs used Korean-first technical terms with the English originals, including `초안(Draft)`, `검토 준비 완료(Ready for review)`, and `스쿼시 병합(Squash Merge)`.

## Overlap diagnostic

The runner keeps `--with-overlap` as a separate diagnostic. In the observed host, allowing the broad legacy `managing-git-safely` description to compete could select that skill and fail the target response contract before `managing-github-workflows` was activated. The default gate therefore isolates the target package. This distinction prevents a routing collision from being misreported as a failure inside an activated target skill.

## Verdict

The isolated public package passed eight actual Codex runs: explicit and implicit invocation, default and low reasoning, and English and Korean responses. The overlap diagnostic remains intentionally separate and may identify a host-level routing conflict. No GitHub mutation occurred.

## Post-review hardening — 2026-09-02

An independent review found that the first runner inherited its parent process environment and accepted progress labels that appeared more than once or inside another sentence. The runner now passes an explicit child-process allowlist, removes token, API-key, generic-secret, and Git-redirection variables, disables system and global Git configuration in the temporary repository, and sets model-generated shell environment inheritance to `none`. Authentication remains available through browser or system credential storage under the retained home directory; an environment API key is not forwarded.

The response validator now requires each localized progress field to appear exactly once, at the start of its own non-empty line, in the required order. The next-step field must still be the final non-empty line. A deterministic regression reproduces and rejects both the duplicate-label and inline-label false-pass cases.

After these changes, the complete real Codex matrix ran again. All eight combinations passed: explicit and implicit invocation, default and low reasoning, and English and Korean responses. The runner reported the read-only sandbox, the allowlisted environment boundary, and no GitHub mutation. The deterministic suite also passed all 53 tests, and `git diff --check` passed.
