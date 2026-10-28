const STATUS_CLASS = {
  active: 'badge--green', inactive: 'badge--red',
  NEW: 'badge--blue', PAYMENT_PENDING: 'badge--yellow',
  CONFIRMED: 'badge--green', PROCESSING: 'badge--purple',
  COMPLETED: 'badge--teal', CANCELLED: 'badge--red',
  PAYMENT_FAILED: 'badge--red', PAYMENT_EXPIRED: 'badge--gray',
  SUCCESS: 'badge--green', PENDING: 'badge--yellow', FAILED: 'badge--red',
  IMMEDIATE: 'badge--blue', PRE_ORDER: 'badge--indigo',
}

export default function Badge({ value }) {
  return <span className={`badge ${STATUS_CLASS[value] || 'badge--gray'}`}>{value}</span>
}
