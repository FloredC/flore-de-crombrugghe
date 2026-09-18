# Artifakt: edits to apply

Source of truth for the page is `src/content/case-studies/artifakt.js`, not the
markdown export. Every change below has to land in that file.

17 text replacements, 5 content decisions.

---

## 1. Replace (your wording, ready to paste)

**1. Current:** You type a word, **trace a loose scaffold by hand**, and your line comes back transformed through the style of a real artist. **The AI does the finishing — it never touches the making.**

**New:** You type a word, trace a loose line drawing by hand, and it comes back in the style of a real artist. The app inspires you and helps you finishing your traced idea with help of real artists.

**2. Current:** Digital gifting has an effort problem. When sending costs nothing, it reads as nothing — and the obvious fix is to make something by hand, except **most adults stopped drawing at eleven** and have no intention of starting again in front of someone they love.

**New:** What if an AI image generation tool could inspire and teach people about drawing and art? How could this tool increase personality and authenticity in drawing in order to feel "less generic"? And when do people decide where that authenticity breaks down? When do they trust their own sense of taste or imperfection against something that is more perfect but clearly machine-generated? This tool prompts users to seek originality in drawing generation by starting with an intention that is true to the person creating it.

**3. Current:** **Lower the barrier.** A scaffold to trace, so "I can’t draw" doesn’t end the gesture before it starts.

**New:** An example to trace, so "I can’t draw" doesn’t end the gesture before it starts.

**4. Current:** **Keep it yours.** Style is applied *after* tracing, never during. Your line stays the structure of the final piece — even the loading screen shows your sketch turning, not the artist’s photo.

**New:** Style is applied *after* tracing, never during. The intent of the tool is that your line stays the structure of the final piece. This works most of the time, though not perfectly.

**5. Current:** **Bring an artist in.** A fixed, curated roster — Louise Bourgeois, Kara Walker, Niki de Saint Phalle, Naoko Takeuchi, Keith Haring. Most people will meet at least one of them here for the first time. It’s also the part that would make this work in a museum: the exhibition already supplies the artist — Artifakt gives visitors something to make with them.

**New:** A fixed, curated group of artists help elevate your drawing: Louise Bourgeois, Kara Walker, Niki de Saint Phalle, Naoko Takeuchi, Keith Haring. Ideally, this gropu of artists would grow over time: more female, queer, "inivisble" artists that would diversify the present collective imagery on the internet.

**6. Current:** **Six interviews** sharpened it — people aren’t reluctant, they’re blocked by what to make, not how.

**New:** Starting questions: How could this tool increase personality and authenticity in drawing in order to feel "less generic"? And when do people decide where that authenticity breaks down?  [comment]: <> (I need help with this)

**7. Current:** Effort counts only if visible. The wobble in a traced line proves it, **shown in the reveal** — so I built transformation before drawing.

**New:** The traced line is what shows the effort, and the reveal is where it shows. That is why I built the transformation before the drawing tool.

**8. Current:** - traced line legible, - artist’s hand clear, - surprise so it feels like a gift, not a filter.

**New:** Wished result:

**9. Current:** **Got:**

**New:** The result I got:

**10. Current:** - asking for L. Bourgeois leads the model to draw spiders, her famous motif, not your lines in her style. - Artists **reach for icons, not technique.**

**New:** The model used the most iconic subject or visual of the artists (which makes sense because this is what is the most available in our collective imagery on the internet.)

**11. Current:** **Dead ends:**

**New:** What didn't work:

**12. Current:** *Traced line not legible. Artists reach for icons, not technique.*

**New:** Traced line not legible and lack of origniality in visual representations.

**13. Current:** **Fix 1: describe material, not artist** — thread, tension, stitched surface.

**New:** Solution 1: Describe the material, gesture, technique first (thread, tension, stitched surface) instead of naming the artist.

**14. Current:** **Fix 2:**

**New:** Solution 2:

**15. Current:** - **Split pipeline** — Pass 1 builds structure without artist, Pass 2 adds artist and colour. - Eight phases tested strength values; low kept the sketch, high gave beautiful but not mine.

**New:** **Split pipeline**: Pass 1 builds structure without artist, Pass 2 adds artist and colour.

**16. Current:** Line width, invert, flood fill — per artist

**New:** Line width, invert, flood fill per artist

**17. Current:** **Every single person hesitated before tracing. Every single person lit up at the result.** All said they’d send it — and wanted to make another straight away.

**New:** **Every single person hesitated before tracing. Every single person lit up at the result.** All said were inspired and would send it — and wanted to make another straight away.

---

## 2. Content decisions (only you can make these)

**1.** > I went in assuming the barrier was emotional. It wasn’t.

> needs editing on a content level as the angle of the case has a slightly different angle now (rule 5)

**2.** How do you help someone make a visual for another person, when most people freeze the moment they’re asked to create something?

> needs editing on a content level as the angle of the case has a slightly different angle now (rule 5)

**3.** Then an early test contradicted me. Three versions of one drawing — rough, refined, finished — which felt like it came from someone who cared? The finished one 

> I need to mention here somewhere that I might have been asking the wrong questiond during this interview, or reframe it in a way that it mixes my personal motivation and starting point with first conversations with users. These interviews actually helped me understand what was imporant to me in that project.

**4.** **People want to have made it, and they want it to look good. They don’t want to choose.**

> Stayes as is for now

**5.** - **First idea** — UX tweaks: softer copy, looser prompts, art-school style (think volumes first). The model didn’t get it. - **Costly detour:** generating the 

> remove dashes, otherwise keep as is

---

## 3. Open word choices

- "busywork": you said you'd use another word. "obsolete" means outdated in English, so it changes the meaning. Pick: pointless, useless, unnecessary.
- "most adults stopped drawing at eleven": keep only with a source, otherwise "as kids".
- "All said were inspired and would send it": reads as a typo. Probably "All said they were inspired and would send it".

---

## 4. Sweep after the edits

- Em dashes in `artifakt.js`: 16 in the page text before this pass (rule 8).
- Check nothing else in the file still says "scaffold" where you now say "example".
