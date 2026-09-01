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

### Bilingual output

For one document containing both languages, use `## English` followed by `## 한국어`. Under an existing `##` topic, use `### English` and `### 한국어`. Generated Issue drafts include complete English and Korean sections. Existing Issue Forms remain English input forms. Separate-language README files stay separate and do not add redundant language headings.

## 한국어

### 모호하지 않은 지시 대상

생략하면 둘 이상의 해석이 가능한 경우에는 주어, 대상, 속성 이름을 명확히 씁니다. 제공된 대상, 속성, 값은 서로 다른 사실로 다룹니다. 예를 들면 다음과 같이 작성합니다.

```text
Discord bot(디스코드 봇)의 표시 이름: `Google News`
Discord bot의 아이콘: 프로젝트의 Google News 아이콘

Discord bot의 표시 이름: `YouTube`
Discord bot의 아이콘: 프로젝트의 YouTube 아이콘
```

이 예시는 설명을 위한 것이며 모든 프로젝트에 적용하는 규칙이 아닙니다.

### 원본 레이아웃

단어, product name, URL, inline code span, Markdown link 중간에는 원본 줄바꿈을 넣지 않습니다. 일정한 열 너비로 문장을 강제 줄바꿈하지 않습니다. 의미 단위 문단을 쓰고 문단, 목록, 표, code block의 앞뒤에는 빈 줄 하나를 둡니다.

### 이중 언어 출력

한 문서에 두 언어를 함께 쓸 때는 `## English` 다음에 `## 한국어`를 둡니다. 기존 `##` topic 아래에서는 `### English`, `### 한국어`를 사용합니다. 생성한 Issue 초안에는 완전한 영어와 한국어 섹션을 모두 넣습니다. 기존 Issue Form은 영어 입력 양식으로 유지합니다. 언어별 README 파일은 분리된 상태로 두며 중복 언어 heading을 추가하지 않습니다.
