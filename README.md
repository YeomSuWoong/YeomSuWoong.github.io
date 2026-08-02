# Suwoong Yeom — Academic Portfolio

빌드 도구 없이 돌아가는 정적 사이트입니다. GitHub Pages에 그대로 올라갑니다.

```
index.html                  모든 콘텐츠 (여기만 고치면 됨)
styles.css                  디자인 · 색상 토큰 (라이트/다크)
main.js                     테마 토글 · 스크롤 스파이 · 등장 애니메이션
assets/
  profile.jpg               프로필 사진 (4:5로 크롭되어 표시됨)
  favicon.svg
  logos/                    sogang.png · purdue.webp · ajou.png
  papers/placeholder.svg    논문 썸네일 자리
```

## 로컬에서 보기

```powershell
python -m http.server 8000
# http://localhost:8000
```

## 구성

위에서부터 "내가 누구인지" → "무엇을 했는지" 순서입니다.

| 순서 | 섹션 | id | 내용 |
|---|---|---|---|
| 1 | Hero | `#top` | 이름, 한 줄 소개, 연구 키워드 칩, 연락처 버튼 |
| 2 | Education | `#education` | **학위만** (학교 로고 포함) |
| 3 | Experience | `#experience` | Visiting Researcher, 인턴 등 **학위가 아닌 소속** |
| 4 | Selected Work | `#work` | 대표 논문 3편을 카드로 크게 노출 |
| 5 | Publications | `#publications` | Conference / Journal 두 그룹 |
| 6 | Mentoring | `#mentoring` | 함께 연구한 후배 + 그 결과 논문 |
| 7 | Research Projects | `#projects` | 과제 · 산학협력 |

섹션 순서를 바꾸려면 `index.html`에서 `<section>` 블록을 통째로 옮기고,
**내비게이션 `<a>` 순서도 같이 맞춰주세요** — `main.js`의 스크롤 스파이가 내비게이션 순서를 문서 순서로 가정합니다.
배경색은 `band` / `band band-alt`가 번갈아 나오도록 클래스도 다시 맞춰야 합니다.

### Experience vs Education vs Research Projects

학계 CV 관례를 따랐습니다. 헷갈릴 때 기준:

- **Education** — 학위를 받는 과정. B.S. / M.S. / Ph.D. / 석박통합
- **Experience** — 학위 없이 일정 기간 소속된 자리. Visiting Researcher, Research Intern, RA, 산업체 인턴
- **Research Projects** — 소속이 아니라 참여한 *과제*. 국가과제, 산학 공동연구

Visiting과 인턴은 성격이 같아서 Experience 하나로 묶고, 항목 제목에 역할을 씁니다
(`Visiting Researcher`, `Research Intern`). 인턴만 따로 섹션을 만들면 항목이 흩어져 오히려 빈약해 보입니다.

## 남은 작업

`index.html` 안에 `═══ 본인 정보로 교체 ═══` 표시가 있는 곳부터 채우면 됩니다.

- [x] ~~연락처~~ — Email · Google Scholar · GitHub · LinkedIn 연결 완료
- [x] ~~논문 목록~~ — TRiGS(C1) / ICSD-NeRF(J2) / HOIGS(J1) 3편으로 정리 완료
- [ ] **CV PDF** — `assets/cv.pdf`로 넣고 Hero의 `CV (PDF)` 버튼 `href`를 바꾸세요 (지금은 `#`)
- [x] ~~대표 이미지~~ — TRiGS·HOIGS 영상, ICSD-NeRF 그림 적용 완료
- [ ] **TRiGS Project Page 링크** — 아직 `wwwjjn.github.io`를 가리킵니다. 본인 페이지가 따로 있으면 교체하세요
- [ ] **Experience** — 인턴 확정되면 `is-template` 항목 채우기. 회사 로고는 `assets/logos/`에 넣고 `src` 교체
- [ ] **Mentoring** — `is-template` 항목 2개를 실제 멘티·논문으로 교체
- [ ] **Journal** — `is-template` 항목 1개. 저널 논문이 없으면 그룹째 지워도 됩니다
- [ ] **Ajou 학과명** — `B.S. in Electronic Engineering` 부분 확인
- [ ] **논문 썸네일** — `assets/papers/`에 이미지를 넣고 `src` 교체

`is-template` 클래스가 붙은 카드는 점선 테두리와 "템플릿" 뱃지로 표시됩니다.
내용을 채운 뒤 `is-template` 클래스와 `<p class="template-badge">` 줄을 지우면 정식 항목이 됩니다.

## 항목 추가하기

각 섹션의 `<article>` 블록을 통째로 복사해서 쓰면 됩니다.

```html
<!-- 논문 링크 버튼 3종 -->
<a class="pill pill-arxiv" href="...">arXiv</a>
<a class="pill pill-openreview" href="...">OpenReview</a>
<a class="pill" href="...">Project Page</a>
```

### 대표 이미지 자리에 영상 넣기

`<img>` 대신 `<video>`를 넣으면 됩니다. 이미지와 똑같이 16:10 틀에 맞춰집니다.

```html
<video src="assets/papers/트리그스.mp4" autoplay muted loop playsinline
       preload="metadata" aria-label="설명"></video>
```

`muted`와 `playsinline`은 자동재생에 필수입니다 (없으면 브라우저가 막습니다).
`main.js`가 화면에 보일 때만 재생하고, `prefers-reduced-motion`을 켠 방문자에게는
재생을 멈추고 컨트롤을 띄웁니다.

영상은 웹용으로 줄여서 넣으세요. 썸네일이 실제로는 200~320px로 표시되므로 960px 폭이면 충분합니다.

```powershell
# 4초~54초 구간만 잘라서 960px, 무음으로 인코딩
ffmpeg -ss 4 -to 54 -i 원본.mp4 -an -vf "scale=960:-2" `
       -c:v libx264 -pix_fmt yuv420p -crf 30 -preset slow `
       -movflags +faststart assets/papers/이름.mp4
```

`-movflags +faststart`가 있어야 다운로드가 끝나기 전에 재생이 시작됩니다.

## 디자인 수정

색상·폰트는 [styles.css](styles.css) 맨 위 `:root` / `:root[data-theme="dark"]` 변수만 고치면 전체에 반영됩니다.

- 강조색: `--accent` (라이트 `#b8431f`, 다크 `#ff8355`)
- 폰트: 제목 Newsreader(serif), 본문 Inter, 메타데이터 JetBrains Mono
- `--plate`는 논문 figure와 학교 로고가 올라가는 판입니다. 다크모드에서도 밝게 유지되어 흰 배경 이미지가 묻히지 않습니다.

테마는 처음 방문 시 OS 설정을 따르고, 토글을 누르면 그 선택이 `localStorage`에 저장됩니다.

## GitHub Pages 배포

```powershell
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

저장소 → **Settings → Pages** → Source `Deploy from a branch` → Branch `main` / `(root)` → Save

주소는 `https://<username>.github.io/<repo>/` 입니다.
저장소 이름을 `<username>.github.io`로 만들면 `https://<username>.github.io/`로 바로 나옵니다.
