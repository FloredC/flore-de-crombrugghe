import Block from './Block'
import Container from '../Container'
import Media from './Media'
import ButtonLink from '../ButtonLink'
import { ExternalLinkIcon } from '../icons'

// The page opener: a full-bleed stage carrying the meta / title / one-liner on
// the left and the hero media on the right, matching Figma's `section hero`
// (node 4774:7528), where the background rectangle spans the whole 1624 frame
// while the content sits on the page's normal column.
//
// The "map cutout" is DistrictBreadcrumb -- the same component the homepage
// sections use, which already renders the district illustration plus
// "You are here: Zone — Subsection". Reusing it means a subpage and its
// homepage section can't drift on either the drawing or the wording.
//
// TYPE: the title renders at `text-display`, Figma's `Desktop/display` -- 48px
// Bold, line-height 1.2. That step did not exist when this page was first
// built, so the title rendered a third too small at `text-h1` (36); the token
// was added 2026-08-19 and this is its only call site so far. The v2 Thesis
// raised the same gap, so it is now settled for both.
//
// Its mobile anchor is the one unmeasured number in the type scale -- see the
// note on `display` in tailwind.config.js. Nothing else in this file needs to
// know that, but if the hero title ever reads wrong on a phone, that is where
// it lives, not here.
//
// STAGE COLOUR: `surface-canvas`, a real token, and the one Figma binds for the
// feature stages on this same page. Figma's actual hero background is a subtle
// grid illustration, which is not in the asset contract -- flagged.
export default function Frame({
  category,
  title,
  oneLiner,
  role,
  date,
  // THE SNAPSHOT TIER'S CREDIT BLOCK, added 2026-08-26.
  //
  // An array of lines rendered stacked, replacing the `role, date` line when
  // present. The snapshot pages carry a fuller credit than a case study does --
  // studio and year, then collaborators, then where the work was published --
  // because the work is older and was made in a team, so "who made this, with
  // whom, and who noticed" is most of what a reader needs. Teamchatviz draws
  // three lines (node 4940:5407).
  //
  // NOT a reuse of `role` with newlines in the string: these are separate facts
  // that happen to be presented together, and a content file that has to encode
  // layout as `\n` is a content file that will eventually encode something else
  // that way too.
  //
  // `oneLiner` is simply omitted by those pages rather than being made
  // conditional here -- it already renders nothing when absent.
  facts,
  liveUrl,
  liveLabel,
  zone,
  subsection,
  media,
  // THE STAGE AND THE MEDIA CHROME ARE PER-PAGE, since 2026-08-21.
  //
  // Both default to exactly what PitchPivot already renders, so that page is
  // untouched -- these exist because Artifakt's hero diverges on both counts
  // and the divergence is real, not drift:
  //
  //   stage           PitchPivot's hero is the graph-paper `bg-notebook`
  //                   surface (see the note above). Artifakt's is a flat
  //                   `surface-yellow` fill, sampled at node 4897:4515.
  //   mediaClassName  PitchPivot's hero screenshot takes a hard black border
  //                   on a white ground. Artifakt's takes a grey border, a
  //                   16 radius and a soft drop shadow (node 4897:4524).
  //
  // Passed from the content file rather than switched on `slug` here: this
  // component has no business knowing which case study it is rendering, and a
  // slug branch would need editing every time a page is added.
  stage = 'bg-notebook',
  mediaClassName = 'mx-auto border border-text-primary bg-surface-background',
  // Snapshot heroes ship a single flattened PNG with its own chrome, corners
  // and shadow already baked in, so they pass `rounded-none` and let the asset
  // speak. The default matches what the two case studies already render.
  mediaRadius = 'rounded-radius-24',
  // LIGHT OR DARK STAGE, added 2026-08-26 for the Sinomocene snapshot, whose
  // hero sits on `Colors/surface/inverted` (node 4940:6613) rather than a pale
  // surface. Controls the TEXT COLOUR only.
  //
  // This was briefly coupled to the button variant on the theory that the two
  // always co-vary and splitting them would let a caller build an invisible
  // page (white text plus a near-black primary button on a near-black stage).
  // Roche disproved it the next day: its hero is a LIGHT stage
  // (`Colors/surface/canvas`, node 4962:6963) with a SECONDARY button
  // (node 4962:6974) — a combination the coupled version could not express.
  //
  // So they are two props, and the invisible-page case is prevented where it
  // actually lives instead: see `buttonProps` below.
  tone = 'light',
  // Which ButtonLink variant the live-site CTA uses. Three snapshot heroes,
  // three different answers, all read off the file: Teamchatviz primary,
  // Sinomocene and Roche secondary.
  buttonVariant = 'primary',
}) {
  const dark = tone === 'dark'
  const textClass = dark ? 'text-text-inverted' : 'text-text-primary'
  // BOTH secondary hero instances in Figma override the button's fill to
  // `Colors/surface/background` (nodes 4957:6835 and 4962:6974), where the
  // site's own secondary variant is `bg-transparent`. That override is not
  // cosmetic on a dark stage — transparent would leave black text on a
  // near-black surface — so it is applied here for every secondary hero button
  // rather than left to each content file to remember.
  //
  // `!` because the variant class already sets `bg-transparent`: two background
  // utilities of equal specificity are resolved by their order in Tailwind's
  // generated CSS, not by the order they appear in the class string, so without
  // it this flips depending on how the config happens to emit. Same trap the
  // `radius` prop on Media avoids.
  const buttonProps =
    buttonVariant === 'secondary'
      ? { variant: 'secondary', className: '!bg-surface-background' }
      : { variant: 'primary' }
  return (
    // `bg-notebook` over the canvas token: the graph-paper surface from Flore's
    // talk deck (see globals.css). This closes a gap flagged when the hero was
    // built -- Figma's hero background is a grid illustration, and the stage was
    // rendering as flat canvas because no asset existed for it. It never needed
    // an asset; it is a CSS pattern.
    // TOP PADDING RETUNED 2026-08-30 (Flore: "title and image are very far down
    // in the viewport... I think part of the reason is that the space foreseen
    // between the navbar and hero content is too big"). Right diagnosis, and
    // the measurement backs it.
    //
    // The padding is still asymmetric because it has to be -- the nav pill is
    // `fixed` and reserves no layout of its own, so this element owns its
    // clearance. But it had drifted well past clearance into imbalance. At
    // 1440x900 the hero drew 200 above and 80 below, and since the pill's own
    // bottom edge sits at 85, what the eye actually compared was 116px of empty
    // stage above the title against 80px below it. On a 900px screen the h1
    // started at y=426 -- past the halfway line, with the reader's first
    // impression of the page being empty colour.
    //
    // The rule now, and it is a rule rather than three tastes:
    //
    //     pt  ~=  (pill's bottom edge)  +  pb
    //
    // so the gap the reader sees UNDER the floating pill matches the gap under
    // the content. Measured pill bottoms are 83 / 85 / 94 across the three
    // bands, which lands each step on a real token:
    //
    //   base   144   (83 + 64 = 147)   gap 61 above, 64 below
    //   xl     160   (85 + 80 = 165)   gap 75 above, 80 below
    //   2xl    200   (94 + 120 = 214)  gap 106 above, 120 below
    //
    // Every one is a touch tighter above than below, which is deliberate:
    // optical centring wants slightly less space above than below, and the
    // stage keeps running to y=0 behind the pill regardless.
    //
    // THE BOTTOM PADDING IS UNCHANGED. It is the rhythm value -- it sets the
    // step from the hero into the first section -- and only the top was ever
    // carrying clearance. Touching both would have moved the page's spacing
    // system to fix a hero problem.
    //
    // This reaches EVERY case study, which is what Flore asked for ("this
    // applies to all the other pages") and is the reason it belongs here rather
    // than in one page's layout.
    //
    // If the nav pill's height ever changes, this is downstream of it: re-measure
    // `[data-component="nav"]`'s bottom edge and re-add the pb.
    <Block
      width="bleed"
      as="header"
      className={`${stage} pb-space-64 pt-space-144 xl:pb-space-80 xl:pt-space-160 2xl:pb-space-120 2xl:pt-space-200`}
    >
      <Container className="flex flex-col gap-space-40 2xl:gap-space-64">
        {/* The "You are here: Lab — Own products" breadcrumb was removed here on
            2026-08-14 — Flore: it reads out of context on a subpage. The map
            wayfinding belongs to the homepage, where the district illustration
            has a map to refer back to; on a standalone case study it points at
            something the reader cannot see.
            `zone` and `subsection` stay in the content file and in this
            component's props: they are still the project's real place in the
            taxonomy, and the homepage card uses them. Nothing renders them
            here any more. */}

        {/* The page's hero pairing. Note this is a second side-by-side
            composition alongside FeatureBlock, which the build spec caps at
            one -- Figma draws the hero this way, so Figma's composition won
            and the conflict is flagged rather than silently resolved. */}
        <div className="grid grid-cols-1 items-center gap-space-40 lg:grid-cols-2 lg:gap-space-64">
          {/* GAPS ARE 10 THROUGHOUT — resampled 2026-08-19 from Flore's restructure
              of `section hero`. Both this column and the title group below ran at
              24 and 16, which were never sampled and had no rationale recorded;
              `Spaces/10` is the only spacing variable bound anywhere in the block
              (nodes 4774:7531 / 4774:7533), and the node geometry agrees -- meta
              ends at y=22 and the title group starts at y=32.
              The two nested flex columns mirror Figma's two nested auto-layout
              frames exactly, even though one column at gap 10 would render
              identically. Same structure, same place to look. */}
          <div className="flex flex-col gap-space-10">
            {/* Sentence case, and `text-primary` as of Flore's 2026-08-19 pass --
                this was `text-secondary`, correctly sampled at the time. The
                hero text block now binds exactly one colour variable,
                Colors/Text/text-primary, with no per-node override, so all four
                lines here are primary. */}
            <p className={`m-0 text-body-sm font-normal ${textClass}`}>{category}</p>

            <div className="flex flex-col gap-space-10">
              <h1 className={`m-0 text-display font-bold ${textClass}`}>{title}</h1>
              <p className={`m-0 text-body-lg font-normal ${textClass}`}>{oneLiner}</p>

              {/* ROLE AND DATE ON ONE LINE — Flore's restructure, 2026-08-19
                  (node 4863:2346). This was a <dl> of two labelled rows, "Role"
                  and "Date" in semibold text-secondary. Figma now draws a single
                  body-sm line with no labels at all, so the <dl> went with them:
                  a description list with nothing doing the describing is markup
                  claiming a relationship the page no longer shows.

                  They stay TWO fields in the content file and two props here.
                  Role and date are different facts, the homepage card reads
                  `date` on its own, and joining them is a presentation choice --
                  so the join happens here, at the point of presentation, and
                  nowhere else. `filter(Boolean)` so a project carrying only one
                  of the two doesn't render a stray comma.

                  Note this drops the "Role"/"Date" labels from the accessibility
                  tree as well as the page -- the line now reads as one
                  uninterrupted phrase to a screen reader. That follows the
                  design; flagged to Flore rather than compensated for with a
                  visually-hidden label she didn't ask for. */}
              {facts?.length ? (
                <div className="flex flex-col">
                  {facts.map((fact) => (
                    <p key={fact} className={`m-0 text-body-sm font-normal ${textClass}`}>
                      {fact}
                    </p>
                  ))}
                </div>
              ) : (
                (role || date) && (
                  <p className={`m-0 text-body-sm font-normal ${textClass}`}>
                    {[role, date].filter(Boolean).join(', ')}
                  </p>
                )
              )}
            </div>

          </div>

          {/* The button now FLOATS over the media's bottom edge, as Figma draws
              it — Flore, 2026-08-14. It previously sat below the media: a
              deliberate earlier call, on the reasoning that overlapping could
              cover artwork at widths Figma doesn't draw. Flore's mock settles
              it, and the risk turns out not to apply — the button is centred
              while the only content along that edge ("Feedback generated by
              Gemini 2.5 Flash") is left-aligned, so they don't collide.

              `relative` on the wrapper, not on the Media frame: that frame has
              `overflow-hidden` for its corner radius, which would clip the half
              of the button hanging below. As a sibling it escapes cleanly.

              translate-y-1/2 puts exactly half the button below the edge, so it
              straddles rather than sits on it, and stays centred at any width
              because it is measured from the button's own box. */}
          <div className="relative">
            {/* `mx-auto` is what makes the floating button land on centre. The
                media is capped at MEDIA_WIDTH.hero (450) inside a ~560 grid
                column, so left-aligned it sat 55px left of the column's middle
                — and the button centres on the wrapper, not on the artwork.
                Centring the media makes the two centres the same line. */}
            <Media {...media} className={mediaClassName} radius={mediaRadius} />
            {liveUrl && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <ButtonLink {...buttonProps} href={liveUrl} target="_blank" rel="noopener noreferrer">
                  {liveLabel}
                  <ExternalLinkIcon width={16} height={16} />
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Block>
  )
}
