# Git and GitHub Concepts

## English

Read the English term and explanation before acting. The Korean section below teaches the same decision vocabulary.

### Repository

A Repository stores a project’s files and recorded history together.

### Remote

A Remote is a Repository hosted elsewhere, such as GitHub, that a local Repository can exchange commits with.

### Authentication

Authentication confirms which GitHub account a tool can currently use. A tool being installed does not mean it is authenticated, and a browser login does not prove that every execution environment can access the same credential.

### Authorization

Authorization is the user's permission for a specific account scope or action. Successful Authentication does not authorize Push, Pull Request changes, Ready for review, Merge, deployment, deletion, or account-permission changes.

### OAuth Scope

An OAuth Scope describes which account capabilities a credential may use. It can affect more than the current Repository, so verify the displayed account and scope before approval and never reveal a token or one-time device code.

### Clone

Clone creates a local copy of a Remote Repository, including its history.

### Pull

Pull receives committed changes from a Remote. It is not a Pull Request.

### Push

Push sends selected local commits to a Remote. It is not Merge or deployment.

### Branch

A Branch is a named line of work. Use `<owner>/<type>/<purpose>` for a single purpose.

### Worktree

A Worktree is another checkout of the same Repository, allowing separate Branch work without moving the current checkout.

### Stage

Stage is the selected set of file changes intended for the next Commit.

### Commit

A Commit is a recoverable recorded checkpoint with one completed purpose.

### Issue

An Issue is a searchable record of a problem, request, decision, and its acceptance conditions.

### Pull Request

A Pull Request proposes that a Branch change be reviewed before Merge.

### Draft Pull Request

A Draft Pull Request is an early Pull Request that is not ready for Merge. This package starts every Pull Request as Draft.

### Review

Review checks the requirements, scope, quality, security, tests, and operational risk of an exact Head SHA.

### Merge

Merge incorporates an approved Pull Request into its base Branch.

### Squash Merge

Squash Merge creates one final Commit from a Pull Request. This package permits only this merge method.

### SHA

A SHA is a unique identifier for a Commit, and review approval is tied to the exact Head SHA reviewed.

### Label

A Label is structured metadata used to filter and group Issues and Pull Requests.

### Assignee

An Assignee is the person responsible for moving an Issue or Pull Request forward.

### Acceptance Criteria

Acceptance Criteria are observable conditions that show when an Issue is complete.

### License

A License explains what others may do with a package and what obligations apply. The [MIT License](../LICENSE) grants permission to use, copy, modify, distribute, sublicense, and sell. Anyone distributing a copy must retain the copyright and license notice. It is provided with no warranty: the authors do not promise that it is fit for a particular purpose or free of defects.

## 한국어

행동하기 전에는 위의 English term을 먼저 읽고, 아래의 한국어 설명으로 같은 결정 용어를 확인합니다.

### 리포지터리

Repository(리포지터리)는 프로젝트 파일과 그 파일이 어떻게 바뀌었는지를 기록한 이력을 함께 보관하는 작업 단위입니다.

### 원격 저장소

Remote(원격 저장소)는 GitHub처럼 다른 위치에 있는 리포지터리입니다. 내 컴퓨터의 리포지터리와 커밋을 주고받을 수 있습니다.

### 인증

Authentication(인증)은 도구가 현재 어느 GitHub 계정을 사용할 수 있는지 확인하는 일입니다. 도구가 설치되어 있어도 인증된 것은 아니며, 브라우저 로그인이 성공해도 모든 실행 환경에서 같은 인증정보를 사용할 수 있다고 단정할 수 없습니다.

### 권한 승인

Authorization(권한 승인)은 특정 계정 범위나 행동을 사용자가 허용하는 일입니다. Authentication이 성공해도 Push, Pull Request 수정, Ready for review, Merge, 배포, 삭제, 계정 권한 변경이 자동으로 승인되지는 않습니다.

### OAuth 권한 범위

OAuth Scope(OAuth 권한 범위)는 인증정보가 사용할 수 있는 계정 기능의 범위를 설명합니다. 현재 Repository 밖에도 영향을 줄 수 있으므로 승인 전에 표시된 계정과 권한 범위를 확인하고, token이나 일회용 기기 코드를 노출하지 않습니다.

### 클론

Clone(클론)은 원격 리포지터리의 파일과 이력을 내 컴퓨터에 복사해 작업을 시작하는 방법입니다.

### 풀

Pull(풀)은 원격 저장소의 커밋된 변경을 내 작업 환경으로 가져오는 일입니다. Pull Request를 만드는 일과는 다릅니다.

### 푸시

Push(푸시)는 내 컴퓨터에 있는 커밋을 원격 저장소로 보내는 일입니다. Merge나 deployment가 자동으로 이루어진다는 뜻은 아닙니다.

### 브랜치

Branch(브랜치)는 독립된 작업 흐름에 붙이는 이름입니다. 한 가지 목적을 위해 `<owner>/<type>/<purpose>` 형식을 사용합니다.

### 워크트리

Worktree(워크트리)는 같은 리포지터리를 다른 폴더에 한 번 더 꺼내 놓은 작업 공간입니다. 현재 폴더를 바꾸지 않고 다른 브랜치를 작업할 수 있습니다.

### 스테이지

Stage(스테이지)는 다음 Commit에 담을 파일 변경만 골라 둔 상태입니다. 폴더의 모든 변경이 자동으로 포함되지는 않습니다.

### 커밋

Commit(커밋)은 한 가지 완료된 목적을 되돌아볼 수 있게 저장한 기록 지점입니다. 브랜치 이름만으로는 이런 복구 지점이 만들어지지 않습니다.

### 이슈

Issue(이슈)는 문제, 요청, 결정 사항과 완료 조건을 검색 가능하게 남기는 기록입니다. 비슷한 이슈가 있는지 먼저 찾습니다.

### 풀 리퀘스트

Pull Request(풀 리퀘스트)는 브랜치 변경을 Merge하기 전에 검토해 달라고 요청하는 기록입니다. Pull과는 다른 작업입니다.

### 드래프트 풀 리퀘스트

Draft Pull Request(드래프트 풀 리퀘스트)는 아직 Merge 준비가 되지 않은 진행 중인 Pull Request입니다. 이 패키지는 모든 Pull Request를 Draft로 시작합니다.

### 리뷰

Review(리뷰)는 특정 Head SHA에 대해 요구사항, 범위, 품질, 보안, 테스트, 운영 위험을 확인하는 일입니다. 변경 뒤에는 새 SHA를 다시 검토합니다.

### 병합

Merge(병합)는 승인된 Pull Request의 변경을 base Branch에 반영하는 일입니다. 병합 전에는 별도의 최종 승인이 필요합니다.

### 스쿼시 병합

Squash Merge(스쿼시 병합)는 Pull Request의 여러 Commit을 하나의 최종 Commit으로 합쳐 병합하는 방법입니다. 이 패키지에서는 이 방법만 허용합니다.

### SHA

SHA는 특정 Commit을 가리키는 고유 식별자입니다. Review 승인은 검토한 정확한 Head SHA에만 적용됩니다.

### 레이블

Label(레이블)은 Issue와 Pull Request를 분류하고 찾기 쉽게 만드는 구조화된 표시입니다. 제목에 같은 상태를 반복하지 않아도 됩니다.

### 담당자

Assignee(담당자)는 Issue나 Pull Request를 다음 단계로 진행할 책임이 있는 사람입니다. 책임자가 불분명하면 작업을 시작하지 않습니다.

### 완료 조건

Acceptance Criteria(완료 조건)는 Issue가 끝났다고 판단할 수 있는 관찰 가능한 기준입니다. 모호하면 작업 범위를 확정하지 않습니다.

### 라이선스

License(라이선스)는 다른 사람이 패키지를 어떻게 사용할 수 있는지와 지켜야 할 의무를 설명합니다. [MIT License](../LICENSE)는 사용, 복사, 수정, 배포, 재라이선스, 판매를 허용합니다. 배포할 때는 저작권과 라이선스 고지문을 남겨야 하며, 품질이나 특정 목적 적합성을 보증하지 않습니다. [SPDX MIT 페이지](https://spdx.org/licenses/MIT.html)에서 식별자를 확인할 수 있습니다.
