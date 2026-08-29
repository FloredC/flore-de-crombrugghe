/**
 * Chapter navigation config for long-form case studies.
 *
 * WHAT A CHAPTER IS, AND WHAT IT IS NOT
 *
 * A chapter is a MACRO grouping over sections that already exist on the page.
 * It is navigation vocabulary only: the labels below appear in the chapter nav
 * and nowhere else in the document. The page's visible narrative structure is
 * still its own editorial headings, which are untouched -- "Making it work"
 * covers four of them and is not written anywhere on the page.
 *
 * That is why a chapter carries a LABEL and an ANCHOR rather than a title: the
 * anchor points at the id of the section the chapter starts on, and everything
 * between that section and the next chapter's anchor belongs to it implicitly.
 * No wrapper elements, no duplicated headings, nothing added to the content
 * files.
 *
 * WHY THE CONFIG IS SEPARATE FROM THE COMPONENT
 *
 * The nav, the scrollspy and the progress line are page-agnostic. The only
 * page-specific facts are the five labels, the five ids, where the nav starts
 * showing and where it stops -- so those are the only things a second case
 * study has to write. `CaseStudyChapters` takes one of these objects and
 * needs nothing else.
 *
 * The ids are the section ids the case-study content files already declare
 * (`src/content/case-studies/artifakt.js`), rendered onto the `<section>`
 * elements by the page layout. They are not new anchors invented here -- which
 * is the point: the nav points at the page's real structure, so a section that
 * gets renamed or reordered in the content file moves its chapter with it.
 */

/**
 * @typedef {object} ChapterConfig
 * @property {{ id: string, label: string }[]} chapters
 *   In document order. `id` is the DOM id of the section the chapter starts on;
 *   `label` is the nav's wording and exists only here.
 * @property {string} revealFrom
 *   The chapter id at which the nav appears. Above it the reader is still in
 *   the hero and the opening, where a second navigation would be noise.
 * @property {string} endAt
 *   The DOM id of the element that ends the article -- the contact block. The
 *   nav hides here and the progress line completes here, so the page's own
 *   closing actions take over rather than competing with a floating control.
 */

/**
 * The id every case-study layout puts on its closing contact block.
 *
 * Shared rather than written per page: it is the same block on every case
 * study ("Feedback or comments?"), and the chapter system needs to find it to
 * know where the article ends.
 */
export const CASE_STUDY_OUTRO = 'case-study-outro'

/** @type {ChapterConfig} */
export const ARTIFAKT_CHAPTERS = {
  chapters: [
    // "Made by you. Finished by an artist." plus "What it is".
    { id: 'what', label: 'Overview' },
    { id: 'question', label: 'The question' },
    // Four sections: the reveal, the pipeline, the scaffold, and designing
    // against the model's defaults. The one chapter that is a real grouping
    // rather than a rename, and the reason chapters exist on this page at all.
    { id: 'reveal', label: 'Making it work' },
    { id: 'testing', label: 'Testing' },
    // Also carries the process appendix and the closing gallery, which have no
    // chapter of their own -- they are the tail of the reflection, not a sixth
    // thing to choose between.
    { id: 'reflection', label: 'Reflection' },
  ],
  revealFrom: 'question',
  endAt: CASE_STUDY_OUTRO,
}
