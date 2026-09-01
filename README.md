[한국어 README](README.ko.md)

# Managing Git Safely

A public, tool-neutral skill for clear GitHub workflows. It explains each decision plainly for people new to GitHub while keeping the authorization, review, and recovery safeguards experienced workflows need.

## Purpose

Use this skill to select and safely complete only the GitHub stages a request needs. Issue → Branch → Commit → Push → Pull Request → Review → Merge is a reference map, not a mandatory sequence for every task. Explanation can remain read-only, Issue work can stop at Issue, local work can stop before Push, and Draft delivery can stop at a Draft Pull Request. Unless the user names one of those earlier endpoints, an implementation, fix, or change defaults to Complete delivery through verified Squash Merge into the actual default Branch.

The skill does not require a particular IDE button, Git client, or private command-line tool. A tool being installed or visible never grants permission to publish, merge, delete, or overwrite work.

## Task modes and completion

| Requested outcome | Selected path | Overall completion |
| --- | --- | --- |
| Explanation or status | Inspect and explain; do not run Git mutation stages. | Complete when the answer or review is delivered. |
| Issue only | Search → bilingual Issue draft or publication. | Complete at the agreed Issue endpoint. |
| Local implementation | Branch → Commit → local Review and verification. | Complete locally; nothing was Pushed. |
| Draft delivery | Branch → Commit → Push → Draft Pull Request → Review. | Complete only when Draft was the requested endpoint. |
| Implementation, fix, or change | Optional Issue → Branch → Commit → Push → Draft Pull Request → Review → final authorization → Ready for review → Squash Merge → verify actual default Branch. | Complete only after the merged result is verified. |
| Existing Branch or Pull Request | Resume its current valid stage and reuse earlier artifacts. | Complete at the requested endpoint. |

Ongoing reports choose the truthful label: `IN PROGRESS` while work continues, `ACTION REQUIRED` when user action is needed, or `BLOCKED` when work cannot continue. They also name both `Current stage / 현재 단계` and `Remaining stages / 남은 단계`. Use `COMPLETE` only after the requested non-Merge endpoint is delivered and verified, and use `MERGED` only after verified Merge on the actual default Branch. A Commit, Push, or Draft Pull Request is only a checkpoint when Merge is the requested result. See [Workflow modes](references/workflow-modes.md) and [Delivery contract](references/delivery-contract.md).

## Workflow and safety

Read [Writing guidelines](references/writing-guidelines.md) before drafting a README, Issue, or Pull Request. Select a task path with [Workflow modes](references/workflow-modes.md), then read only the selected stage details in [GitHub workflow](references/github-workflow.md). For remote publication and Merge, use [Delivery contract](references/delivery-contract.md). Read [GitHub authentication](references/github-authentication.md) before an authenticated GitHub CLI operation. Read [collaboration policy](references/collaboration-policy.md) before worktree, publication, review, merge, or cleanup decisions. For plain bilingual definitions, see [Git and GitHub Concepts](references/github-concepts.md).

The short rules are: search existing Issues/Pull Requests first, use one purpose per branch and commit, never direct Push to the repository's actual default Branch, whatever its name (`main` and `master` are examples), never use any Force Push variant, and never make unapproved public publication. Before public Push, scan all reachable Git history for author/committer metadata and use a GitHub-provided `noreply` email by default; general publication approval never authorizes exposing a personal email. Start Pull Requests as Drafts, re-review the new Head SHA after any change, obtain explicit final Merge approval, and use Squash Merge only. Deployment and branch deletion are separate decisions.

For contribution boundaries, read [CONTRIBUTING.md](CONTRIBUTING.md). Use one independently reviewable outcome per Pull Request, not one Pull Request per file or every feature label. Keep implementation, tests, documentation, and configuration together when they solve the same root cause; split outcomes that can be reviewed, verified, merged, and reverted independently.

## Titles and search

- Issue: `[Area] Problem or requested outcome`
- Branch: `<owner>/<type>/<purpose>`
- Commit and Pull Request: `type(scope): completed outcome`
- Squash Merge: the approved Pull Request title

Do not end titles with a period. For an Issue, use at most one square-bracket Area tag. Commit and Pull Request use one optional, lowercase scope in parentheses; omit scope when no honest shared scope exists, and never use filenames as a scope. The colon separates the lowercase `type(scope)` prefix from the outcome. Do not duplicate type, priority, or status already represented by Issue type, Label, or Draft state. Search first, use Labels for structured filtering, include real search terms in the title and opening summary, and add 3–7 useful `Search keywords` without keyword-stuffing. Avoid `Update`, `Changes`, `Fix issue`, and stacked tags such as `[BUG][HIGH][INSTALL]`. Examples: `[Documentation] Installation paths differ between supported runtimes`, `docs(workflow): standardize searchable GitHub titles`, and `docs(i18n): synchronize README guidance across languages`.

## Installation

### Ask your AI assistant

This is the easiest option across different LLMs and IDEs. Paste this prompt into the assistant that will use the skill:

```text
Install the public `managing-git-safely` skill from https://github.com/LYNGMN/github-workflow-skill. Detect this runtime's official skill directory and use its built-in skill installer if available. If the installer is unavailable and Git is installed, use the documented Git method. If Git is unavailable, use the Download ZIP method without Git. Do not overwrite an existing destination. Verify that `<install path>/SKILL.md` exists at the skill root, confirm whether the runtime discovered or activated it, and tell me whether a rescan or restart is needed.
```

The assistant should report four separate states: files installed, skill discovered or activated, GitHub authenticated when needed, and currently usable in that runtime.

Verification order: installed → discovered/activated → rescan/restart if needed.

### Install with Git

Keep this summary table when choosing a discovery destination. Replace no path placeholders: each copy-ready command already names its exact destination.

| Destination option | Applicable runtimes | When to choose | Required input / placeholder | Copy-ready example | Expected result | Collision/rescan/restart caution |
| --- | --- | --- | --- | --- | --- | --- |
| `~/.agents/skills/managing-git-safely` | Codex, Copilot CLI, Gemini CLI, Windsurf | Choose the shared agent-skills location. | Create `~/.agents/skills` if absent. | `mkdir -p ~/.agents/skills && git clone https://github.com/LYNGMN/github-workflow-skill.git ~/.agents/skills/managing-git-safely` | The runtime can discover `managing-git-safely` from the shared location. | If the destination already exists, inspect it instead of overwriting it; rescan or restart the runtime after installation. |
| `~/.claude/skills/managing-git-safely` | Claude Code | Choose Claude Code’s own skills location. | Create `~/.claude/skills` if absent. | `mkdir -p ~/.claude/skills && git clone https://github.com/LYNGMN/github-workflow-skill.git ~/.claude/skills/managing-git-safely` | Claude Code can discover the skill in its own location. | If the destination already exists, inspect it instead of overwriting it; rescan or restart Claude Code after installation. |
| `~/.cursor/skills/managing-git-safely` | Cursor | Choose Cursor’s own skills location. | Create `~/.cursor/skills` if absent. | `mkdir -p ~/.cursor/skills && git clone https://github.com/LYNGMN/github-workflow-skill.git ~/.cursor/skills/managing-git-safely` | Cursor can discover the skill in its own location. | If the destination already exists, inspect it instead of overwriting it; rescan or restart Cursor after installation. |
| `~/.gemini/antigravity/skills/managing-git-safely` | Antigravity | Choose Antigravity’s skills location. | Create `~/.gemini/antigravity/skills` if absent. | `mkdir -p ~/.gemini/antigravity/skills && git clone https://github.com/LYNGMN/github-workflow-skill.git ~/.gemini/antigravity/skills/managing-git-safely` | Antigravity can discover the skill in its own location. | If the destination already exists, inspect it instead of overwriting it; rescan or restart Antigravity after installation. |

Installed means the files are present. Activated/discovered means the runtime has found the skill. Authenticated means any GitHub account connection is signed in. Usable means this current runtime exposes the needed capability and the user has authorized the action; these are separate states.

### Install without Git

1. Open [the public repository](https://github.com/LYNGMN/github-workflow-skill) and choose **Code → Download ZIP**. This option works without Git.
2. Extract the ZIP and choose the destination from the table above. If the destination already exists, stop and inspect it; do not overwrite it.
3. Copy the extracted repository contents so the final file is exactly `<install path>/SKILL.md`. Avoid a nested repository folder such as `<install path>/github-workflow-skill-main/SKILL.md`, because many runtimes will not discover the skill there.
4. Rescan skills or restart the runtime. Ask it to list or identify `managing-git-safely`, then distinguish installed, discovered/activated, authenticated, and usable states.

## GitHub CLI authentication (optional)

GitHub CLI is not required when another authenticated GitHub capability can prove the same account and permission boundaries. Interactive GitHub CLI authentication is browser-only. When GitHub CLI is selected:

1. Confirm installation with `gh --version`.
2. Check the intended host and active account with `gh auth status -h github.com`. Detect whether `GH_TOKEN` or `GITHUB_TOKEN` is set without printing values; an environment token can override stored credentials. Never add `--show-token` or run `gh auth token` for this check.
3. If authentication is missing or invalid, explain the target account, account-wide permission impact, requested OAuth scopes, and credential-storage effect. After explicit approval, start browser login with `gh auth login -h github.com -p https -w`. Do not use a PAT, `--with-token`, or an environment-token fallback for interactive authentication.
4. Keep the CLI process running, wait for browser authorization, and resume the approved workflow automatically when login succeeds. Do not make the user return just to say “next.” Treat the one-time device code as sensitive and do not put it in documentation, an Issue, Pull Request, Commit, chat, or log.
5. Run `gh auth status -h github.com` again in the same execution environment that will perform the GitHub action. A sandbox and the host keyring may see different credentials.
6. Replace `OWNER/REPO`, then run `gh repo view OWNER/REPO --json nameWithOwner,visibility,viewerPermission`. This read-only check confirms the exact Repository and repository-level permission without using Push as a test. For organization repositories, also check OAuth App restrictions and SSO authorization.

Do not switch accounts, logout, refresh or replace credentials, or revoke access without explicit approval. GitHub authentication does not authorize Push or Merge. Push and Merge use separate approval gates from authentication: Start authorization and Final Merge authorization. See [GitHub authentication](references/github-authentication.md) for the complete decision contract.

## Usage examples

- GitHub CLI authentication recovery: distinguish installed, authenticated, authorized, and usable states; protect the device code; verify the account and scopes; then continue the intended GitHub action only when its Start authorization exists.
- Issue drafting: write a complete English Issue section and a complete Korean section, including the search record and `Open Questions` rather than guessed facts.
- Multiple files with one purpose: update `README.md` and `README.ko.md` for one shared documentation purpose, verify their semantic parity, and make one Commit after fresh tests.
- Draft publication: open a Draft Pull Request with the exact base, Head, Head SHA, checks, and the ten English and Korean fields ready for review.
- Approved Draft-to-Squash-Merge work: show the exact Pull Request state, obtain one explicit final authorization, move to Ready for review, wait for required reviews and checks, then use Squash Merge only after the state remains unchanged.

## Language synchronization

Update the README means update every maintained language README unless the requester names a language-specific exception. Keep semantic parity for commands, links, license facts, installation paths, examples, and safety rules; literal translation is not required. GitHub publication content is English by default, with Korean review copy below it unless another publication language is requested.

## License and verification

This package is available under the [MIT License](LICENSE). MIT allows use, copying, modification, distribution, sublicensing, and sale, while preserving the copyright and license notice; it provides the software without warranty.

Run `npm test` to verify the public package contracts. The GitHub workflow also runs the same check through [validate.yml](.github/workflows/validate.yml).
