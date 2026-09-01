[English README](README.md)

# Managing Git Safely

GitHub 작업을 안전하고 명확하게 진행하기 위한 공개형·도구 중립 스킬입니다. GitHub 초보도 각 결정을 이해할 수 있게 설명하고, 숙련된 작업 흐름에 필요한 승인·리뷰·복구 안전장치도 지킵니다.

## 목적

이 스킬은 요청에 필요한 GitHub 단계만 선택해 안전하게 완료하도록 돕습니다. Issue(이슈) → Branch(브랜치) → Commit(커밋) → Push(푸시) → Pull Request(풀 리퀘스트) → Review(리뷰) → Merge(병합)는 참고 지도이며 모든 작업의 의무 순서가 아닙니다. 설명은 읽기 전용으로 끝낼 수 있고, Issue 작업은 Issue에서, 로컬 작업은 Push 전에, Draft 배달은 Draft Pull Request에서 끝낼 수 있습니다. 사용자가 이런 이른 완료 지점을 지정하지 않으면 구현·수정·변경 요청은 실제 기본 브랜치에 검증된 Squash Merge를 완료하는 Complete delivery(완전 배달)를 기본값으로 삼습니다.

특정 IDE 버튼, Git 클라이언트, 비공개 명령줄 도구를 요구하지 않습니다. 도구가 설치되었거나 화면에 보인다는 사실만으로 공개, 병합, 삭제, 덮어쓰기 권한이 생기지 않습니다.

## 작업 모드와 완료 기준

| 요청한 결과 | 선택 경로 | 전체 완료 기준 |
| --- | --- | --- |
| 설명 또는 상태 확인 | 필요한 내용을 확인하고 설명하며 Git 변경 단계를 실행하지 않습니다. | 답변 또는 Review를 전달하면 완료입니다. |
| Issue만 작성 | 검색 → 한영 Issue 초안 또는 게시입니다. | 합의한 Issue 완료 지점에서 완료입니다. |
| 로컬 구현 | Branch → Commit → 로컬 Review와 검증입니다. | 로컬에서 완료되며 Push된 내용은 없습니다. |
| Draft 배달 | Branch → Commit → Push → Draft Pull Request → Review입니다. | 사용자가 Draft를 요청한 경우에만 전체 완료입니다. |
| 구현·수정·변경 | 선택적 Issue → Branch → Commit → Push → Draft Pull Request → Review → 최종 승인 → Ready for review → Squash Merge → 실제 기본 브랜치 확인입니다. | 병합 결과를 확인한 뒤에만 완료입니다. |
| 기존 Branch 또는 Pull Request | 유효한 현재 단계에서 재개하고 앞의 작업물을 재사용합니다. | 요청한 완료 지점에서 완료입니다. |

진행 보고에는 실제 상태에 맞춰 작업 중이면 `IN PROGRESS`, 사용자 행동이 필요하면 `ACTION REQUIRED`, 계속할 수 없으면 `BLOCKED`를 표시합니다. `Current stage / 현재 단계`와 `Remaining stages / 남은 단계`도 모두 적습니다. `COMPLETE`는 요청한 Merge가 아닌 완료 지점을 전달하고 검증한 뒤에만 사용하고, `MERGED`는 병합 결과를 실제 기본 브랜치에서 검증한 뒤에만 사용합니다. Merge가 요청한 결과라면 Commit, Push, Draft Pull Request는 체크포인트이지 전체 완료가 아닙니다. 자세한 기준은 [Workflow modes](references/workflow-modes.md)와 [Delivery contract](references/delivery-contract.md)를 확인하세요.

README, Issue, Pull Request 초안을 쓰기 전에는 [Writing guidelines](references/writing-guidelines.md)를 확인하세요. [Workflow modes](references/workflow-modes.md)에서 작업 경로를 고른 뒤 선택한 단계만 [GitHub workflow](references/github-workflow.md)에서 읽습니다. 원격 게시와 Merge에는 [Delivery contract](references/delivery-contract.md)를 적용합니다. 인증이 필요한 GitHub CLI 작업은 [GitHub authentication](references/github-authentication.md), worktree·공개·리뷰·병합·정리 안전 규칙은 [collaboration policy](references/collaboration-policy.md), 쉬운 한영 개념 설명은 [Git and GitHub Concepts](references/github-concepts.md)를 확인하세요.

핵심 안전 규칙은 기존 Issue/Pull Request를 먼저 검색하고, Branch와 Commit마다 한 가지 목적만 두며, 이름이 무엇이든 저장소의 **실제 기본 브랜치(actual default Branch)** 에 direct Push하지 않고(`main`과 `master`는 예시일 뿐입니다), 모든 Force Push를 금지하며, 승인되지 않은 공개 게시를 하지 않는 것입니다. 공개 Push 전에는 도달 가능한 Git 이력 전체의 author/committer 메타데이터를 검사하고 GitHub가 제공하는 `noreply` 이메일을 기본값으로 사용합니다. 일반적인 공개 승인은 개인 이메일 공개 승인이 아닙니다. Pull Request는 Draft로 시작하고 변경 뒤 새 Head SHA를 다시 리뷰하며, 명시적인 최종 Merge 승인을 받은 뒤 Squash Merge만 사용합니다. 배포와 Branch 삭제는 별도 결정입니다.

기여 범위는 [CONTRIBUTING.md](CONTRIBUTING.md)를 확인하세요. 파일마다 또는 기능이라는 이름마다 나누지 않고, 독립적으로 Review할 수 있는 결과마다 Pull Request 하나를 사용합니다. 같은 근본 원인을 해결하는 구현·테스트·문서·설정은 함께 두고, 독립적으로 Review·검증·Merge·되돌릴 수 있는 결과는 나눕니다.

## 제목과 검색

- Issue: `[Area] Problem or requested outcome`
- Branch: `<owner>/<type>/<purpose>`
- Commit 및 Pull Request: `type(scope): completed outcome`
- Squash Merge: 승인된 Pull Request 제목

제목 끝에 마침표를 쓰지 마세요. Issue에는 대괄호 Area 태그를 하나만 사용합니다. Commit과 Pull Request에는 소문자 type과 선택적 scope 하나만 괄호에 넣고, 정직하게 공유하는 범위가 없으면 scope를 생략합니다. scope에 파일 이름을 나열하지 말고, 콜론으로 `type(scope)` 접두사와 결과를 구분합니다. Issue type, Label, Draft 상태에 이미 담긴 유형·우선순위·상태를 제목에 반복하지 않습니다. 먼저 검색하고 Labels로 구조화해 필터링하며, 제목과 첫 요약에 실제 검색어를 넣고, 3–7개의 유용한 `Search keywords`를 추가하되 키워드를 과도하게 나열하지 않습니다. `Update`, `Changes`, `Fix issue`, `[BUG][HIGH][INSTALL]` 같은 모호하거나 겹친 태그는 피합니다. 예: `[Documentation] Installation paths differ between supported runtimes`, `docs(workflow): standardize searchable GitHub titles`, `docs(i18n): synchronize README guidance across languages`.

## 설치

### AI에게 설치 요청

서로 다른 LLM과 IDE에서 가장 쉽게 사용할 수 있는 방법입니다. 스킬을 사용할 AI assistant에게 다음 문장을 그대로 전달하세요.

```text
공개 저장소 https://github.com/LYNGMN/github-workflow-skill 에서 `managing-git-safely` 스킬을 설치해 주세요. 현재 런타임의 공식 스킬 경로를 확인하고 내장 스킬 설치 기능이 있으면 우선 사용하세요. 내장 installer가 없고 Git이 설치되어 있으면 문서의 Git 설치법을 사용하세요. Git도 없으면 Git 없이 Download ZIP 방식을 사용하세요. 기존 설치 위치를 덮어쓰지 말고, 스킬 루트에 `<install path>/SKILL.md`가 있는지 확인하세요. 런타임이 스킬을 발견하거나 활성화했는지, 재검색 또는 재시작이 필요한지도 알려 주세요.
```

AI assistant는 파일 설치됨, 스킬 발견됨 또는 활성화됨, 필요할 때 GitHub 인증됨, 현재 런타임에서 사용 가능함을 서로 다른 상태로 보고해야 합니다.

확인 순서: 설치 → 발견/활성 → 필요하면 재검색/재시작입니다.

### Git으로 설치

런타임이 스킬을 발견할 위치를 고를 때 이 요약 표를 사용하세요. 모든 바로 쓸 수 있는 명령은 정확한 설치 경로를 이미 포함하므로 경로 placeholder를 바꾸지 않습니다.

| 설치 위치 | 적용 런타임 | 선택할 때 | 필수 입력 / placeholder | 바로 쓸 수 있는 예시 | 예상 결과 | 충돌/재검색/재시작 주의 |
| --- | --- | --- | --- | --- | --- |
| `~/.agents/skills/managing-git-safely` | Codex, Copilot CLI, Gemini CLI, Windsurf | 공용 agent-skills 위치를 사용할 때 선택합니다. | 없으면 `~/.agents/skills`를 만듭니다. | `mkdir -p ~/.agents/skills && git clone https://github.com/LYNGMN/github-workflow-skill.git ~/.agents/skills/managing-git-safely` | 런타임이 공용 위치에서 `managing-git-safely`를 발견할 수 있습니다. | 설치 위치가 이미 있으면 덮어쓰지 말고 먼저 확인하세요. 설치 뒤에는 런타임을 재검색하거나 재시작합니다. |
| `~/.claude/skills/managing-git-safely` | Claude Code | Claude Code 전용 skills 위치를 사용할 때 선택합니다. | 없으면 `~/.claude/skills`를 만듭니다. | `mkdir -p ~/.claude/skills && git clone https://github.com/LYNGMN/github-workflow-skill.git ~/.claude/skills/managing-git-safely` | Claude Code가 전용 위치에서 스킬을 발견할 수 있습니다. | 설치 위치가 이미 있으면 덮어쓰지 말고 먼저 확인하세요. 설치 뒤에는 Claude Code를 재검색하거나 재시작합니다. |
| `~/.cursor/skills/managing-git-safely` | Cursor | Cursor 전용 skills 위치를 사용할 때 선택합니다. | 없으면 `~/.cursor/skills`를 만듭니다. | `mkdir -p ~/.cursor/skills && git clone https://github.com/LYNGMN/github-workflow-skill.git ~/.cursor/skills/managing-git-safely` | Cursor가 전용 위치에서 스킬을 발견할 수 있습니다. | 설치 위치가 이미 있으면 덮어쓰지 말고 먼저 확인하세요. 설치 뒤에는 Cursor를 재검색하거나 재시작합니다. |
| `~/.gemini/antigravity/skills/managing-git-safely` | Antigravity | Antigravity skills 위치를 사용할 때 선택합니다. | 없으면 `~/.gemini/antigravity/skills`를 만듭니다. | `mkdir -p ~/.gemini/antigravity/skills && git clone https://github.com/LYNGMN/github-workflow-skill.git ~/.gemini/antigravity/skills/managing-git-safely` | Antigravity가 skills 위치에서 스킬을 발견할 수 있습니다. | 설치 위치가 이미 있으면 덮어쓰지 말고 먼저 확인하세요. 설치 뒤에는 Antigravity를 재검색하거나 재시작합니다. |

installed(설치됨)는 파일이 존재하는 상태, activated/discovered(활성화됨/발견됨)는 런타임이 스킬을 찾은 상태, authenticated(인증됨)는 GitHub 계정 연결이 로그인된 상태, usable(현재 사용 가능)은 필요한 기능이 노출되고 사용자가 행동을 승인한 상태입니다. 네 상태는 서로 다릅니다.

### Git 없이 설치

1. [공개 저장소](https://github.com/LYNGMN/github-workflow-skill)를 열고 **Code → Download ZIP(ZIP 다운로드)** 을 선택합니다. Git 없이 설치할 수 있는 방법입니다.
2. ZIP을 풀고 위 표에서 설치 위치를 고릅니다. 설치 위치가 이미 있으면 멈추고 내용을 확인하며 덮어쓰지 않습니다.
3. 압축을 푼 저장소의 내용물을 복사해 최종 파일이 정확히 `<install path>/SKILL.md`가 되게 합니다. `<install path>/github-workflow-skill-main/SKILL.md` 같은 중첩된 저장소 폴더는 많은 런타임이 스킬을 발견하지 못하므로 피합니다.
4. 스킬을 재검색하거나 런타임을 재시작합니다. `managing-git-safely`를 목록에서 확인하고 설치됨, 발견됨/활성화됨, 인증됨, 사용 가능함을 구분합니다.

## GitHub CLI 인증(선택 사항)

다른 GitHub 기능이 같은 계정과 권한 경계를 확인할 수 있다면 GitHub CLI는 필수 조건이 아닙니다. GitHub CLI 대화형 인증은 브라우저 전용으로 진행합니다. GitHub CLI를 선택했다면 다음 순서를 사용합니다.

1. `gh --version`으로 설치 여부를 확인합니다.
2. `gh auth status -h github.com`으로 대상 host와 활성 계정을 확인합니다. `GH_TOKEN` 또는 `GITHUB_TOKEN`의 설정 여부만 확인하고 값은 출력하지 않습니다. 환경 token은 저장된 인증정보를 덮어쓸 수 있습니다. 이 확인에 `--show-token`을 추가하거나 `gh auth token`을 실행하지 않습니다.
3. 인증이 없거나 만료됐다면 대상 계정, 계정 전체 권한에 미치는 영향, 요청 OAuth 권한 범위, 인증정보 저장 영향을 설명합니다. 명시적 승인을 받은 뒤 `gh auth login -h github.com -p https -w`로 브라우저 로그인을 시작합니다. 대화형 인증에 PAT, `--with-token`, 환경 token fallback을 사용하지 않습니다.
4. CLI 프로세스를 계속 실행하고 브라우저 승인을 기다립니다. 인증이 성공하면 승인된 작업을 자동으로 재개하며 사용자가 “다음”이라고 말하기 위해 돌아오게 하지 않습니다. 일회용 기기 코드는 민감 정보이므로 문서, Issue, Pull Request, Commit, 대화, 로그에 적지 않습니다.
5. 실제 GitHub 작업을 수행할 같은 실행 환경에서 `gh auth status -h github.com`을 다시 실행합니다. sandbox와 host keyring은 서로 다른 인증정보를 볼 수 있습니다.
6. `OWNER/REPO`를 실제 값으로 바꾼 뒤 `gh repo view OWNER/REPO --json nameWithOwner,visibility,viewerPermission`을 실행합니다. 이 읽기 전용 확인으로 Push를 시험하지 않고 정확한 Repository와 저장소 단위 권한을 확인합니다. 조직 Repository라면 OAuth App 제한과 SSO 권한 승인도 확인합니다.

명시적 승인 없이 계정 전환, 로그아웃, 인증정보 갱신·교체, 접근 권한 해제를 하지 않습니다. 인증은 Push나 Merge 승인이 아니며, 시작 승인과 최종 Merge 승인은 인증 승인과 별도입니다. 전체 판단 계약은 [GitHub authentication](references/github-authentication.md)을 확인하세요.

## 사용 예시

- GitHub CLI 인증 복구: installed, authenticated, authorized, usable 상태를 구분하고, 기기 코드를 보호하며, 계정과 권한 범위를 확인한 뒤 시작 승인이 있을 때만 의도한 GitHub 행동을 이어갑니다.
- Issue 초안: 검색 기록과 추측하지 않은 `Open Questions`를 포함해 완전한 영어 Issue 섹션과 완전한 한국어 섹션을 작성합니다.
- 여러 파일의 한 가지 목적 편집: 하나의 문서 목적을 위해 `README.md`와 `README.ko.md`를 함께 갱신하고 의미 동등성을 확인한 뒤, 새 테스트를 통과하면 Commit 하나를 만듭니다.
- Draft 게시: 정확한 base, Head, Head SHA, checks와 검토용 영어·한국어 열 가지 필드를 갖춘 Draft Pull Request를 엽니다.
- 승인된 Draft에서 Squash Merge까지의 작업: 정확한 Pull Request 상태를 보여 주고 최종 명시 승인을 한 번 받은 뒤 Ready for review로 전환합니다. 필요한 reviews와 checks를 기다리고 상태가 바뀌지 않았을 때만 Squash Merge를 사용합니다.

## 언어 동기화

"Update the README"는 요청자가 특정 언어 예외를 이름으로 지정하지 않는 한 모든 관리 대상 언어 README를 갱신한다는 뜻입니다. 명령, 링크, 라이선스 사실, 설치 경로, 예시, 안전 규칙은 의미를 맞춰 유지하며, 직역은 필요하지 않습니다. GitHub에 게시하는 내용은 기본적으로 영어이고, 다른 게시 언어를 요청하지 않는 한 그 아래에 한국어 검토본을 둡니다.

## 라이선스와 검증

이 패키지는 [MIT License](LICENSE)로 제공됩니다. MIT는 사용, 복사, 수정, 배포, 재라이선스, 판매를 허용하지만 저작권·라이선스 고지문을 유지해야 하며, 품질이나 특정 목적 적합성을 보증하지 않는 조건으로 보증 없이 제공됩니다.

공개 패키지 계약은 `npm test`로 확인합니다. GitHub에서는 [validate.yml](.github/workflows/validate.yml)도 같은 검사를 실행합니다.
