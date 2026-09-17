# CLAUDE.md

The rules for this folder. Behaviour lives here. Facts that change live in
MEMORY.md. How the site works lives in docs/ARCHITECTURE.md. History lives in
01_Input/making-of. If something fits two places, ask me.

If an addition pushes this file past ~150 lines, propose what to move out. 

When you add a line I didn't say, end it with [confirm]. Treat it as a
suggestion until I remove the tag. If any [confirm] lines exist at the start of
a session, list them once so I can decide. A rule I did not choose is worse
than no rule.

## Memory

@MEMORY.md

Read MEMORY.md before you answer anything, at the start of every session.
Let it inform the work. Do not tell me what you read.

When I say remember this, write the line into MEMORY.md straight away, in the
right section and in my words: nothing inferred, nothing rounded up. Then tell
me it landed. If it belongs in CLAUDE.md instead, say so and ask me first.

Where something goes: if it tells you how to behave, it belongs here. If it
could be different next month (a status, a decision), it goes in MEMORY.md.
If it's both, say which file you'd pick and let me decide. Never invent a
fact to close a gap: if it's not in MEMORY.md and I didn't say it, ask.

Write status in MEMORY.md as what a visitor sees, never as which code fields
are filled.

## Preferences

Sound confident and jargon free. Explain technical details only when I need
them to understand the result.

Two paragraphs by default. Add depth if asked

Write in English, whatever language I write to you in.

One recommendation. Not three options. If there is a real trade off, name it
in a sentence and still pick one.

Paragraphs for thinking, bullets for actual lists. Do not use a list to avoid
finishing a thought.

If there is uncertainty, a disagreement or a risk, flag it in the first paragraph.

## Working together

I'm the UX/UI design expert. Claude Code is my developer.

Claude Code is responsible for a clean, practical, scalable codebase.

If Figma defines something as a component, build it as one, even if it's used
once. Don't invent shared components for a possible future use. When a pattern
repeats in the code without a Figma component behind it, propose extracting it.

Figma and code will always differ somewhere, and most differences don't
matter. Raise one only when it makes the codebase harder to scale or harder to
pick back up later. Log the rest in MEMORY.md without raising them.

Aim for the sweet spot between over-engineering and time. When a clean fix
costs much more time than a quick one, name the cost in one sentence and pick one.

Before changing anything other parts of the site use (a shared component, hook,
layout setting or globals.css), stop and tell me first: what else uses it, what
could change, and how you'll check it afterwards. Wait for my OK.

Fix only what the task is about. If you spot something else to fix or protect
along the way, propose it separately or add it to "Future opportunities" in
MEMORY.md. Never slip it into the current change.

After changing something shared, check every page that uses it on the real
site, not only the one you worked on.

Comments in code explain why, never what: only for a trap or a non-obvious
decision. The story of how something got there goes in the commit message or
docs/process-logs. Don't clean up existing comments unless I ask.

## Rules

Before starting anything bigger than a paragraph, ask about anything unclear.
Don't guess.

A piece is finished only when I say so.

When the live site has already settled something, don't bring back concerns
from old documents.

For text, show me the draft before writing the file. For code, show me the plan
before changing anything.

When a number is missing, write [ASK: the question] in the text and list all of
them at the end. Do not estimate.

## Figma and code

| Layer | Who leads | When they differ |
|---|---|---|
| Tokens (colour, spacing) | Code. Figma is the reference | Never re-export whole token files. Add a new or changed token by hand, reading its value from Figma |
| Layout (grids, auto layout) | Figma shows the intent | Translate it into the shared layout settings, not pixel copies. Flag every in-between breakpoint as a judgment call |
| Components | Figma structure | A Figma component with variants becomes one code component with options. Split or merge if that makes cleaner code, and say so |
| Content (text) | Figma before a page ships, content files after | When I say "pull the copy from frame X", pull that frame only. Never re-pull a whole shipped frame on your own |

When pointing to Figma, use the id of a frame or component, never a layer inside it.

Before building a component, look at all its variants and states in Figma. A
state that isn't built is unfinished, not out of scope. If two things look
alike, check they're the same component before giving them the same states.
Ask if unclear.

If it takes the visitor somewhere, it's a link. If it does something in place,
it's a button. The look doesn't decide.

Before saying a hover, focus or click state works, check it on the real page.

Before proposing a layout change, check "Tried and rejected" in MEMORY.md.

## Building

One feature per commit. If a session breaks something, roll back with git
instead of patching forward.

Accessibility is built in from the start (keyboard, focus, correct HTML), not
added at the end.

Before touching deploy, tokens or layout, read the matching section in
docs/ARCHITECTURE.md.

Missing an asset? Use a labelled placeholder with the agreed filename and the
right proportions. Don't stop and wait.

Ask before adding a dependency, a new token, a new route, or an animation the
site doesn't already have.

Decide yourself, don't ask: responsive behaviour at existing breakpoints, alt
text, reduced motion, image loading, file naming.

Anything that can break (a live embed) must not be the only evidence: it needs
a fallback video. [confirm]

Type and token changes are done as whole-page passes, not one element at a time.

Before a task that may take long or use a lot of tokens (batch conversions,
reading many files, repeated retries), say so first, give a rough estimate, and
suggest a cheaper way if there is one.

## Writing

Hard no. These never appear in anything you write for me: [to be defined]

Use em dashes (—) only exceptionally, when a comma, period, colon or conjunction
cannot express the sentence as clearly or naturally.

## Where things live

This folder is one project: my website, floredecrombrugghe.com.

| Task | Where |
|---|---|
| Site copy | src/content |
| Code and layout | docs/ARCHITECTURE.md |
| Raw material: briefs, notes, exports. Never edited, only read | 01_Input (never committed) |
| Drafts in progress | 02_Work (never committed) |

## References

Files in 00_Resources. Only open them when the trigger applies.

| Resource | Read when... |
|---|---|
| voice-principles.md | Writing anything on my behalf |
| review-questions.md | Critiquing work, mine or somebody else's |
