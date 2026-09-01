# Delivery Contract / 배달 계약

Use this contract for remote publication and Merge. It prevents repeated “next step” prompts while keeping the final irreversible repository decision explicit.

## English

### Gate 1: Start authorization

Before changing or publishing work, show the Repository, visibility, included scope, excluded scope, requested endpoint, work Branch, and whether authentication is needed. Record the user's Start authorization for that exact delivery scope.

Start authorization covers creating or using the purpose Branch, making one-purpose Commit checkpoints, non-force Push to the approved work Branch, creating or updating the same Draft Pull Request, and Review. Continue these steps when their conditions are satisfied; do not ask for another stage-by-stage approval or ask the user to say “next.” It does not authorize direct Push to the actual default Branch, Force Push, Merge, deployment, Branch deletion, credential changes, or work outside the stated scope.

For the first Push to a new remote or a PUBLIC remote, the Start authorization must also cover the exact remote, visibility, included files, and reachable history. Author/committer identity and email metadata require a separate privacy check: use a GitHub-provided `noreply` email by default, and never interpret general publication authorization as approval to expose a personal or unapproved non-noreply email. Later non-force updates to the same approved work Branch and Draft Pull Request remain inside this gate while scope and visibility stay unchanged.

### Gate 2: Final Merge authorization

Keep the Pull Request as Draft until the user sees the exact Pull Request, Base Branch, Head Branch, Head SHA, current checks, unresolved reviews, required reviews, mergeability, method, and expected Squash title. One explicit Final Merge authorization for that exact state permits the Ready for review transition and, after GitHub requirements pass, Squash Merge through that Pull Request.

A normal pending-to-passing check transition after authorization does not invalidate it. Keep waiting, re-check the unchanged state, and merge without another approval when every requirement passes. A new commit, base change, title change, method change, failing check, conflict, or blocking review stops Merge and invalidates only the Final Merge authorization. Return to Draft before corrective development, then retest, re-review, display the new exact state, and obtain a new Final Merge authorization.

When the exact state is unchanged and every requirement passes, use `gh pr merge <PR> --squash --match-head-commit <SHA> --subject "<approved Pull Request title>"`. Pass the Pull Request, Head SHA, and approved title as separate CLI arguments; do not interpolate them into a constructed shell command. Never use `--admin` to bypass protections. Do not use Rebase or Force Push merely to combine work Branch commits; Squash Merge creates one organized Commit on the actual default Branch.

After Merge, verify the Pull Request is merged, the actual default Branch contains the expected Squash Commit SHA, and a linked Issue closed when the Pull Request used a closing keyword. Deployment is a separate operation. Branch deletion is a separate approval and requires recovery evidence.

### Progress and completion language

Match conversational status and progress fields to the user's language. Do not combine English and Korean in one field label.

An English-language report uses these fields, each on its own line:

- `Status: IN PROGRESS`, `Status: ACTION REQUIRED`, `Status: BLOCKED`, `Status: COMPLETE`, or `Status: MERGED`.
- `Current stage:` what is happening now.
- `Remaining stages:` what must still happen before the requested endpoint.
- `Next step:` the immediate action and its owner.

A Korean-language report uses these fields, each on its own line:

- `상태: 진행 중 — 완료 아님`, `상태: 사용자 조치 필요 — 완료 아님`, `상태: 차단됨 — 완료 아님`, `상태: 요청 결과 완료`, or `상태: 병합 완료`.
- `현재 단계:` 지금 진행하는 단계입니다.
- `남은 단계:` 요청한 완료 지점까지 남은 단계입니다.
- `다음 단계:` 즉시 이어질 행동과 행동 주체입니다.

In a Korean-language report, introduce specialized terms with the Korean term first and the English original in parentheses on first occurrence, as `풀 리퀘스트(Pull Request)`, `헤드 SHA(Head SHA)`, and `스쿼시 병합(Squash Merge)`. Describe user-visible milestones and decisions instead of routine internal reading or tool calls.

Every intermediate and final user-facing report must end with the language-matched `Next step:` or `다음 단계:` field as its last field; nothing follows it. Name one immediate action and its owner. When current authorization lets the agent continue, state the agent's next action and continue instead of asking the user to say “next.” If the requested endpoint is complete, begin the final field with `No action required for the completed request; optional next action:` or `필수 작업 없음; 선택 가능한 다음 행동:` so completion is not mistaken for a new requirement.

Use exactly one overall status label from the language-matched list above. Use `Status: COMPLETE` only after a requested non-Merge endpoint such as an Issue, Local implementation, or Draft Pull Request has been delivered and verified. Use `Status: MERGED` only after the requested Merge result is verified on the actual default Branch. A Commit, Push, or Draft Pull Request must not be reported as overall complete when the requested endpoint is Merge. Say what checkpoint was completed and immediately name the remaining stages. Use `Status: ACTION REQUIRED` when a user action is truly needed, including exact-state Final Merge authorization; otherwise continue, wait, or verify without handing the workflow back prematurely.

## 한국어

### 게이트 1: 시작 승인

작업을 변경하거나 게시하기 전에 Repository, 공개 범위, 포함 범위, 제외 범위, 요청한 완료 지점, 작업 Branch, 인증 필요 여부를 보여 줍니다. 이 정확한 배달 범위에 대한 사용자의 시작 승인을 기록합니다.

시작 승인은 목적형 Branch 생성 또는 사용, 한 가지 목적의 Commit 체크포인트, 승인된 작업 Branch로의 비강제 Push, 같은 Draft Pull Request 생성·갱신, Review를 포함합니다. 각 조건이 충족되면 계속 진행하며 단계마다 다시 승인받지 않고 사용자에게 “다음”이라고 말해 달라고 요청하지 않습니다. 시작 승인은 실제 기본 브랜치 direct Push, Force Push, Merge, 배포, Branch 삭제, 인증정보 변경, 명시한 범위 밖의 작업을 허용하지 않습니다.

새 remote 또는 PUBLIC remote로 처음 Push할 때는 정확한 remote, 공개 범위, 포함 파일, 공개될 도달 가능한 이력을 시작 승인에 포함합니다. author/committer 신원과 이메일 메타데이터는 별도 개인정보 검사를 적용합니다. GitHub가 제공하는 `noreply` 이메일을 기본값으로 사용하고, 일반적인 공개 승인을 개인 또는 승인되지 않은 non-noreply 이메일 공개 승인으로 해석하지 않습니다. 범위와 공개 설정이 그대로라면 이후 같은 승인된 작업 Branch와 Draft Pull Request의 비강제 갱신은 이 게이트 안에서 진행합니다.

### 게이트 2: 최종 Merge 승인

사용자에게 정확한 Pull Request, Base Branch, Head Branch, Head SHA, 현재 검사, 미해결 리뷰, 필수 리뷰, 병합 가능 여부, 병합 방식, 예상 Squash 제목을 보여 줄 때까지 Pull Request를 Draft로 유지합니다. 정확한 상태에 대한 한 번의 명시적 최종 Merge 승인은 Ready for review 전환과, GitHub 요구사항을 모두 통과한 뒤 해당 Pull Request를 통한 Squash Merge를 허가합니다.

승인 뒤 검사가 pending에서 passing으로 정상 전환되는 것은 승인을 무효화하지 않습니다. 그대로 기다리고 동일한 상태를 다시 확인한 뒤 모든 요구사항이 통과하면 추가 승인 없이 병합합니다. 새 Commit, base 변경, 제목 변경, 병합 방식 변경, 실패한 검사, 충돌, 차단 리뷰가 생기면 Merge를 중단하고 최종 Merge 승인만 무효화합니다. 수정 개발 전에 Draft로 되돌린 뒤 재검사·재리뷰하고, 새 정확한 상태를 보여 주고 새 최종 Merge 승인을 받습니다.

정확한 상태가 그대로이고 모든 요구사항이 통과하면 `gh pr merge <PR> --squash --match-head-commit <SHA> --subject "<approved Pull Request title>"`을 사용합니다. Pull Request, Head SHA, 승인된 제목은 각각 별도의 CLI 인자로 전달하고, 하나의 shell 명령 문자열에 보간하지 않습니다. 보호 규칙을 우회하기 위해 `--admin`을 절대 사용하지 않습니다. 작업 Branch의 여러 Commit을 합치려고 Rebase나 Force Push를 사용하지 않습니다. Squash Merge가 실제 기본 브랜치에 정돈된 Commit 하나를 만듭니다.

Merge 후 Pull Request가 병합됨 상태인지, 실제 기본 브랜치에 예상 Squash Commit SHA가 있는지, 닫기 키워드를 쓴 연결 Issue가 종료됐는지 확인합니다. 배포는 별도 작업입니다. Branch 삭제는 별도 승인이 필요하며 복구 증거를 먼저 확인합니다.

### 진행과 완료 표현

대화의 상태 표시와 진행 필드는 사용자 언어에 맞추고, 한 필드에 영어와 한국어 제목을 함께 적지 않습니다.

영어 답변(English-language report)은 각각 별도 줄에 다음 필드를 사용합니다.

- `Status: IN PROGRESS`, `Status: ACTION REQUIRED`, `Status: BLOCKED`, `Status: COMPLETE`, `Status: MERGED` 중 하나
- `Current stage:`
- `Remaining stages:`
- `Next step:`

한국어 답변(Korean-language report)은 각각 별도 줄에 다음 필드를 사용합니다.

- `상태: 진행 중 — 완료 아님`, `상태: 사용자 조치 필요 — 완료 아님`, `상태: 차단됨 — 완료 아님`, `상태: 요청 결과 완료`, `상태: 병합 완료` 중 하나
- `현재 단계:`
- `남은 단계:`
- `다음 단계:`

한국어 답변의 기술 용어는 처음 등장할 때 `풀 리퀘스트(Pull Request)`, `헤드 SHA(Head SHA)`, `스쿼시 병합(Squash Merge)`처럼 한국어를 먼저 쓰고 영어 원어를 괄호 안에 적습니다. 일상적인 내부 문서 읽기나 도구 호출보다 사용자가 이해해야 할 작업 지점과 결정을 설명합니다.

모든 중간 보고와 최종 보고는 답변 언어에 맞는 `Next step:` 또는 `다음 단계:`를 마지막 필드로 사용하며, 그 뒤에는 아무 내용도 두지 않습니다. 즉시 이어질 행동 하나와 행동 주체를 명시합니다. 현재 승인 범위에서 에이전트가 계속할 수 있으면 사용자에게 “다음”을 요청하지 않고 에이전트의 다음 행동을 적은 뒤 계속 진행합니다. 요청한 완료 지점이 이미 완료되어 사용자가 해야 할 필수 작업이 없다면 마지막 필드를 `필수 작업 없음; 선택 가능한 다음 행동:`으로 시작하여 완료와 새로운 필수 작업을 구분합니다.

위의 한국어 목록에서 전체 상태 표시 하나만 사용합니다. `상태: 요청 결과 완료`는 이슈, 로컬 구현, 초안 풀 리퀘스트처럼 요청한 병합이 아닌 완료 지점을 전달하고 검증한 뒤에만 사용합니다. `상태: 병합 완료`는 요청한 병합 결과가 실제 기본 브랜치에서 확인된 뒤에만 사용합니다. 요청한 완료 지점이 병합이라면 커밋, 푸시, 초안 풀 리퀘스트가 끝났다는 이유로 전체 완료라고 보고하지 않습니다. 완료된 체크포인트와 남은 단계를 바로 이어서 알립니다. `상태: 사용자 조치 필요 — 완료 아님`은 정확한 상태에 대한 최종 병합 승인처럼 사용자 행동이 정말 필요할 때 사용하고, 그렇지 않으면 작업을 계속하거나 기다리거나 검증합니다.
