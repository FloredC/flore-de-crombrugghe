import { useEffect, useRef } from 'react'
import Block from './Block'
import Frame from './Frame'
import SectionHeader from './SectionHeader'
import StatGrid from './StatGrid'
import QuoteCard from './QuoteCard'
import AvatarNote from './AvatarNote'
import FeatureBlock from './FeatureBlock'
import LearningBlock from './LearningBlock'
import RankedBars from './RankedBars'
import Media from './Media'
import Onward from './Onward'
import { SPACE } from '../../lib/caseStudyLayout'
import { getProjectBySlug } from '../../lib/content'
import { FOCUS_CLASS } from '../ButtonLink'
import emphasise from '../../lib/emphasis'

// Rule 1 -- no two consecutive blocks share a width -- checked against the
// RENDERED DOM in dev, not against the data.
//
// Checking the data would only prove the content file says what it says. The
// widths that matter are the ones that reach the page, and several are decided
// by components rather than content (Onward overrides the vocabulary default,
// Frame always bleeds, each section splits into a text block plus its own
// media/evidence block). Reading `[data-width]` back in document order is the
// only view of the sequence that can't go stale.
//
// Throws rather than warns, and it has already earned that: it caught a real
// clash the first time it ran. Dev-only -- `import.meta.env.DEV` is statically
// replaced at build time, so this compiles out of production entirely and can
// never break a live page for a reader.
function useWidthRuleCheck(ref) {
  useEffect(() => {
    if (!import.meta.env.DEV) return
    const widths = [...(ref.current?.querySelectorAll('[data-width]') || [])].map(
      (block) => block.dataset.width,
    )

    const clash = widths.findIndex((width, index) => index > 0 && width === widths[index - 1])
    if (clash > 0) {
      throw new Error(
        `Case study layout: Rule 1 violated -- blocks ${clash - 1} and ${clash} are both "${widths[clash]}".\n` +
          `Full sequence: ${widths.join(' -> ')}`,
      )
    }
    // eslint-disable-next-line no-console
    console.info(`[case study] width sequence (${widths.length} blocks): ${widths.join(' → ')}`)
  })
}

export default function CaseStudy({ data }) {
  const ref = useRef(null)
  useWidthRuleCheck(ref)

  // Looked up from the real project list rather than duplicated into the
  // content file, so the next project's title, tint, thumbnail and CTA are the
  // same objects the homepage renders and can't drift from it.
  const nextProject = data.onward?.slug ? getProjectBySlug(data.onward.slug) : null

  return (
    <article
      ref={ref}
      data-component="case-study"
      data-slug={data.slug}
      // TWO LEVELS, since 2026-08-14: this stack holds CHAPTERS at `break`,
      // and each chapter groups its own blocks at the smaller `chapter` step.
      // Before, every block was a flat sibling here, so a header sat as far
      // from its own prose as from the next chapter and nothing read as a unit.
      //
      // The Rule 1 check is unaffected: it reads `[data-width]` with
      // querySelectorAll, which returns document order regardless of nesting.
      className={`flex flex-col ${SPACE.break}`}
    >
      <Frame {...data.frame} />

      {/* 2 — What is PitchPivot. Narrow prose, then the explanatory
          illustration at `wide`. */}
      <div className={`flex flex-col ${SPACE.chapter}`}>
        <Block width="narrow" className="flex flex-col gap-space-24">
          <SectionHeader title={data.what.title} />
          {data.what.body.map((paragraph) => (
            <p key={paragraph} className="m-0 text-body-lg font-normal">
              {emphasise(paragraph)}
            </p>
          ))}
        </Block>
        <Block width="wide" as="div">
          {/* Same padded notebook panel as the momentum figure below: the panel
            carries the border, radius and grid, and the Media inside is
            frameless, so the artwork sits ON the grid with a margin rather than
            running into the border. Before this the image met the border on all
            four sides. */}
          <div className="overflow-hidden rounded-radius-24 border border-border-grey bg-notebook p-space-24">
            <Media {...data.what.media} />
          </div>
        </Block>
      </div>

      {/* 3 — Why This Matters. Narrow prose + sources, then the StatGrid wide. */}
      <div className={`flex flex-col ${SPACE.chapter}`}>
        <Block width="narrow" className="flex flex-col gap-space-24">
          <SectionHeader title={data.why.title} />
          {data.why.body.map((paragraph) => (
            <p key={paragraph} className="m-0 text-body-lg font-normal">
              {emphasise(paragraph)}
            </p>
          ))}
          {/* Source citations, each a real outbound link. `FOCUS_CLASS` is
            reused from ButtonLink so these keep the site's one focus ring
            rather than inventing a second — they are inline text links inside a
            caption, so they are not ButtonLink instances themselves.
            The <span> wrapper carries the comma separator; it avoids importing
            Fragment just to hold two children. */}
          <p className="m-0 text-caption font-normal text-text-secondary">
            Sources:{' '}
            {data.why.sources.map((source, index) => (
              <span key={source.href}>
                {index > 0 && ', '}
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`underline underline-offset-2 hover:text-text-primary ${FOCUS_CLASS}`}
                >
                  {source.label}
                </a>
              </span>
            ))}
          </p>
        </Block>
        <Block width="wide" as="div">
          <StatGrid stats={data.why.stats} />
        </Block>
      </div>

      {/* 4 — The Turning Point. Sits before the features deliberately: it is
          why they exist. */}
      <div className={`flex flex-col ${SPACE.chapter}`}>
        <Block width="narrow" className="flex flex-col gap-space-24">
          <SectionHeader title={data.turningPoint.title} />
          {data.turningPoint.body?.map((paragraph) => (
            <p key={paragraph} className="m-0 text-body-lg font-normal">
              {emphasise(paragraph)}
            </p>
          ))}
        </Block>
        {/* The Guide gets its OWN `wide` block so it can reach the right margin.
          Flore's note 2026-08-12: the avatar and bubble are right-aligned AND
          touch the margin. It was right-aligned inside the 860 `medium` block
          below, which left it stopping 324px short of the content edge —
          right-aligned to the wrong thing. `wide` is the full content column,
          so its right edge and the page's right margin are the same line. */}
        <Block width="wide" as="div">
          <AvatarNote body={data.turningPoint.note} />
        </Block>
        {/* The "User Interview Quotes" label above these was cut 2026-08-14: the
          section's opening paragraph now says "five interviews", so a heading
          announcing interview quotes two lines later was naming what the reader
          had just been told.
          h-full per item so every card's rule runs the full row height and the
          attributions line up, rather than three ragged columns. */}
        <Block width="medium" as="div">
          <ul className="m-0 grid list-none grid-cols-1 gap-space-24 p-0 sm:grid-cols-3">
            {data.turningPoint.quotes.map((quote) => (
              <li key={quote.quote} className="h-full">
                <QuoteCard {...quote} />
              </li>
            ))}
          </ul>
        </Block>
      </div>

      {/* 5 — The Two Core Features. The page's one side-by-side pattern. */}
      <div className={`flex flex-col ${SPACE.chapter}`}>
        <Block width="wide" className="flex flex-col gap-space-64 xl:gap-space-80">
          <SectionHeader title={data.features.title} />
          {data.features.items.map((feature) => (
            // BOTH MEDIA ON THE RIGHT, text on the left — Flore, 2026-08-14.
            // This alternated by index, which was a known, flagged conflict:
            // the build spec asked for alternation while the Figma frame draws
            // both rows with text at x=0 (nodes 4774:7607 and 4774:7622). Figma
            // was right. `mediaSide` stays a prop rather than being hardcoded in
            // FeatureBlock, so a future row can still flip if it needs to.
            <FeatureBlock key={feature.title} {...feature} mediaSide="right" />
          ))}
          {/* Closing visual for the section, in the SAME padded notebook panel as
            the "What is PitchPivot" banner and the momentum figure — Flore's
            ask: treat it the same way.
            Rendered inside this block rather than as a block of its own, which
            keeps it part of the Features section and leaves the page's width
            sequence untouched. It already spans the full content width, since
            the block is `wide`. */}
          {data.features.visual && (
            <div className="overflow-hidden rounded-radius-24 border border-border-grey bg-notebook p-space-24">
              <Media {...data.features.visual} />
            </div>
          )}
        </Block>
      </div>

      <div className={`flex flex-col ${SPACE.chapter}`}>
        {/* 6 — Takeaways. All three LearningBlocks in ONE narrow block, each with
          its RankedBars in its own evidence slot.
          One block rather than one per takeaway, for two reasons that happen to
          agree: Figma draws the whole section in a single 720 text container,
          and splitting the chart out into its own wider block would take the
          bars out of the evidence slot -- which the build spec calls the most
          important thing about this component. (Tried the split first; it also
          produced three consecutive `narrow` blocks and tripped Rule 1.) */}
        {/* ALL THREE GUIDES SIT AT THE PAGE MARGIN — Flore's call, 2026-08-14,
          and it is what forces the header and the Guide into separate blocks
          here.
          A Guide only reaches the right margin inside a `wide` block, but the
          features block directly above is `wide` too, and Rule 1 forbids two in
          a row. Splitting gives narrow -> wide -> narrow across the header,
          the Guide and the takeaways, which alternates cleanly.
          The old cost of that split -- header and Guide a full `break` apart --
          is gone as of 2026-08-14: they are siblings inside this chapter group,
          so the gap is the 40 the frame draws. */}
        <Block width="narrow">
          <SectionHeader title={data.takeaways.title} />
        </Block>
        {data.takeaways.note && (
          <Block width="wide" as="div">
            <AvatarNote body={data.takeaways.note} />
          </Block>
        )}
        <Block width="narrow" as="div" className="flex flex-col gap-space-64">
          {data.takeaways.items.map((takeaway) => (
            <LearningBlock
              key={takeaway.index}
              index={takeaway.index}
              title={takeaway.title}
              body={takeaway.body}
              evidence={<RankedBars {...takeaway.chart} />}
            />
          ))}
        </Block>
      </div>

      <div className={`flex flex-col ${SPACE.chapter}`}>
        {/* 7 — The Process. `wide` so this Guide reaches the right margin too,
          same as the Turning Point one. The header sits in the same block and
          left-aligns at the content edge, so the two ends of the row are the
          page's two margins. */}
        <Block width="wide" className="flex flex-col gap-space-40">
          <SectionHeader title={data.process.title} />
          <AvatarNote body={data.process.note} />
        </Block>
        {/* Prose at `narrow`, its own block: this is the section's reading
          measure and it cannot share the Guide's `wide` block without running
          to 1184px a line. Sits after the Guide rather than before it, which
          also mirrors the Takeaways section (header + Guide, then content) and
          keeps the width sequence alternating. */}
        {data.process.body && (
          <Block width="narrow" as="div" className="flex flex-col gap-space-24">
            {data.process.body.map((paragraph) => (
              <p key={paragraph} className="m-0 text-body-lg font-normal">
                {emphasise(paragraph)}
              </p>
            ))}
          </Block>
        )}
        {/* `wide` — full content width, margin to margin — Flore, 2026-08-14.
          This was `medium` (860) purely to satisfy Rule 1 while Onward below it
          was also `wide`. Onward is now `medium` instead, which frees this one:
          the momentum panel is the page's largest single piece of evidence and
          the one that most needs the room, whereas Onward is a single card and
          a CTA that never filled 1184. */}
        <Block width="wide" as="div">
          {/* ONE notebook panel holding BOTH assets, not two panels: the chart
            and its legend are a single figure, and Figma composes them that way
            (node 4787:7879, 1282 wide overall).
            The panel carries the border, radius and grid; each Media inside is
            frameless so the grid runs behind both and the two share one edge.
            65/35 matches Figma's split. Stacks below `lg`, where a legend
            beside a chart would leave both too narrow to read -- which is why
            Flore exported them separately in the first place. */}
          <div className="flex flex-col items-center gap-space-24 overflow-hidden rounded-radius-24 border border-border-grey bg-notebook p-space-24 lg:flex-row">
            <div className="w-full lg:basis-[65%]">
              <Media {...data.process.media} />
            </div>
            <div className="w-full lg:basis-[35%]">
              <Media {...data.process.legend} />
            </div>
          </div>
        </Block>
      </div>

      {/* 8 — Onward. */}
      <Onward heading={data.onward.heading} project={nextProject} contact={data.onward.contact} />
    </article>
  )
}
