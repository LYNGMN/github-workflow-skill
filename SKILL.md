---
name: managing-github-workflows
description: Use when a requested outcome involves a GitHub Issue, Branch, Commit, Push, Pull Request, Review, repository publication, GitHub CLI authentication, or Squash Merge.
license: MIT
compatibility: Requires an Agent Skills-compatible runtime. Git and GitHub tools are optional and depend on the requested action.
---

# Managing GitHub Workflows

Turn a GitHub request into the smallest safe, verifiable workflow. Explain technical terms with the English term first and the Korean term beside or below it. Tool availability does not grant permission to publish, Merge, delete, force-update, or clean work. GitHub authentication does not grant that permission either.

## Select the requested outcome

Read [Workflow modes](references/workflow-modes.md) and choose one endpoint before acting. The seven stages—Issue → Branch → Commit → Push → Pull Request → Review → Merge—are a reference map, not universally required steps.

- Explanation or status: inspect and explain without changing Git or GitHub state.
- Issue only: search existing work, then draft or publish the Issue at the authorized endpoint.
- Local implementation: stop after local Commit, Review, and verification.
- Draft delivery: stop after the verified Draft Pull Request when Draft is the requested endpoint.
- Complete delivery: unqualified requests to implement, fix, or change work default to **Complete delivery** through verified Squash Merge into the actual default Branch.
- Existing work: resume the existing Branch or Pull Request at its current valid stage. Do not recreate completed artifacts.

Report the overall state as `IN PROGRESS`, `ACTION REQUIRED`, `BLOCKED`, `COMPLETE`, or `MERGED`. At every checkpoint, state `Current stage / 현재 단계` and `Remaining stages / 남은 단계`. A Commit, Push, or Draft Pull Request is not overall completion when Merge is the requested endpoint.

## Load only the references needed now

- Before writing a README, Issue, or Pull Request, read [Writing guidelines](references/writing-guidelines.md).
- Read the target Repository's `CONTRIBUTING` file and templates before drafting an Issue or Pull Request. Use this package's [Contribution guidelines](CONTRIBUTING.md) only as a fallback.
- Before stage execution, read only the selected sections of [GitHub workflow](references/github-workflow.md).
- Before authentication, read [GitHub authentication](references/github-authentication.md).
- Before publication or Merge, read [Delivery contract](references/delivery-contract.md).
- Before worktree, authorship, publication, Review, Merge, cleanup, or recovery, read [Collaboration policy](references/collaboration-policy.md).
- For plain-language definitions, read [Git and GitHub Concepts](references/github-concepts.md).

## Keep scope independently reviewable

Search existing Issues and Pull Requests before drafting new work. Use one independently reviewable outcome per Pull Request, not one Pull Request per file or every feature label. Keep implementation, tests, documentation, and configuration together when they solve the same root cause. Split outcomes that can be reviewed, verified, merged, and reverted independently.

Issue records planned work; Pull Request describes the change actually present in its diff. Do not turn `Not included` into a list of future work. Create or link a separate Issue for a distinct future outcome. Use an optional `Scope note` only when naming a closely adjacent unchanged behavior prevents a concrete misunderstanding.

Write GitHub publication content in complete English first, followed by a Korean review copy that translates every required field and section completely. The Korean review copy must not use “same as above”, “위와 동일”, a summary, or a cross-reference. When a user asks to update “the README” without naming a language exception, identify every maintained language README and update all of them with semantic parity for commands, links, installation paths, license facts, examples, and safety rules. Before completing, compare commands, links, installation paths, license facts, examples, and safety rules across every maintained language variant. Record the per-category parity result in a Pull Request body, verification checklist, or test output as reportable verification evidence.

## Preserve authorization and privacy

Before an authenticated GitHub operation, distinguish these states: source exists, files installed, skill discovered, skill activated, GitHub authenticated, requested action authorized, and action currently usable. For GitHub CLI, use browser-only interactive authentication, protect device codes and tokens, verify the exact account and scopes in the same execution environment, and resume already authorized work after login. Authentication does not authorize Push or Merge.

Use one Start authorization for the stated delivery scope and one exact-state Final Merge authorization. Do not ask the user to say “next” after every already authorized stage. Final authorization applies only to the displayed exact Pull Request, Base Branch, Head Branch, Head SHA, current checks, unresolved reviews, required reviews, mergeability, method, and expected Squash title. Any new Commit, base/title/method change, failing check, conflict, or blocking review invalidates it and requires a new approval. Return to Draft before corrective or new-state development, then retest, re-review, and request approval for the new exact state. A normal pending-to-passing check after Ready does not invalidate approval.

Before the first Push to a PUBLIC remote, review all reachable Git history intended for publication, including author/committer identity and email metadata. Use a GitHub-provided `noreply` email as the default-safe public Commit identity. General publication approval does not authorize a personal or unapproved non-noreply email; stop and do not Push if one is reachable. Never print secrets or personal identifiers in reports.

Never direct Push to the Repository's actual default Branch, whatever its name; `main` and `master` are examples. Never use any Force Push variant. Start Pull Requests as Drafts. After exact-state approval, move the Draft to Ready for review. After Ready for review, wait and re-check GitHub requirements. Use only Squash Merge through the Pull Request when the exact state remains valid. Deployment and Branch deletion are separate decisions.

## Complete with evidence

Before claiming completion, verify the selected endpoint with fresh evidence. Report what changed, user impact, tests and Review, Git and GitHub state, unpublished or uncommitted work, and the next handoff. When facts are unknown, list them under `Open Questions`; do not guess.
