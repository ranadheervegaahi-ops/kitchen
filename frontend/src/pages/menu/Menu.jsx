
// import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
// import { Search, X } from 'lucide-react'
// import toast from 'react-hot-toast'

// import {
//   getProducts,
//   createProduct,
//   updateProduct,
//   updateProductAvailability,
//   deleteProduct,
//   getCategories,
//   createCategory,
//   getVariants,
//   createVariant,
//   updateVariantPrice,
//   deleteVariant,
// } from '../../services/adminService'

// const FILE_BASE = 'http://localhost:5000'
// const MAX_IMAGE_MB = 2
// const TELUGU_FIELD = 'name_te'
// const SIZES_STORAGE_KEY = 'drk_menu_size_catalog'
// const MENU_CATEGORY_ORDER = ['curries', 'fry', 'biryani', 'hundi', 'specials']

// const imgSrc = (url) =>
//   !url ? '' : url.startsWith('http') ? url : `${FILE_BASE}${url}`

// const formatPrice = (value) =>
//   `₹${Number(value ?? 0).toLocaleString('en-IN')}`

// const catIdOf = (p) =>
//   p?.category_id?._id || p?.category_id || ''

// const makeWeight = (value, unit = 'KG') => {
//   const v = Number(value)
//   const u = String(unit || 'KG').toUpperCase()

//   return {
//     key: `${v}-${u}`,
//     type: 'quantity',
//     value: v,
//     unit: u,
//     label: `${v} ${u}`,
//   }
// }

// const makePeople = (count) => {
//   const c = Number(count)

//   return {
//     key: `m-${c}`,
//     type: 'member',
//     value: c,
//     unit: '',
//     label: `${c} people`,
//   }
// }

// const sizeFromVariant = (v) => {
//   if (!v) return null

//   if (v.variant_type === 'member') {
//     return Number(v.member_count) > 0
//       ? makePeople(v.member_count)
//       : null
//   }

//   if (
//     v.variant_type === 'quantity' &&
//     Number(v.quantity_value) > 0 &&
//     v.quantity_unit
//   ) {
//     return makeWeight(v.quantity_value, v.quantity_unit)
//   }

//   return null
// }

// const sizeFromKey = (key) => {
//   if (typeof key !== 'string') return null

//   if (key.startsWith('m-')) {
//     const count = Number(key.slice(2))
//     return count > 0 ? makePeople(count) : null
//   }

//   const index = key.lastIndexOf('-')
//   if (index < 1) return null

//   const value = Number(key.slice(0, index))
//   const unit = key.slice(index + 1)

//   return value > 0 && unit ? makeWeight(value, unit) : null
// }

// const variantKey = (v) => sizeFromVariant(v)?.key || null

// const sortSizes = (items) =>
//   [...items].sort((a, b) => {
//     if (a.type !== b.type) return a.type === 'quantity' ? -1 : 1

//     if (a.type === 'quantity' && a.unit !== b.unit) {
//       return a.unit.localeCompare(b.unit)
//     }

//     return a.value - b.value
//   })

// const variantPayload = (size, price) =>
//   size.type === 'member'
//     ? {
//         variant_type: 'member',
//         variant_name: `${size.value} Members`,
//         quantity_value: 0,
//         quantity_unit: 'PCS',
//         member_count: size.value,
//         price,
//         status: 'active',
//       }
//     : {
//         variant_type: 'quantity',
//         variant_name: `${size.value} ${size.unit}`,
//         quantity_value: size.value,
//         quantity_unit: size.unit,
//         member_count: null,
//         price,
//         status: 'active',
//       }

// const hasKgRule = (p) =>
//   p?.preorder_above_kg != null &&
//   Number(p.preorder_above_kg) > 0

// const hasPrepRule = (p) => Number(p?.min_prep_hours) > 0

// const loadCatalog = () => {
//   try {
//     const raw = JSON.parse(
//       localStorage.getItem(SIZES_STORAGE_KEY) || '[]'
//     )

//     return Array.isArray(raw)
//       ? raw.filter((key) => typeof key === 'string')
//       : []
//   } catch {
//     return []
//   }
// }

// const saveCatalog = (keys) => {
//   try {
//     localStorage.setItem(SIZES_STORAGE_KEY, JSON.stringify(keys))
//   } catch {
//     // Browser storage may be unavailable.
//   }
// }

// const sortCategories = (items) => {
//   if (!Array.isArray(items)) return []

//   return [...items].sort((a, b) => {
//     const nameA = String(a.name || '').trim().toLowerCase()
//     const nameB = String(b.name || '').trim().toLowerCase()

//     const indexA = MENU_CATEGORY_ORDER.indexOf(nameA)
//     const indexB = MENU_CATEGORY_ORDER.indexOf(nameB)

//     const orderA = indexA === -1 ? MENU_CATEGORY_ORDER.length : indexA
//     const orderB = indexB === -1 ? MENU_CATEGORY_ORDER.length : indexB

//     if (orderA !== orderB) return orderA - orderB

//     return nameA.localeCompare(nameB)
//   })
// }

// const fetchAllProducts = async () => {
//   const all = []
//   let page = 1

//   for (;;) {
//     const { data } = await getProducts({
//       search: '',
//       status: '',
//       category_id: '',
//       page,
//       limit: 100,
//     })

//     const result = data?.data
//     const items = Array.isArray(result?.products)
//       ? result.products
//       : []

//     all.push(...items)

//     const total = Number(result?.total) || 0

//     if (
//       items.length === 0 ||
//       all.length >= total ||
//       page >= 200
//     ) {
//       break
//     }

//     page += 1
//   }

//   return all
// }

// const optimizeImage = (file) =>
//   new Promise((resolve) => {
//     const url = URL.createObjectURL(file)
//     const image = new Image()

//     image.onload = () => {
//       const max = 1200
//       const scale = Math.min(
//         1,
//         max / Math.max(image.width, image.height)
//       )

//       const canvas = document.createElement('canvas')
//       canvas.width = Math.round(image.width * scale)
//       canvas.height = Math.round(image.height * scale)

//       const context = canvas.getContext('2d')

//       if (!context) {
//         URL.revokeObjectURL(url)
//         resolve(file)
//         return
//       }

//       context.drawImage(
//         image,
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       )

//       URL.revokeObjectURL(url)

//       canvas.toBlob(
//         (blob) => {
//           if (!blob || blob.size >= file.size) {
//             resolve(file)
//             return
//           }

//           resolve(
//             new File(
//               [blob],
//               file.name.replace(/\.\w+$/, '') + '.webp',
//               { type: 'image/webp' }
//             )
//           )
//         },
//         'image/webp',
//         0.85
//       )
//     }

//     image.onerror = () => {
//       URL.revokeObjectURL(url)
//       resolve(file)
//     }

//     image.src = url
//   })

// const formatNow = (date) => {
//   const day = new Intl.DateTimeFormat('en-GB', {
//     timeZone: 'Asia/Kolkata',
//     weekday: 'long',
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//   }).format(date)

//   const time = new Intl.DateTimeFormat('en-IN', {
//     timeZone: 'Asia/Kolkata',
//     hour: 'numeric',
//     minute: '2-digit',
//     hour12: true,
//   })
//     .format(date)
//     .toUpperCase()

//   return `${day.replace(/^(\w+) /, '$1, ')} · ${time}`
// }

// const CSS = `
// .mn-page{background:#f2ede4;min-height:100%;padding:20px 24px 40px;color:#1f2d3d}
// .mn-head h2{font-size:30px;font-weight:800;margin:0}
// .mn-head p{margin:4px 0 0;color:#6b7686;font-size:13px}
// .mn-bar{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}
// .mn-search{flex:1 1 260px;display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #e4dccd;border-radius:12px;padding:0 14px}
// .mn-search input{border:none;outline:none;background:transparent;width:100%;padding:14px 0;font-size:15px;color:#1f2d3d}
// .mn-btn{border:1px solid #2b3a4d;background:#fff;color:#2b3a4d;border-radius:10px;padding:10px 16px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap}
// .mn-btn:disabled{opacity:.5;cursor:not-allowed}
// .mn-btn--primary{background:#d9531e;border-color:#d9531e;color:#fff}
// .mn-btn--danger{background:#fbe7e1;border-color:#fbe7e1;color:#b3341a}
// .mn-btn--ghost{border-color:#e4dccd}
// .mn-tabs{display:flex;gap:8px;flex-wrap:nowrap;overflow-x:auto;padding:4px 2px 12px;margin-bottom:12px;scrollbar-width:thin}
// .mn-tab{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto;border:1px solid #e4dccd;background:#fff;color:#1f2d3d;border-radius:10px;padding:11px 18px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap}
// .mn-tab[aria-pressed="true"]{background:#2b3a4d;border-color:#2b3a4d;color:#fff}
// .mn-tab small{background:#f2ede4;color:#2b3a4d;border-radius:999px;padding:2px 7px;font-size:11px}
// .mn-tab[aria-pressed="true"] small{background:#fff;color:#2b3a4d}
// .mn-section{margin-bottom:16px}
// .mn-card{background:#fff;border:1px solid #e4dccd;border-radius:16px;overflow:hidden}
// .mn-card-title{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a6a58;padding:14px 20px;border-bottom:1px solid #eee6d9;font-weight:800}
// .mn-row{display:grid;grid-template-columns:minmax(200px,1.4fr) minmax(160px,1.4fr) auto auto;gap:16px;align-items:center;padding:16px 20px;border-bottom:1px solid #f0e9dc}
// .mn-row:last-child{border-bottom:none}
// .mn-dish{display:flex;align-items:center;gap:14px;min-width:0}
// .mn-thumb{width:56px;height:56px;border-radius:12px;flex:none;overflow:hidden;background:#f2ede4}
// .mn-thumb img{width:100%;height:100%;object-fit:cover}
// .mn-name{font-weight:800;font-size:16px;overflow-wrap:anywhere}
// .mn-te{color:#6b7686;font-size:14px;margin-top:2px}
// .mn-prices{font-size:13px;line-height:1.9;color:#2b3a4d}
// .mn-muted{color:#9aa3af}
// .mn-rules{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
// .mn-chip{background:#fde9db;border:1px solid #f3c3a3;color:#c2410c;border-radius:8px;padding:2px 8px;font-size:12px;font-weight:600}
// .mn-stock{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;white-space:nowrap}
// .mn-stock--off{color:#9aa3af}
// .mn-actions{display:flex;gap:8px}
// .mn-switch{width:40px;height:24px;border-radius:999px;border:none;background:#cfd4da;position:relative;cursor:pointer;padding:0;flex:none}
// .mn-switch:after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s}
// .mn-switch[aria-checked="true"]{background:#2f7d4f}
// .mn-switch[aria-checked="true"]:after{transform:translateX(16px)}
// .mn-switch:disabled{opacity:.6;cursor:not-allowed}
// .mn-empty{text-align:center;color:#6b7686;padding:40px 16px;background:#fff;border:1px solid #e4dccd;border-radius:16px}
// .mn-loader{display:grid;place-items:center;padding:60px}
// .mn-spin{width:28px;height:28px;border:3px solid #eadfce;border-top-color:#d9531e;border-radius:50%;animation:mnspin .8s linear infinite}
// @keyframes mnspin{to{transform:rotate(360deg)}}
// .mn-overlay{position:fixed;inset:0;background:rgba(31,45,61,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000}
// .mn-modal{background:#fff;border-radius:20px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;padding:22px;box-sizing:border-box}
// .mn-modal--sm{max-width:460px}
// .mn-mhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
// .mn-mtitle{font-size:23px;font-weight:800;margin:0;color:#2b3a4d}
// .mn-x{width:38px;height:38px;border-radius:50%;border:1px solid #e4cfc6;background:#fff;color:#b3341a;cursor:pointer;display:grid;place-items:center}
// .mn-hint{color:#6b7686;font-size:14px;line-height:1.5;margin:0 0 16px}
// .mn-field{margin-bottom:16px}
// .mn-label{display:block;font-size:14px;font-weight:600;margin-bottom:6px;color:#2b3a4d}
// .mn-input,.mn-select{width:100%;box-sizing:border-box;border:1px solid #e4dccd;background:#fff;border-radius:12px;padding:12px 14px;font-size:15px;color:#1f2d3d;outline:none}
// .mn-input:focus,.mn-select:focus{border-color:#d9531e}
// .mn-row2{display:flex;gap:12px}
// .mn-row2>*{flex:1;min-width:0}
// .mn-mbtns{display:flex;justify-content:flex-end;gap:10px;margin-top:12px}
// .mn-h4{font-size:16px;font-weight:800;margin:6px 0 10px;color:#2b3a4d}
// .mn-box{border:1px solid #e4dccd;border-radius:14px;padding:16px;margin-bottom:14px}
// .mn-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
// .mn-size{display:inline-flex;align-items:center;gap:8px;background:#f2ede4;border-radius:999px;padding:6px 8px 6px 14px;font-size:13px;font-weight:800}
// .mn-size small{font-weight:500;color:#6b7686}
// .mn-size button{width:24px;height:24px;border-radius:50%;border:1px solid #d8d2c6;background:#fff;color:#d9531e;cursor:pointer;display:grid;place-items:center;padding:0}
// .mn-size button:disabled{opacity:.5}
// .mn-addrow{display:flex;gap:10px}
// .mn-suffix{flex:1;display:flex;align-items:center;gap:8px;border:1px solid #e4dccd;border-radius:12px;padding:0 12px}
// .mn-suffix input{border:none;outline:none;width:100%;padding:12px 0;font-size:15px;background:transparent}
// .mn-suffix span{color:#8a93a0;font-size:13px;font-weight:600}
// .mn-pickgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px}
// .mn-pick{display:flex;align-items:center;gap:8px;border:1px solid #e4dccd;border-radius:10px;padding:8px;background:#fff;min-width:0}
// .mn-pick--on{background:#f0fdf4;border-color:#bfe3cb}
// .mn-pick strong{min-width:65px;font-size:13px}
// .mn-price{display:flex;align-items:center;gap:4px;border:1px solid #e4dccd;border-radius:8px;padding:0 8px;flex:1;min-width:0}
// .mn-price input{border:none;outline:none;width:100%;min-width:0;padding:8px 0;font-size:13px;background:transparent}
// .mn-toggle{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:700}
// .mn-drop{border:2px dashed #dcc4b3;background:#fdf9f2;border-radius:16px;padding:26px 12px;text-align:center;cursor:pointer;font-size:14px;color:#6b7686}
// .mn-drop--over{background:#fdeede;border-color:#d9531e}
// .mn-photo{position:relative;border-radius:14px;overflow:hidden;border:1px solid #e4dccd}
// .mn-photo img{display:block;width:100%;max-height:180px;object-fit:cover}
// .mn-photo button{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;border:none;background:rgba(0,0,0,.6);color:#fff;cursor:pointer}
// .mn-note{color:#6b7686;font-size:12px;margin-top:8px}
// @media(max-width:900px){.mn-row{grid-template-columns:1fr 1fr;gap:12px}.mn-actions{flex-wrap:wrap}}
// @media(max-width:600px){.mn-page{padding:16px}.mn-row{grid-template-columns:1fr}.mn-row2{flex-direction:column}.mn-actions{flex-wrap:wrap}.mn-stock{padding:4px 0}}
// `

// function Switch({ checked, onChange, disabled, label }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       aria-label={label}
//       className="mn-switch"
//       disabled={disabled}
//       onClick={() => onChange(!checked)}
//     />
//   )
// }

// function Modal({ title, onClose, locked, small, children }) {
//   return (
//     <div
//       className="mn-overlay"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget && !locked) onClose()
//       }}
//     >
//       <div className={`mn-modal ${small ? 'mn-modal--sm' : ''}`}>
//         <div className="mn-mhead">
//           <h3 className="mn-mtitle">{title}</h3>
//           <button
//             type="button"
//             className="mn-x"
//             aria-label="Close"
//             onClick={() => !locked && onClose()}
//           >
//             <X size={16} />
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   )
// }

// function CategoryModal({ onClose, onCreated }) {
//   const [name, setName] = useState('')
//   const [saving, setSaving] = useState(false)

//   const submit = async (e) => {
//     e.preventDefault()
//     if (saving) return

//     const clean = name.trim()
//     if (!clean) return toast.error('Category name is required.')

//     setSaving(true)

//     try {
//       await createCategory({ name: clean, status: 'active' })
//       await onCreated()
//       toast.success('Category added.')
//       onClose()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to add category.')
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <Modal title="New category" onClose={onClose} locked={saving} small>
//       <form onSubmit={submit}>
//         <div className="mn-field">
//           <label className="mn-label" htmlFor="mn-cat-name">
//             Category name
//           </label>
//           <input
//             id="mn-cat-name"
//             className="mn-input"
//             placeholder="e.g. Starters"
//             value={name}
//             autoFocus
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         <div className="mn-mbtns">
//           <button type="button" className="mn-btn" onClick={onClose} disabled={saving}>
//             Cancel
//           </button>
//           <button type="submit" className="mn-btn mn-btn--primary" disabled={saving}>
//             {saving ? 'Adding...' : 'Add category'}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   )
// }

// function SizesModal({ sizes, usage, variantsMap, catalog, setCatalog, onClose, onChanged }) {
//   const [weight, setWeight] = useState('')
//   const [people, setPeople] = useState('')
//   const [busyKey, setBusyKey] = useState(null)

//   const weights = sizes.filter((s) => s.type === 'quantity')
//   const peopleSizes = sizes.filter((s) => s.type === 'member')

//   const addSize = (size) => {
//     if (sizes.some((s) => s.key === size.key)) {
//       toast.error(`${size.label} already exists.`)
//       return false
//     }

//     const next = [...catalog, size.key]
//     setCatalog(next)
//     saveCatalog(next)
//     toast.success(`${size.label} added.`)
//     return true
//   }

//   const addWeight = (e) => {
//     e.preventDefault()
//     const value = Number(weight)

//     if (!(value > 0)) return toast.error('Enter a valid weight.')

//     if (addSize(makeWeight(value, 'KG'))) setWeight('')
//   }

//   const addPeople = (e) => {
//     e.preventDefault()
//     const count = Number(people)

//     if (!Number.isInteger(count) || count < 1) {
//       return toast.error('People must be a whole number, 1 or more.')
//     }

//     if (addSize(makePeople(count))) setPeople('')
//   }

//   const removeSize = async (size) => {
//     if (busyKey) return

//     const used = usage[size.key] || 0

//     if (used > 0) {
//       const ok = window.confirm(
//         `Remove ${size.label} from ${used} dish(es)? Prices set for it will be lost.`
//       )
//       if (!ok) return
//     }

//     setBusyKey(size.key)

//     try {
//       if (used > 0) {
//         const targets = Object.values(variantsMap)
//           .flat()
//           .filter((v) => variantKey(v) === size.key)

//         const results = await Promise.allSettled(
//           targets.map((v) => deleteVariant(v._id))
//         )

//         const failed = results.filter((r) => r.status === 'rejected').length

//         if (failed > 0) {
//           toast.error(`Could not remove ${size.label} from ${failed} dish(es).`)
//           await onChanged()
//           return
//         }
//       }

//       const next = catalog.filter((key) => key !== size.key)
//       setCatalog(next)
//       saveCatalog(next)

//       toast.success(`${size.label} removed.`)

//       if (used > 0) await onChanged()
//     } catch {
//       toast.error('Failed to remove size.')
//     } finally {
//       setBusyKey(null)
//     }
//   }

//   const renderChips = (list) => (
//     <div className="mn-chips">
//       {list.map((size) => {
//         const used = usage[size.key] || 0

//         return (
//           <span key={size.key} className="mn-size">
//             {size.label}
//             <small>{used ? `${used} dish(es)` : 'unused'}</small>
//             <button
//               type="button"
//               aria-label={`Remove ${size.label}`}
//               disabled={Boolean(busyKey)}
//               onClick={() => removeSize(size)}
//             >
//               <X size={12} />
//             </button>
//           </span>
//         )
//       })}
//     </div>
//   )

//   return (
//     <Modal title="Sizes" onClose={onClose} locked={Boolean(busyKey)}>
//       <p className="mn-hint">
//         Create sizes once and reuse them across dishes.
//       </p>

//       <div className="mn-box">
//         <h4 className="mn-h4">Weights</h4>
//         {renderChips(weights)}

//         <form className="mn-addrow" onSubmit={addWeight}>
//           <label className="mn-suffix">
//             <input
//               type="number"
//               min="0"
//               step="any"
//               placeholder="e.g. 0.75"
//               value={weight}
//               onChange={(e) => setWeight(e.target.value)}
//             />
//             <span>KG</span>
//           </label>
//           <button type="submit" className="mn-btn">Add</button>
//         </form>
//       </div>

//       <div className="mn-box">
//         <h4 className="mn-h4">Hundi — people</h4>
//         {renderChips(peopleSizes)}

//         <form className="mn-addrow" onSubmit={addPeople}>
//           <label className="mn-suffix">
//             <input
//               type="number"
//               min="1"
//               step="1"
//               placeholder="e.g. 30"
//               value={people}
//               onChange={(e) => setPeople(e.target.value)}
//             />
//             <span>people</span>
//           </label>
//           <button type="submit" className="mn-btn">Add</button>
//         </form>
//       </div>

//       <div className="mn-mbtns">
//         <button type="button" className="mn-btn" onClick={onClose}>
//           Done
//         </button>
//       </div>
//     </Modal>
//   )
// }

// function DishModal({
//   product,
//   variants,
//   categories,
//   sizes,
//   defaultCategory,
//   onClose,
//   onSaved,
// }) {
//   const editing = Boolean(product)

//   const [name, setName] = useState(product?.name || '')
//   const [nameTe, setNameTe] = useState(product?.[TELUGU_FIELD] || '')
//   const [categoryId, setCategoryId] = useState(
//     catIdOf(product) || defaultCategory || ''
//   )
//   const [description, setDescription] = useState(product?.description || '')
//   const [available, setAvailable] = useState(
//     editing ? Boolean(product.availability) : true
//   )
//   const [preorderAboveKg, setPreorderAboveKg] = useState(
//     hasKgRule(product) ? String(product.preorder_above_kg) : ''
//   )
//   const [minPrepHours, setMinPrepHours] = useState(
//     hasPrepRule(product) ? String(product.min_prep_hours) : ''
//   )

//   const [selected, setSelected] = useState(() =>
//     variants.map(variantKey).filter(Boolean)
//   )

//   const [prices, setPrices] = useState(() =>
//     Object.fromEntries(
//       variants
//         .filter((v) => variantKey(v))
//         .map((v) => [
//           variantKey(v),
//           Number(v.price) > 0 ? String(v.price) : '',
//         ])
//     )
//   )

//   const [imageFile, setImageFile] = useState(null)
//   const [imagePreview, setImagePreview] = useState(
//     product?.image_url ? imgSrc(product.image_url) : ''
//   )
//   const [dragOver, setDragOver] = useState(false)
//   const [saving, setSaving] = useState(false)

//   const fileRef = useRef(null)
//   const previewUrlRef = useRef('')

//   const clearPreviewUrl = () => {
//     if (previewUrlRef.current) {
//       URL.revokeObjectURL(previewUrlRef.current)
//       previewUrlRef.current = ''
//     }
//   }

//   useEffect(() => () => clearPreviewUrl(), [])

//   const acceptFile = async (file) => {
//     if (!file) return

//     const allowed = [
//       'image/jpeg',
//       'image/jpg',
//       'image/png',
//       'image/webp',
//     ]

//     if (!allowed.includes(file.type)) {
//       return toast.error('Only JPG, PNG, WEBP allowed.')
//     }

//     if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
//       return toast.error(`Max ${MAX_IMAGE_MB} MB allowed.`)
//     }

//     const optimized = await optimizeImage(file)

//     clearPreviewUrl()

//     const url = URL.createObjectURL(optimized)
//     previewUrlRef.current = url

//     setImageFile(optimized)
//     setImagePreview(url)
//   }

//   const removeImage = () => {
//     clearPreviewUrl()
//     setImageFile(null)
//     setImagePreview('')

//     if (fileRef.current) fileRef.current.value = ''
//   }

//   const toggleSize = (key, checked) => {
//     setSelected((current) =>
//       checked
//         ? current.includes(key) ? current : [...current, key]
//         : current.filter((item) => item !== key)
//     )
//   }

//   const handleSave = async (e) => {
//     e.preventDefault()
//     if (saving) return

//     if (!name.trim()) return toast.error('Dish name is required.')
//     if (!categoryId) return toast.error('Pick a category.')

//     const kgRaw = String(preorderAboveKg).trim()
//     const prepRaw = String(minPrepHours).trim()

//     if (kgRaw !== '' && !(Number(kgRaw) > 0)) {
//       return toast.error('Pre-order limit must be greater than 0 KG.')
//     }

//     if (prepRaw !== '' && !(Number(prepRaw) >= 0)) {
//       return toast.error('Minimum preparation time cannot be negative.')
//     }

//     for (const key of selected) {
//       const raw = prices[key]

//       if (raw === undefined || raw === '') continue

//       if (!Number.isFinite(Number(raw)) || Number(raw) <= 0) {
//         return toast.error('Prices must be greater than 0.')
//       }
//     }

//     setSaving(true)

//     try {
//       const fd = new FormData()

//       fd.append('name', name.trim())
//       fd.append(TELUGU_FIELD, nameTe.trim())
//       fd.append('category_id', categoryId)
//       fd.append('description', description || '')
//       fd.append(
//         'display_order',
//         String(Math.max(0, Number(product?.display_order) || 0))
//       )
//       fd.append('status', product?.status || 'active')
//       fd.append('availability', String(available))
//       fd.append('preorder_above_kg', kgRaw)
//       fd.append('min_prep_hours', prepRaw === '' ? '0' : prepRaw)

//       if (imageFile) fd.append('image', imageFile)

//       let productId = product?._id

//       if (editing) {
//         await updateProduct(product._id, fd)
//       } else {
//         const { data } = await createProduct(fd)
//         const created = data?.data

//         productId = created?._id || created?.product?._id
//       }

//       if (!productId) {
//         throw new Error('Dish saved, but its sizes could not be linked.')
//       }

//       const selectedSet = new Set(selected)

//       for (const variant of variants) {
//         const key = variantKey(variant)

//         if (key && !selectedSet.has(key)) {
//           await deleteVariant(variant._id)
//         }
//       }

//       for (const size of sizes) {
//         if (!selectedSet.has(size.key)) continue

//         const existing = variants.find(
//           (v) => variantKey(v) === size.key
//         )

//         const raw = prices[size.key]
//         const hasRaw = raw !== undefined && raw !== ''

//         if (existing) {
//           const newPrice = hasRaw
//             ? Number(raw)
//             : Number(existing.price)

//           if (
//             newPrice > 0 &&
//             newPrice !== Number(existing.price)
//           ) {
//             await updateVariantPrice(existing._id, newPrice)
//           }
//         } else {
//           await createVariant(
//             productId,
//             variantPayload(size, hasRaw ? Number(raw) : 0)
//           )
//         }
//       }

//       toast.success(editing ? 'Dish updated.' : 'Dish added.')

//       await onSaved()
//       onClose()
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           'Failed to save.'
//       )
//     } finally {
//       setSaving(false)
//     }
//   }

//   const renderPicks = (list) => (
//     <div className="mn-pickgrid">
//       {list.map((size) => {
//         const checked = selected.includes(size.key)

//         return (
//           <label
//             key={size.key}
//             className={`mn-pick ${checked ? 'mn-pick--on' : ''}`}
//           >
//             <input
//               type="checkbox"
//               checked={checked}
//               disabled={saving}
//               onChange={(e) =>
//                 toggleSize(size.key, e.target.checked)
//               }
//             />

//             <strong>{size.label}</strong>

//             <span className="mn-price">
//               <span>₹</span>
//               <input
//                 type="number"
//                 min="0.01"
//                 step="0.01"
//                 placeholder="Price"
//                 aria-label={`Price for ${size.label}`}
//                 value={prices[size.key] ?? ''}
//                 disabled={!checked || saving}
//                 onChange={(e) =>
//                   setPrices((current) => ({
//                     ...current,
//                     [size.key]: e.target.value,
//                   }))
//                 }
//               />
//             </span>
//           </label>
//         )
//       })}
//     </div>
//   )

//   const weightSizes = sizes.filter((s) => s.type === 'quantity')
//   const peopleSizes = sizes.filter((s) => s.type === 'member')

//   return (
//     <Modal
//       title={editing ? 'Edit dish' : 'Add dish'}
//       onClose={onClose}
//       locked={saving}
//     >
//       <form onSubmit={handleSave}>
//         <div className="mn-field">
//           <label className="mn-label">Dish name *</label>
//           <input
//             className="mn-input"
//             placeholder="e.g. Chicken Dum Biryani"
//             value={name}
//             autoFocus
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         <div className="mn-field">
//           <label className="mn-label">Telugu name</label>
//           <input
//             className="mn-input"
//             placeholder="తెలుగు పేరు"
//             value={nameTe}
//             onChange={(e) => setNameTe(e.target.value)}
//           />
//         </div>

//         <div className="mn-field">
//           <label className="mn-label">Category *</label>
//           <select
//             className="mn-select"
//             value={categoryId}
//             onChange={(e) => setCategoryId(e.target.value)}
//           >
//             <option value="">Select category...</option>

//             {categories.map((category) => (
//               <option key={category._id} value={category._id}>
//                 {category.name}
//               </option>
//             ))}
//           </select>

//           {categories.length === 0 && (
//             <div className="mn-note">
//               No categories yet. Create a category first.
//             </div>
//           )}
//         </div>

//         <div className="mn-field">
//           <label className="mn-label">Description</label>
//           <input
//             className="mn-input"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         <div className="mn-field">
//           <label className="mn-label">
//             Photo (JPG, PNG, WEBP · max {MAX_IMAGE_MB} MB)
//           </label>

//           {imagePreview ? (
//             <div className="mn-photo">
//               <img src={imagePreview} alt="Dish preview" />
//               <button type="button" onClick={removeImage}>
//                 ✕
//               </button>
//             </div>
//           ) : (
//             <div
//               className={`mn-drop ${dragOver ? 'mn-drop--over' : ''}`}
//               role="button"
//               tabIndex={0}
//               onClick={() => fileRef.current?.click()}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                   e.preventDefault()
//                   fileRef.current?.click()
//                 }
//               }}
//               onDragOver={(e) => {
//                 e.preventDefault()
//                 setDragOver(true)
//               }}
//               onDragLeave={() => setDragOver(false)}
//               onDrop={(e) => {
//                 e.preventDefault()
//                 setDragOver(false)
//                 acceptFile(e.dataTransfer.files?.[0])
//               }}
//             >
//               Click or drag a photo here
//             </div>
//           )}

//           <input
//             ref={fileRef}
//             type="file"
//             accept="image/jpeg,image/jpg,image/png,image/webp"
//             style={{ display: 'none' }}
//             onChange={(e) => {
//               acceptFile(e.target.files?.[0])
//               e.target.value = ''
//             }}
//           />
//         </div>

//         <div className="mn-field mn-toggle">
//           <Switch
//             checked={available}
//             onChange={setAvailable}
//             label="In stock"
//           />
//           {available ? 'In stock' : 'Out of stock'}
//         </div>

//         <h4 className="mn-h4">Sizes &amp; prices</h4>

//         {sizes.length === 0 ? (
//           <p className="mn-hint">
//             No sizes yet. Close this and create sizes first.
//           </p>
//         ) : (
//           <>
//             {weightSizes.length > 0 && (
//               <>
//                 <div className="mn-note">Weights</div>
//                 {renderPicks(weightSizes)}
//               </>
//             )}

//             {peopleSizes.length > 0 && (
//               <>
//                 <div className="mn-note" style={{ marginTop: 12 }}>
//                   Hundi — people
//                 </div>
//                 {renderPicks(peopleSizes)}
//               </>
//             )}

//             <div className="mn-note">
//               Select the sizes for this dish and enter each price.
//             </div>
//           </>
//         )}

//         <h4 className="mn-h4" style={{ marginTop: 18 }}>
//           Order rules (optional)
//         </h4>

//         <div className="mn-row2 mn-field">
//           <div>
//             <label className="mn-label">Pre-order above (KG)</label>
//             <input
//               className="mn-input"
//               type="number"
//               min="0"
//               step="any"
//               placeholder="e.g. 5"
//               value={preorderAboveKg}
//               onChange={(e) => setPreorderAboveKg(e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="mn-label">Min prep time (hours)</label>
//             <input
//               className="mn-input"
//               type="number"
//               min="0"
//               step="any"
//               placeholder="e.g. 2"
//               value={minPrepHours}
//               onChange={(e) => setMinPrepHours(e.target.value)}
//             />
//           </div>
//         </div>

//         <div className="mn-mbtns">
//           <button
//             type="button"
//             className="mn-btn"
//             onClick={onClose}
//             disabled={saving}
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             className="mn-btn mn-btn--primary"
//             disabled={saving || categories.length === 0}
//           >
//             {saving ? 'Saving...' : editing ? 'Save dish' : 'Add dish'}
//           </button>
//         </div>
//       </form>
//     </Modal>
//   )
// }

// export default function Menu() {
//   const [products, setProducts] = useState([])
//   const [variantsMap, setVariantsMap] = useState({})
//   const [categories, setCategories] = useState([])
//   const [catalog, setCatalog] = useState(loadCatalog)
//   const [loading, setLoading] = useState(true)

//   const [search, setSearch] = useState('')
//   const [activeCat, setActiveCat] = useState('all')
//   const [busyId, setBusyId] = useState(null)
//   const [now, setNow] = useState(() => new Date())

//   const [dishForm, setDishForm] = useState(null)
//   const [showSizes, setShowSizes] = useState(false)
//   const [showCategory, setShowCategory] = useState(false)
//   const [confirmDelete, setConfirmDelete] = useState(null)
//   const [deleting, setDeleting] = useState(false)

//   useEffect(() => {
//     const id = setInterval(() => setNow(new Date()), 30000)
//     return () => clearInterval(id)
//   }, [])

//   const loadCategories = useCallback(async () => {
//     const { data } = await getCategories({ status: 'active' })
//     const list = sortCategories(data?.data)
//     setCategories(list)
//     return list
//   }, [])

//   const loadAll = useCallback(
//     async (silent = false) => {
//       if (!silent) setLoading(true)

//       try {
//         const [items, categoryList] = await Promise.all([
//           fetchAllProducts(),
//           loadCategories(),
//         ])

//         setProducts(items)

//         // If the selected category was removed or is no longer active,
//         // return to All instead of leaving a stale selection.
//         setActiveCat((current) => {
//           if (current === 'all') return current

//           return categoryList.some((c) => c._id === current)
//             ? current
//             : 'all'
//         })

//         const map = {}

//         for (let i = 0; i < items.length; i += 10) {
//           await Promise.all(
//             items.slice(i, i + 10).map(async (product) => {
//               try {
//                 const { data } = await getVariants(product._id)
//                 map[product._id] = Array.isArray(data?.data)
//                   ? data.data
//                   : []
//               } catch {
//                 map[product._id] = []
//               }
//             })
//           )
//         }

//         setVariantsMap(map)
//       } catch (err) {
//         toast.error(
//           err.response?.data?.message || 'Failed to load menu.'
//         )
//       } finally {
//         setLoading(false)
//       }
//     },
//     [loadCategories]
//   )

//   useEffect(() => {
//     loadAll()
//   }, [loadAll])

//   const sizes = useMemo(() => {
//     const map = new Map()

//     catalog.forEach((key) => {
//       const size = sizeFromKey(key)
//       if (size) map.set(size.key, size)
//     })

//     Object.values(variantsMap)
//       .flat()
//       .forEach((variant) => {
//         const size = sizeFromVariant(variant)
//         if (size && !map.has(size.key)) map.set(size.key, size)
//       })

//     return sortSizes([...map.values()])
//   }, [catalog, variantsMap])

//   const usage = useMemo(() => {
//     const counts = {}

//     Object.values(variantsMap).forEach((list) => {
//       const seen = new Set()

//       list.forEach((variant) => {
//         const key = variantKey(variant)

//         if (key && !seen.has(key)) {
//           seen.add(key)
//           counts[key] = (counts[key] || 0) + 1
//         }
//       })
//     })

//     return counts
//   }, [variantsMap])

//   const countByCategory = useMemo(() => {
//     const counts = {}

//     products.forEach((product) => {
//       const id = catIdOf(product)
//       counts[id] = (counts[id] || 0) + 1
//     })

//     return counts
//   }, [products])

//   // IMPORTANT: The selected category ID controls which dishes are visible.
//   const visibleProducts = useMemo(() => {
//     const term = search.trim().toLowerCase()

//     return products.filter((product) => {
//       const categoryMatches =
//         activeCat === 'all' || catIdOf(product) === activeCat

//       const searchMatches =
//         !term ||
//         String(product.name || '').toLowerCase().includes(term) ||
//         String(product[TELUGU_FIELD] || '').toLowerCase().includes(term) ||
//         String(product.description || '').toLowerCase().includes(term)

//       return categoryMatches && searchMatches
//     })
//   }, [products, activeCat, search])

//   const sections = useMemo(() => {
//     const known = new Set(categories.map((category) => category._id))

//     const result = categories
//       .filter((category) =>
//         activeCat === 'all' || category._id === activeCat
//       )
//       .map((category) => ({
//         id: category._id,
//         title: category.name,
//         items: visibleProducts.filter(
//           (product) => catIdOf(product) === category._id
//         ),
//       }))
//       .filter((section) => section.items.length > 0)

//     const orphans = visibleProducts.filter(
//       (product) => !known.has(catIdOf(product))
//     )

//     if (orphans.length > 0) {
//       result.push({
//         id: 'other',
//         title: 'Other',
//         items: orphans,
//       })
//     }

//     return result
//   }, [categories, visibleProducts, activeCat])

//   const toggleStock = async (product) => {
//     if (busyId) return

//     setBusyId(product._id)

//     try {
//       await updateProductAvailability(
//         product._id,
//         !product.availability
//       )

//       setProducts((current) =>
//         current.map((item) =>
//           item._id === product._id
//             ? { ...item, availability: !product.availability }
//             : item
//         )
//       )
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || 'Failed to update stock.'
//       )
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const handleDelete = async () => {
//     if (!confirmDelete || deleting) return

//     setDeleting(true)

//     try {
//       await deleteProduct(confirmDelete._id)
//       toast.success('Dish deleted.')
//       setConfirmDelete(null)
//       await loadAll(true)
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || 'Failed to delete.'
//       )
//     } finally {
//       setDeleting(false)
//     }
//   }

//   const renderPrices = (product) => {
//     const variants = (variantsMap[product._id] || [])
//       .map((variant) => ({
//         variant,
//         size: sizeFromVariant(variant),
//       }))
//       .filter((item) => item.size)

//     if (variantsMap[product._id] === undefined) {
//       return <span className="mn-muted">Loading...</span>
//     }

//     if (variants.length === 0) {
//       return <span className="mn-muted">No sizes yet</span>
//     }

//     return sortSizes(variants.map((item) => item.size))
//       .map((size) => {
//         const variant = variants.find(
//           (item) => item.size.key === size.key
//         ).variant

//         const priced = Number(variant.price) > 0

//         return (
//           <span
//             key={size.key}
//             className={priced ? '' : 'mn-muted'}
//           >
//             {size.label} {priced ? formatPrice(variant.price) : '—'}
//           </span>
//         )
//       })
//       .reduce(
//         (result, node, index) =>
//           index === 0 ? [node] : [...result, ' · ', node],
//         []
//       )
//   }

//   return (
//     <div className="mn-page">
//       <style>{CSS}</style>

//       <div className="mn-head">
//         <h2>Menu Management</h2>
//         <p>{formatNow(now)}</p>
//       </div>

//       <div className="mn-bar">
//         <label className="mn-search">
//           <Search size={17} />
//           <input
//             placeholder="Search dishes"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </label>

//         <button
//           type="button"
//           className="mn-btn"
//           onClick={() => setShowSizes(true)}
//         >
//           Sizes
//         </button>

//         <button
//           type="button"
//           className="mn-btn"
//           onClick={() => setShowCategory(true)}
//         >
//           + Category
//         </button>

//         <button
//           type="button"
//           className="mn-btn mn-btn--primary"
//           onClick={() => setDishForm({ product: null })}
//         >
//           + Add Dish
//         </button>
//       </div>

//       {/* CATEGORY TAB SWITCH */}
//       <div className="mn-tabs" role="group" aria-label="Filter dishes by category">
//         <button
//           type="button"
//           className="mn-tab"
//           aria-pressed={activeCat === 'all'}
//           onClick={() => setActiveCat('all')}
//         >
//           All
//           <small>{products.length}</small>
//         </button>

//         {categories.map((category) => (
//           <button
//             key={category._id}
//             type="button"
//             className="mn-tab"
//             aria-pressed={activeCat === category._id}
//             onClick={() => {
//               setActiveCat(category._id)
//               setSearch('')
//             }}
//           >
//             {category.name}
//             <small>{countByCategory[category._id] || 0}</small>
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <div className="mn-loader">
//           <span className="mn-spin" />
//         </div>
//       ) : sections.length === 0 ? (
//         <div className="mn-empty">
//           {search.trim()
//             ? 'No dishes match your search in this category.'
//             : activeCat !== 'all'
//               ? 'No dishes in this category yet. Click + Add Dish to create one.'
//               : 'No dishes yet. Click + Add Dish to create your first dish.'}
//         </div>
//       ) : (
//         sections.map((section) => (
//           <div className="mn-section" key={section.id}>
//             <div className="mn-card">
//               <div className="mn-card-title">
//                 {section.title} · {section.items.length} dishes
//               </div>

//               {section.items.map((product) => {
//                 const inStock = Boolean(product.availability)

//                 return (
//                   <div className="mn-row" key={product._id}>
//                     <div className="mn-dish">
//                       <div className="mn-thumb">
//                         {product.image_url && (
//                           <img
//                             src={imgSrc(product.image_url)}
//                             alt={product.name}
//                           />
//                         )}
//                       </div>

//                       <div style={{ minWidth: 0 }}>
//                         <div className="mn-name">{product.name}</div>

//                         {product[TELUGU_FIELD] && (
//                           <div className="mn-te">
//                             {product[TELUGU_FIELD]}
//                           </div>
//                         )}

//                         {(hasKgRule(product) || hasPrepRule(product)) && (
//                           <div className="mn-rules">
//                             {hasKgRule(product) && (
//                               <span className="mn-chip">
//                                 Pre-order above {Number(product.preorder_above_kg)} KG
//                               </span>
//                             )}

//                             {hasPrepRule(product) && (
//                               <span className="mn-chip">
//                                 Min {Number(product.min_prep_hours)} h prep
//                               </span>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     <div className="mn-prices">
//                       {renderPrices(product)}
//                     </div>

//                     <div className={`mn-stock ${inStock ? '' : 'mn-stock--off'}`}>
//                       <Switch
//                         checked={inStock}
//                         label={`Stock of ${product.name}`}
//                         disabled={busyId === product._id}
//                         onChange={() => toggleStock(product)}
//                       />
//                       {inStock ? 'In stock' : 'Out of stock'}
//                     </div>

//                     <div className="mn-actions">
//                       <button
//                         type="button"
//                         className="mn-btn mn-btn--ghost"
//                         onClick={() => setDishForm({ product })}
//                       >
//                         Edit
//                       </button>

//                       <button
//                         type="button"
//                         className="mn-btn mn-btn--danger"
//                         onClick={() => setConfirmDelete(product)}
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         ))
//       )}

//       {dishForm && (
//         <DishModal
//           key={dishForm.product?._id || 'new'}
//           product={dishForm.product}
//           variants={
//             dishForm.product
//               ? variantsMap[dishForm.product._id] || []
//               : []
//           }
//           categories={categories}
//           sizes={sizes}
//           defaultCategory={activeCat !== 'all' ? activeCat : ''}
//           onClose={() => setDishForm(null)}
//           onSaved={() => loadAll(true)}
//         />
//       )}

//       {showSizes && (
//         <SizesModal
//           sizes={sizes}
//           usage={usage}
//           variantsMap={variantsMap}
//           catalog={catalog}
//           setCatalog={setCatalog}
//           onClose={() => setShowSizes(false)}
//           onChanged={() => loadAll(true)}
//         />
//       )}

//       {showCategory && (
//         <CategoryModal
//           onClose={() => setShowCategory(false)}
//           onCreated={loadAll}
//         />
//       )}

//       {confirmDelete && (
//         <Modal
//           title="Delete dish"
//           onClose={() => setConfirmDelete(null)}
//           locked={deleting}
//           small
//         >
//           <p className="mn-hint">
//             Are you sure you want to delete{' '}
//             <strong>{confirmDelete.name}</strong>? This cannot be undone.
//           </p>

//           <div className="mn-mbtns">
//             <button
//               type="button"
//               className="mn-btn"
//               onClick={() => setConfirmDelete(null)}
//               disabled={deleting}
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               className="mn-btn mn-btn--primary"
//               onClick={handleDelete}
//               disabled={deleting}
//             >
//               {deleting ? 'Deleting...' : 'Delete'}
//             </button>
//           </div>
//         </Modal>
//       )}
//     </div>
//   )
// }

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import toast from 'react-hot-toast'

import {
  getProducts,
  createProduct,
  updateProduct,
  updateProductAvailability,
  deleteProduct,
  getCategories,
  createCategory,
  getVariants,
  createVariant,
  updateVariant,
  updateVariantPrice,
  deleteVariant,
} from '../../services/adminService'

const FILE_BASE = 'http://localhost:5000'
const MAX_IMAGE_MB = 2
const TELUGU_FIELD = 'name_te'
const SIZES_STORAGE_KEY = 'drk_menu_size_catalog'
const MENU_CATEGORY_ORDER = ['curries', 'fry', 'biryani', 'hundi', 'specials']

const imgSrc = (url) =>
  !url ? '' : url.startsWith('http') ? url : `${FILE_BASE}${url}`

const formatPrice = (value) =>
  `₹${Number(value ?? 0).toLocaleString('en-IN')}`

const catIdOf = (p) =>
  p?.category_id?._id || p?.category_id || ''

const isHundiName = (name) =>
  String(name || '').trim().toLowerCase() === 'hundi'

const makeWeight = (value, unit = 'KG') => {
  const v = Number(value)
  const u = String(unit || 'KG').toUpperCase()

  return {
    key: `${v}-${u}`,
    type: 'quantity',
    value: v,
    unit: u,
    label: `${v} ${u}`,
  }
}

const makePeople = (count) => {
  const c = Number(count)

  return {
    key: `m-${c}`,
    type: 'member',
    value: c,
    unit: '',
    label: `${c} people`,
  }
}

const sizeFromVariant = (v) => {
  if (!v) return null

  if (v.variant_type === 'member') {
    return Number(v.member_count) > 0
      ? makePeople(v.member_count)
      : null
  }

  if (
    v.variant_type === 'quantity' &&
    Number(v.quantity_value) > 0 &&
    v.quantity_unit
  ) {
    return makeWeight(v.quantity_value, v.quantity_unit)
  }

  return null
}

const sizeFromKey = (key) => {
  if (typeof key !== 'string') return null

  if (key.startsWith('m-')) {
    const count = Number(key.slice(2))
    return count > 0 ? makePeople(count) : null
  }

  const index = key.lastIndexOf('-')
  if (index < 1) return null

  const value = Number(key.slice(0, index))
  const unit = key.slice(index + 1)

  return value > 0 && unit ? makeWeight(value, unit) : null
}

const variantKey = (v) => sizeFromVariant(v)?.key || null

const sortSizes = (items) =>
  [...items].sort((a, b) => {
    if (a.type !== b.type) return a.type === 'quantity' ? -1 : 1

    if (a.type === 'quantity' && a.unit !== b.unit) {
      return a.unit.localeCompare(b.unit)
    }

    return a.value - b.value
  })

const variantPayload = (size, price, orderType = 'instock') =>
  size.type === 'member'
    ? {
        variant_type: 'member',
        variant_name: `${size.value} Members`,
        quantity_value: 0,
        quantity_unit: 'PCS',
        member_count: size.value,
        price,
        status: 'active',
        order_type: orderType,
      }
    : {
        variant_type: 'quantity',
        variant_name: `${size.value} ${size.unit}`,
        quantity_value: size.value,
        quantity_unit: size.unit,
        member_count: null,
        price,
        status: 'active',
        order_type: orderType,
      }

const hasKgRule = (p) =>
  p?.preorder_above_kg != null &&
  Number(p.preorder_above_kg) > 0

const hasPrepRule = (p) => Number(p?.min_prep_hours) > 0

const loadCatalog = () => {
  try {
    const raw = JSON.parse(
      localStorage.getItem(SIZES_STORAGE_KEY) || '[]'
    )

    return Array.isArray(raw)
      ? raw.filter((key) => typeof key === 'string')
      : []
  } catch {
    return []
  }
}

const saveCatalog = (keys) => {
  try {
    localStorage.setItem(SIZES_STORAGE_KEY, JSON.stringify(keys))
  } catch {
    // Browser storage may be unavailable.
  }
}

const sortCategories = (items) => {
  if (!Array.isArray(items)) return []

  return [...items].sort((a, b) => {
    const nameA = String(a.name || '').trim().toLowerCase()
    const nameB = String(b.name || '').trim().toLowerCase()

    const indexA = MENU_CATEGORY_ORDER.indexOf(nameA)
    const indexB = MENU_CATEGORY_ORDER.indexOf(nameB)

    const orderA = indexA === -1 ? MENU_CATEGORY_ORDER.length : indexA
    const orderB = indexB === -1 ? MENU_CATEGORY_ORDER.length : indexB

    if (orderA !== orderB) return orderA - orderB

    return nameA.localeCompare(nameB)
  })
}

const fetchAllProducts = async () => {
  const all = []
  let page = 1

  for (;;) {
    const { data } = await getProducts({
      search: '',
      status: '',
      category_id: '',
      page,
      limit: 100,
    })

    const result = data?.data
    const items = Array.isArray(result?.products)
      ? result.products
      : []

    all.push(...items)

    const total = Number(result?.total) || 0

    if (
      items.length === 0 ||
      all.length >= total ||
      page >= 200
    ) {
      break
    }

    page += 1
  }

  return all
}

const optimizeImage = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      const max = 1200
      const scale = Math.min(
        1,
        max / Math.max(image.width, image.height)
      )

      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)

      const context = canvas.getContext('2d')

      if (!context) {
        URL.revokeObjectURL(url)
        resolve(file)
        return
      }

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      )

      URL.revokeObjectURL(url)

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            resolve(file)
            return
          }

          resolve(
            new File(
              [blob],
              file.name.replace(/\.\w+$/, '') + '.webp',
              { type: 'image/webp' }
            )
          )
        },
        'image/webp',
        0.85
      )
    }

    image.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }

    image.src = url
  })

const formatNow = (date) => {
  const day = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)

  const time = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .toUpperCase()

  return `${day.replace(/^(\w+) /, '$1, ')} · ${time}`
}

const CSS = `
.mn-page{background:#f2ede4;min-height:100%;padding:20px 24px 40px;color:#1f2d3d}
.mn-head h2{font-size:30px;font-weight:800;margin:0}
.mn-head p{margin:4px 0 0;color:#6b7686;font-size:13px}
.mn-bar{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}
.mn-search{flex:1 1 260px;display:flex;align-items:center;gap:10px;background:#fff;border:1px solid #e4dccd;border-radius:12px;padding:0 14px}
.mn-search input{border:none;outline:none;background:transparent;width:100%;padding:14px 0;font-size:15px;color:#1f2d3d}
.mn-btn{border:1px solid #2b3a4d;background:#fff;color:#2b3a4d;border-radius:10px;padding:10px 16px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap}
.mn-btn:disabled{opacity:.5;cursor:not-allowed}
.mn-btn--primary{background:#d9531e;border-color:#d9531e;color:#fff}
.mn-btn--danger{background:#fbe7e1;border-color:#fbe7e1;color:#b3341a}
.mn-btn--ghost{border-color:#e4dccd}
.mn-tabs{display:flex;gap:8px;flex-wrap:nowrap;overflow-x:auto;padding:4px 2px 12px;margin-bottom:12px;scrollbar-width:thin}
.mn-tab{display:inline-flex;align-items:center;gap:8px;flex:0 0 auto;border:1px solid #e4dccd;background:#fff;color:#1f2d3d;border-radius:10px;padding:11px 18px;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap}
.mn-tab[aria-pressed="true"]{background:#2b3a4d;border-color:#2b3a4d;color:#fff}
.mn-tab small{background:#f2ede4;color:#2b3a4d;border-radius:999px;padding:2px 7px;font-size:11px}
.mn-tab[aria-pressed="true"] small{background:#fff;color:#2b3a4d}
.mn-section{margin-bottom:16px}
.mn-card{background:#fff;border:1px solid #e4dccd;border-radius:16px;overflow:hidden}
.mn-card-title{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8a6a58;padding:14px 20px;border-bottom:1px solid #eee6d9;font-weight:800}
.mn-row{display:grid;grid-template-columns:minmax(200px,1.4fr) minmax(160px,1.4fr) auto auto;gap:16px;align-items:center;padding:16px 20px;border-bottom:1px solid #f0e9dc}
.mn-row:last-child{border-bottom:none}
.mn-dish{display:flex;align-items:center;gap:14px;min-width:0}
.mn-thumb{width:56px;height:56px;border-radius:12px;flex:none;overflow:hidden;background:#f2ede4}
.mn-thumb img{width:100%;height:100%;object-fit:cover}
.mn-name{font-weight:800;font-size:16px;overflow-wrap:anywhere}
.mn-te{color:#6b7686;font-size:14px;margin-top:2px}
.mn-prices{font-size:13px;line-height:1.9;color:#2b3a4d}
.mn-muted{color:#9aa3af}
.mn-rules{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.mn-chip{background:#fde9db;border:1px solid #f3c3a3;color:#c2410c;border-radius:8px;padding:2px 8px;font-size:12px;font-weight:600}
.mn-chip--hidden{background:#eceff3;border-color:#d5dae1;color:#5b6675}
.mn-stock{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:700;white-space:nowrap}
.mn-stock--off{color:#9aa3af}
.mn-actions{display:flex;gap:8px}
.mn-switch{width:40px;height:24px;border-radius:999px;border:none;background:#cfd4da;position:relative;cursor:pointer;padding:0;flex:none}
.mn-switch:after{content:'';position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s}
.mn-switch[aria-checked="true"]{background:#2f7d4f}
.mn-switch[aria-checked="true"]:after{transform:translateX(16px)}
.mn-switch:disabled{opacity:.6;cursor:not-allowed}
.mn-empty{text-align:center;color:#6b7686;padding:40px 16px;background:#fff;border:1px solid #e4dccd;border-radius:16px}
.mn-loader{display:grid;place-items:center;padding:60px}
.mn-spin{width:28px;height:28px;border:3px solid #eadfce;border-top-color:#d9531e;border-radius:50%;animation:mnspin .8s linear infinite}
@keyframes mnspin{to{transform:rotate(360deg)}}
.mn-overlay{position:fixed;inset:0;background:rgba(31,45,61,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000}
.mn-modal{background:#fff;border-radius:20px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;padding:22px;box-sizing:border-box}
.mn-modal--sm{max-width:460px}
.mn-mhead{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.mn-mtitle{font-size:23px;font-weight:800;margin:0;color:#2b3a4d}
.mn-x{width:38px;height:38px;border-radius:50%;border:1px solid #e4cfc6;background:#fff;color:#b3341a;cursor:pointer;display:grid;place-items:center}
.mn-hint{color:#6b7686;font-size:14px;line-height:1.5;margin:0 0 16px}
.mn-field{margin-bottom:16px}
.mn-label{display:block;font-size:14px;font-weight:600;margin-bottom:6px;color:#2b3a4d}
.mn-input,.mn-select{width:100%;box-sizing:border-box;border:1px solid #e4dccd;background:#fff;border-radius:12px;padding:12px 14px;font-size:15px;color:#1f2d3d;outline:none}
.mn-input:focus,.mn-select:focus{border-color:#d9531e}
.mn-row2{display:flex;gap:12px}
.mn-row2>*{flex:1;min-width:0}
.mn-mbtns{display:flex;justify-content:flex-end;gap:10px;margin-top:12px}
.mn-h4{font-size:16px;font-weight:800;margin:6px 0 10px;color:#2b3a4d}
.mn-box{border:1px solid #e4dccd;border-radius:14px;padding:16px;margin-bottom:14px}
.mn-chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
.mn-size{display:inline-flex;align-items:center;gap:8px;background:#f2ede4;border-radius:999px;padding:6px 8px 6px 14px;font-size:13px;font-weight:800}
.mn-size small{font-weight:500;color:#6b7686}
.mn-size button{width:24px;height:24px;border-radius:50%;border:1px solid #d8d2c6;background:#fff;color:#d9531e;cursor:pointer;display:grid;place-items:center;padding:0}
.mn-size button:disabled{opacity:.5}
.mn-addrow{display:flex;gap:10px}
.mn-suffix{flex:1;display:flex;align-items:center;gap:8px;border:1px solid #e4dccd;border-radius:12px;padding:0 12px}
.mn-suffix input{border:none;outline:none;width:100%;padding:12px 0;font-size:15px;background:transparent}
.mn-suffix span{color:#8a93a0;font-size:13px;font-weight:600}
.mn-drop{border:2px dashed #dcc4b3;background:#fdf9f2;border-radius:16px;padding:26px 12px;text-align:center;cursor:pointer;font-size:14px;color:#6b7686}
.mn-drop--over{background:#fdeede;border-color:#d9531e}
.mn-photo{position:relative;border-radius:14px;overflow:hidden;border:1px solid #e4dccd}
.mn-photo img{display:block;width:100%;max-height:180px;object-fit:cover}
.mn-photo button{position:absolute;top:8px;right:8px;width:28px;height:28px;border-radius:50%;border:none;background:rgba(0,0,0,.6);color:#fff;cursor:pointer}
.mn-note{color:#6b7686;font-size:12px;margin-top:8px}

/* ── dish form: pills, size rows, toggles ── */
.mn-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.mn-pills{display:flex;flex-wrap:wrap;gap:8px}
.mn-pill{border:1px solid #e4dccd;background:#fff;color:#1f2d3d;border-radius:999px;padding:9px 18px;font-size:14px;font-weight:600;cursor:pointer;white-space:nowrap;font-family:inherit}
.mn-pill:disabled{opacity:.55;cursor:not-allowed}
.mn-pill--on{background:#2b3a4d;border-color:#2b3a4d;color:#fff}
.mn-pill--lg{padding:11px 20px;font-size:15px}
.mn-labrow{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:8px;flex-wrap:wrap}
.mn-labrow .mn-label{margin:0}
.mn-labrow span{font-size:12px;color:#8a93a0}
.mn-srow{display:grid;grid-template-columns:90px 1fr 170px 38px;gap:8px;align-items:center;margin-top:8px}
.mn-srow-name{background:#f2ede4;border-radius:12px;padding:13px 12px;font-weight:800;font-size:14px}
.mn-price{display:flex;align-items:center;gap:4px;border:1px solid #e4dccd;border-radius:12px;padding:0 12px;min-width:0}
.mn-price input{border:none;outline:none;width:100%;min-width:0;padding:12px 0;font-size:15px;background:transparent}
.mn-seg{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:#f2ede4;border-radius:12px;padding:3px}
.mn-seg button{border:none;background:transparent;border-radius:9px;padding:10px 4px;font-size:12px;font-weight:700;color:#8a93a0;cursor:pointer;font-family:inherit}
.mn-seg button[aria-pressed="true"]{background:#fff;color:#2f7d4f;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.mn-seg button.mn-seg--pre[aria-pressed="true"]{color:#c2410c}
.mn-srow-rm{height:42px;border-radius:12px;border:none;background:#f9e5df;color:#d9531e;font-size:16px;cursor:pointer}
.mn-infonote{background:#e9eef2;border-radius:10px;padding:10px 12px;font-size:13px;color:#44403c;margin-top:10px}
.mn-pickhint{color:#6b7686;font-size:13px;margin-top:12px}
.mn-swrow{display:flex;align-items:center;gap:12px;margin-top:14px}
.mn-swrow strong{display:block;font-size:15px;color:#2b3a4d}
.mn-swrow small{display:block;color:#6b7686;font-size:12px;margin-top:2px}
@media(max-width:900px){.mn-row{grid-template-columns:1fr 1fr;gap:12px}.mn-actions{flex-wrap:wrap}}
@media(max-width:600px){.mn-page{padding:16px}.mn-row{grid-template-columns:1fr}.mn-row2{flex-direction:column}.mn-actions{flex-wrap:wrap}.mn-stock{padding:4px 0}.mn-grid2{grid-template-columns:1fr}.mn-srow{grid-template-columns:76px 1fr 38px}.mn-srow .mn-seg{grid-column:1 / -1;grid-row:2}}
`

function Switch({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="mn-switch"
      disabled={disabled}
      onClick={() => onChange(!checked)}
    />
  )
}

function Modal({ title, onClose, locked, small, children }) {
  return (
    <div
      className="mn-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !locked) onClose()
      }}
    >
      <div className={`mn-modal ${small ? 'mn-modal--sm' : ''}`}>
        <div className="mn-mhead">
          <h3 className="mn-mtitle">{title}</h3>
          <button
            type="button"
            className="mn-x"
            aria-label="Close"
            onClick={() => !locked && onClose()}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function CategoryModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (saving) return

    const clean = name.trim()
    if (!clean) return toast.error('Category name is required.')

    setSaving(true)

    try {
      await createCategory({ name: clean, status: 'active' })
      await onCreated()
      toast.success('Category added.')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title="New category" onClose={onClose} locked={saving} small>
      <form onSubmit={submit}>
        <div className="mn-field">
          <label className="mn-label" htmlFor="mn-cat-name">
            Category name
          </label>
          <input
            id="mn-cat-name"
            className="mn-input"
            placeholder="e.g. Starters"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mn-mbtns">
          <button type="button" className="mn-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="mn-btn mn-btn--primary" disabled={saving}>
            {saving ? 'Adding...' : 'Add category'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function SizesModal({ sizes, usage, variantsMap, catalog, setCatalog, onClose, onChanged }) {
  const [weight, setWeight] = useState('')
  const [people, setPeople] = useState('')
  const [busyKey, setBusyKey] = useState(null)

  const weights = sizes.filter((s) => s.type === 'quantity')
  const peopleSizes = sizes.filter((s) => s.type === 'member')

  const addSize = (size) => {
    if (sizes.some((s) => s.key === size.key)) {
      toast.error(`${size.label} already exists.`)
      return false
    }

    const next = [...catalog, size.key]
    setCatalog(next)
    saveCatalog(next)
    toast.success(`${size.label} added.`)
    return true
  }

  const addWeight = (e) => {
    e.preventDefault()
    const value = Number(weight)

    if (!(value > 0)) return toast.error('Enter a valid weight.')

    if (addSize(makeWeight(value, 'KG'))) setWeight('')
  }

  const addPeople = (e) => {
    e.preventDefault()
    const count = Number(people)

    if (!Number.isInteger(count) || count < 1) {
      return toast.error('People must be a whole number, 1 or more.')
    }

    if (addSize(makePeople(count))) setPeople('')
  }

  const removeSize = async (size) => {
    if (busyKey) return

    const used = usage[size.key] || 0

    if (used > 0) {
      const ok = window.confirm(
        `Remove ${size.label} from ${used} dish(es)? Prices set for it will be lost.`
      )
      if (!ok) return
    }

    setBusyKey(size.key)

    try {
      if (used > 0) {
        const targets = Object.values(variantsMap)
          .flat()
          .filter((v) => variantKey(v) === size.key)

        const results = await Promise.allSettled(
          targets.map((v) => deleteVariant(v._id))
        )

        const failed = results.filter((r) => r.status === 'rejected').length

        if (failed > 0) {
          toast.error(`Could not remove ${size.label} from ${failed} dish(es).`)
          await onChanged()
          return
        }
      }

      const next = catalog.filter((key) => key !== size.key)
      setCatalog(next)
      saveCatalog(next)

      toast.success(`${size.label} removed.`)

      if (used > 0) await onChanged()
    } catch {
      toast.error('Failed to remove size.')
    } finally {
      setBusyKey(null)
    }
  }

  const renderChips = (list) => (
    <div className="mn-chips">
      {list.map((size) => {
        const used = usage[size.key] || 0

        return (
          <span key={size.key} className="mn-size">
            {size.label}
            <small>{used ? `${used} dish(es)` : 'unused'}</small>
            <button
              type="button"
              aria-label={`Remove ${size.label}`}
              disabled={Boolean(busyKey)}
              onClick={() => removeSize(size)}
            >
              <X size={12} />
            </button>
          </span>
        )
      })}
    </div>
  )

  return (
    <Modal title="Sizes" onClose={onClose} locked={Boolean(busyKey)}>
      <p className="mn-hint">
        Create sizes once and reuse them across dishes.
      </p>

      <div className="mn-box">
        <h4 className="mn-h4">Weights</h4>
        {renderChips(weights)}

        <form className="mn-addrow" onSubmit={addWeight}>
          <label className="mn-suffix">
            <input
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 0.75"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <span>KG</span>
          </label>
          <button type="submit" className="mn-btn">Add</button>
        </form>
      </div>

      <div className="mn-box">
        <h4 className="mn-h4">Hundi — people</h4>
        {renderChips(peopleSizes)}

        <form className="mn-addrow" onSubmit={addPeople}>
          <label className="mn-suffix">
            <input
              type="number"
              min="1"
              step="1"
              placeholder="e.g. 30"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
            <span>people</span>
          </label>
          <button type="submit" className="mn-btn">Add</button>
        </form>
      </div>

      <div className="mn-mbtns">
        <button type="button" className="mn-btn" onClick={onClose}>
          Done
        </button>
      </div>
    </Modal>
  )
}

function DishModal({
  product,
  variants,
  categories,
  sizes,
  defaultCategory,
  onClose,
  onSaved,
}) {
  const editing = Boolean(product)

  const hundiCategory = categories.find((c) => isHundiName(c.name)) || null
  const firstWeightCategory =
    categories.find((c) => !isHundiName(c.name)) || null

  const isHundiId = (id) => Boolean(id) && hundiCategory?._id === id

  const initialCategory =
    catIdOf(product) || defaultCategory || categories[0]?._id || ''

  const initialSoldBy = (() => {
    if (editing) {
      const hasMember = variants.some((v) => v.variant_type === 'member')
      const hasQty = variants.some((v) => v.variant_type === 'quantity')

      if (hasMember && !hasQty) return 'people'
      if (hasQty && !hasMember) return 'weight'
    }

    return isHundiId(initialCategory) ? 'people' : 'weight'
  })()

  const [name, setName] = useState(product?.name || '')
//   const [nameTe, setNameTe] = useState(product?.[TELUGU_FIELD] || '')
  const [categoryId, setCategoryId] = useState(initialCategory)
  const [soldBy, setSoldBy] = useState(initialSoldBy)
  const [description, setDescription] = useState(product?.description || '')
  const [available, setAvailable] = useState(
    editing ? Boolean(product.availability) : true
  )
  const [hidden, setHidden] = useState(
    editing ? product.status === 'inactive' : false
  )
  const [preorderAboveKg, setPreorderAboveKg] = useState(
    hasKgRule(product) ? String(product.preorder_above_kg) : ''
  )
  const [minPrepHours, setMinPrepHours] = useState(
    hasPrepRule(product) ? String(product.min_prep_hours) : ''
  )

  const [selected, setSelected] = useState(() =>
    variants.map(variantKey).filter(Boolean)
  )

  const [prices, setPrices] = useState(() =>
    Object.fromEntries(
      variants
        .filter((v) => variantKey(v))
        .map((v) => [
          variantKey(v),
          Number(v.price) > 0 ? String(v.price) : '',
        ])
    )
  )

  // key -> true (In stock / order now) or false (Pre-order)
  const [stocks, setStocks] = useState(() =>
    Object.fromEntries(
      variants
        .filter((v) => variantKey(v))
        .map((v) => [variantKey(v), v.order_type !== 'preorder'])
    )
  )

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(
    product?.image_url ? imgSrc(product.image_url) : ''
  )
  const [dragOver, setDragOver] = useState(false)
  const [saving, setSaving] = useState(false)

  const fileRef = useRef(null)
  const previewUrlRef = useRef('')

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = ''
    }
  }

  useEffect(() => () => clearPreviewUrl(), [])

  const isPeople = soldBy === 'people'

  /* ── Sold by ⇄ Category are linked ── */
  const chooseSoldBy = (mode) => {
    setSoldBy(mode)

    if (mode === 'people') {
      // People (Hundi) -> Hundi category gets selected
      if (hundiCategory) setCategoryId(hundiCategory._id)
    } else if (isHundiId(categoryId) && firstWeightCategory) {
      // Weight (KG) -> leave Hundi and select a normal category
      setCategoryId(firstWeightCategory._id)
    }
  }

  const chooseCategory = (id) => {
    setCategoryId(id)
    setSoldBy(isHundiId(id) ? 'people' : 'weight')
  }

  const modeSizes = sizes.filter((s) =>
    isPeople ? s.type === 'member' : s.type === 'quantity'
  )
  const activeSizes = modeSizes.filter((s) => selected.includes(s.key))

  const toggleSize = (key) => {
    setSelected((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key]
    )
    setStocks((current) =>
      key in current ? current : { ...current, [key]: true }
    )
  }

  const orderNowLabel = (() => {
    const list = activeSizes.filter((s) => stocks[s.key] !== false)

    if (list.length === 0) return 'none'

    return isPeople
      ? `${list.map((s) => s.value).join(', ')} people`
      : `${list.map((s) => s.value).join(', ')} ${list[0].unit}`
  })()

  /* ── image ── */
  const acceptFile = async (file) => {
    if (!file) return

    const allowed = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ]

    if (!allowed.includes(file.type)) {
      return toast.error('Only JPG, PNG, WEBP allowed.')
    }

    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      return toast.error(`Max ${MAX_IMAGE_MB} MB allowed.`)
    }

    const optimized = await optimizeImage(file)

    clearPreviewUrl()

    const url = URL.createObjectURL(optimized)
    previewUrlRef.current = url

    setImageFile(optimized)
    setImagePreview(url)
  }

  const removeImage = () => {
    clearPreviewUrl()
    setImageFile(null)
    setImagePreview('')

    if (fileRef.current) fileRef.current.value = ''
  }

  /* ── save ── */
  const handleSave = async (e) => {
    e.preventDefault()
    if (saving) return

    if (!name.trim()) return toast.error('Dish name is required.')
    if (!categoryId) return toast.error('Pick a category.')

    const kgRaw = isPeople ? '' : String(preorderAboveKg).trim()
    const prepRaw = String(minPrepHours).trim()

    if (kgRaw !== '' && !(Number(kgRaw) > 0)) {
      return toast.error('Pre-order limit must be greater than 0 KG.')
    }

    if (prepRaw !== '' && !(Number(prepRaw) >= 0)) {
      return toast.error('Minimum preparation time cannot be negative.')
    }

    for (const size of activeSizes) {
      const raw = prices[size.key]

      if (raw === undefined || raw === '') continue

      if (!Number.isFinite(Number(raw)) || Number(raw) <= 0) {
        return toast.error('Prices must be greater than 0.')
      }
    }

    setSaving(true)

    try {
      const fd = new FormData()

      fd.append('name', name.trim())
    //   fd.append(TELUGU_FIELD, nameTe.trim())
      fd.append('category_id', categoryId)
      fd.append('description', description || '')
      fd.append(
        'display_order',
        String(Math.max(0, Number(product?.display_order) || 0))
      )
      fd.append('status', hidden ? 'inactive' : 'active')
      fd.append('availability', String(available))
      fd.append('preorder_above_kg', kgRaw)
      fd.append('min_prep_hours', prepRaw === '' ? '0' : prepRaw)

      if (imageFile) fd.append('image', imageFile)

      let productId = product?._id

      if (editing) {
        await updateProduct(product._id, fd)
      } else {
        const { data } = await createProduct(fd)
        const created = data?.data

        productId = created?._id || created?.product?._id
      }

      if (!productId) {
        throw new Error('Dish saved, but its sizes could not be linked.')
      }

      const selectedSet = new Set(activeSizes.map((s) => s.key))

      // Remove every old size that is not selected in the current tab
      // (this also clears the other tab's sizes when "Sold by" was switched).
      for (const variant of variants) {
        const key = variantKey(variant)

        if (key && !selectedSet.has(key)) {
          await deleteVariant(variant._id)
        }
      }

      for (const size of activeSizes) {
        const existing = variants.find(
          (v) => variantKey(v) === size.key
        )

        const raw = prices[size.key]
        const hasRaw = raw !== undefined && raw !== ''
        const orderType = stocks[size.key] === false ? 'preorder' : 'instock'

        if (existing) {
          const newPrice = hasRaw
            ? Number(raw)
            : Number(existing.price)
          const oldType =
            existing.order_type === 'preorder' ? 'preorder' : 'instock'

          if (oldType !== orderType) {
            await updateVariant(
              existing._id,
              variantPayload(
                size,
                newPrice > 0 ? newPrice : 0,
                orderType
              )
            )
          } else if (
            newPrice > 0 &&
            newPrice !== Number(existing.price)
          ) {
            await updateVariantPrice(existing._id, newPrice)
          }
        } else {
          await createVariant(
            productId,
            variantPayload(size, hasRaw ? Number(raw) : 0, orderType)
          )
        }
      }

      toast.success(editing ? 'Dish updated.' : 'Dish added to menu.')

      await onSaved()
      onClose()
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          'Failed to save.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      title={editing ? 'Edit dish' : 'Add dish'}
      onClose={onClose}
      locked={saving}
    >
      <form onSubmit={handleSave}>
        <div className="mn-field mn-grid2">
          <div>
            <label className="mn-label">Name (English) *</label>
            <input
              className="mn-input"
              placeholder="e.g. Chicken Curry"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* <div>
            <label className="mn-label">Name (Telugu)</label>
            <input
              className="mn-input"
              placeholder="ఉదా. చికెన్ కర్రీ"
              value={nameTe}
              onChange={(e) => setNameTe(e.target.value)}
            />
          </div> */}
        </div>

        <div className="mn-field">
          <label className="mn-label">Description</label>
          <textarea
            className="mn-input"
            rows={3}
            style={{ resize: 'vertical' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* CATEGORY */}
        <div className="mn-field">
          <label className="mn-label">Category *</label>

          <div className="mn-pills">
            {categories.map((category) => (
              <button
                key={category._id}
                type="button"
                disabled={saving}
                className={`mn-pill ${
                  categoryId === category._id ? 'mn-pill--on' : ''
                }`}
                onClick={() => chooseCategory(category._id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="mn-note">
              No categories yet. Create a category first.
            </div>
          )}
        </div>

        {/* SOLD BY */}
        <div className="mn-field">
          <label className="mn-label">Sold by</label>

          <div className="mn-pills">
            <button
              type="button"
              disabled={saving}
              className={`mn-pill mn-pill--lg ${!isPeople ? 'mn-pill--on' : ''}`}
              onClick={() => chooseSoldBy('weight')}
            >
              Weight (KG)
            </button>

            <button
              type="button"
              disabled={saving}
              className={`mn-pill mn-pill--lg ${isPeople ? 'mn-pill--on' : ''}`}
              onClick={() => chooseSoldBy('people')}
            >
              People (Hundi)
            </button>
          </div>
        </div>

        {/* SIZES & PRICES */}
        <div className="mn-field">
          <div className="mn-labrow">
            <label className="mn-label">Sizes &amp; prices</label>
            <span>Tap sizes to add · manage the list in Menu → Sizes</span>
          </div>

          {modeSizes.length === 0 ? (
            <div className="mn-pickhint">
              No {isPeople ? 'people' : 'weight'} sizes yet. Add them from
              Menu → Sizes.
            </div>
          ) : (
            <div className="mn-pills">
              {modeSizes.map((size) => {
                const on = selected.includes(size.key)

                return (
                  <button
                    key={size.key}
                    type="button"
                    disabled={saving}
                    className={`mn-pill ${on ? 'mn-pill--on' : ''}`}
                    onClick={() => toggleSize(size.key)}
                  >
                    {on ? '✓' : '+'} {size.label}
                  </button>
                )
              })}
            </div>
          )}

          {activeSizes.map((size) => (
            <div className="mn-srow" key={size.key}>
              <div className="mn-srow-name">{size.label}</div>

              <label className="mn-price">
                <span>₹</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Price"
                  aria-label={`Price for ${size.label}`}
                  value={prices[size.key] ?? ''}
                  disabled={saving}
                  onChange={(e) =>
                    setPrices((current) => ({
                      ...current,
                      [size.key]: e.target.value,
                    }))
                  }
                />
              </label>

              <div className="mn-seg">
                <button
                  type="button"
                  aria-pressed={stocks[size.key] !== false}
                  onClick={() =>
                    setStocks((current) => ({
                      ...current,
                      [size.key]: true,
                    }))
                  }
                >
                  In stock
                </button>

                <button
                  type="button"
                  className="mn-seg--pre"
                  aria-pressed={stocks[size.key] === false}
                  onClick={() =>
                    setStocks((current) => ({
                      ...current,
                      [size.key]: false,
                    }))
                  }
                >
                  Pre-order
                </button>
              </div>

              <button
                type="button"
                className="mn-srow-rm"
                title="Remove size"
                disabled={saving}
                onClick={() => toggleSize(size.key)}
              >
                –
              </button>
            </div>
          ))}

          {activeSizes.length > 0 ? (
            <div className="mn-infonote">
              Order now: {orderNowLabel}. “Sold out today” only affects
              order-now sizes.
            </div>
          ) : (
            modeSizes.length > 0 && (
              <div className="mn-pickhint">Pick at least one size above.</div>
            )
          )}
        </div>

        {/* order rules only apply to weight dishes */}
        {!isPeople && (
          <div className="mn-row2 mn-field">
            {/* <div>
              <label className="mn-label">Pre-order above (KG)</label>
              <input
                className="mn-input"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 5 (optional)"
                value={preorderAboveKg}
                onChange={(e) => setPreorderAboveKg(e.target.value)}
              />
            </div> */}

            {/* <div>
              <label className="mn-label">Min prep time (hours)</label>
              <input
                className="mn-input"
                type="number"
                min="0"
                step="any"
                placeholder="e.g. 2 (optional)"
                value={minPrepHours}
                onChange={(e) => setMinPrepHours(e.target.value)}
              />
            </div> */}
          </div>
        )}

        {/* TOGGLES */}
        <div className="mn-swrow">
          <Switch
            checked={available}
            onChange={setAvailable}
            label="In stock today"
          />
          <div>
            <strong>In stock today</strong>
            <small>
              Off = order-now sizes show “Sold out today”. Pre-order sizes
              stay bookable.
            </small>
          </div>
        </div>

        <div className="mn-swrow" style={{ marginBottom: 18 }}>
          <Switch
            checked={hidden}
            onChange={setHidden}
            label="Hidden from menu"
          />
          <div>
            <strong>Hidden from menu</strong>
            <small>Customers can’t see or search it</small>
          </div>
        </div>

        {/* PHOTO */}
        <div className="mn-field">
          <label className="mn-label">
            Photo (JPG, PNG, WEBP · max {MAX_IMAGE_MB} MB)
          </label>

          {imagePreview ? (
            <div className="mn-photo">
              <img src={imagePreview} alt="Dish preview" />
              <button type="button" onClick={removeImage}>
                ✕
              </button>
            </div>
          ) : (
            <div
              className={`mn-drop ${dragOver ? 'mn-drop--over' : ''}`}
              role="button"
              tabIndex={0}
              onClick={() => fileRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  fileRef.current?.click()
                }
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                acceptFile(e.dataTransfer.files?.[0])
              }}
            >
              Click or drag a photo here
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: 'none' }}
            onChange={(e) => {
              acceptFile(e.target.files?.[0])
              e.target.value = ''
            }}
          />
        </div>

        <div className="mn-mbtns">
          <button
            type="button"
            className="mn-btn"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="mn-btn mn-btn--primary"
            disabled={saving || categories.length === 0}
          >
            {saving ? 'Saving...' : editing ? 'Save dish' : 'Add to menu'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default function Menu() {
  const [products, setProducts] = useState([])
  const [variantsMap, setVariantsMap] = useState({})
  const [categories, setCategories] = useState([])
  const [catalog, setCatalog] = useState(loadCatalog)
  const [loading, setLoading] = useState(true)

  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('all')
  const [busyId, setBusyId] = useState(null)
  const [now, setNow] = useState(() => new Date())

  const [dishForm, setDishForm] = useState(null)
  const [showSizes, setShowSizes] = useState(false)
  const [showCategory, setShowCategory] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(id)
  }, [])

  const loadCategories = useCallback(async () => {
    const { data } = await getCategories({ status: 'active' })
    const list = sortCategories(data?.data)
    setCategories(list)
    return list
  }, [])

  const loadAll = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true)

      try {
        const [items, categoryList] = await Promise.all([
          fetchAllProducts(),
          loadCategories(),
        ])

        setProducts(items)

        // If the selected category was removed or is no longer active,
        // return to All instead of leaving a stale selection.
        setActiveCat((current) => {
          if (current === 'all') return current

          return categoryList.some((c) => c._id === current)
            ? current
            : 'all'
        })

        const map = {}

        for (let i = 0; i < items.length; i += 10) {
          await Promise.all(
            items.slice(i, i + 10).map(async (product) => {
              try {
                const { data } = await getVariants(product._id)
                map[product._id] = Array.isArray(data?.data)
                  ? data.data
                  : []
              } catch {
                map[product._id] = []
              }
            })
          )
        }

        setVariantsMap(map)
      } catch (err) {
        toast.error(
          err.response?.data?.message || 'Failed to load menu.'
        )
      } finally {
        setLoading(false)
      }
    },
    [loadCategories]
  )

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const sizes = useMemo(() => {
    const map = new Map()

    catalog.forEach((key) => {
      const size = sizeFromKey(key)
      if (size) map.set(size.key, size)
    })

    Object.values(variantsMap)
      .flat()
      .forEach((variant) => {
        const size = sizeFromVariant(variant)
        if (size && !map.has(size.key)) map.set(size.key, size)
      })

    return sortSizes([...map.values()])
  }, [catalog, variantsMap])

  const usage = useMemo(() => {
    const counts = {}

    Object.values(variantsMap).forEach((list) => {
      const seen = new Set()

      list.forEach((variant) => {
        const key = variantKey(variant)

        if (key && !seen.has(key)) {
          seen.add(key)
          counts[key] = (counts[key] || 0) + 1
        }
      })
    })

    return counts
  }, [variantsMap])

  const countByCategory = useMemo(() => {
    const counts = {}

    products.forEach((product) => {
      const id = catIdOf(product)
      counts[id] = (counts[id] || 0) + 1
    })

    return counts
  }, [products])

  // IMPORTANT: The selected category ID controls which dishes are visible.
  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase()

    return products.filter((product) => {
      const categoryMatches =
        activeCat === 'all' || catIdOf(product) === activeCat

      const searchMatches =
        !term ||
        String(product.name || '').toLowerCase().includes(term) ||
        String(product[TELUGU_FIELD] || '').toLowerCase().includes(term) ||
        String(product.description || '').toLowerCase().includes(term)

      return categoryMatches && searchMatches
    })
  }, [products, activeCat, search])

  const sections = useMemo(() => {
    const known = new Set(categories.map((category) => category._id))

    const result = categories
      .filter((category) =>
        activeCat === 'all' || category._id === activeCat
      )
      .map((category) => ({
        id: category._id,
        title: category.name,
        items: visibleProducts.filter(
          (product) => catIdOf(product) === category._id
        ),
      }))
      .filter((section) => section.items.length > 0)

    const orphans = visibleProducts.filter(
      (product) => !known.has(catIdOf(product))
    )

    if (orphans.length > 0) {
      result.push({
        id: 'other',
        title: 'Other',
        items: orphans,
      })
    }

    return result
  }, [categories, visibleProducts, activeCat])

  const toggleStock = async (product) => {
    if (busyId) return

    setBusyId(product._id)

    try {
      await updateProductAvailability(
        product._id,
        !product.availability
      )

      setProducts((current) =>
        current.map((item) =>
          item._id === product._id
            ? { ...item, availability: !product.availability }
            : item
        )
      )
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update stock.'
      )
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete || deleting) return

    setDeleting(true)

    try {
      await deleteProduct(confirmDelete._id)
      toast.success('Dish deleted.')
      setConfirmDelete(null)
      await loadAll(true)
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to delete.'
      )
    } finally {
      setDeleting(false)
    }
  }

  const renderPrices = (product) => {
    const variants = (variantsMap[product._id] || [])
      .map((variant) => ({
        variant,
        size: sizeFromVariant(variant),
      }))
      .filter((item) => item.size)

    if (variantsMap[product._id] === undefined) {
      return <span className="mn-muted">Loading...</span>
    }

    if (variants.length === 0) {
      return <span className="mn-muted">No sizes yet</span>
    }

    return sortSizes(variants.map((item) => item.size))
      .map((size) => {
        const variant = variants.find(
          (item) => item.size.key === size.key
        ).variant

        const priced = Number(variant.price) > 0

        return (
          <span
            key={size.key}
            className={priced ? '' : 'mn-muted'}
          >
            {size.label} {priced ? formatPrice(variant.price) : '—'}
            {variant.order_type === 'preorder' ? ' (pre-order)' : ''}
          </span>
        )
      })
      .reduce(
        (result, node, index) =>
          index === 0 ? [node] : [...result, ' · ', node],
        []
      )
  }

  return (
    <div className="mn-page">
      <style>{CSS}</style>

      <div className="mn-head">
        <h2>Menu Management</h2>
        <p>{formatNow(now)}</p>
      </div>

      <div className="mn-bar">
        <label className="mn-search">
          <Search size={17} />
          <input
            placeholder="Search dishes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>

        <button
          type="button"
          className="mn-btn"
          onClick={() => setShowSizes(true)}
        >
          Sizes
        </button>

        <button
          type="button"
          className="mn-btn"
          onClick={() => setShowCategory(true)}
        >
          + Category
        </button>

        <button
          type="button"
          className="mn-btn mn-btn--primary"
          onClick={() => setDishForm({ product: null })}
        >
          + Add Dish
        </button>
      </div>

      {/* CATEGORY TAB SWITCH */}
      <div className="mn-tabs" role="group" aria-label="Filter dishes by category">
        <button
          type="button"
          className="mn-tab"
          aria-pressed={activeCat === 'all'}
          onClick={() => setActiveCat('all')}
        >
          All
          <small>{products.length}</small>
        </button>

        {categories.map((category) => (
          <button
            key={category._id}
            type="button"
            className="mn-tab"
            aria-pressed={activeCat === category._id}
            onClick={() => {
              setActiveCat(category._id)
              setSearch('')
            }}
          >
            {category.name}
            <small>{countByCategory[category._id] || 0}</small>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mn-loader">
          <span className="mn-spin" />
        </div>
      ) : sections.length === 0 ? (
        <div className="mn-empty">
          {search.trim()
            ? 'No dishes match your search in this category.'
            : activeCat !== 'all'
              ? 'No dishes in this category yet. Click + Add Dish to create one.'
              : 'No dishes yet. Click + Add Dish to create your first dish.'}
        </div>
      ) : (
        sections.map((section) => (
          <div className="mn-section" key={section.id}>
            <div className="mn-card">
              <div className="mn-card-title">
                {section.title} · {section.items.length} dishes
              </div>

              {section.items.map((product) => {
                const inStock = Boolean(product.availability)

                return (
                  <div className="mn-row" key={product._id}>
                    <div className="mn-dish">
                      <div className="mn-thumb">
                        {product.image_url && (
                          <img
                            src={imgSrc(product.image_url)}
                            alt={product.name}
                          />
                        )}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div className="mn-name">{product.name}</div>

                        {product[TELUGU_FIELD] && (
                          <div className="mn-te">
                            {product[TELUGU_FIELD]}
                          </div>
                        )}

                        {(hasKgRule(product) ||
                          hasPrepRule(product) ||
                          product.status === 'inactive') && (
                          <div className="mn-rules">
                            {product.status === 'inactive' && (
                              <span className="mn-chip mn-chip--hidden">
                                Hidden from menu
                              </span>
                            )}

                            {hasKgRule(product) && (
                              <span className="mn-chip">
                                Pre-order above {Number(product.preorder_above_kg)} KG
                              </span>
                            )}

                            {hasPrepRule(product) && (
                              <span className="mn-chip">
                                Min {Number(product.min_prep_hours)} h prep
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mn-prices">
                      {renderPrices(product)}
                    </div>

                    <div className={`mn-stock ${inStock ? '' : 'mn-stock--off'}`}>
                      <Switch
                        checked={inStock}
                        label={`Stock of ${product.name}`}
                        disabled={busyId === product._id}
                        onChange={() => toggleStock(product)}
                      />
                      {inStock ? 'In stock' : 'Out of stock'}
                    </div>

                    <div className="mn-actions">
                      <button
                        type="button"
                        className="mn-btn mn-btn--ghost"
                        onClick={() => setDishForm({ product })}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="mn-btn mn-btn--danger"
                        onClick={() => setConfirmDelete(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
      {dishForm && (
        <DishModal
          key={dishForm.product?._id || 'new'}
          product={dishForm.product}
          variants={
            dishForm.product
              ? variantsMap[dishForm.product._id] || []
              : []
          }
          categories={categories}
          sizes={sizes}
          defaultCategory={activeCat !== 'all' ? activeCat : ''}
          onClose={() => setDishForm(null)}
          onSaved={() => loadAll(true)}
        />
      )}

      {showSizes && (
        <SizesModal
          sizes={sizes}
          usage={usage}
          variantsMap={variantsMap}
          catalog={catalog}
          setCatalog={setCatalog}
          onClose={() => setShowSizes(false)}
          onChanged={() => loadAll(true)}
        />
      )}

      {showCategory && (
        <CategoryModal
          onClose={() => setShowCategory(false)}
          onCreated={loadAll}
        />
      )}

      {confirmDelete && (
        <Modal
          title="Delete dish"
          onClose={() => setConfirmDelete(null)}
          locked={deleting}
          small
        >
          <p className="mn-hint">
            Are you sure you want to delete{' '}
            <strong>{confirmDelete.name}</strong>? This cannot be undone.
          </p>

          <div className="mn-mbtns">
            <button
              type="button"
              className="mn-btn"
              onClick={() => setConfirmDelete(null)}
              disabled={deleting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="mn-btn mn-btn--primary"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}