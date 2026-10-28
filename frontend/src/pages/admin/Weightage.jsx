// import { useEffect, useMemo, useState, useCallback } from 'react'
// import { Layers, Plus } from 'lucide-react'
// import toast from 'react-hot-toast'
// import {
//   getProducts,
//   getVariants,
//   createVariant,
// } from '../../services/adminService'

// const UNITS = ['KG', 'G', 'L', 'ML']

// const normalizeUnit = (unit) => String(unit || '').toUpperCase()

// const getWeightageKey = (variant) =>
//   `${Number(variant.quantity_value)}-${normalizeUnit(variant.quantity_unit)}`

// const getWeightageName = (variant) =>
//   `${Number(variant.quantity_value)} ${normalizeUnit(variant.quantity_unit)}`

// function Toggle({ checked, onChange, label }) {
//   return (
//     <div>
//       <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
//         {label}
//       </div>
//       <button
//         type="button"
//         role="switch"
//         aria-checked={checked}
//         onClick={() => onChange(!checked)}
//         style={{
//           width: 44,
//           height: 24,
//           borderRadius: 999,
//           border: 'none',
//           padding: 2,
//           cursor: 'pointer',
//           background: checked ? '#15803d' : '#d1d5db',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: checked ? 'flex-end' : 'flex-start',
//           transition: 'background 0.15s',
//         }}
//       >
//         <span
//           style={{
//             width: 20,
//             height: 20,
//             borderRadius: '50%',
//             background: '#fff',
//             display: 'block',
//           }}
//         />
//       </button>
//     </div>
//   )
// }

// export default function Weightage() {
//   const [products, setProducts] = useState([])
//   const [allVariants, setAllVariants] = useState([])
//   const [loading, setLoading] = useState(true)

//   const [showAdd, setShowAdd] = useState(false)
//   const [quantity, setQuantity] = useState('')
//   const [unit, setUnit] = useState(UNITS[0])
//   const [available, setAvailable] = useState(true)
//   const [active, setActive] = useState(true)
//   const [saving, setSaving] = useState(false)

//   // Load all products, then collect quantity variants from every product
//   const loadAll = useCallback(async () => {
//     setLoading(true)

//     try {
//       const allProducts = []
//       let page = 1
//       let total = 0

//       do {
//         const { data } = await getProducts({ page, limit: 100 })
//         const result = data?.data
//         const items = Array.isArray(result?.products)
//           ? result.products
//           : []

//         allProducts.push(...items)
//         total = Number(result?.total) || allProducts.length
//         page += 1

//         if (!items.length || page > 201) break
//       } while (allProducts.length < total)

//       setProducts(allProducts)

//       const results = await Promise.all(
//         allProducts.map(async (item) => {
//           try {
//             const { data } = await getVariants(item._id)
//             const variants = Array.isArray(data?.data) ? data.data : []

//             return variants
//               .filter(
//                 (variant) =>
//                   variant.variant_type === 'quantity' &&
//                   variant.quantity_value != null &&
//                   variant.quantity_unit
//               )
//               .map((variant) => ({ ...variant, product_id: item._id }))
//           } catch {
//             return []
//           }
//         })
//       )

//       setAllVariants(results.flat())
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || 'Failed to load weightages.'
//       )
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   useEffect(() => {
//     loadAll()
//   }, [loadAll])

//   // Unique weightage cards built from every product's variants
//   const weightages = useMemo(() => {
//     const unique = new Map()

//     allVariants.forEach((variant) => {
//       const key = getWeightageKey(variant)

//       if (!unique.has(key)) {
//         unique.set(key, { key, name: getWeightageName(variant) })
//       }
//     })

//     return Array.from(unique.values()).sort((a, b) => {
//       const [aValue, aUnit] = a.key.split('-')
//       const [bValue, bUnit] = b.key.split('-')
//       if (aUnit !== bUnit) return aUnit.localeCompare(bUnit)
//       return Number(aValue) - Number(bValue)
//     })
//   }, [allVariants])

//   const resetForm = () => {
//     setQuantity('')
//     setUnit(UNITS[0])
//     setAvailable(true)
//     setActive(true)
//   }

//   const closeAdd = () => {
//     if (saving) return
//     setShowAdd(false)
//     resetForm()
//   }

//   const handleAdd = async (event) => {
//     event.preventDefault()

//     const value = Number(quantity)

//     if (!value || value <= 0) {
//       toast.error('Enter a valid quantity.')
//       return
//     }

//     if (!products.length) {
//       toast.error('Add a product first.')
//       return
//     }

//     const key = `${value}-${unit}`

//     // Only products that don't already have this weightage
//     const missing = products.filter(
//       (item) =>
//         !allVariants.some(
//           (variant) =>
//             variant.product_id === item._id &&
//             getWeightageKey(variant) === key
//         )
//     )

//     if (missing.length === 0) {
//       toast.error(`${value} ${unit} already exists.`)
//       return
//     }

//     setSaving(true)

//     try {
//       const results = await Promise.allSettled(
//         missing.map((item) =>
//           createVariant(item._id, {
//             variant_type: 'quantity',
//             variant_name: `${value} ${unit}`,
//             quantity_value: value,
//             quantity_unit: unit,
//             member_count: null,
//             price: 0,
//             availability: available,
//             status: active ? 'active' : 'inactive',
//           })
//         )
//       )

//       const failed = results.filter((r) => r.status === 'rejected').length
//       const added = results.length - failed

//       if (added > 0) {
//         toast.success(`${value} ${unit} added to ${added} product(s).`)
//       }

//       if (failed > 0) {
//         const firstError = results.find((r) => r.status === 'rejected')
//         toast.error(
//           firstError?.reason?.response?.data?.message ||
//             `Failed to add to ${failed} product(s).`
//         )
//       }

//       if (added > 0) {
//         setShowAdd(false)
//         resetForm()
//         await loadAll()
//       }
//     } finally {
//       setSaving(false)
//     }
//   }

//   const previewName =
//     Number(quantity) > 0 ? `${Number(quantity)} ${unit}` : 'Variant name'

//   return (
//     <div className="page">
//       <div className="page__header">
//         <div>
//           <h2 className="page__title">Weightage</h2>
//           <p className="page__subtitle">
//             Dynamic weightages shared across all products.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="btn btn--primary"
//           onClick={() => setShowAdd(true)}
//         >
//           <Plus size={16} />
//           Add variant
//         </button>
//       </div>

//       <div className="section-card" style={{ padding: 16 }}>
//         {loading ? (
//           <p>Loading weightages...</p>
//         ) : weightages.length === 0 ? (
//           <div className="empty-state">
//             <Layers size={16} />
//             No weightages yet. Click Add variant to create one.
//           </div>
//         ) : (
//           <div
//             style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
//               gap: 10,
//             }}
//           >
//             {weightages.map((weightage) => (
//               <div
//                 key={weightage.key}
//                 style={{
//                   border: '1px solid #e5e7eb',
//                   borderRadius: 10,
//                   padding: '14px 12px',
//                   background: '#f0fdf4',
//                   textAlign: 'center',
//                 }}
//               >
//                 <strong style={{ fontSize: 16 }}>{weightage.name}</strong>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {showAdd && (
//         <div
//           onClick={closeAdd}
//           style={{
//             position: 'fixed',
//             inset: 0,
//             background: 'rgba(0,0,0,0.4)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             zIndex: 1000,
//           }}
//         >
//           <form
//             onSubmit={handleAdd}
//             onClick={(event) => event.stopPropagation()}
//             style={{
//               background: '#f5f0e8',
//               borderRadius: 14,
//               padding: 20,
//               width: 400,
//               maxWidth: '92vw',
//               maxHeight: '90vh',
//               overflowY: 'auto',
//             }}
//           >
//             <h3 style={{ marginTop: 0 }}>Add variant</h3>

//             <div style={{ display: 'flex', gap: 12 }}>
//               <div className="form-group" style={{ flex: 2 }}>
//                 <label className="form-label" htmlFor="weightage-quantity">
//                   Quantity *
//                 </label>
//                 <input
//                   id="weightage-quantity"
//                   className="form-input"
//                   type="number"
//                   min="0"
//                   step="any"
//                   value={quantity}
//                   onChange={(event) => setQuantity(event.target.value)}
//                   placeholder="e.g. 0.5"
//                   autoFocus
//                 />
//               </div>

//               <div className="form-group" style={{ flex: 1 }}>
//                 <label className="form-label" htmlFor="weightage-unit">
//                   Unit
//                 </label>
//                 <select
//                   id="weightage-unit"
//                   className="form-input"
//                   value={unit}
//                   onChange={(event) => setUnit(event.target.value)}
//                 >
//                   {UNITS.map((item) => (
//                     <option key={item} value={item}>
//                       {item}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             <small
//               style={{ display: 'block', margin: '8px 0 12px', color: '#6b7280' }}
//             >
//               This variant will be added to every product.
//             </small>

//             <div style={{ display: 'flex', gap: 40, marginBottom: 16 }}>
//               <Toggle
//                 label="Available"
//                 checked={available}
//                 onChange={setAvailable}
//               />
//               <Toggle label="Active" checked={active} onChange={setActive} />
//             </div>

//             <div style={{ fontWeight: 700, marginBottom: 8 }}>Live preview</div>

//             <div
//               style={{
//                 background: '#fff',
//                 borderRadius: 12,
//                 padding: 14,
//                 marginBottom: 16,
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: 18,
//                   fontWeight: 700,
//                   color: '#1f2937',
//                 }}
//               >
//                 {previewName}
//               </div>
//               <span
//                 style={{
//                   display: 'inline-block',
//                   marginTop: 6,
//                   fontSize: 12,
//                   fontWeight: 600,
//                   padding: '2px 8px',
//                   borderRadius: 999,
//                   background: available ? '#dcfce7' : '#fee2e2',
//                   color: available ? '#15803d' : '#b91c1c',
//                 }}
//               >
//                 {available ? 'Available' : 'Unavailable'}
//               </span>
//             </div>

//             <div style={{ display: 'flex', gap: 8 }}>
//               <button
//                 type="submit"
//                 className="btn btn--primary"
//                 style={{ flex: 1 }}
//                 disabled={saving}
//               >
//                 {saving ? 'Adding...' : 'Add to all products'}
//               </button>
//               <button
//                 type="button"
//                 className="btn"
//                 onClick={closeAdd}
//                 disabled={saving}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   )
// }
import { useEffect, useMemo, useState, useCallback } from 'react'
import { Layers, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getProducts,
  getVariants,
  createVariant,
  deleteVariant,
} from '../../services/adminService'

const UNITS = ['KG', 'G', 'L', 'ML']

const normalizeUnit = (unit) => String(unit || '').toUpperCase()

const getWeightageKey = (variant) =>
  `${Number(variant.quantity_value)}-${normalizeUnit(variant.quantity_unit)}`

const getWeightageName = (variant) =>
  `${Number(variant.quantity_value)} ${normalizeUnit(variant.quantity_unit)}`

function Toggle({ checked, onChange, label }) {
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
        {label}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          width: 44,
          height: 24,
          borderRadius: 999,
          border: 'none',
          padding: 2,
          cursor: 'pointer',
          background: checked ? '#15803d' : '#d1d5db',
          display: 'flex',
          alignItems: 'center',
          justifyContent: checked ? 'flex-end' : 'flex-start',
          transition: 'background 0.15s',
        }}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            display: 'block',
          }}
        />
      </button>
    </div>
  )
}

export default function Weightage() {
  const [products, setProducts] = useState([])
  const [allVariants, setAllVariants] = useState([])
  const [loading, setLoading] = useState(true)

  const [showAdd, setShowAdd] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState(UNITS[0])
  const [available, setAvailable] = useState(true)
  const [active, setActive] = useState(true)
  const [saving, setSaving] = useState(false)

  const [deletingKey, setDeletingKey] = useState(null)

  // Load all products, then collect quantity variants from every product
  const loadAll = useCallback(async () => {
    setLoading(true)

    try {
      const allProducts = []
      let page = 1
      let total = 0

      do {
        const { data } = await getProducts({ page, limit: 100 })
        const result = data?.data
        const items = Array.isArray(result?.products)
          ? result.products
          : []

        allProducts.push(...items)
        total = Number(result?.total) || allProducts.length
        page += 1

        if (!items.length || page > 201) break
      } while (allProducts.length < total)

      setProducts(allProducts)

      const results = await Promise.all(
        allProducts.map(async (item) => {
          try {
            const { data } = await getVariants(item._id)
            const variants = Array.isArray(data?.data) ? data.data : []

            return variants
              .filter(
                (variant) =>
                  variant.variant_type === 'quantity' &&
                  variant.quantity_value != null &&
                  variant.quantity_unit
              )
              .map((variant) => ({ ...variant, product_id: item._id }))
          } catch {
            return []
          }
        })
      )

      setAllVariants(results.flat())
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to load weightages.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // Unique weightage cards built from every product's variants
  const weightages = useMemo(() => {
    const unique = new Map()

    allVariants.forEach((variant) => {
      const key = getWeightageKey(variant)

      if (!unique.has(key)) {
        unique.set(key, { key, name: getWeightageName(variant) })
      }
    })

    return Array.from(unique.values()).sort((a, b) => {
      const [aValue, aUnit] = a.key.split('-')
      const [bValue, bUnit] = b.key.split('-')
      if (aUnit !== bUnit) return aUnit.localeCompare(bUnit)
      return Number(aValue) - Number(bValue)
    })
  }, [allVariants])

  const resetForm = () => {
    setQuantity('')
    setUnit(UNITS[0])
    setAvailable(true)
    setActive(true)
  }

  const closeAdd = () => {
    if (saving) return
    setShowAdd(false)
    resetForm()
  }

  const handleAdd = async (event) => {
    event.preventDefault()

    const value = Number(quantity)

    if (!value || value <= 0) {
      toast.error('Enter a valid quantity.')
      return
    }

    if (!products.length) {
      toast.error('Add a product first.')
      return
    }

    const key = `${value}-${unit}`

    // Only products that don't already have this weightage
    const missing = products.filter(
      (item) =>
        !allVariants.some(
          (variant) =>
            variant.product_id === item._id &&
            getWeightageKey(variant) === key
        )
    )

    if (missing.length === 0) {
      toast.error(`${value} ${unit} already exists.`)
      return
    }

    setSaving(true)

    try {
      const results = await Promise.allSettled(
        missing.map((item) =>
          createVariant(item._id, {
            variant_type: 'quantity',
            variant_name: `${value} ${unit}`,
            quantity_value: value,
            quantity_unit: unit,
            member_count: null,
            price: 0,
            availability: available,
            status: active ? 'active' : 'inactive',
          })
        )
      )

      const failed = results.filter((r) => r.status === 'rejected').length
      const added = results.length - failed

      if (added > 0) {
        toast.success(`${value} ${unit} added to ${added} product(s).`)
      }

      if (failed > 0) {
        const firstError = results.find((r) => r.status === 'rejected')
        toast.error(
          firstError?.reason?.response?.data?.message ||
            `Failed to add to ${failed} product(s).`
        )
      }

      if (added > 0) {
        setShowAdd(false)
        resetForm()
        await loadAll()
      }
    } finally {
      setSaving(false)
    }
  }

  // Delete one weightage from every product that has it
  const handleDelete = async (weightage) => {
    if (deletingKey) return

    const matches = allVariants.filter(
      (variant) => getWeightageKey(variant) === weightage.key
    )

    if (matches.length === 0) return

    const ok = window.confirm(
      `Delete ${weightage.name} from all ${matches.length} product(s)?\n\n` +
        'Any prices set for it will be lost. This cannot be undone.'
    )

    if (!ok) return

    setDeletingKey(weightage.key)

    try {
      const results = await Promise.allSettled(
        matches.map((variant) => deleteVariant(variant._id))
      )

      const failed = results.filter((r) => r.status === 'rejected').length
      const removed = results.length - failed

      if (removed > 0) {
        toast.success(`${weightage.name} deleted from ${removed} product(s).`)
      }

      if (failed > 0) {
        const firstError = results.find((r) => r.status === 'rejected')
        toast.error(
          firstError?.reason?.response?.data?.message ||
            `Failed to delete from ${failed} product(s).`
        )
      }

      await loadAll()
    } finally {
      setDeletingKey(null)
    }
  }

  const previewName =
    Number(quantity) > 0 ? `${Number(quantity)} ${unit}` : 'Variant name'

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">Weightage</h2>
          <p className="page__subtitle">
            Dynamic weightages shared across all products.
          </p>
        </div>

        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setShowAdd(true)}
        >
          <Plus size={16} />
          Add variant
        </button>
      </div>

      <div className="section-card" style={{ padding: 16 }}>
        {loading ? (
          <p>Loading weightages...</p>
        ) : weightages.length === 0 ? (
          <div className="empty-state">
            <Layers size={16} />
            No weightages yet. Click Add variant to create one.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 10,
            }}
          >
            {weightages.map((weightage) => {
              const busy = deletingKey === weightage.key

              return (
                <div
                  key={weightage.key}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 10,
                    padding: '14px 12px',
                    background: '#f0fdf4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    opacity: deletingKey && !busy ? 0.6 : 1,
                  }}
                >
                  <strong style={{ fontSize: 16 }}>
                    {busy ? 'Deleting...' : weightage.name}
                  </strong>

                  <button
                    type="button"
                    title={`Delete ${weightage.name} from all products`}
                    aria-label={`Delete ${weightage.name} from all products`}
                    disabled={Boolean(deletingKey)}
                    onClick={() => handleDelete(weightage)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      border: '1px solid #fecaca',
                      background: '#fff',
                      color: '#dc2626',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: deletingKey ? 'not-allowed' : 'pointer',
                      flex: 'none',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <div
          onClick={closeAdd}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <form
            onSubmit={handleAdd}
            onClick={(event) => event.stopPropagation()}
            style={{
              background: '#f5f0e8',
              borderRadius: 14,
              padding: 20,
              width: 400,
              maxWidth: '92vw',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Add variant</h3>

            <div style={{ display: 'flex', gap: 12 }}>
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label" htmlFor="weightage-quantity">
                  Quantity *
                </label>
                <input
                  id="weightage-quantity"
                  className="form-input"
                  type="number"
                  min="0"
                  step="any"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  placeholder="e.g. 0.5"
                  autoFocus
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label" htmlFor="weightage-unit">
                  Unit
                </label>
                <select
                  id="weightage-unit"
                  className="form-input"
                  value={unit}
                  onChange={(event) => setUnit(event.target.value)}
                >
                  {UNITS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <small
              style={{ display: 'block', margin: '8px 0 12px', color: '#6b7280' }}
            >
              This variant will be added to every product.
            </small>

            <div style={{ display: 'flex', gap: 40, marginBottom: 16 }}>
              <Toggle
                label="Available"
                checked={available}
                onChange={setAvailable}
              />
              <Toggle label="Active" checked={active} onChange={setActive} />
            </div>

            <div style={{ fontWeight: 700, marginBottom: 8 }}>Live preview</div>

            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 14,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#1f2937',
                }}
              >
                {previewName}
              </div>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 6,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 999,
                  background: available ? '#dcfce7' : '#fee2e2',
                  color: available ? '#15803d' : '#b91c1c',
                }}
              >
                {available ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="submit"
                className="btn btn--primary"
                style={{ flex: 1 }}
                disabled={saving}
              >
                {saving ? 'Adding...' : 'Add to all products'}
              </button>
              <button
                type="button"
                className="btn"
                onClick={closeAdd}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}