# GitHub Authentication / GitHub 인증

Use this reference only when a GitHub operation needs an authenticated account. GitHub CLI is one supported path, not a mandatory dependency for every runtime. An authenticated connector or IDE may be used when it can prove the same account, permission, execution-environment, and approval boundaries.

## English

### State model

- **Installed:** the GitHub tool or connector exists.
- **Authenticated:** a credential for a GitHub account is currently valid.
- **Authorized:** the user has approved the exact account, OAuth scopes, and intended action.
- **Usable:** the current execution environment can access the credential and perform the intended operation.

Do not collapse these states. Authentication does not authorize Push, Pull Request mutation, Ready for review, Merge, deployment, deletion, or permission changes.

### Browser-only interactive authentication

Interactive GitHub CLI authentication is browser-only. Before starting it, detect whether `GH_TOKEN` or `GITHUB_TOKEN` is set, but never print either value. An environment token takes precedence over stored credentials and may override the account that `gh` would otherwise use. Do not unset or remove either variable automatically; report the conflict and obtain a decision.

If the user chooses browser authentication while an environment token is present, include a command-scoped environment in the recorded authentication approval. On Unix-like shells, prefix the login and every subsequent `gh` verification or action in that workflow with `env -u GH_TOKEN -u GITHUB_TOKEN`. On another platform, use its equivalent child-process environment control. This same command-scoped exclusion selects the stored browser credential without changing the parent shell or shell configuration. Never alter a profile file or permanently remove the variables as a shortcut.

Do not use a personal access token (PAT), `--with-token`, or an environment-token fallback for interactive authentication. Use `gh auth login -h github.com -p https -w` so GitHub opens the browser authorization flow. If GitHub CLI proposes plain-text credential storage instead of the operating-system credential store, stop and request a decision before accepting that weaker storage method.

Keep the CLI process running while the browser is open, wait for browser authorization, and resume automatically when the process succeeds. Give one concise `ACTION REQUIRED` notice when the browser needs the user's account action. Do not ask the user to say “next” or “done”; poll or wait for the existing login process and continue the already approved workflow after verification.

When the authentication state is unchanged, the recorded authentication approval and browser interaction use one `ACTION REQUIRED` notice; the device-code handoff and matching final browser screen do not create additional chat approval gates. A changed account, scope, storage method, or environment-token choice is a new state and requires a new decision.

### GitHub CLI preflight

1. Confirm that GitHub CLI exists with `gh --version`. Installation alone does not prove account access.
2. Check the intended host with `gh auth status -h github.com`. Detect the presence of `GH_TOKEN` and `GITHUB_TOKEN` without printing their values. Do not use `--show-token`, `gh auth token`, or output that reveals credential values.
3. Verify the active account or identity and the OAuth scopes required for the intended operation. Treat browser authorization as account-wide and not limited to one Repository unless GitHub explicitly shows a narrower credential boundary.
4. If authentication is missing or invalid, explain the target host, intended account, requested scopes, credential storage effect, and intended operation. Obtain one authentication approval for that exact state, then start web authentication with `gh auth login -h github.com -p https -w`.
5. Treat the one-time device code as sensitive. Do not repeat it in documentation, an Issue, Pull Request, Commit, chat, or log. Browser or device-code handoff is part of the approved login and does not need another chat confirmation while the displayed account, scopes, and storage method remain unchanged.
6. Before the final browser authorization, verify that the displayed account and OAuth scopes or permission summary match the recorded authentication approval. If they differ, stop and obtain a new decision; do not assume broad scopes are routine.
7. After login, run `gh auth status -h github.com` again in the same execution environment that will perform the GitHub operation. A sandbox can see different credentials from the host keyring; one environment's success or failure does not prove the other's state.
8. Report the active account, host, Git protocol, and whether the required scopes are present without exposing any token value. Only then evaluate whether the tool is usable for the intended action.
9. No universal OAuth scope minimum applies to every credential type and GitHub action. Derive the smallest required scope from the selected credential and action; never request broader access merely “just in case.”
10. Verify the target without changing it: `gh repo view OWNER/REPO --json nameWithOwner,visibility,viewerPermission`. Confirm the exact Repository, visibility, and repository-level permission. This check is read-only; Push or another write operation is not a permission test. Branch rules and other GitHub requirements may still block the intended action.
11. For an organization Repository, check whether OAuth app access restrictions or SSO authorization applies. Missing organization approval or an inactive SSO session means the authenticated tool is not yet usable for that organization.

If the active account is wrong or the scope is unclear, stop. Do not switch accounts, logout, refresh or replace credentials, or revoke access without explicit approval for that exact authentication change. Authentication approval and Push approval are separate. Merge always requires its own exact-state approval.

Official references: [`gh auth status`](https://cli.github.com/manual/gh_auth_status), [`gh auth login`](https://cli.github.com/manual/gh_auth_login), [`gh repo view`](https://cli.github.com/manual/gh_repo_view), and [Authorizing OAuth apps](https://docs.github.com/en/apps/oauth-apps/using-oauth-apps/authorizing-oauth-apps).

## 한국어

### 상태 구분

- **설치됨(Installed):** GitHub 도구 또는 connector가 존재합니다.
- **인증됨(Authenticated):** GitHub 계정의 인증정보가 현재 유효합니다.
- **권한 승인됨(Authorized):** 사용자가 정확한 계정, OAuth 권한 범위, 실행할 행동을 승인했습니다.
- **현재 사용 가능(Usable):** 실제 작업을 실행할 현재 환경에서 인증정보에 접근하고 의도한 행동을 수행할 수 있습니다.

이 상태들을 하나로 취급하지 않습니다. 인증은 Push나 Merge에 대한 승인이 아니며, 인증 승인과 각 GitHub 작업 승인은 서로 분리합니다. 인증만으로 Pull Request 수정, Ready for review 전환, 배포, 삭제, 권한 변경을 실행하지 않습니다.

### 브라우저 전용 대화형 인증

GitHub CLI의 대화형 인증은 브라우저 전용으로 진행합니다. 인증을 시작하기 전에 `GH_TOKEN` 또는 `GITHUB_TOKEN`이 설정되어 있는지 확인하되 값은 출력하지 않습니다. 환경 token은 저장된 인증정보보다 우선하고 `gh`가 사용할 계정을 바꿀 수 있습니다. 두 변수를 자동으로 해제하거나 삭제하지 말고 충돌을 보고한 뒤 결정을 받습니다.

환경 token이 있는데 사용자가 브라우저 인증을 선택하면 명령 범위 환경을 인증 승인에 포함합니다. Unix 계열 shell에서는 로그인과 이후 해당 작업의 모든 `gh` 확인·행동 명령 앞에 `env -u GH_TOKEN -u GITHUB_TOKEN`을 붙입니다. 다른 플랫폼에서는 같은 역할을 하는 child-process 환경 제어를 사용합니다. 같은 명령 범위 배제를 유지하면 부모 shell이나 shell 설정을 변경하지 않고 저장된 브라우저 인증정보를 선택할 수 있습니다. 편의를 위해 profile 파일을 수정하거나 변수를 영구 삭제하지 않습니다.

대화형 인증에는 personal access token(PAT), `--with-token`, 환경 token fallback을 사용하지 않습니다. `gh auth login -h github.com -p https -w`로 GitHub 브라우저 권한 승인 흐름을 엽니다. 운영체제 인증정보 저장소 대신 평문 인증정보 저장을 제안하면 수락하기 전에 중단하고 사용자의 결정을 받습니다.

브라우저가 열려 있는 동안 CLI 프로세스를 계속 실행하고, 브라우저 승인을 기다린 뒤 프로세스가 성공하면 자동으로 재개합니다. 사용자의 계정 조작이 필요할 때만 간결한 `ACTION REQUIRED` 안내를 한 번 제공합니다. 사용자에게 “다음” 또는 “완료”라고 말해 달라고 요청하지 않고 기존 로그인 프로세스를 기다리거나 확인한 뒤, 검증에 성공하면 이미 승인된 작업을 이어갑니다.

인증 상태가 그대로라면 기록된 인증 승인과 브라우저 상호작용에는 `ACTION REQUIRED` 안내 한 번만 사용합니다. 기기 코드 전달과 승인 내용과 일치하는 최종 브라우저 화면 때문에 대화 승인 게이트를 추가하지 않습니다. 계정, 권한 범위, 저장 방식, 환경 token 처리 선택이 바뀌면 새 상태이므로 새 결정을 받습니다.

### GitHub CLI 사전 확인

1. `gh --version`으로 GitHub CLI 설치 여부를 확인합니다. 설치만으로 계정 접근이 확인되지는 않습니다.
2. `gh auth status -h github.com`으로 대상 host의 인증 상태를 확인합니다. `GH_TOKEN`과 `GITHUB_TOKEN`의 설정 여부만 확인하고 값은 출력하지 않습니다. `--show-token`, `gh auth token`, 인증정보 값을 드러내는 출력은 사용하지 않습니다.
3. 활성 계정과 의도한 작업에 필요한 OAuth 권한 범위를 확인합니다. GitHub가 더 좁은 인증정보 범위를 명확히 보여 주지 않는 한, 브라우저 권한 승인은 계정 전체에 영향을 줄 수 있고 하나의 Repository에만 적용되지 않는다고 봅니다.
4. 인증이 없거나 만료됐다면 대상 host, 사용할 계정, 요청 권한 범위, 인증정보 저장 영향, 의도한 작업을 설명합니다. 그 정확한 상태에 대한 인증 승인 한 번을 받은 뒤 `gh auth login -h github.com -p https -w`로 웹 인증을 시작합니다.
5. 일회용 기기 코드는 민감 정보로 취급합니다. 문서, Issue, Pull Request, Commit, 대화, 로그에 반복해서 적지 않습니다. 표시된 계정·권한 범위·저장 방식이 그대로라면 브라우저 또는 기기 코드 전달은 승인된 로그인에 포함되므로 대화 승인을 다시 받지 않습니다.
6. 브라우저의 최종 권한 승인 전에는 표시된 계정과 OAuth 권한 범위 또는 권한 요약이 기록된 인증 승인과 일치하는지 확인합니다. 다르면 중단하고 새 결정을 받으며, 넓은 권한을 관례라고 가정해 자동 승인하지 않습니다.
7. 로그인 뒤 실제 GitHub 작업을 수행할 같은 실행 환경에서 `gh auth status -h github.com`을 다시 실행합니다. sandbox가 host keyring과 다른 인증정보를 볼 수 있으므로, 한쪽 환경의 성공이나 실패만으로 다른 쪽 상태를 단정하지 않습니다.
8. token 값을 노출하지 않고 활성 계정, host, Git protocol, 필요한 권한 범위 충족 여부를 보고합니다. 그 뒤에만 의도한 작업에 현재 사용 가능한 상태인지 판단합니다.
9. 모든 인증정보 종류와 GitHub 행동에 공통으로 적용되는 단 하나의 OAuth 최소 권한 범위는 없습니다. 선택한 인증정보와 행동에 필요한 가장 좁은 권한 범위를 확인하며, “혹시 모르니” 더 넓은 권한을 요청하지 않습니다.
10. 대상을 변경하지 않고 `gh repo view OWNER/REPO --json nameWithOwner,visibility,viewerPermission`을 실행합니다. 정확한 Repository, 공개 범위, 저장소 단위 권한을 확인합니다. 이 명령은 읽기 전용이며, Push나 다른 쓰기 작업을 권한 시험으로 실행하지 않습니다. Branch 규칙과 다른 GitHub 요구사항은 의도한 행동을 여전히 막을 수 있습니다.
11. 조직 Repository라면 OAuth App 접근 제한이나 SSO 권한 승인이 적용되는지 확인합니다. 조직 승인 누락이나 비활성 SSO session이 있으면 인증된 도구라도 해당 조직에서 아직 사용할 수 없는 상태입니다.

활성 계정이 다르거나 권한 범위가 불분명하면 중단합니다. 계정 전환, 로그아웃, 인증정보 갱신·교체, 접근 권한 해제에는 해당 인증 변경에 대한 명시적 승인이 필요합니다. 인증 승인은 Push 승인이 아니며 서로 분리합니다. Merge에는 정확한 상태에 대한 별도 승인이 항상 필요합니다.

공식 참고문서: [`gh auth status`](https://cli.github.com/manual/gh_auth_status), [`gh auth login`](https://cli.github.com/manual/gh_auth_login), [`gh repo view`](https://cli.github.com/manual/gh_repo_view), [Authorizing OAuth apps](https://docs.github.com/en/apps/oauth-apps/using-oauth-apps/authorizing-oauth-apps).
