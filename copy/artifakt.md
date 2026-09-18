# Artifakt — Tracing your way past the blank canvas

<!-- Extracted from src/content/case-studies/artifakt.js by scripts/copy.mjs.
     A VIEW, not a source: edit the .js, then re-run `npm run copy artifakt`.
     Path comments name each block's location in that module. -->

<!-- frame.category -->
AI Prompt Engineering / Gen Design / UX Research

<!-- frame.oneLiner -->
Guided DIY — a trace, an artist, an artifact

<!-- frame.role -->
0→1 designer, from research to final product

<!-- frame.date -->
Jun 2026

<!-- frame.liveLabel -->
Try it out

<!-- body[0].title -->
## Made by you. Finished by an artist.

<!-- body[0].prose[0] -->
You type a word, trace a loose line drawing by hand, and it comes back in the style of a real artist. The tool **inspires you and helps you finish your traced idea with the help of real artists**.

<!-- body[0].prose[1] -->
What if an AI image generation tool could inspire and teach people about drawing and art? How could this tool increase personality and authenticity in drawing in order to feel "less generic"? And when do people decide where that authenticity breaks down? When do they trust their own sense of taste or imperfection against something that is more perfect but clearly machine-generated? This tool prompts users to **seek originality in drawing generation by starting with an intention that is true to the person creating it**.

<!-- body[1].title -->
## What it is

<!-- body[1].prose[0] -->
Artifakt is a mobile tool that turns a typed intention into a hand-drawn artwork in the style of a real artist. It’s built to **spark creativity rather than stand in for it: every result is unique to the person who traced it, and every result arrives with an artist worth being curious about**.

<!-- body[1].prose[1] -->
**An example to trace**, so "I can’t draw" doesn’t end the gesture before it starts.

<!-- body[1].prose[2] -->
Style is applied *after* tracing, never during. The intent of the tool is that **your line stays the structure of the final piece**. This works most of the time, though not perfectly.

<!-- body[1].prose[3] -->
A fixed, curated group of artists help elevate your drawing: Louise Bourgeois, Kara Walker, Niki de Saint Phalle, Naoko Takeuchi, Keith Haring. Ideally, this group of artists would grow over time: **more female, queer, "invisible" artists that would diversify the present collective imagery on the internet**.

<!-- body[1].media.caption -->
*Caption: state 21.08.26*

<!-- body[1].extraMedia.caption -->
*Caption: Five artists, a fixed curated roster*

<!-- body[2].title -->
## The question: made by me — but make it good

<!-- body[2].note -->
> **Guide:** My test was flawed. The finding wasn’t.

<!-- body[2].prose[0] -->
An early test contradicted me. I showed three versions of the same birthday cake, from a rough doodle to a coloured illustration.

<!-- body[2].prose[1] -->
Three of five picked the coloured one. One had just told me she preferred things that look handmade, then called her pick too regular to feel human.

<!-- body[2].prose[2] -->
**Nobody agreed on what looks machine-made, either.** Some pointed at the smoothest lines, one at the roughest sketch because it looked "fastly done". The test was a bit flawed: I realised too late that colour was what drove most of those picks. But the contradiction in the answers was what stayed with me:

<!-- body[2].prose[3] -->
**People want to have made it, and they want it to look good. They don’t want to choose.**

<!-- body[2].prose[4] -->
That’s why the reveal became my first design focus, ahead of the drawing tool. It had to land first for the tool to work.

<!-- body[2].media.caption -->
*Caption: Testing question “Which one feels like it came from someone who cares?” / “Where does it start to feel machine-made?”*

<!-- body[3].title -->
## The reveal: separating structure from style

<!-- body[3].note -->
> **Guide:** With the reveal as the main design focus, finding the right balance between the trace and the artist’s style proved more challenging than expected.

<!-- body[3].prose[0] -->
The traced line is what shows the effort, and **the reveal is where it shows**. That is why I built the transformation before the drawing tool.

<!-- body[3].prose[1] -->
**Wished result**:

<!-- body[3].prose[2] -->
- traced line legible,
- artist’s hand clear,
- surprise so it feels like a new artwork, not a filter.

<!-- body[3].prose[3] -->
**The result I got**:

<!-- body[3].prose[4] -->
- The model used **the most iconic subject or visual of each artist** (which makes sense, because those are the images most present online).

<!-- body[3].prose[5] -->
**What didn’t work**:

<!-- body[3].prose[6] -->
- Replicate + ControlNet overlays new images, losing visible lines.
- Flux Pro Redux never sent the sketch.

<!-- body[3].prose[7] -->
**Solution 1**: Describe the material, gesture, technique first (thread, tension, stitched surface) instead of naming the artist.

<!-- body[3].prose[8] -->
**Solution 2**:

<!-- body[3].prose[9] -->
- **Split pipeline**: Pass 1 builds structure without artist, Pass 2 adds artist and colour.
- Eight phases tested strength values; low kept the sketch, high gave beautiful but not mine.

<!-- body[3].prose[10] -->
***Lesson**: If the same trade-off keeps coming back after a few adjustments, stop adjusting and rethink how the pipeline is built.*

<!-- body[3].media.caption -->
*Caption: Traced line not legible and lack of originality in visual representations.*

<!-- body[3].pipeline.title -->
## How the pipeline works

<!-- body[3].pipeline.link.label -->
The 14 phases behind this pipeline

<!-- body[3].pipeline.steps[0].preview.caption -->
*Caption: Raw user sketch on the canvas — loose pencil lines, no colour.*

<!-- body[3].pipeline.steps[1].preview.caption -->
*Caption: Sketch cleaned and line weight adjusted per artist before the model sees it. Think of it as defining brushes in a drawing tool — but to support the unique gesture of each artist.*

<!-- body[3].pipeline.steps[2].preview.caption -->
*Caption: Gesture and material established — strong form, no artist colour yet.*

<!-- body[3].pipeline.steps[3].preview.caption -->
*Caption: Artist identity applied — colour, motifs and full style on top.*

<!-- body[3].pipeline.steps[4].preview.caption -->
*Caption: Final artwork shown on Screen 2.*

<!-- body[4].title -->
## The outline: leaving room to make it yours

<!-- body[4].note -->
> **Guide:** I built the outline to guide users, but testers felt it was telling them what to draw.

<!-- body[4].prose[0] -->
Testing raised the project’s sharpest question:

<!-- body[4].prose[1] -->
> "Why trace something that’s already there?" — Jules

<!-- body[4].prose[2] -->
The outline was too complete, so tracing felt pointless rather than like making something. All testers noticed this.

<!-- body[4].prose[3] -->
- **First idea** — UX tweaks: softer copy, looser prompts, art-school style (think volumes first). The model didn’t get it.
- **Costly detour**: generating the outline via img2img on an SVG motif. Biggest credit chunk, but it made a more finished illustration.
- **Reframe**: "Make this less detailed" is subtraction, not generation. Image-to-image changes style, not structure.
- **Fix** in code, not prompts: generate a sketch, then subtract — grayscale → blur → Canny → flood-fill → keep outer contours. Prototyped in Python, ported to browser Canvas for static hosting.
- **Still a problem**: flood-fill assumes closed contours. Give it a bike, it fills the canvas black.

<!-- body[4].prose[4] -->
With a simpler outline, tracing felt like a choice. Wording mattered: "trace the image" implied precision. Softer wording changed behaviour more than the interface.

<!-- body[4].prose[5] -->
***Lesson**: when UX tweaks fail, look upstream. This was a generation issue disguised as interaction.*

<!-- body[4].link.label -->
The contour-reduction experiments

<!-- body[4].media.caption -->
*Caption: Reducing it to its outer contours*

<!-- body[5].title -->
## Designing against the model’s defaults

<!-- body[5].note -->
> **Guide:** Showcasing female and queer artists made representation a key design consideration, from how source images were selected to how they were reinterpreted.

<!-- body[5].prose[0] -->
Type "strong" and Flux gives you a white man. Ask Naoko Takeuchi for a character and you get a blonde, blue-eyed one, whatever the keyword. The bodies the model draws by default are thin, white and European, and they stay that way unless you describe something else.

<!-- body[5].prose[1] -->
- **Doesn’t work:** negation. "Not white" or "diverse" collapses straight back to the average.
- **Works:** naming skin tone, hair and body type in the prompt. I also placed the figure in the foreground and rotated the subjects, so the same default body doesn’t come back every time.

<!-- body[5].prose[2] -->
The harder part wasn’t technical. The model often suggested well-known artists like Picasso because they were easier to generate and saved me hours of work. But **choosing artists simply because the model knew them better would undermine the purpose of the product**.

<!-- body[5].prose[3] -->
***Lesson:** I added this remediation after seeing skewed output; it should have been in the initial prompt since representation is a key value.*

<!-- body[5].link.label -->
The per-artist prompt table

<!-- body[5].media.caption -->
*Caption: Correcting representation biases*

<!-- body[6].title -->
## Hesitation, then delight

<!-- body[6].note -->
> **Guide:** I expected the tracing to be the fun part. It was the part people dreaded.

<!-- body[6].prose[0] -->
Four moderated in-person sessions.

<!-- body[6].prose[1] -->
**Every single person hesitated before tracing. Every single person lit up at the result.** All said they were inspired and would send it — and wanted to make another straight away.

<!-- body[6].prose[2] -->
**That gap is the finding**. People don’t understand why they’re drawing until they see what it becomes. The doubt comes first, the reward comes last. A good ending doesn’t validate the path to it.

<!-- body[6].prose[3] -->
It also answered the question I started with. **Ownership is partial: it’s my idea but not my drawing.** That’s the honest ceiling for a tool that hands you something to trace — and enough to make them want to send it.

<!-- body[6].prose[4] -->
- **Killed.** The onboarding animation confused three testers in a row. Removed rather than redesigned a fourth time.
- **Still open.** The artist bio — the most culturally meaningful moment in the product — was the least discovered thing in it.
- **Still open.** Erase clears everything; testers expected stroke-by-stroke undo.
- **Next test.** Promise the reveal before the trace, and see whether the hesitation drops.

<!-- body[6].media.caption -->
*Caption: User testing session*

<!-- body[7].title -->
## What this changed about how I work

<!-- body[7].prose[0] -->
Everything that moved this project forward came from **changing the question rather than the setting**. **Two passes instead of a better strength value. Subtraction instead of a better prompt.** Each time I got there after two or three rounds of tuning that felt productive and weren’t.

<!-- body[7].prose[1] -->
**AI output arrives looking finished**, which makes it easy to accept as a given and tune around the edges. The design work is in **refusing that** — knowing what the model is actually doing, and noticing where its convenience is quietly making a decision that should have been yours.

<!-- body[7].media.caption -->
*Caption: Mental model for the two-pass pipeline, borrowed from childhood art classes: study the technique, study the subject, then put both away and make your own.*

<!-- body[8].title -->
## The Process — 14 phases, documented

<!-- body[8].prose[0] -->
Four weeks, solo, built during cohort 6 of Patricia Reiners’ AI for Designers. Same timeline as PitchPivot, considerably heavier underneath — **most of those hours went into the image pipeline, not the interface**.

<!-- body[8].prose[1] -->
**4 weeks end to end**. **14 documented prompting phases**. 6 process logs kept during the build. 5 artists, after two were cut for technical reasons. 5 in-person sessions testing the prototype.

<!-- body[8].prose[2] -->
Single index.html, no backend, static hosting. Image generation via [fal.ai](https://fal.ai) / Flux. Built in Claude Code.

<!-- body[8].cta.label -->
Github repo

<!-- body[8].logs[0].title -->
## Reveal & AI integration

<!-- body[8].logs[1].title -->
## Prompting process

<!-- body[8].logs[2].title -->
## Visual system

<!-- body[8].logs[3].title -->
## Loading animations

<!-- body[8].logs[4].title -->
## Scaffold process

<!-- body[8].logs[5].title -->
## Final screen redesign

<!-- body[9].media.caption -->
*Caption: Final product*

<!-- onward.heading -->
## Next project

<!-- contact.heading -->
## Feedback or comments?

<!-- contact.description -->
Always happy to connect, whether remotely or in person.

---

<!-- 90 blocks, ~1693 words -->
