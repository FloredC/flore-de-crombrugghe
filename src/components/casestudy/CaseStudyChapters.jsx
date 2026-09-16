import ChapterNav from './ChapterNav'
import ReadingProgress from './ReadingProgress'
import useChapterProgress from '../../lib/useChapterProgress'

/**
 * Chapter navigation + reading progress for one long-form case study.
 *
 * The whole system's public surface: a page renders this with a chapter config
 * and gets both controls, wired to each other. Nothing else about the page has
 * to change except putting `id` and `data-chapter-anchor` on the sections the
 * config names.
 *
 * REUSING IT ON ANOTHER CASE STUDY is one new config object in `lib/chapters.js`
 * and one line in that page's layout. Nothing here knows anything about
 * Artifakt -- not the labels, not the ids, not how many chapters there are.
 *
 * DELIBERATELY NOT WIRED INTO `ProjectPage` for every subpage. Only a page long
 * enough to lose your place in earns a second navigation, and the four other
 * case-study tiers (snapshots, NDA, WIP) are a screen or three each. Making
 * this automatic would put a floating control on pages that do not need one,
 * which is the "second competing main navigation" the whole design is trying
 * to avoid. Opt in per page.
 *
 * WHY THE TWO CONTROLS SHARE ONE HOOK rather than each computing its own
 * position: they are two readings of the same measurement. Separately, the bar
 * could complete while the nav still showed a chapter left to read, and nothing
 * in either component would be wrong -- the disagreement would only exist on
 * screen. One pass makes that impossible.
 */
export default function CaseStudyChapters({ config }) {
  const { chapters, revealFrom, endAt } = config
  const { activeId, visible, fillRef } = useChapterProgress({ chapters, revealFrom, endAt })

  return (
    <>
      <ReadingProgress fillRef={fillRef} />
      <ChapterNav chapters={chapters} activeId={activeId} visible={visible} />
    </>
  )
}
