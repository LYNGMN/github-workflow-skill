# Contributing to Managing Git Safely

## English

### Start with the target Repository rules

Read the target Repository's `CONTRIBUTING` file before preparing an Issue or Pull Request. Repository-specific rules override this general skill. Also inspect the available Issue Forms, Pull Request template, labels, required checks, Code Owners, and default Branch without assuming that every Repository uses the same process.

### Decide whether an Issue is needed

Search existing Issues and Pull Requests first. Use one problem or requested outcome per Issue. Create an Issue before implementation when a new feature, behavior change, breaking change, risky migration, or unclear requirement needs agreement or traceability. A small, self-contained documentation, test, or typo correction may go directly to a Pull Request when the target Repository permits it.

An umbrella Issue may describe a larger program, but independently deliverable outcomes belong in sub-issues. Creating an Issue does not create a Branch. Create a Branch only when implementation begins.

### Keep one independently reviewable outcome per Pull Request

Use one independently reviewable outcome per Pull Request. This is not a rule requiring one Pull Request per file or every feature label. Files are implementation details; the review boundary is the outcome.

Work that solves the same root cause—code or implementation, tests, documentation, and configuration necessary to complete one outcome—belongs in one Pull Request. When work can be reviewed, verified, merged, and reverted independently, put it in a separate Issue and separate Pull Request.

Use these questions in order:

| Question | Keep together when | Separate when |
| --- | --- | --- |
| Outcome | The changes satisfy one Acceptance Criteria set. | The changes satisfy different user or operational outcomes. |
| Root cause | The changes address the same root cause. | The changes address unrelated causes or components. |
| Review and verification | One reviewer can evaluate the change with one coherent test plan. | Different expertise, evidence, or approval is required. |
| Merge and recovery | One part would be incomplete or unsafe without the other. | Either part can be merged and reverted independently. |
| Schedule and risk | The changes share rollout timing and risk. | They have different priority, release timing, or operational risk. |

Prefer one primary Issue per Pull Request. More than one Issue may be completed by one Pull Request only when the Issues share the same root cause and cannot be separated without producing an incomplete or unsafe change. One umbrella Issue may intentionally receive several Pull Requests; each Pull Request states which part it completes.

### Put future work in Issues, not the current Pull Request

Record an independently deliverable future work item in a separate Issue. Link it from `Related Issue / Pull Request` only when it explains a dependency or deliberate scope split. Do not place future work in the current Pull Request's `Scope Note`.

Use `Scope Note` only when adjacent behavior could reasonably be misunderstood as changed. Delete the optional section when no such ambiguity exists. A Scope Note is a present boundary, not a backlog, promise, or list of everything discussed in the same conversation.

### Branches and Commits

Create the purpose Branch when implementation begins, using `<owner>/<type>/<purpose>`. Keep one author per Branch and Worktree. A Commit contains one recoverable intention, while a Pull Request may contain several working Commits that contribute to the same reviewable outcome. Do not rewrite or Force Push merely to make the Branch look tidy; Squash Merge can produce one default-Branch Commit after approval.

### Pull Request content

Start with a Draft Pull Request. Write the complete English section first and the complete Korean review section second. Describe the current reviewed diff, not the whole conversation.

- `Purpose`: why this outcome is needed.
- `Related Issue / Pull Request`: the primary tracking relationship. Use `Closes #N` only when this Pull Request fully completes the Issue. Use `Refs #N` for partial work, a dependency, or an intentionally split scope that must not auto-close the Issue.
- `Changes`: only what appears in the reviewed diff and serves the Purpose.
- `User Impact`: what changes for the user or operator.
- `Verification`: commands, checks, and observed results for the exact Head SHA.
- `Scope Note (optional)`: only an adjacent boundary likely to be misunderstood; never future work.
- `Risk/Recovery (when relevant)`: credible failure modes and how to recover.
- `Screenshots/Evidence (when relevant)`: visual or operational proof that helps review.
- `Search keywords`: useful terms without keyword stuffing.
- `Draft blockers`: only work required before this same Pull Request can become Ready for review. Use `None` when no blockers remain.

### Review and Merge

Keep the Pull Request Draft while `Draft blockers` is not `None`. Review requirements and scope first, then quality, security, tests, and operational risk on the exact Head SHA. Follow the Repository's required reviews and checks. Final Merge authorization is state-specific, and only Squash Merge through the Pull Request is allowed by this skill. Deployment and Branch deletion remain separate decisions.

Official references: [Setting guidelines for Repository contributors](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors), [Issue and Pull Request templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates), and [Issue-closing keywords](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/using-keywords-in-issues-and-pull-requests).

Practice examples: [Visual Studio Code's contribution guide](https://github.com/microsoft/vscode/wiki/How-to-Contribute#pull-requests) uses one Pull Request per Issue and permits combined requests only when they share the same root cause. [Node.js contribution guidance](https://github.com/nodejs/node/blob/main/doc/contributing/first-contributions.md#faqs-about-pull-requests) explains that working Commits in one Pull Request are commonly squashed when landing and that changed code needs fresh approval.

## 한국어

### 대상 Repository 규칙부터 확인

Issue 또는 Pull Request를 준비하기 전에 대상 Repository의 `CONTRIBUTING` 파일을 먼저 읽습니다. 저장소 전용 규칙은 이 범용 스킬보다 우선합니다. 모든 Repository가 같은 절차를 사용한다고 가정하지 말고 사용 가능한 Issue Form, Pull Request template, labels, 필수 checks, Code Owners, default Branch도 확인합니다.

### Issue가 필요한지 판단

기존 Issue와 Pull Request를 먼저 검색합니다. Issue 하나에는 문제 또는 요청 결과 하나만 기록합니다. 새 기능, 동작 변경, breaking change, 위험한 migration, 불명확한 요구사항처럼 합의나 추적이 필요한 작업은 구현 전에 Issue를 만듭니다. 대상 Repository가 허용한다면 작고 독립적인 문서·테스트·오탈자 수정은 Issue 없이 바로 Pull Request로 제안할 수 있습니다.

Umbrella Issue는 큰 프로그램을 설명할 수 있지만, 독립적으로 완료할 수 있는 결과는 sub-issues로 나눕니다. Issue를 만들었다고 Branch가 생기지는 않습니다. 구현을 시작할 때 Branch를 만듭니다.

### 독립적으로 검토할 수 있는 결과마다 Pull Request 하나

독립적으로 Review, 검증, Merge, 되돌릴 수 있는 결과마다 Pull Request 하나를 사용합니다. 파일마다 Pull Request 하나를 만드는 규칙도 아니고, 제목에 기능이라는 단어가 들어갈 때마다 나누는 규칙도 아닙니다. 파일은 구현 수단이며 결과가 Review 범위를 결정합니다.

같은 근본 원인을 해결하고 하나의 결과를 완성하는 데 필요한 코드, 테스트, 문서, 설정은 하나의 Pull Request에 함께 둡니다. 각 작업을 독립적으로 Review, 검증, Merge, 되돌릴 수 있다면 별도 Issue와 별도 Pull Request로 나눕니다.

다음 질문을 순서대로 적용합니다.

| 질문 | 함께 두는 기준 | 나누는 기준 |
| --- | --- | --- |
| 결과 | 하나의 Acceptance Criteria 묶음을 충족합니다. | 사용자 또는 운영 결과가 서로 다릅니다. |
| 근본 원인 | 같은 근본 원인을 해결합니다. | 서로 무관한 원인이나 component를 다룹니다. |
| Review와 검증 | 한 명의 reviewer가 하나의 일관된 테스트 계획으로 판단할 수 있습니다. | 다른 전문성, 증거, 승인이 필요합니다. |
| Merge와 복구 | 어느 한쪽만 Merge하면 불완전하거나 위험합니다. | 각 부분을 독립적으로 Merge하고 되돌릴 수 있습니다. |
| 일정과 위험 | rollout 시점과 위험이 같습니다. | 우선순위, release 시점, 운영 위험이 다릅니다. |

Pull Request에는 primary Issue 하나를 연결하는 방식을 우선합니다. 여러 Issue가 같은 근본 원인을 공유하고 분리하면 불완전하거나 위험한 변경이 될 때만 Pull Request 하나가 여러 Issue를 완료할 수 있습니다. 하나의 Umbrella Issue에 여러 Pull Request를 연결할 수도 있으며 각 Pull Request는 자신이 완료하는 부분을 명시합니다.

### 향후 작업은 현재 Pull Request가 아니라 Issue에 기록

독립적으로 완료할 향후 작업은 별도 Issue로 기록합니다. 의존 관계나 의도적인 범위 분리를 설명할 필요가 있을 때만 `관련 Issue / Pull Request`에서 링크합니다. 향후 작업을 현재 Pull Request의 `범위 참고`에 적지 않습니다.

Review하는 사람이 인접 동작의 변경 여부를 합리적으로 오해할 수 있을 때만 `범위 참고`를 사용합니다. 오해 가능성이 없으면 선택 사항인 이 섹션을 삭제합니다. 범위 참고는 현재 경계를 설명하며 backlog, 향후 구현 약속, 같은 대화에서 논의한 모든 작업의 목록이 아닙니다.

### Branch와 Commit

구현을 시작할 때 `<owner>/<type>/<purpose>` 형식의 목적 Branch를 만듭니다. Branch와 Worktree에는 작성자 한 명만 둡니다. Commit 하나는 복구 가능한 의도 하나를 담지만, Pull Request에는 같은 검토 결과에 기여하는 여러 작업 Commit이 있을 수 있습니다. Branch를 정돈해 보이게 만들기 위한 rewrite나 Force Push는 하지 않습니다. 승인 뒤 Squash Merge가 default Branch에 최종 Commit 하나를 만들 수 있습니다.

### Pull Request 내용

항상 Draft Pull Request로 시작합니다. 완전한 영어 섹션을 먼저 쓰고, 그 아래에 완전한 한국어 검토 섹션을 작성합니다. 전체 대화가 아니라 현재 Review한 diff를 설명합니다.

- `목적`: 이 결과가 필요한 이유입니다.
- `관련 Issue / Pull Request`: primary 추적 관계입니다. `Closes #N`은 이 Pull Request가 Issue를 완전히 완료할 때만 사용합니다. `Refs #N`은 부분 구현, 의존 관계, 의도적으로 분리한 범위처럼 Issue를 자동 종료하면 안 되는 경우에 사용합니다.
- `변경 내용`: Review한 diff에 존재하고 목적에 기여하는 내용만 기록합니다.
- `사용자 영향`: 사용자나 운영자에게 무엇이 달라지는지 기록합니다.
- `검증`: 정확한 Head SHA에서 실행한 명령, checks, 관찰 결과를 기록합니다.
- `범위 참고 (선택 사항)`: 오해하기 쉬운 인접 경계만 설명하며 향후 작업은 적지 않습니다.
- `위험 및 복구 (필요한 경우)`: 현실적인 실패 가능성과 복구 방법을 기록합니다.
- `스크린샷 및 증거 (필요한 경우)`: Review에 도움이 되는 시각적·운영 증거를 기록합니다.
- `검색 키워드`: 과도하게 나열하지 않고 유용한 용어만 기록합니다.
- `Draft 해제 전 남은 작업`: 이 Pull Request를 Ready for review로 전환하기 전에 필요한 작업만 기록합니다. 차단 작업이 없으면 `없음`이라고 적습니다.

### Review와 Merge

`Draft 해제 전 남은 작업`이 `없음`이 아니면 Pull Request를 Draft로 유지합니다. 정확한 Head SHA에서 요구사항과 범위를 먼저 Review한 뒤 품질, 보안, 테스트, 운영 위험을 Review합니다. Repository의 필수 reviews와 checks를 따릅니다. 최종 Merge 승인은 정확한 상태에만 적용되며 이 스킬은 Pull Request를 통한 Squash Merge만 허용합니다. 배포와 Branch 삭제는 별도 결정입니다.

공식 참고문서: [Repository 기여 지침 설정](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors), [Issue 및 Pull Request template](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates), [Issue 종료 키워드](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/using-keywords-in-issues-and-pull-requests).

실무 사례: [Visual Studio Code 기여 지침](https://github.com/microsoft/vscode/wiki/How-to-Contribute#pull-requests)은 Issue마다 Pull Request 하나를 사용하고, 같은 근본 원인을 해결할 때만 여러 요청을 함께 다룹니다. [Node.js 기여 지침](https://github.com/nodejs/node/blob/main/doc/contributing/first-contributions.md#faqs-about-pull-requests)은 Pull Request의 작업 Commit을 병합 시 Squash하는 관행과 코드 변경 후 새로운 승인이 필요함을 설명합니다.
