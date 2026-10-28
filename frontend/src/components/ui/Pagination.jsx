export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null
  return (
    <div className="pagination">
      <button className="btn btn--outline btn--sm" disabled={page === 1} onClick={() => onChange(page - 1)}>← Prev</button>
      <span className="pagination__info">Page {page} of {totalPages} &nbsp;·&nbsp; {total} records</span>
      <button className="btn btn--outline btn--sm" disabled={page === totalPages} onClick={() => onChange(page + 1)}>Next →</button>
    </div>
  )
}
