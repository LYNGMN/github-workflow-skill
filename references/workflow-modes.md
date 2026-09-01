# Workflow Modes / 워크플로 모드

The seven GitHub stages are a reference map. Select the mode that reaches the user's requested endpoint; do not perform unrelated stages merely because they exist.

## English

### Mode selection

| Mode | Use when | Required path and endpoint |
| --- | --- | --- |
| **Explain, status, or read-only** | The user asks for a concept, comparison, diagnosis, review, or current state without asking for a change. | Inspect only what is needed and report the result. Do not execute Git stages or mutate GitHub state. |
| **Issue-only** | The requested deliverable is an Issue draft or published Issue. | Search existing Issues and Pull Requests, prepare the bilingual Issue, then stop at the agreed Issue endpoint. Do not create a Branch merely because Issue is first in the reference map. |
| **Local implementation** | The user explicitly wants files changed locally without publication. | Use a purpose Branch, make one-purpose Commit checkpoints, and complete local Review and verification. Stop before Push. |
| **Draft delivery** | The user explicitly wants reviewable remote work but not Merge. | Branch → Commit → non-force Push → Draft Pull Request → Review. When the Draft URL is the requested endpoint and verification passes, report `Status: COMPLETE`. If the requested outcome is Merge, the Draft is only a checkpoint and the overall delivery remains incomplete. |
| **Complete delivery** | The user says implement, fix, change, finish, or otherwise asks for a completed repository result without naming an earlier endpoint. | Use an optional Issue when it adds traceability, then Branch → Commit → Push → Draft Pull Request → Review → final authorization → Ready for review → Squash Merge → verify the actual default Branch. This is the default implementation mode. |
| **Existing Branch or Pull Request** | Valid work already exists. | Inspect and reuse the existing artifacts, resume at the current stage, and continue only to the requested endpoint. Do not recreate earlier stages or replace valid work. |

### Selection rules

1. Record the requested endpoint before acting.
2. Read the target Repository's `CONTRIBUTING` and templates. Do not create an Issue when the task is already clear and the Repository permits a direct Pull Request. Use an Issue first for new features, behavior changes, risky work, unclear requirements, or any case the Repository requires.
3. Do not Push during local implementation, and do not Merge during Draft delivery.
4. If the endpoint changes, explain the additional stages and authorization boundary before continuing.
5. Use [GitHub workflow](github-workflow.md) only for the stages selected by this mode.
6. For Draft delivery or Complete delivery, also use [Delivery contract](delivery-contract.md).

## 한국어

### 모드 선택

| 모드 | 사용하는 경우 | 필요한 경로와 완료 지점 |
| --- | --- | --- |
| **설명, 상태 확인 또는 읽기 전용** | 사용자가 변경을 요청하지 않고 개념, 비교, 진단, 리뷰, 현재 상태를 요청합니다. | 필요한 범위만 확인하고 결과를 보고합니다. Git 실행 단계를 실행하거나 GitHub 상태를 변경하지 않습니다. |
| **Issue만 작성** | 요청한 결과물이 Issue 초안 또는 게시된 Issue입니다. | 기존 Issue와 Pull Request를 검색하고 한영 Issue를 준비한 뒤 합의한 Issue 완료 지점에서 멈춥니다. 참고 순서의 첫 단계라는 이유만으로 Branch를 만들지 않습니다. |
| **로컬 구현** | 사용자가 게시하지 않고 로컬 파일만 수정하라고 명시합니다. | 목적형 Branch를 사용하고 한 가지 목적의 Commit 체크포인트를 만든 뒤 로컬 Review와 검증을 마칩니다. Push 전에 멈춥니다. |
| **초안 배달(Draft delivery)** | 사용자가 원격에서 검토할 수 있는 결과를 원하지만 병합은 원하지 않습니다. | 브랜치 → 커밋 → 비강제 푸시 → 초안 풀 리퀘스트 → 리뷰로 진행합니다. 초안 URL이 요청한 완료 지점이고 검증도 통과하면 `상태: 요청 결과 완료`로 보고합니다. 요청한 최종 결과가 병합이라면 초안은 완료되지 않은 체크포인트일 뿐입니다. |
| **완전 배달(Complete delivery)** | 사용자가 더 이른 완료 지점을 지정하지 않고 구현, 수정, 변경, 완료를 요청합니다. | 추적에 도움이 될 때만 선택적 Issue를 사용하고 Branch → Commit → Push → Draft Pull Request → Review → 최종 승인 → Ready for review → Squash Merge → 실제 기본 브랜치 확인까지 진행합니다. 구현 요청의 기본 모드입니다. |
| **기존 Branch 또는 Pull Request** | 유효한 작업물이 이미 있습니다. | 기존 작업물을 확인하고 재사용하며 현재 단계에서 재개해 요청한 완료 지점까지만 진행합니다. 앞 단계를 다시 만들거나 유효한 작업을 교체하지 않습니다. |

### 선택 규칙

1. 작업 전에 사용자가 원하는 완료 지점을 기록합니다.
2. 대상 Repository의 `CONTRIBUTING`과 templates를 읽습니다. 작업이 이미 명확하고 Repository가 direct Pull Request를 허용하면 Issue를 억지로 만들지 않습니다. 새 기능, 동작 변경, 위험한 작업, 불명확한 요구사항 또는 Repository가 요구하는 경우에는 Issue를 먼저 사용합니다.
3. 로컬 구현에서는 푸시하지 않고, 초안 배달에서는 병합하지 않습니다.
4. 완료 지점이 바뀌면 추가 단계와 승인 경계를 설명한 뒤 계속합니다.
5. [GitHub workflow](github-workflow.md)는 선택한 단계에만 적용합니다.
6. 초안 배달 또는 완전 배달에서는 [배달 계약](delivery-contract.md)도 적용합니다.
