# ВЕКТОРЪТ — производствен пакет за видеото
### Всички промпти + инструкции + изисквания. Самодостатъчен — правиш го сам от нулата.

---

## 1. ИЗИСКВАНИЯ КЪМ ФИНАЛНИЯ МАТЕРИАЛ (за да влезе в сайта)

| Параметър | Стойност | Защо |
|---|---|---|
| Брой клипове | **6** (или 1 файл ~48s) | 6 зони на сайта |
| Дължина | **8 сек всеки** | зона = равен дял от скрола |
| Формат | **16:9** | full-bleed на десктоп |
| Резолюция | **720p минимум** (1280×720); 1080p е бонус | сайтът извлича кадри на 1280w |
| Аудио | **НЯМА** | скрабът е ням по дефиниция |
| Текст в кадър | **НУЛА** — единственият текст в света е гравировката VEKTO върху стреличката | всичко друго се бие с типографията |
| Музика | НЯМА | |

**Желязното правило на веригата:** последният кадър на клип N трябва да е
(визуално) първият кадър на клип N+1. Едно движение, без нито едно рязане.

**Съдържателните правила (от реални провали):**
- Преминаването през екрана се случва **ТОЧНО ВЕДНЪЖ** — само в клип 3.
  Клип 4 НЕ повтаря подхода/преминаването. Клип 5 НЕ повтаря коридора.
- Клип 5 излиза в бялото пространство **в първата секунда**, не на третата.
- Гравировката е **VEKTO — 5 букви, веднъж** — във всеки кадър на всеки клип.
- Стреличката е твърд метал винаги — никакво огъване/топене.

Като са готови 6-те клипа → даваш ми ги (или ги пускаш в
`scratchpad/vector-run/`) → аз ги режа на кадри и ги качвам.

---

## 2. РАБОТНИЯТ РЕД (какво в какъв ред генерираш)

```
СТЪПКА 0 · РЕФ КИТ (веднъж)
  0.1  Качи реалното лого: public/images/logo.png
  0.2  IMAGE A — страничен профил (промпт §3.1) + логото като референция
  0.3  IMAGE B — 3/4 изглед (промпт §3.2) + [IMAGE A + лого] като референции
  0.4  IMAGE C — макро на опашката (промпт §3.3) + [IMAGE A + лого]
  → 3-те ъгъла са identity китът. ВСЯКА следваща генерация ги получава.

СТЪПКА 1 · ГРАНИЧНИ КАДРИ (по желание, силно препоръчително)
  K0 — широката сцена (промпт §4.0) + [A + лого]
  K1..K6 — шестте граници (промптове §4.1–4.6) + [A + B + лого]
  → Всеки клип получава end_image = следващата граница. Това държи
    посоката; видео референцията държи непрекъснатостта.

СТЪПКА 2 · КЛИПОВЕТЕ (строго последователно!)
  Клип 1: start_image=K0, end_image=K1, image_references=[A,B,C]
  Клип 2: video_reference=КЛИП 1 (mp4!), end_image=K2, refs=[A,B,C]
  Клип 3: video_reference=КЛИП 2, end_image=K3, refs=[A,B,C]
  Клип 4: video_reference=КЛИП 3, end_image=K4, refs=[A,B,C]
  Клип 5: video_reference=КЛИП 4, end_image=K5, refs=[A,B,C]
  Клип 6: video_reference=КЛИП 5, end_image=K6, refs=[A,B,C]
```

**Модели и настройки (проверени):**
- Картинки: **Nano Banana 2**, resolution 4k (рефове) / 2k (граници)
- Клипове: **Seedance 2.0 Mini**, 720p, 8s, generate_audio: false
  (Mini = 20 кредита/клип и приема video_references + image_references +
  start/end_image — точно каквото трябва. Std е same при 36 кр/720p.)
- **Kling НЕ става** — няма identity референции, стреличката дрифти.

**Провалите, които тези правила покриват (не ги повтаряй):**
1. Без video reference → твърд разрез между клиповете (start_image се
   интерпретира „меко").
2. Без забраната за близък план в клип 1 → моделът си измисля макро
   пасаж и изкривява буквите („VEKKTO").
3. Без „exactly once" за екрана → клип 4/5 преиграват преминаването.

---

## 3. ПРОМПТОВЕ — РЕФ КИТ (Nano Banana 2, 4K)

### 3.1 IMAGE A — страничен профил *(+ логото като референция)*
```
4K studio product photograph on a seamless jet-black background, shot on an
ARRI Alexa with a 100mm macro lens at T4. Subject: THE VECTOR — a
CNC-machined billet-titanium dart, 30 cm long, suspended against pure black
with no visible support. Framing: exact side profile, camera perpendicular
to the shaft axis, dart horizontal, nose pointing frame-right, full length
filling the frame. Geometry: elongated teardrop nose, slender shaft with a
micro-knurled grip band at mid-body, three thin machined fins at exactly
120°. ENGRAVING — THE CRITICAL DETAIL: along the visible side of the shaft,
engrave ONLY the word VEKTO, reproduced EXACTLY in the letterforms of the
provided reference logo image — the same bold industrial sans-serif
wordmark, same letter proportions, same spacing, faithfully copied as if
CNC-engraved into the metal. Nothing else is engraved: no dates, no roman
numerals, no additional text of any kind. The engraving has real cut depth,
crisp chamfered stroke edges, shadow inside the trenches — machined, not
printed. Lighting: one large rectangular softbox upper left, black flags
elsewhere; chrome-silver tonality, deep true blacks, controlled speculars.
Micro-detail: brushed-metal grain running nose-to-tail, faint parallel
milling marks on the fin faces, micro-scratches near the nose tip, the
knurled band resolving individual teeth, the softbox reflected as one
elongated soft-edged rectangle along the body. Industrial instrument,
machine tolerances, no ornamentation. No people, no stand, no props.
```

### 3.2 IMAGE B — 3/4 изглед *(+ [IMAGE A + лого])*
```
Photograph THE EXACT SAME titanium dart shown in the first reference image —
identical CNC-machined billet-titanium body, identical elongated teardrop
nose, identical micro-knurled grip band at mid-body, identical three thin
fins, and the IDENTICAL engraving: only the word VEKTO in the exact wordmark
letterforms of the second reference image. Reproduce the object 1:1; do not
redesign, restyle or reproportion any part. New framing only: three-quarter
front view from slightly below, nose aimed toward upper frame-right, full
object in frame on a seamless jet-black background, no visible support.
Same lighting language: one large rectangular softbox upper left, black
flags elsewhere, chrome-silver tonality, deep true blacks. 4K studio
product photograph, ARRI Alexa, 100mm macro, T4. Machining micro-detail
preserved exactly. No people, no stand, no text anywhere except the VEKTO
engraving.
```

### 3.3 IMAGE C — макро на опашката *(+ [IMAGE A + лого])*
```
Extreme macro photograph of the tail assembly of THE EXACT SAME titanium
dart shown in the first reference image — identical body, identical
micro-knurled grip band, identical three thin machined fins, and the
IDENTICAL engraving: only the word VEKTO in the exact wordmark letterforms
of the second reference image, its final characters curving away with the
cylinder. Reproduce the object 1:1; do not redesign any part. Framing: the
tail fills the frame — fins, knurled band, and the end of the engraving in
sharp focus, shaft falling into creamy macro defocus toward frame edge.
Seamless jet-black background, one large rectangular softbox upper left,
chrome-silver tonality. 4K, ARRI Alexa, 100mm macro, T4, shallow macro
depth of field. Knurling resolved tooth by tooth, engraving trenches with
real cut depth. No people, no props, no text anywhere except the engraving.
```

---

## 4. ПРОМПТОВЕ — ГРАНИЧНИ КАДРИ (Nano Banana 2, 2K, 16:9, всички с [A + B + лого])

### 4.0 K0 — начална сцена (start на клип 1)
```
4K cinematic still, ARRI Alexa, 50mm prime at T2.8, camera at floor height,
wide shot from three meters back. Scene: a dark studio vault — jet-black
walls and floor swallowed in shadow, one large rectangular softbox hanging
upper left as the only light source, thin film of fine dust on the floor.
In the centre, on a low machined-steel museum stand shaped like a wide
letter V (two polished steel arms meeting at a base bar), rests THE EXACT
SAME titanium dart from the reference images. It lies at a shallow
10-degree incline, nose high, pointing frame-right and slightly upward,
presented like a museum exhibit. ENGRAVING: only the word VEKTO in the
exact reference letterforms, real cut depth. No dates, no other text
anywhere in the scene. Photoreal, chrome-silver and jet-black palette,
subtle film grain. No people, no on-screen text.
```

### 4.1 K1 — край на клип 1 / отправна точка на 2
```
Cinematic 16:9 frame. THE EXACT SAME titanium dart from the reference
images shown LARGE in a low three-quarter view filling two-thirds of the
frame width, hovering just above a machined-steel V-shaped stand in a dark
studio vault. Nose aimed up-and-right. One large rectangular softbox upper
left is the only light; its reflection stretches along the brushed body;
the VEKTO engraving reads crisply with real cut depth. Jet-black void
behind, fine dust on the floor. Reproduce the dart 1:1; do not redesign
any part. Photoreal, ARRI Alexa, chrome-silver and jet-black, subtle film
grain. No people, no text except the engraving.
```

### 4.2 K2 — край на клип 2
```
Cinematic 16:9 frame. THE EXACT SAME titanium dart from the reference
images in EXACT SIDE PROFILE at half frame width, hovering 20 centimeters
above an empty machined-steel V-shaped stand in a dark studio vault, nose
aimed up-and-right at 35 degrees, taut like a drawn arrow. Thin dust
settling beneath it. One rectangular softbox upper left. Far behind in the
black depth, aligned with the dart's aim toward upper right, one small
faint vertical rectangle of white glow — a distant standing phone screen.
Reproduce the dart 1:1. Photoreal, chrome-silver and jet-black, subtle
film grain. No people, no text except the VEKTO engraving.
```

### 4.3 K3 — край на клип 3
```
Cinematic 16:9 frame, seen from directly behind. THE EXACT SAME titanium
dart from the reference images — identical tail fins and knurled band
visible from the rear — small and centered, flying away from camera into
deep darkness, rim-lit silver. At the frame edges, the last luminous
ripple of a sealed liquid-glass surface contracts and fades. Far ahead in
the darkness, faint blurred vertical slivers of cool white glow hint at a
corridor of standing panels. Reproduce the dart 1:1. Photoreal,
chrome-silver and jet-black with soft white glow, subtle film grain. No
people, no text, no logos anywhere.
```

### 4.4 K4 — край на клип 4
```
Cinematic 16:9 frame, chase view from behind and slightly above. THE EXACT
SAME titanium dart from the reference images — centered, flying away from
camera, nose beginning to pitch upward, exiting a dark corridor of tall
glowing vertical glass panels: the final two panels slip past the left and
right frame edges, their glow showing only blurred indistinct footage.
Ahead the darkness dissolves into a growing pale bone-white haze. Panel
glow streaks as real reflections along the dart's brushed titanium body.
Reproduce the dart 1:1. Photoreal, chrome-silver and jet-black with cool
muted glow, never neon, subtle film grain. No people, no readable text, no
logos anywhere.
```

### 4.5 K5 — край на клип 5
```
Cinematic 16:9 extreme wide frame. An infinite seamless bone-white
cyclorama, softly and evenly lit, no horizon. One unbroken polished-chrome
ribbon — a solid rigid contrail — rises from lower-left in a steepening
curve toward upper-right, reading as a growth graph drawn in mirror metal.
At its very tip in the upper right: THE EXACT SAME titanium dart from the
reference images, tiny but sharp, nose up-and-right. On the floor near
lower frame-right sits a small low matte-black rectangular plinth with
hard machined edges. Reproduce the dart 1:1. Photoreal, chrome-silver and
jet-black over bone-white, soft even daylight, subtle film grain. No
people, no text, no logos anywhere.
```

### 4.6 K6 — финалът (паметникът)
```
Cinematic 16:9 frame, low static angle at plinth level. THE EXACT SAME
titanium dart from the reference images planted NOSE-DOWN in the top face
of a low matte-black machined plinth, standing perfectly vertical like a
monument, fins crowning the top. The engraving reads down the vertical
shaft: ONLY the word VEKTO, in the exact wordmark letterforms of the logo
reference image, crisp, with real cut depth — fully legible, correctly
spelled, nothing else engraved. A soft contact shadow pools at the base; a
thin ring of settled dust on the plinth top. Dart and plinth occupy the
lower third of frame; the upper two-thirds are pure empty bone-white
negative space. Reproduce the dart and lettering 1:1; do not invent or
distort any characters. Photoreal, chrome-silver and jet-black over
bone-white, subtle film grain, monumental calm. No people, no other text.
```

---

## 5. ПРОМПТОВЕ — КЛИПОВЕТЕ (Seedance 2.0 Mini · 16:9 · 8s · 720p · без аудио)

> Трите LOCK реда се слагат В КРАЯ НА ВСЕКИ промпт, дословно:
> ```
> LETTERING LOCK: the engraving reads exactly V-E-K-T-O — five letters,
> engraved once, exactly as in the reference images; never duplicate,
> repeat, stretch, warp or invent any letter, in any frame.
> [NO TEXT LOCK] Render zero on-screen text, captions, subtitles, logos or
> watermarks. The only text in the world is the physical VEKTO engraving.
> [NO MUSIC LOCK] No music, no score. Silent output.
> ```

### КЛИП 1 · ХРАНИЛИЩЕТО *(start_image=K0, end_image=K1, refs=[A,B,C])*
```
[SHOT] ARRI Alexa, 50mm, floor height. One continuous SLOW dolly-in from
the wide start framing, steadily decelerating, ending EXACTLY on the
provided end frame's framing — the dart large in a low three-quarter view
at two-thirds of frame width. The camera NEVER moves closer than the end
frame; no macro pass, no extreme close-up at any point.
[SCENE] Dark studio vault, single rectangular softbox upper left,
machined-steel V-shaped stand, fine dust on the floor. The titanium dart
from the reference images rests motionless on the stand.
[ACTION] The dart stays perfectly motionless; only the camera moves. The
softbox reflection slides slowly along the brushed body as the camera
approaches and the VEKTO engraving resolves with real cut depth.
[STYLE] Photoreal, chrome-silver and jet-black, deep true blacks, subtle
film grain, rigid solid metal, no stylization.
+ трите LOCK реда
```

### КЛИП 2 · ЗАПАЛВАНЕТО *(video_reference=клип1, end_image=K2, refs)*
```
SEAMLESS CONTINUATION: this shot begins on the EXACT final frame of the
provided reference video — same dart, same V-shaped steel stand, same
framing, same single-softbox lighting, same film grain — and continues its
motion without any cut, jump, or reframe.
[SHOT] ARRI Alexa, 50mm. From the reference video's final framing the
camera eases slightly wider and level, one smooth continuous move, ending
exactly on the provided end frame: the dart in side profile at half frame
width, hovering above the empty stand, a small vertical white screen glow
far behind in the black depth on its aim line.
[ACTION] One continuous maneuver: the dart lifts gently off the stand,
rises 20 centimeters and rotates in one unbroken motion into a side
profile aimed up-and-right at 35 degrees, hovering taut like a drawn
arrow. A soft puff of fine dust displaces off the stand at lift-off. Deep
in the background the distant standing phone screen fades in as a small
vertical rectangle of white glow.
[STYLE] Photoreal, chrome-silver and jet-black, deep blacks, subtle film
grain, rigid solid metal.
+ трите LOCK реда
```

### КЛИП 3 · ЕКРАНЪТ *(video_reference=клип2, end_image=K3, refs)*
```
SEAMLESS CONTINUATION: this shot begins on the EXACT final frame of the
provided reference video — the titanium dart hovering nose-up toward the
distant glowing screen — and continues its motion without any cut, jump,
or reframe.
[SHOT] ARRI Alexa, 35mm. The camera swings behind the dart and locks into
a matched-speed chase as it launches, crossing the glass surface half a
second after the fins, ending exactly on the provided end frame: behind
the dart in darkness, the sealed luminous ripple fading at the frame
edges, faint corridor glows far ahead.
[ACTION] One primary action: the dart accelerates in a straight line into
the center of the tall glowing phone screen and passes THROUGH it — the
glass yields like a heavy liquid membrane, dimpling and wrapping around
the nose in slow concentric ripples, letting it through whole. Nothing
shatters. THIS IS THE ONLY SCREEN PASS IN THE ENTIRE FILM.
[STYLE] Photoreal, chrome-silver and jet-black with soft white glow, deep
blacks, subtle film grain; the dart stays rigid solid metal — only the
glass deforms.
+ трите LOCK реда
```

### КЛИП 4 · ФИЙДЪТ *(video_reference=клип3, end_image=K4, refs)*
```
SEAMLESS CONTINUATION: this shot begins on the EXACT final frame of the
provided reference video — behind the titanium dart flying into darkness,
faint glows ahead — and continues its motion without any cut, jump, or
reframe. DO NOT show any screen, any approach to a screen, or any
pass-through again — that already happened. This clip is ONLY the corridor.
[SHOT] ARRI Alexa, 35mm chase cam locked behind and slightly above the
dart at matched speed, swaying gently with its slalom, ending exactly on
the provided end frame: the last two glowing panels slipping past the
frame edges, pale bone-white haze opening ahead, the dart's nose pitching
upward.
[ACTION] One primary action: tall glowing vertical panels rise on both
sides forming a dark corridor — phone-proportioned glass slabs in receding
rows sliding backward past camera, each showing only blurred indistinct
footage, cool desaturated silver-white, nothing readable. The dart carves
a shallow fast slalom between them, panel glow streaking as real
reflections along its brushed body, then the rows thin out and a
bone-white haze grows ahead.
[STYLE] Photoreal, chrome-silver and jet-black with cool muted glow, never
neon, deep blacks, subtle film grain, rigid solid metal.
+ трите LOCK реда
```

### КЛИП 5 · КРИВАТА *(video_reference=клип4, end_image=K5, refs)*
```
SEAMLESS CONTINUATION: this shot begins on the EXACT final frame of the
provided reference video — the titanium dart exiting the glowing corridor,
nose pitching up, bone-white haze ahead — and continues without any cut.
THE CORRIDOR ENDS WITHIN THE FIRST SECOND: the dart bursts into the open
white space immediately; do not replay the corridor, the panels, or any
tunnel imagery after the first second.
[SHOT] ARRI Alexa, 24mm wide. The camera pulls straight back and drifts
down in one long continuous widening move, ending exactly on the provided
end frame: extreme wide bone-white space, one unbroken chrome curve rising
from lower-left toward upper-right, the dart tiny at its tip, a small
matte-black plinth on the floor near lower frame-right.
[ACTION] One primary action: the dart climbs up-and-right in a steepening
curve through the infinite seamless bone-white cyclorama, extruding from
its tail a solid polished-chrome contrail — a continuous rigid ribbon of
mirror metal that stays exactly where it was drawn, sagging nowhere,
fading never. The flight path reads as a rising graph line drawn in
chrome.
[STYLE] Photoreal, chrome-silver and jet-black over bone-white, soft even
daylight, subtle film grain, rigid solid metal.
+ трите LOCK реда
```

### КЛИП 6 · ЗАБИВАНЕТО *(video_reference=клип5, end_image=K6, refs)*
```
SEAMLESS CONTINUATION: this shot begins on the EXACT final frame of the
provided reference video — the extreme wide bone-white space with the
chrome curve rising and the titanium dart at its tip, black plinth on the
floor — and continues its motion without any cut, jump, or reframe.
[SHOT] ARRI Alexa, 35mm. The camera descends and pushes toward the plinth
in one decelerating move, settling at plinth level in a low static angle
and holding completely motionless for the final two seconds, ending
exactly on the provided end frame: the dart planted nose-down and
perfectly vertical in the black plinth, fins crowning the top, the VEKTO
engraving reading down the shaft, upper two-thirds of frame pure empty
bone-white.
[ACTION] One primary action: at the apex the dart pitches over in one
clean rotation until its nose points straight down, drops in a fast
vertical dive and drives its nose into the plinth top with a single
decisive hit, stopping instantly, standing perfectly vertical like a
monument. The three fins give exactly one short vibration and go still. A
thin ring of dust kicks off the plinth and settles. The chrome contrail
drifts out of frame above as the camera drops.
[STYLE] Photoreal, chrome-silver and jet-black over bone-white, soft even
light, subtle film grain, monumental calm, rigid solid metal.
+ трите LOCK реда
```

---

## 6. КОНТРОЛ НА КАЧЕСТВОТО (проверявай СЛЕД ВСЕКИ клип, преди следващия)

- [ ] Гравировката чете „VEKTO" (5 букви) в началото, средата И края на клипа
- [ ] Последният кадър съвпада (по композиция) с граничния кадър K
- [ ] Първият кадър продължава последния на предишния клип без скок
- [ ] Стреличката е същият обект (перки, накатка, нос) като реф кита
- [ ] Няма текст/лога/субтитри никъде другаде в кадъра
- [ ] Клип 3: екранът се преминава веднъж; Клип 4: само коридор; Клип 5: бялото от 1-вата секунда

Ако клип пропадне на нещо → регенерирай САМО него (същите входове).
Веригата е модулна — не пипаш останалите.

---

## 7. КАКВО ПРАВЯ АЗ, КАТО МИ ДАДЕШ КЛИПОВЕТЕ

1. `ffmpeg` → 12fps → 96–97 кадъра на клип → 577 общо
2. Два сета: 1280w q74 (десктоп ~11MB) + 960w q58 (телефон ~6MB)
3. Нова версионирана директория `/scrub/v3*` (кешът никога не пречи)
4. Seam-check на всичките 5 граници + luminance скан за повторени мотиви
5. Ако някой шев има микро-скок → 6–8 кадров dissolve, изпечен в кадрите
6. Деплой
