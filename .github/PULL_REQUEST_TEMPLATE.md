# `type(scope): completed outcome`

Use [Contribution guidelines](../CONTRIBUTING.md) and [Writing guidelines](../references/writing-guidelines.md) before drafting. Use English for publication. The Korean review copy must translate every required field and section completely. It must not use “same as above”, “위와 동일”, a summary, or a cross-reference to the English section. Search existing Issues/Pull Requests first; do not end the title with a period.

## English

### Purpose

### Related Issue / Pull Request

<!-- Prefer one primary Issue. Use `Closes #N` only when this Pull Request fully completes it. Use `Refs #N` for partial work, a dependency, or an intentionally split scope that must remain open. -->

### Changes

<!-- List only work present in the reviewed diff that serves the stated Purpose. Do not copy the whole conversation or list planned work. -->

### User Impact

### Verification

### Scope Note (optional)

<!-- Delete this section unless adjacent behavior could reasonably be misunderstood as changed. State the present boundary only. Put independently deliverable future work in its own Issue, not here. -->

### Risk/Recovery (when relevant)

### Screenshots/Evidence (when relevant)

### Search keywords

### Draft blockers

<!-- List only work required before this Pull Request can become Ready for review. If none remains, write `None`. Do not list later, separate work here. -->

### Review Checklist

- [ ] This Pull Request remains Draft until final authorization.
- [ ] Requirements, Acceptance Criteria, and scope were reviewed on this exact Head SHA.
- [ ] Quality, security, tests, and operational risk were reviewed.
- [ ] Before final approval, the exact Pull Request, Base Branch, Head Branch, Head SHA, current checks, unresolved reviews, required reviews, mergeability, method, and expected Squash title were shown.
- [ ] After final authorization, this Pull Request was first changed from Draft to Ready for review.
- [ ] After Ready for review, required Code Owner reviews and checks were awaited and passed; unchanged Head/base/title/method, conflicts, mergeability, and that Squash Merge is enabled were re-checked immediately before Merge.
- [ ] New changes received new tests and review; earlier approval was not reused.

### Merge Checklist

- [ ] One explicit final approval for this exact state first authorizes changing the Pull Request from Draft to Ready for review. After that transition, required reviews and checks are awaited and must pass; only then does the same approval authorize Squash Merge.
- [ ] Any new commit, base/title/method change, failing check, conflict, or blocking review stopped Merge, invalidated the existing final approval, and required a new exact-state final approval after resolution. A new state or corrective development returned this Pull Request to Draft before retest and re-review; a transient failed check, conflict, or blocking review also invalidated approval and returned to Draft before corrective development.
- [ ] The expected Squash Commit title matches this approved Pull Request title, and Squash Merge is the enabled method.
- [ ] After Merge, the default-branch Squash SHA, Pull Request merged state, and linked Issue closure were verified.

Checking these boxes does not grant Merge approval. Do not rewrite or Force Push merely to combine branch commits. Deployment and branch deletion require separate decisions.

## 한국어

<!-- Translate every required field completely. Do not use “same as above”, “위와 동일”, a summary, or a cross-reference. -->

### 목적

### 관련 Issue / Pull Request

<!-- primary Issue 하나를 우선합니다. 이 Pull Request가 Issue를 완전히 완료할 때만 `Closes #N`을 사용합니다. 부분 구현, 의존 관계, Issue를 열린 상태로 유지해야 하는 의도적인 범위 분리에는 `Refs #N`을 사용합니다. -->

### 변경 내용

<!-- Review한 diff에 존재하고 명시한 목적에 기여하는 작업만 적습니다. 전체 대화를 옮기거나 계획 중인 작업을 나열하지 않습니다. -->

### 사용자 영향

### 검증

### 범위 참고 (선택 사항)

<!-- Review하는 사람이 인접 동작의 변경 여부를 합리적으로 오해할 수 있을 때만 남기고, 아니면 이 섹션을 삭제합니다. 현재 경계만 설명합니다. 독립적으로 완료할 향후 작업은 여기가 아니라 자체 Issue에 기록합니다. -->

### 위험 및 복구 (필요한 경우)

### 스크린샷 및 증거 (필요한 경우)

### 검색 키워드

### Draft 해제 전 남은 작업

<!-- 이 Pull Request를 Ready for review로 전환하기 전에 반드시 완료해야 하는 작업만 적습니다. 남은 작업이 없으면 `없음`이라고 적습니다. 나중에 별도로 진행할 작업은 적지 않습니다. -->

### 리뷰 체크리스트

- [ ] 이 Pull Request는 최종 승인 전까지 Draft 상태를 유지합니다.
- [ ] 요구사항, Acceptance Criteria, 범위를 이 정확한 Head SHA에서 Review했습니다.
- [ ] 품질, 보안, 테스트, 운영 위험을 Review했습니다.
- [ ] 최종 승인 전에 정확한 Pull Request, Base Branch, Head Branch, Head SHA, 현재 checks, 미해결 reviews, 필수 reviews, 병합 가능 여부, 병합 방식, 예상 Squash title을 보여 주었습니다.
- [ ] 최종 승인 뒤 이 Pull Request를 먼저 Draft에서 Ready for review로 전환했습니다.
- [ ] Ready for review 전환 뒤 필수 Code Owner reviews와 checks를 기다리고 통과했으며, Merge 직전에 Head/base/title/method 변경 여부, conflicts, 병합 가능 여부, Squash Merge 허용 상태를 다시 확인했습니다.
- [ ] 새 변경에는 새 테스트와 Review를 수행했으며 이전 승인을 재사용하지 않았습니다.

### 병합 체크리스트

- [ ] 이 정확한 상태에 대한 명시적인 최종 승인 한 번은 먼저 Draft에서 Ready for review로 Pull Request 상태를 전환하도록 허가합니다. 전환 뒤 필수 reviews와 checks를 기다리고 모두 통과해야 하며, 그때만 같은 승인으로 Squash Merge를 허가합니다.
- [ ] 새 Commit, base/title/method 변경, 실패한 check, conflict, blocking review가 생기면 Merge를 멈추고 기존 최종 승인을 무효화하며, 해결 뒤 새 정확한 상태에 대한 최종 승인을 받습니다. 새 상태나 수정 개발은 retest와 re-review 전에 Pull Request를 Draft로 되돌립니다. 일시적인 failed check, conflict, blocking review도 승인을 무효화하며 수정 개발 전에 Draft로 되돌립니다.
- [ ] 예상 Squash Commit 제목은 승인된 Pull Request 제목과 일치하며 Squash Merge가 허용된 병합 방식입니다.
- [ ] Merge 뒤 default-branch Squash SHA, Pull Request merged 상태, 연결된 Issue 종료 여부를 확인했습니다.

체크박스를 선택하는 것만으로 Merge 승인이 되지는 않습니다. Branch Commit을 합치기 위해 rewrite하거나 Force Push하지 않습니다. 배포와 Branch 삭제는 별도 결정입니다.
