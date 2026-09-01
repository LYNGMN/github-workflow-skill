# GitHub Workflow

This document defines the seven possible GitHub stages; it does not require every task to execute every stage. First select the smallest path in [Workflow modes](workflow-modes.md), reuse valid existing artifacts, and read only the selected stage sections. For remote publication or Merge, also follow [Delivery contract](delivery-contract.md).

For README, Issue, and Pull Request prose, first read [Writing guidelines](writing-guidelines.md). Before Issue or Pull Request work, read the target Repository's contribution guidelines; use this package's [CONTRIBUTING](../CONTRIBUTING.md) only as the general fallback. Publication defaults: write the English publication copy for an Issue or Pull Request first, then place a complete Korean review copy below it. The Korean review copy must translate every required field and section completely. It must not use “same as above”, “위와 동일”, a summary, or a cross-reference to the English section. Publish English unless the user requests another language. Search existing Issues/Pull Requests first; use Labels for structured filtering and put unknown facts under `Open Questions`.

## GitHub CLI Authentication

Read [GitHub authentication](github-authentication.md) when GitHub CLI is the selected capability. This is a preflight for authenticated GitHub actions, not an eighth workflow stage and not a publication or Merge approval.

### English

**Required input:** CLI installation, target host and account, authentication status, requested OAuth scopes, intended action, and execution environment.

**Actions:** follow the reference. Protect secrets, use browser-only login, keep the CLI active, verify the same environment, and resume automatically. Keep action approval separate.

**Exit criteria:** the account and scopes work in the same environment, no secret was exposed, and the GitHub action retains its own approval gate.

### 한국어

**필수 입력:** CLI 설치 여부, 대상 host와 계정, 인증 상태, 요청 OAuth 권한 범위, 의도한 행동, 실행 환경을 확인합니다.

**작업:** 참고문서를 따릅니다. 민감 정보를 보호하고 브라우저 전용 로그인과 CLI 프로세스를 유지하며, 같은 환경을 확인한 뒤 자동으로 이어갑니다. 행동 승인은 분리합니다.

**완료 기준:** 같은 환경에서 계정과 권한 범위가 작동하고, 민감 정보를 노출하지 않았으며, GitHub 행동의 별도 승인 게이트가 유지됩니다.

## Issue

### English
**Required input:** title `[Area] Problem or requested outcome`; Summary, Context, Reproduction, Actual Result, Expected Result, Impact, Priority, Labels, Assignee, Acceptance Criteria, Evidence, Search keywords, and Open Questions.

**Actions:** read the target Repository's contribution guidelines and search existing items. Use one problem or requested outcome per Issue; split independently deliverable outcomes into separate Issues, while an umbrella Issue may link sub-issues. Use at most one pair of square brackets for an Issue Area tag. Put real product, component, symptom/outcome, and useful exact error terms in the title and opening Summary. Add 3–7 useful Search keywords. Record the query, repository/scope searched, and result status/count in Existing search results for every search, including no matches. When matches or near-duplicates exist, attach related Issue/PR URLs. Never translate impact into an unknown priority code or scale: use the confirmed repository taxonomy, or set Priority to `Needs confirmation`, state the observed impact, and put the taxonomy under Open Questions. Draft an English publication section followed by a complete Korean review section. Creating an Issue does not create a Branch; wait until implementation begins.

**Exit criteria:** scope and Acceptance Criteria are clear, and the assignee/worker confirms understanding.

### 한국어
**필수 입력:** `[Area] Problem or requested outcome` 형식의 제목과 Summary, Context, Reproduction, Actual Result, Expected Result, Impact, Priority, Labels, Assignee, Acceptance Criteria, Evidence, Search keywords, Open Questions를 준비합니다.

**작업:** 대상 Repository의 기여 지침을 읽고 기존 이슈를 먼저 검색합니다. Issue 하나에는 문제 또는 요청 결과 하나만 기록하고, 독립적으로 완료할 수 있는 결과는 별도 Issue로 나눕니다. Umbrella Issue는 sub-issues를 연결할 수 있습니다. Issue의 Area 태그는 대괄호 한 쌍만 사용하고, 제목과 첫 요약에 제품·구성 요소·증상 또는 원하는 결과·필요하면 정확한 오류 문구를 넣습니다. Search keywords는 3–7개만 고릅니다. 검색 결과가 없더라도 모든 검색의 검색어, 검색한 리포지터리/범위, 결과 상태/개수를 Existing search results에 기록합니다. 일치하거나 거의 중복된 항목이 있으면 관련 Issue/PR URL도 붙입니다. 확인되지 않은 우선순위 코드나 단계로 영향도를 바꾸지 않습니다. 저장소의 확인된 taxonomy를 쓰고, 없다면 관찰한 영향도를 적은 뒤 Priority는 `Needs confirmation`으로 두며 taxonomy는 Open Questions에 적습니다. 영어 게시 섹션 다음에 완전한 한국어 검토 섹션을 작성하며, 한국어 검토본은 모든 필수 항목과 섹션을 빠짐없이 번역하고 “위와 동일”, 요약, 영어 섹션 참조로 대신하지 않습니다. Issue 작성만으로 Branch를 만들지 않고 구현을 시작할 때까지 기다립니다.

**완료 기준:** 범위와 Acceptance Criteria가 분명하며 담당자 또는 작업자가 이해했다고 확인합니다.

## Branch

### English
**Required input:** linked Issue when applicable or the reason an Issue is not required, base Branch, start Commit, purpose, and owner of current uncommitted changes.

**Actions:** create the Branch only when implementation begins. Use `<owner>/<type>/<purpose>` with lowercase owner/type and one purpose. Keep one author per Branch/Worktree; record the Issue relationship, start Commit, author, and purpose.

**Exit criteria:** Issue relationship or no-Issue rationale, start Commit, author, and purpose are recorded.

### 한국어
**필수 입력:** 해당할 때 연결된 Issue 또는 Issue가 필요하지 않은 이유, 기준 Branch, 시작 Commit, 작업 목적, 현재 미커밋 변경의 소유자를 확인합니다.

**작업:** 구현을 시작할 때만 Branch를 만듭니다. `<owner>/<type>/<purpose>` 형식을 쓰고 owner와 type은 소문자로 적습니다. 하나의 Branch/Worktree에는 한 명의 작성자만 두며, Issue 관계·시작 Commit·작성자·목적을 기록합니다.

**완료 기준:** Issue 관계 또는 Issue가 필요하지 않은 이유, 시작 Commit, 작성자, 목적이 모두 기록되어 있습니다.

## Commit

### English
**Required input:** intended one-purpose change, staged files, new files, diff, sensitive-data review, fresh test evidence, and linked Issue.

**Actions:** inspect every staged and new file. Make one recoverable Commit using English `type(scope): completed outcome`; use one optional lowercase scope for an honest shared feature or domain, omit the scope when no honest shared scope exists, and never list filenames as scope. The colon separates the structured prefix from the concise outcome. The body records why, verification, and related Issue. Multiple files with one purpose may share one Commit; multiple purposes require separate Commits and may require separate Pull Requests.

**Exit criteria:** a recoverable single-purpose checkpoint exists with fresh evidence.

### 한국어
**필수 입력:** 한 가지 목적의 변경, stage에 올린 파일과 새 파일, diff, 민감 정보 점검, 새 테스트 증거, 연결된 Issue를 준비합니다.

**작업:** stage에 올린 파일과 새 파일을 모두 확인합니다. `type(scope): completed outcome` 형식의 영어 Commit을 만들고, 정직하게 공유하는 기능·도메인 범위가 있을 때만 소문자 scope 하나를 씁니다. 공통 범위가 없으면 scope를 생략하며 파일 이름 목록을 scope로 쓰지 않습니다. 콜론은 구조화된 접두사와 간결한 결과를 구분합니다. 본문에는 이유, 검증, 관련 Issue를 기록합니다. 같은 한 가지 목적에 기여하는 여러 파일은 하나의 Commit에 함께 담을 수 있습니다. 목적이 여러 개면 Commit을 나누고, 필요하면 Pull Request도 나눕니다.

**완료 기준:** 새 검증 증거가 있는, 복구 가능한 단일 목적 Commit이 만들어졌습니다.

## Push

### English
**Required input:** remote identity, PUBLIC/PRIVATE visibility, approval scope, current Branch, included files, intended local Commit, and whether the target is the actual default Branch.

**Actions:** for a first Push or new remote, show target, visibility, Branch, and included files and obtain explicit approval. Public remotes additionally need explicit public approval and full public-file/secret review. Before the first Push to a PUBLIC remote, review all reachable Git history intended for publication, including author/committer identity and email metadata. Use a GitHub-provided `noreply` email as the default-safe public Commit identity. General publication approval does not authorize exposing a personal or non-noreply email. An explicitly pre-approved organizational or public alias is the only exception. If any reachable metadata contains a personal or unapproved non-noreply email, stop and do not Push. If it was already published, keep publication stopped and report the affected Commit count and remediation choices without repeating the email address. Never direct Push to the repository's actual default Branch, whatever its name; `main` and `master` are examples. Never use any Force Push variant.

**Exit criteria:** remote Branch SHA equals the intended local Commit.

### 한국어
**필수 입력:** remote의 정체와 PUBLIC/PRIVATE 공개 범위, 승인 범위, 현재 Branch, 포함 파일, 보낼 로컬 Commit, 대상이 실제 기본 브랜치인지 확인합니다.

**작업:** 첫 Push 또는 새 remote라면 대상·공개 범위·Branch·포함 파일을 보여 주고 명시적 승인을 받습니다. 공개 remote에는 별도의 공개 승인과 전체 공개 파일·비밀값 점검이 필요합니다. PUBLIC remote에 처음 Push하기 전에는 공개될 모든 도달 가능한 Git 이력을 검토하고 author/committer 신원과 이메일 메타데이터를 확인합니다. GitHub가 제공하는 `noreply` 이메일을 공개 Commit 신원의 기본 안전값으로 사용합니다. 일반적인 공개 승인은 개인 또는 non-noreply 이메일 공개를 승인하지 않습니다. 사전에 명시적으로 승인된 조직용·공개용 별칭만 예외입니다. 도달 가능한 메타데이터에 개인 이메일이나 승인되지 않은 non-noreply 이메일이 있으면 중단하고 Push하지 않습니다. 이미 공개되었다면 새 게시를 계속 중단하고 영향받은 Commit 수와 복구 선택지만 보고하며, 이메일 주소를 반복하거나 출력하지 않습니다. 이름이 무엇이든 저장소의 실제 기본 브랜치에는 direct Push하지 않습니다. `main`과 `master`는 예시일 뿐입니다. 어떤 Force Push도 사용하지 않습니다.

**완료 기준:** remote Branch의 SHA가 의도한 로컬 Commit과 같습니다.

## Pull Request

### English
**Required input:** base and Head Branches, Head SHA, related Issue or explicit no-Issue rationale, verification evidence, current diff, risk/recovery information, and screenshots/evidence when relevant.

**Actions:** read the target Repository's contribution guidelines and always start a Draft Pull Request. Use one independently reviewable outcome per Pull Request. This is not one Pull Request per file or every feature label: implementation, tests, documentation, and configuration may stay together when they solve the same root cause and complete one outcome. Split work that can be reviewed, verified, merged, and reverted independently. Use `type(scope): completed outcome` as the title: lowercase type/scope, one optional shared scope, no scope when none is honest, a colon before a concise outcome, and no final period. The body uses `## English` then `## 한국어`, with complete matching Purpose, Related Issue / Pull Request, Changes, User Impact, Verification, Scope Note (optional), Risk/Recovery (when relevant), Screenshots/Evidence (when relevant), Search keywords, and Draft blockers fields. Use `Closes #N` only when Merge fully completes the Issue; use `Refs #N` for partial work, dependencies, or deliberately split scope that must remain open.

**Scope classification:** apply these rules in order so one item has one place.

1. `Changes` lists only work in the reviewed diff that serves the stated Purpose.
2. `Draft blockers` lists only work required before this Pull Request can become Ready for review. When it is not `None`, keep the Pull Request in Draft. It does not contain a later, separate objective.
3. Independently deliverable future work gets its own Issue. Link it under `Related Issue / Pull Request` only when the relationship explains a dependency or deliberate split. Do not put future work in `Scope Note`.
4. `Scope Note` is optional. Keep it only when adjacent behavior could reasonably be misunderstood as changed; it defines the current boundary and is not a backlog or future promise.
5. Omit unrelated concurrent work. A shared conversation, session, or prompt does not by itself make work relevant to a Pull Request.

**Exit criteria:** Base/Head Branch, Head SHA, checks, and Draft URL are verified.

**State learning:**

- `Draft Pull Request` — State: work is open and not ready to merge.
  Allowed action: draft, test, and request review preparation without Merge.
  Next: show the exact Pull Request, Base Branch, Head Branch, Head SHA, current checks, unresolved reviews, required reviews, mergeability, method, and expected Squash title before final authorization.

- `Ready for review` — State: final authorization has been recorded for that exact state.
  Allowed action: wait for required reviews and checks.
  Next: re-check the unchanged state before Merge.

- `Review` — State: requirements and risk are evaluated on the exact Head SHA.
  Allowed action: approve only after blockers are resolved.
  Next: stop and return to Draft if the state changes.

- `Merge` — State: GitHub requirements and the exact approval are valid.
  Allowed action: merge through the Pull Request.
  Next: verify the resulting state.

- `Squash Merge` — State: the approved merge method.
  Allowed action: create one final Commit through the Pull Request.
  Next: verify the default-branch Squash SHA and linked Issue closure.

### 한국어
**필수 입력:** 기준·Head Branch, Head SHA, 관련 Issue 또는 Issue가 필요하지 않은 이유, 검증 증거, 현재 diff, 위험·복구 정보, 필요 시 스크린샷 또는 증거를 준비합니다.

**작업:** 대상 Repository의 기여 지침을 읽고 Pull Request는 항상 Draft로 시작합니다. 독립적으로 Review할 수 있는 결과마다 Pull Request 하나를 사용합니다. 파일마다 또는 기능이라는 이름마다 무조건 나누는 규칙이 아닙니다. 같은 근본 원인을 해결하고 결과 하나를 완성하는 구현, 테스트, 문서, 설정은 함께 둘 수 있으며, 독립적으로 Review·검증·Merge·되돌릴 수 있는 작업은 나눕니다. 제목은 소문자 type과 선택적 공통 scope 하나를 쓰는 `type(scope): completed outcome` 형식입니다. 공통 scope가 정직하지 않으면 생략하고, 콜론 뒤에 간결한 결과를 쓰며 마지막에 마침표를 붙이지 않습니다. 본문은 `## English` 다음 `## 한국어` 순서로 두고 Purpose, Related Issue / Pull Request, Changes, User Impact, Verification, Scope Note (optional), Risk/Recovery (when relevant), Screenshots/Evidence (when relevant), Search keywords, Draft blockers 열 가지 필드를 빠짐없이 대응시킵니다. Merge가 Issue를 완전히 완료할 때만 `Closes #N`을 사용하고, Issue를 열어 둬야 하는 부분 구현·의존 관계·의도적인 범위 분리에는 `Refs #N`을 사용합니다.

**범위 분류:** 한 항목이 한 곳에만 들어가도록 다음 규칙을 순서대로 적용합니다.

1. `변경 내용`에는 Review한 diff에 존재하고 명시한 목적에 기여하는 작업만 적습니다.
2. `Draft 해제 전 남은 작업`에는 이 Pull Request를 Ready for review로 전환하기 전에 반드시 완료해야 하는 작업만 적습니다. `없음`이 아니면 Pull Request를 Draft로 유지합니다. 나중에 별도로 진행할 목적은 여기에 적지 않습니다.
3. 독립적으로 완료할 향후 작업은 자체 Issue로 추적합니다. 의존 관계나 의도적인 범위 분리를 설명할 필요가 있을 때만 `관련 Issue / Pull Request`에 링크합니다. 향후 작업을 `범위 참고`에 적지 않습니다.
4. `범위 참고`는 선택 사항입니다. Review하는 사람이 인접 동작의 변경 여부를 합리적으로 오해할 수 있을 때만 남기며, 현재 경계를 설명할 뿐 backlog나 향후 구현 약속이 아닙니다.
5. 동시에 진행했더라도 현재 Pull Request와 관련이 없는 작업은 적지 않습니다. 같은 대화, 작업 세션 또는 prompt에서 요청했다는 사실만으로 관련 작업이 되지는 않습니다.

**완료 기준:** Base/Head Branch, Head SHA, 검사 결과, Draft URL을 확인했습니다.

**상태 학습:**

- `Draft Pull Request`(드래프트 풀 리퀘스트) — 상태: 작업은 열려 있지만 Merge 준비가 되지 않았습니다.
  허용 행동: Draft 작성, 테스트, Review 준비 요청을 할 수 있지만 Merge는 할 수 없습니다.
  다음: 최종 승인을 받기 전에 정확한 Pull Request, Base Branch, Head Branch, Head SHA, 현재 checks, 미해결 reviews, 필수 reviews, 병합 가능 여부, 병합 방식, 예상 Squash title을 보여 줍니다.

- `Ready for review`(검토 준비 완료) — 상태: 그 정확한 상태에 대한 최종 승인이 기록되었습니다.
  허용 행동: 필요한 reviews와 checks를 기다립니다.
  다음: Merge 전에 상태가 바뀌지 않았는지 다시 확인합니다.

- `Review`(리뷰) — 상태: 정확한 Head SHA에서 요구사항과 위험을 평가합니다.
  허용 행동: 막는 문제가 해결된 뒤에만 승인합니다.
  다음: 상태가 바뀌면 멈추고 Draft로 돌아갑니다.

- `Merge`(병합) — 상태: GitHub 요구사항과 정확한 승인이 유효합니다.
  허용 행동: Pull Request를 통해 병합합니다.
  다음: 결과 상태를 확인합니다.

- `Squash Merge`(스쿼시 병합) — 상태: 승인된 병합 방식입니다.
  허용 행동: Pull Request를 통해 최종 Commit 하나를 만듭니다.
  다음: default-branch Squash SHA와 연결된 Issue 종료를 확인합니다.

## Review

### English
**Required input:** exact Head SHA, Issue Acceptance Criteria, requirements, scope, fresh checks, and known risk.

**Actions:** pass 1 checks requirements, Acceptance Criteria, and scope. Pass 2 checks quality, security, tests, and operational risk. After Ready for review, re-check that Head, base, title, and method are unchanged; then re-check reviews, checks, conflicts, mergeability, and that Squash Merge is enabled. Wait for required Code Owner reviews and checks. After any change, do not reuse earlier approval: rerun tests on the new Head SHA and review it again.

**Exit criteria:** no blocking unresolved findings remain and checks pass on the exact Head SHA.

### 한국어
**필수 입력:** 정확한 Head SHA, Issue Acceptance Criteria, 요구사항, 범위, 새 검사 결과, 알려진 위험을 준비합니다.

**작업:** 1차에서는 요구사항·Acceptance Criteria·범위를 확인합니다. 2차에서는 품질·보안·테스트·운영 위험을 확인합니다. Ready for review 뒤에는 Head, base, title, method가 바뀌지 않았는지 다시 확인하고 reviews, checks, conflicts, mergeability, Squash Merge 사용 가능 여부를 확인합니다. 필요한 Code Owner reviews와 checks를 기다립니다. 변경이 생기면 이전 승인을 재사용하지 말고 테스트를 다시 실행해 새 Head SHA를 리뷰합니다.

**완료 기준:** 막는 미해결 항목이 없고, 정확한 Head SHA에서 모든 검사가 통과합니다.

## Merge

### English
**Required input:** exact Pull Request, Base Branch, Head Branch, reviewed Head SHA, current checks that are pending or passing with none failing, unresolved reviews, required reviews, mergeability, method, expected Squash title, and one explicit final Merge approval for that exact state.

**Actions:** keep the Pull Request Draft until final authorization. Before approval, show the exact Pull Request, Base Branch, Head Branch, Head SHA, current checks, unresolved reviews, required reviews, mergeability, method, and expected Squash title. One explicit final approval for that exact state authorizes the Ready for review transition and Squash Merge only after all GitHub requirements pass. A normal pending-to-passing check transition does not invalidate approval; wait and re-check without asking again. Any new commit, base/title/method change, failing check, conflict, or blocking review stops Merge, invalidates the existing final approval, and requires a new exact-state final approval after resolution. A new commit, base/title/method change, or any corrective development must return the Pull Request to Draft before retest and re-review. A transient failed check, conflict, or blocking review still stops Merge and invalidates approval; if correction resumes, the Pull Request must return to Draft before retest and re-review. Allow only Squash Merge through the Pull Request. When all requirements pass and the exact state is unchanged, use `gh pr merge <PR> --squash --match-head-commit <SHA> --subject "<approved Pull Request title>"`. Pass the Pull Request, Head SHA, and approved title as separate CLI arguments, never use `--admin`, and do not rewrite or Force Push merely to combine branch commits. After Merge, verify the default-branch Squash SHA, Pull Request merged state, and linked Issue closure. Deployment is separate, and Branch deletion remains separately authorized.

**Exit criteria:** the approved Squash Merge is verified. Deployment and Branch deletion remain separate decisions.

### 한국어
**필수 입력:** 정확한 Pull Request, Base Branch, Head Branch, 리뷰한 Head SHA, 실패 없이 pending 또는 passing인 현재 checks, 미해결 reviews, 필수 reviews, 병합 가능 여부, 병합 방식, 예상 Squash title, 그 정확한 상태에 대한 명시적인 최종 Merge 승인을 준비합니다.

**작업:** Pull Request는 최종 승인 전까지 Draft로 둡니다. 승인 전에는 정확한 Pull Request, Base Branch, Head Branch, Head SHA, 현재 checks, 미해결 reviews, 필수 reviews, 병합 가능 여부, 병합 방식, 예상 Squash title을 보여 줍니다. 그 정확한 상태에 대한 최종 명시 승인 한 번은 Ready for review 전환과 모든 GitHub 요구사항 통과 뒤 Squash Merge를 허용합니다. pending 검사가 passing으로 정상 전환되는 것은 승인을 무효화하지 않으므로 추가 승인 없이 기다리고 다시 확인합니다. 새 Commit, base/title/method 변경, failing check, conflict, blocking review가 하나라도 생기면 Merge를 멈추고 기존 최종 승인을 무효화하며, 해결 뒤에는 새 정확한 상태의 최종 승인이 필요합니다. 새 Commit, base/title/method 변경 또는 corrective development가 있으면 retest와 re-review 전에 Pull Request를 Draft로 되돌려야 합니다. 일시적인 failed check, conflict, blocking review도 Merge를 멈추고 승인을 무효화합니다. 수정 작업을 다시 시작하면 retest와 re-review 전에 Pull Request를 Draft로 되돌려야 합니다. Pull Request를 통한 Squash Merge만 허용합니다. 모든 요구사항이 통과하고 정확한 상태가 그대로면 `gh pr merge <PR> --squash --match-head-commit <SHA> --subject "<approved Pull Request title>"`을 사용합니다. Pull Request, Head SHA, 승인된 제목은 각각 별도의 CLI 인자로 전달하고 `--admin`은 절대 사용하지 않습니다. branch commits를 합치려고 rewrite하거나 Force Push하지 않습니다. Merge 뒤에는 default-branch Squash SHA, Pull Request merged state, 연결된 Issue 종료를 확인합니다. 배포와 Branch 삭제는 별도의 승인이 필요합니다.

**완료 기준:** 승인된 Squash Merge를 확인했고, 배포와 Branch 삭제 결정은 별도로 기록했습니다.

## Title rules

### English

For an Issue, use at most one pair of square brackets for a stable Area/component tag. Parentheses are for one optional scope in Commit and Pull Request titles; omit the scope when no honest shared scope exists. Scope describes a feature, domain, or shared purpose; it is not a list of filenames. A colon separates the structured prefix from a concise outcome. Use lowercase `type` and `scope`. Do not duplicate type, priority, or status already represented by Issue type, Label, or Draft state. Avoid `Update`, `Changes`, `Fix issue`, `[BUG][HIGH][INSTALL]`, and titles that end with a period.

Examples beyond installation: `[Documentation] Installation paths differ between supported runtimes`; `docs(workflow): standardize searchable GitHub titles`; `docs(i18n): synchronize README guidance across languages`; `test(contracts): verify bilingual README synchronization`.

### 한국어

Issue에는 안정적인 Area/component 태그로 대괄호 한 쌍만 사용합니다. Commit과 Pull Request 제목의 괄호는 선택적 scope 하나에만 쓰며, 정직한 공통 범위가 없으면 생략합니다. scope는 feature, domain, shared purpose를 설명하며 파일 이름 목록이 아닙니다. 콜론은 구조화된 접두사와 간결한 결과를 구분합니다. `type`과 `scope`는 소문자로 씁니다. Issue type, Label, Draft state에 이미 있는 type, priority, status를 제목에 반복하지 않습니다. `Update`, `Changes`, `Fix issue`, `[BUG][HIGH][INSTALL]`, 마침표로 끝나는 제목은 피합니다.

설치 외 예시: `[Documentation] Installation paths differ between supported runtimes`, `docs(workflow): standardize searchable GitHub titles`, `docs(i18n): synchronize README guidance across languages`, `test(contracts): verify bilingual README synchronization`.
