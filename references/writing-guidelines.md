# Clear Writing Guidelines

## English

### Unambiguous referents

Keep explicit subjects, objects, and property names whenever omitting them could create more than one interpretation. Treat supplied target, property, and value as separate facts. For example:

```text
Discord bot display name: `Google News`
Discord bot icon: the project's Google News icon

Discord bot display name: `YouTube`
Discord bot icon: the project's YouTube icon
```

These are illustrative examples, not a universal project rule.

### Source layout

Do not insert a source newline inside a word, product name, URL, inline code span, or Markdown link. Do not hard-wrap prose at a fixed column. Use semantic paragraphs and one blank line around paragraphs, lists, tables, and code blocks.

For every Markdown table, keep the header, delimiter, and every body row at the same number of columns. Validate the Markdown source structure and inspect the rendered table before publication. Treat a malformed or unreadable rendered table as unfinished work.

### Conversation language and progress

In conversation, match ordinary prose, status labels, and progress labels to the user's language. An English response uses `Status: ...`, `Current stage:`, `Remaining stages:`, and `Next step:`. A Korean response uses `상태: ...`, `현재 단계:`, `남은 단계:`, and `다음 단계:`. Never combine the English and Korean status in one field. Put each field on its own line, keep the next-step field last, and describe meaningful milestones rather than routine internal reading or tool calls.

For Korean conversation, write technical terms in Korean first and place the English original in parentheses on first occurrence, such as `풀 리퀘스트(Pull Request)`, `헤드 SHA(Head SHA)`, and `스쿼시 병합(Squash Merge)`. Do not mix Korean-first and English-first parenthetical ordering. After teaching the term once, use the shorter Korean form consistently when the meaning remains clear. Do not translate product names, code, commands, paths, or identifiers.

### Bilingual output

For one document containing both languages, use `## English` followed by `## 한국어`. Under an existing `##` topic, use `### English` and `### 한국어`. Generated Issue drafts include complete English and Korean sections. Existing Issue Forms remain English input forms. Separate-language README files stay separate and do not add redundant language headings.

## 한국어

### 모호하지 않은 지시 대상

생략하면 둘 이상의 해석이 가능한 경우에는 주어, 대상, 속성 이름을 명확히 씁니다. 제공된 대상, 속성, 값은 서로 다른 사실로 다룹니다. 예를 들면 다음과 같이 작성합니다.

```text
디스코드 봇(Discord bot)의 표시 이름: `Google News`
디스코드 봇의 아이콘: 프로젝트의 Google News 아이콘

디스코드 봇의 표시 이름: `YouTube`
디스코드 봇의 아이콘: 프로젝트의 YouTube 아이콘
```

이 예시는 설명을 위한 것이며 모든 프로젝트에 적용하는 규칙이 아닙니다.

### 원본 레이아웃

단어, product name, URL, inline code span, Markdown link 중간에는 원본 줄바꿈을 넣지 않습니다. 일정한 열 너비로 문장을 강제 줄바꿈하지 않습니다. 의미 단위 문단을 쓰고 문단, 목록, 표, code block의 앞뒤에는 빈 줄 하나를 둡니다.

모든 마크다운 표(Markdown table)는 헤더, 구분선, 모든 본문 행의 열 수를 같게 유지합니다. 게시하기 전에 마크다운 원본 구조를 검증하고 렌더링된 표를 확인합니다. 표가 잘못 표시되거나 읽기 어려우면 작업이 완료되지 않은 상태로 판단합니다.

### 대화 언어와 진행 안내

대화 답변의 일반 문장, 상태 표시, 진행 필드는 사용자 언어에 맞춥니다. 한국어 답변은 `상태: ...`, `현재 단계:`, `남은 단계:`, `다음 단계:`를 사용하고, 영어 답변은 `Status: ...`, `Current stage:`, `Remaining stages:`, `Next step:`을 사용합니다. 상태 표시 한 곳에 영어와 한국어를 함께 적지 않습니다. 각 필드를 별도 줄에 두고 다음 단계 필드를 마지막에 두며, 일상적인 내부 문서 읽기나 도구 호출보다 의미 있는 작업 지점을 설명합니다.

한국어 대화에서 기술 용어는 처음 등장할 때 `풀 리퀘스트(Pull Request)`, `헤드 SHA(Head SHA)`, `스쿼시 병합(Squash Merge)`처럼 한국어를 먼저 쓰고 영어 원어를 괄호 안에 적습니다. `영어(한국어)` 순서를 섞어 쓰지 않습니다. 한 번 설명한 뒤에는 뜻이 명확하면 짧은 한국어 표현을 일관되게 사용합니다. 제품명, 코드, 명령, 경로, 식별자는 번역하지 않습니다.

### 이중 언어 출력

한 문서에 두 언어를 함께 쓸 때는 `## English` 다음에 `## 한국어`를 둡니다. 기존 `##` topic 아래에서는 `### English`, `### 한국어`를 사용합니다. 생성한 Issue 초안에는 완전한 영어와 한국어 섹션을 모두 넣습니다. 기존 Issue Form은 영어 입력 양식으로 유지합니다. 언어별 README 파일은 분리된 상태로 두며 중복 언어 heading을 추가하지 않습니다.
