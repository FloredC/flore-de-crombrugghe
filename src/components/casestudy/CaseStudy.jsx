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
      // `break` is the only gap in this stack; every other distance is set
      // inside a block. That's what holds the spacing scale to three steps.
      className={`flex flex-col ${SPACE.break}`}
    >
      <Frame {...data.frame} />

      {/* 2 — What is PitchPivot. Narrow prose, then the explanatory
          illustration at `wide`. */}
      <Block width="narrow" className="flex flex-col gap-space-24">
        <SectionHeader title={data.what.title} />
        {data.what.body.map((paragraph) => (
          <p key={paragraph} className="m-0 text-body-lg font-normal">
            {paragraph}
          </p>
        ))}
      </Block>
      <Block width="wide" as="div">
        <Media {...data.what.media} className="border border-border-grey bg-surface-canvas" />
      </Block>

      {/* 3 — Why This Matters. Narrow prose + sources, then the StatGrid wide. */}
      <Block width="narrow" className="flex flex-col gap-space-24">
        <SectionHeader title={data.why.title} />
        {data.why.body.map((paragraph) => (
          <p key={paragraph} className="m-0 text-body-lg font-normal">
            {paragraph}
          </p>
        ))}
        <p className="m-0 text-caption font-normal text-text-secondary">{data.why.sources}</p>
      </Block>
      <Block width="wide" as="div">
        <StatGrid stats={data.why.stats} />
      </Block>

      {/* 4 — The Turning Point. Sits before the features deliberately: it is
          why they exist. */}
      <Block width="narrow">
        <SectionHeader title={data.turningPoint.title} />
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
      {/* Label and quotes nested at the `default` step rather than sitting as
          flat siblings at a `break`-sized gap -- the label names the quotes, so
          it has to be closer to them than anything else. Same nesting reason as
          the ProjectCard text block. */}
      <Block width="medium" as="div" className="flex flex-col gap-space-16">
        <p className="m-0 text-body-sm font-normal text-text-secondary">
          {data.turningPoint.quotesLabel}
        </p>
        {/* h-full per item so every card's rule runs the full row height and
            the attributions line up, rather than three ragged columns. */}
        <ul className="m-0 grid list-none grid-cols-1 gap-space-24 p-0 sm:grid-cols-3">
          {data.turningPoint.quotes.map((quote) => (
            <li key={quote.quote} className="h-full">
              <QuoteCard {...quote} />
            </li>
          ))}
        </ul>
      </Block>

      {/* 5 — The Two Core Features. The page's one side-by-side pattern. */}
      <Block width="wide" className="flex flex-col gap-space-64 xl:gap-space-80">
        <SectionHeader title={data.features.title} />
        {data.features.items.map((feature, index) => (
          <FeatureBlock
            key={feature.title}
            {...feature}
            // Alternates from the index rather than being set per item in the
            // data file: the alternation is a property of the sequence, so a
            // reordered or added feature can't accidentally repeat a side.
            mediaSide={index % 2 === 0 ? 'right' : 'left'}
          />
        ))}
      </Block>

      {/* 6 — Takeaways. All three LearningBlocks in ONE narrow block, each with
          its RankedBars in its own evidence slot.
          One block rather than one per takeaway, for two reasons that happen to
          agree: Figma draws the whole section in a single 720 text container,
          and splitting the chart out into its own wider block would take the
          bars out of the evidence slot -- which the build spec calls the most
          important thing about this component. (Tried the split first; it also
          produced three consecutive `narrow` blocks and tripped Rule 1.) */}
      <Block width="narrow" className="flex flex-col gap-space-64">
        <SectionHeader title={data.takeaways.title} />
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

      {/* 7 — The Process. `wide` so this Guide reaches the right margin too,
          same as the Turning Point one. The header sits in the same block and
          left-aligns at the content edge, so the two ends of the row are the
          page's two margins. */}
      <Block width="wide" className="flex flex-col gap-space-40">
        <SectionHeader title={data.process.title} />
        <AvatarNote body={data.process.note} />
      </Block>
      {/* The curve moves to `medium` purely to keep Rule 1 alive now that the
          block above is wide. It changes nothing visually: the image is capped
          at its 724 design width (MEDIA_WIDTH.curve), which is well inside
          both 860 and 1184, so it renders at exactly the same size either way. */}
      <Block width="medium" as="div">
        <Media {...data.process.media} className="border border-border-grey bg-surface-canvas" />
      </Block>

      {/* 8 — Onward. */}
      <Onward heading={data.onward.heading} project={nextProject} contact={data.onward.contact} />
    </article>
  )
}
