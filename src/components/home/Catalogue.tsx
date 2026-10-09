import { useState, type PointerEvent } from 'react'
import { catalogueImage } from '../../data/catalogueImages'
import { modules } from '../../data/modules'
import { Link } from '../../router/Link'
import { paths } from '../../router/paths'
import { Button } from '../ui/Button'
import { ArrowRightIcon } from '../ui/icons'
import styles from './Catalogue.module.css'

/** Keep the home page compact; the full catalogue lives on the script pages. */
const HOME_LIMIT = 6
const PAGE_SIZE = 9

/*
 * Leans a tile toward the pointer. The position goes straight into CSS
 * variables, so moving the mouse never re-renders anything.
 */
function lean(event: PointerEvent<HTMLLIElement>) {
  if (event.pointerType !== 'mouse') return
  const item = event.currentTarget
  const box = item.getBoundingClientRect()
  item.style.setProperty('--px', ((event.clientX - box.left) / box.width - 0.5).toFixed(3))
  item.style.setProperty('--py', ((event.clientY - box.top) / box.height - 0.5).toFixed(3))
}

function settle(event: PointerEvent<HTMLLIElement>) {
  event.currentTarget.style.removeProperty('--px')
  event.currentTarget.style.removeProperty('--py')
}

/**
 * Compact home-page catalogue. "View all" opens the existing script catalogue
 * experience at the first script, where ScriptRail exposes every module.
 */
export function Catalogue({ showAll = false }: { showAll?: boolean }) {
  const [page, setPage] = useState(1)
  const pageCount = Math.ceil(modules.length / PAGE_SIZE)
  const currentPage = Math.min(page, Math.max(1, pageCount))
  const visible = showAll
    ? modules.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : modules.slice(0, HOME_LIMIT)

  function goToPage(nextPage: number) {
    setPage(Math.max(1, Math.min(nextPage, pageCount)))
  }

  return (
    <section className={styles.catalogue} aria-label="Catalogue">
      <div className="container">
        <ul role="list" className={styles.grid}>
          {visible.map((module) => {
            const image = catalogueImage(module.slug)
            return (
              <li key={module.slug} className={styles.item} onPointerMove={lean} onPointerLeave={settle}>
                <div className={styles.frame}>
                  {image && <img src={image} alt="" loading="lazy" decoding="async" />}
                </div>

                <h2 className={styles.name}>
                  <Link to={paths.module(module.slug)} className={styles.link}>
                    {module.name}
                    <ArrowRightIcon aria-hidden="true" weight="bold" className={styles.arrow} />
                  </Link>
                </h2>

                <p className={styles.blurb}>{module.blurb}</p>
              </li>
            )
          })}
        </ul>

        {showAll && pageCount > 1 && (
          <nav className={styles.pagination} aria-label="Script catalogue pages">
            <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => goToPage(number)}
                aria-label={`Page ${number}`}
                aria-current={currentPage === number ? 'page' : undefined}
                className={currentPage === number ? styles.currentPage : undefined}
              >
                {number}
              </button>
            ))}
            <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount}>
              Next
            </button>
          </nav>
        )}

        {!showAll && modules.length > HOME_LIMIT && (
          <div className={styles.more}>
            <Button href={`#${paths.catalogue}`} variant="secondary" size="lg">
              View all
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
