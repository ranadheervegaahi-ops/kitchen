// // // import { useEffect, useRef, useState } from 'react'
// // // import { CalendarDays, Store, Truck, Trash2 } from 'lucide-react'
// // // import {
// // //   getProducts,
// // //   getProductPreorder,
// // //   createProduct,
// // //   updateProduct,
// // //   updateProductStatus,
// // //   updateProductAvailability,
// // //   deleteProduct,
// // //   getCategories,
// // //   getVariants,
// // //   createVariant,
// // //   updateVariant,
// // //   updateVariantPrice,
// // //   updateVariantAvailability,
// // //   deleteVariant,
// // //   updateVariantStatus,
// // // } from '../../services/adminService'

// // // import Pagination from '../../components/ui/Pagination'
// // // import toast from 'react-hot-toast'

// // // const LIMIT = 20
// // // const FILE_BASE = 'http://localhost:5000'
// // // const MAX_IMAGE_MB = 2
// // // const MENU_CATEGORY_ORDER = ['curries', 'fry', 'biryani', 'specials']
// // // const UNITS = ['KG', 'G', 'L', 'ML', 'PCS']
// // // const UNIT_GROUP = { KG: 'weight', G: 'weight', L: 'volume', ML: 'volume', PCS: 'count' }

// // // const imgSrc = (url) => {
// // //   if (!url) return ''
// // //   return url.startsWith('http') ? url : `${FILE_BASE}${url}`
// // // }

// // // const getTodayIstDate = () => {
// // //   const parts = new Intl.DateTimeFormat('en-CA', {
// // //     timeZone: 'Asia/Kolkata',
// // //     year: 'numeric',
// // //     month: '2-digit',
// // //     day: '2-digit',
// // //   }).formatToParts(new Date())
// // //   const get = (type) => parts.find((p) => p.type === type)?.value
// // //   return `${get('year')}-${get('month')}-${get('day')}`
// // // }

// // // const formatMoney = (value) =>
// // //   `₹${Number(value ?? 0).toLocaleString('en-IN', {
// // //     minimumFractionDigits: 2,
// // //     maximumFractionDigits: 2,
// // //   })}`

// // // const formatPrice = (value) =>
// // //   `₹${Number(value ?? 0).toLocaleString('en-IN')}`

// // // /* "0.5 KG" -> quantity variant, "5 Members" -> member variant */
// // // const parseVariantName = (raw) => {
// // //   const name = String(raw || '').trim()

// // //   let m = name.match(/^(\d*\.?\d+)\s*(kg|g|l|ml|pcs)$/i)
// // //   if (m) {
// // //     const qty = Number(m[1])
// // //     const unit = m[2].toUpperCase()
// // //     if (!(qty > 0)) return null
// // //     return {
// // //       variant_type: 'quantity',
// // //       variant_name: `${qty} ${unit}`,
// // //       quantity_value: qty,
// // //       quantity_unit: unit,
// // //       member_count: null,
// // //     }
// // //   }

// // //   m = name.match(/^(\d+)\s*members?$/i)
// // //   if (m && Number(m[1]) > 0) {
// // //     const count = Number(m[1])
// // //     return {
// // //       variant_type: 'member',
// // //       variant_name: `${count} Members`,
// // //       quantity_value: 0,
// // //       quantity_unit: 'PCS',
// // //       member_count: count,
// // //     }
// // //   }

// // //   return null
// // // }

// // // /* same variant = same quantity+unit (or same member count) */
// // // const sameVariant = (v, parsed) =>
// // //   parsed.variant_type === 'quantity'
// // //     ? v.variant_type === 'quantity' &&
// // //       Number(v.quantity_value) === parsed.quantity_value &&
// // //       v.quantity_unit === parsed.quantity_unit
// // //     : v.variant_type === 'member' && Number(v.member_count) === parsed.member_count

// // // const quantityVariantKey = (variant) =>
// // //   `${Number(variant.quantity_value)}-${variant.quantity_unit}`

// // // /* quantity variants first (by unit, then size), member variants after */
// // // const sortVariants = (items) =>
// // //   [...items].sort((a, b) => {
// // //     if (a.variant_type !== b.variant_type) {
// // //       return a.variant_type === 'quantity' ? -1 : 1
// // //     }
// // //     if (a.variant_type === 'member') {
// // //       return Number(a.member_count) - Number(b.member_count)
// // //     }
// // //     if (a.quantity_unit !== b.quantity_unit) {
// // //       return String(a.quantity_unit).localeCompare(String(b.quantity_unit))
// // //     }
// // //     return Number(a.quantity_value) - Number(b.quantity_value)
// // //   })

// // // const fetchAllProducts = async () => {
// // //   const all = []
// // //   let page = 1

// // //   for (;;) {
// // //     const { data } = await getProducts({
// // //       search: '',
// // //       status: '',
// // //       category_id: '',
// // //       page,
// // //       limit: 100,
// // //     })

// // //     const result = data?.data
// // //     const items = Array.isArray(result?.products) ? result.products : []
// // //     all.push(...items)

// // //     const total = Number(result?.total) || 0
// // //     if (items.length === 0 || all.length >= total || page >= 200) break
// // //     page += 1
// // //   }

// // //   return all
// // // }

// // // /* Adds one variant to every product. Skips products that already have it. */
// // // const addVariantToAllProducts = async (payload, availability) => {
// // //   const products = await fetchAllProducts()
// // //   const result = { total: products.length, added: 0, existed: 0, skipped: 0, failed: 0 }

// // //   const run = async (prod) => {
// // //     try {
// // //       const { data } = await getVariants(prod._id)
// // //       const existing = Array.isArray(data?.data) ? data.data : []

// // //       if (existing.some((v) => sameVariant(v, payload))) {
// // //         result.existed += 1
// // //         return
// // //       }

// // //       const res = await createVariant(prod._id, payload)
// // //       const newId = res?.data?.data?._id

// // //       if (!availability && newId) {
// // //         await updateVariantAvailability(newId, false)
// // //       }

// // //       result.added += 1
// // //     } catch {
// // //       result.failed += 1
// // //     }
// // //   }

// // //   for (let i = 0; i < products.length; i += 5) {
// // //     await Promise.all(products.slice(i, i + 5).map(run))
// // //   }

// // //   return result
// // // }

// // // const optimizeImage = (file) =>
// // //   new Promise((resolve) => {
// // //     const url = URL.createObjectURL(file)
// // //     const img = new Image()

// // //     img.onload = () => {
// // //       const max = 1200
// // //       const scale = Math.min(1, max / Math.max(img.width, img.height))
// // //       const canvas = document.createElement('canvas')
// // //       canvas.width = Math.round(img.width * scale)
// // //       canvas.height = Math.round(img.height * scale)
// // //       canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
// // //       URL.revokeObjectURL(url)

// // //       canvas.toBlob(
// // //         (blob) => {
// // //           if (!blob || blob.size >= file.size) return resolve(file)
// // //           resolve(
// // //             new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', {
// // //               type: 'image/webp',
// // //             })
// // //           )
// // //         },
// // //         'image/webp',
// // //         0.85
// // //       )
// // //     }

// // //     img.onerror = () => {
// // //       URL.revokeObjectURL(url)
// // //       resolve(file)
// // //     }

// // //     img.src = url
// // //   })

// // // const sortCategories = (items) => {
// // //   if (!Array.isArray(items)) return []

// // //   return [...items].sort((a, b) => {
// // //     const nameA = String(a.name || '').trim().toLowerCase()
// // //     const nameB = String(b.name || '').trim().toLowerCase()
// // //     const iA = MENU_CATEGORY_ORDER.indexOf(nameA)
// // //     const iB = MENU_CATEGORY_ORDER.indexOf(nameB)
// // //     const oA = iA === -1 ? MENU_CATEGORY_ORDER.length : iA
// // //     const oB = iB === -1 ? MENU_CATEGORY_ORDER.length : iB
// // //     if (oA !== oB) return oA - oB
// // //     return nameA.localeCompare(nameB)
// // //   })
// // // }

// // // /* ───────────────────────── STYLES ───────────────────────── */

// // // const CSS = `
// // // .pv-page{background:#f4f0e9;min-height:100%;padding:20px;color:#1c1917;font-family:inherit}
// // // .pv-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px}
// // // .pv-title{font-size:26px;font-weight:800;margin:0}
// // // .pv-sub{color:#78716c;font-size:14px;margin:2px 0 0}
// // // .pv-btn{border:1px solid #e7dfd2;background:#fff;color:#1c1917;border-radius:10px;padding:9px 14px;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
// // // .pv-btn:disabled{opacity:.55;cursor:not-allowed}
// // // .pv-btn--primary{background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;border:none}
// // // .pv-btn--danger{color:#dc2626}
// // // .pv-btn--sm{padding:7px 12px;font-size:13px}
// // // .pv-card{background:#fff;border:1px solid #eadfce;border-radius:16px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,.04)}
// // // .pv-filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
// // // .pv-input,.pv-select{width:100%;box-sizing:border-box;border:1px solid #e7dfd2;background:#fff;border-radius:12px;padding:12px 14px;font-size:15px;font-family:inherit;color:#1c1917;outline:none}
// // // .pv-input:focus,.pv-select:focus{border-color:#ea580c}
// // // .pv-filters .pv-input,.pv-filters .pv-select{width:auto;flex:1 1 170px}
// // // .pv-wrap{overflow-x:auto}
// // // .pv-table{width:100%;border-collapse:collapse;min-width:900px}
// // // .pv-table th{text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#78716c;padding:12px 8px;border-bottom:1px solid #eee6d9}
// // // .pv-table td{padding:14px 8px;border-bottom:1px solid #eee6d9;vertical-align:middle;font-size:14px}
// // // .pv-prod{display:flex;gap:12px;align-items:center}
// // // .pv-thumb{width:46px;height:46px;border-radius:12px;background:#fde9db;display:grid;place-items:center;font-size:22px;flex:none;overflow:hidden}
// // // .pv-thumb img{width:100%;height:100%;object-fit:cover}
// // // .pv-prod-name{font-weight:700}
// // // .pv-prod-desc{color:#78716c;font-size:13px;max-width:180px}
// // // .pv-chips{display:flex;flex-wrap:wrap;gap:5px;max-width:320px}
// // // .pv-chip{background:#f5efe4;border:1px solid #e7dfd2;border-radius:8px;padding:3px 8px;font-size:12px;font-weight:600;white-space:nowrap}
// // // .pv-chip--off{opacity:.5}
// // // .pv-badge{display:inline-block;border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
// // // .pv-badge--green{background:#dcfce7;color:#15803d}
// // // .pv-badge--red{background:#fee2e2;color:#b91c1c}
// // // .pv-actions{display:flex;gap:6px;flex-wrap:wrap}
// // // .pv-switch{width:44px;height:26px;border-radius:999px;border:none;background:#d6d3d1;position:relative;cursor:pointer;padding:0;flex:none;transition:background .15s}
// // // .pv-switch::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .15s}
// // // .pv-switch[aria-checked="true"]{background:#15803d}
// // // .pv-switch[aria-checked="true"]::after{transform:translateX(18px)}
// // // .pv-switch:disabled{opacity:.6;cursor:not-allowed}
// // // .pv-empty{text-align:center;color:#78716c;padding:28px 0}
// // // .pv-loader{display:grid;place-items:center;padding:40px}
// // // .pv-spin{width:28px;height:28px;border:3px solid #eadfce;border-top-color:#ea580c;border-radius:50%;animation:pvspin .8s linear infinite}
// // // @keyframes pvspin{to{transform:rotate(360deg)}}
// // // .pv-foot{margin-top:12px}

// // // .pv-overlay{position:fixed;inset:0;background:rgba(28,25,23,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000}
// // // .pv-modal{background:#f4f0e9;border-radius:18px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;padding:20px;box-sizing:border-box}
// // // .pv-modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
// // // .pv-modal-title{font-size:22px;font-weight:800;margin:0}
// // // .pv-x{width:40px;height:40px;border-radius:12px;border:1px solid #e7dfd2;background:#fff;font-size:18px;cursor:pointer}
// // // .pv-field{margin-bottom:16px}
// // // .pv-label{display:block;font-size:13px;font-weight:700;color:#78716c;margin-bottom:6px}
// // // .pv-drop{border:2px dashed #d9b9a5;background:#fdf9f2;border-radius:18px;padding:34px 12px;text-align:center;cursor:pointer;display:grid;gap:4px;justify-items:center}
// // // .pv-drop--over{background:#fdeede;border-color:#ea580c}
// // // .pv-drop-ico{font-size:30px}
// // // .pv-drop-title{font-weight:800;font-size:15px}
// // // .pv-drop-sub{font-size:13px;color:#78716c}
// // // .pv-photo{position:relative;border-radius:16px;overflow:hidden;border:1px solid #e7dfd2;background:#fff}
// // // .pv-photo img{display:block;width:100%;max-height:200px;object-fit:cover}
// // // .pv-photo button{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;border:none;background:rgba(0,0,0,.6);color:#fff;cursor:pointer}
// // // .pv-row2{display:flex;gap:12px;align-items:flex-end}
// // // .pv-row2 .pv-grow{flex:1}
// // // .pv-toggle{display:grid;gap:6px;justify-items:center;font-size:12px;font-weight:700;color:#78716c}
// // // .pv-h3{font-size:17px;font-weight:800;margin:6px 0 10px}
// // // .pv-vhead,.pv-vrow{display:grid;grid-template-columns:1fr 108px 56px 40px;gap:8px;align-items:center}
// // // .pv-vhead{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#78716c;font-weight:700;margin-bottom:6px}
// // // .pv-vrow{margin-bottom:8px}
// // // .pv-vrow .pv-input{padding:11px 12px}
// // // .pv-price{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #e7dfd2;border-radius:12px;padding:0 10px}
// // // .pv-price input{border:none;outline:none;width:100%;padding:11px 0;font-size:15px;background:transparent;font-family:inherit}
// // // .pv-rm{width:40px;height:40px;border-radius:12px;border:1px solid #e7dfd2;background:#fff;color:#dc2626;cursor:pointer;font-size:16px}
// // // .pv-prev{background:#fff;border:1px solid #e7dfd2;border-radius:16px;overflow:hidden;margin-bottom:16px}
// // // .pv-prev-img{background:#fde9db;height:120px;display:grid;place-items:center;font-size:30px}
// // // .pv-prev-img img{width:100%;height:100%;object-fit:cover}
// // // .pv-prev-body{padding:14px 16px;display:grid;gap:6px;justify-items:start}
// // // .pv-prev-name{font-weight:800;font-size:16px}
// // // .pv-prev-desc{color:#78716c;font-size:14px}
// // // .pv-prev-chips{display:flex;gap:6px;flex-wrap:wrap}
// // // .pv-btns{display:flex;gap:10px}
// // // .pv-btns .pv-btn{justify-content:center;padding:14px 16px;font-size:15px}
// // // .pv-btns .pv-btn--primary{flex:1}
// // // .pv-box{background:#fff;border:1px solid #e7dfd2;border-radius:12px;padding:14px;display:grid;gap:8px;font-size:14px}
// // // .pv-line{display:flex;justify-content:space-between}
// // // .pv-seg{display:grid;grid-template-columns:1fr 1fr;gap:8px}
// // // .pv-seg .pv-btn[aria-pressed="true"]{background:#fde9db;border-color:#ea580c;color:#c2410c}
// // // .pv-back{border:1px solid #e7dfd2;background:#fff;border-radius:12px;padding:8px 14px;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:16px;font-family:inherit;color:#1c1917}
// // // .pv-segtabs{display:flex;gap:4px;background:#faf6ee;border:1px solid #eadfce;border-radius:14px;padding:4px}
// // // .pv-segtabs button{flex:1;border:none;background:transparent;padding:12px 8px;border-radius:10px;font-size:15px;font-weight:700;color:#78716c;cursor:pointer;font-family:inherit}
// // // .pv-segtabs button[aria-pressed="true"]{background:#fff;color:#c2410c;box-shadow:0 1px 4px rgba(0,0,0,.08)}
// // // .pv-segtabs button:disabled{cursor:not-allowed;opacity:.7}
// // // .pv-toggles{display:grid;grid-template-columns:1fr 1fr;gap:12px}
// // // .pv-toggles .pv-toggle{justify-items:start}
// // // .pv-vitem{background:#fff;border:1px solid #e7dfd2;border-radius:14px;padding:12px 14px;margin-bottom:10px}
// // // .pv-vitem-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px}
// // // .pv-vprice{color:#c2410c;font-weight:800;font-size:17px}
// // // .pv-vitem-bottom{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
// // // .pv-mini{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#78716c}
// // // .pv-vprev-row{display:flex;justify-content:space-between;align-items:baseline;width:100%}
// // // .pv-vprev-name{font-size:21px;font-weight:800}
// // // .pv-vprev-price{font-size:20px;font-weight:800;color:#c2410c}
// // // .pv-applyall{display:flex;justify-content:space-between;align-items:center;gap:14px;background:#fff;border:1px solid #e7dfd2;border-radius:14px;padding:12px 14px}
// // // .pv-applyall small{display:block;color:#78716c;font-size:12px;margin-top:2px;font-weight:500}
// // // `

// // // /* ───────────────────────── SMALL UI PIECES ───────────────────────── */

// // // function Switch({ checked, onChange, disabled, label }) {
// // //   return (
// // //     <button
// // //       type="button"
// // //       role="switch"
// // //       aria-checked={checked}
// // //       aria-label={label}
// // //       className="pv-switch"
// // //       disabled={disabled}
// // //       onClick={() => onChange(!checked)}
// // //     />
// // //   )
// // // }

// // // function Shell({ title, onClose, children, locked }) {
// // //   return (
// // //     <div
// // //       className="pv-overlay"
// // //       onMouseDown={(e) => {
// // //         if (e.target === e.currentTarget && !locked) onClose()
// // //       }}
// // //     >
// // //       <div className="pv-modal">
// // //         <div className="pv-modal-head">
// // //           <h3 className="pv-modal-title">{title}</h3>
// // //           <button
// // //             type="button"
// // //             className="pv-x"
// // //             onClick={() => !locked && onClose()}
// // //             aria-label="Close"
// // //           >
// // //             ✕
// // //           </button>
// // //         </div>
// // //         {children}
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // // /* ───────────────────────── VARIANTS MODAL ───────────────────────── */

// // // const emptyVariantForm = (unit) => ({
// // //   variant_type: 'quantity',
// // //   quantity_value: '',
// // //   quantity_unit: unit,
// // //   member_count: '1',
// // //   price: '',
// // //   availability: true,
// // //   active: true,
// // // })

// // // export function VariantsModal({ product, onClose, onSaved }) {
// // //   const baseUnit = UNIT_GROUP[product.price_unit] ? product.price_unit : 'KG'
// // //   const allowedUnits = UNITS.filter((u) => UNIT_GROUP[u] === UNIT_GROUP[baseUnit])

// // //   const [variants, setVariants] = useState([])
// // //   const [loading, setLoading] = useState(true)
// // //   const [view, setView] = useState('list') // 'list' | 'form'
// // //   const [editingV, setEditingV] = useState(null)
// // //   const [form, setForm] = useState(() => emptyVariantForm(baseUnit))
// // //   const [saving, setSaving] = useState(false)
// // //   const [busyId, setBusyId] = useState(null)

// // //   const loadVariants = async () => {
// // //     try {
// // //       const { data } = await getVariants(product._id)
// // //       setVariants(Array.isArray(data?.data) ? data.data : [])
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed to load variants.')
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     setLoading(true)
// // //     loadVariants()
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [product._id])

// // //   const backToList = () => {
// // //     setView('list')
// // //     setEditingV(null)
// // //     setForm(emptyVariantForm(baseUnit))
// // //   }

// // //   const openAdd = () => {
// // //     setEditingV(null)
// // //     setForm(emptyVariantForm(baseUnit))
// // //     setView('form')
// // //   }

// // //   const openEdit = (v) => {
// // //     setEditingV(v)
// // //     setForm({
// // //       variant_type: v.variant_type || 'quantity',
// // //       quantity_value: v.quantity_value > 0 ? String(v.quantity_value) : '',
// // //       quantity_unit: v.quantity_unit && v.quantity_unit !== 'PCS' ? v.quantity_unit : baseUnit,
// // //       member_count: v.member_count > 0 ? String(v.member_count) : '1',
// // //       price: v.price != null ? String(v.price) : '',
// // //       availability: v.availability !== false,
// // //       active: (v.status || 'active') === 'active',
// // //     })
// // //     setView('form')
// // //   }

// // //   const isQty = form.variant_type === 'quantity'

// // //   // What the saved variant will look like (null while the inputs are invalid).
// // //   const preview = isQty
// // //     ? Number(form.quantity_value) > 0
// // //       ? parseVariantName(`${Number(form.quantity_value)} ${form.quantity_unit}`)
// // //       : null
// // //     : Number.isInteger(Number(form.member_count)) && Number(form.member_count) >= 1
// // //       ? parseVariantName(`${Number(form.member_count)} Members`)
// // //       : null

// // //   const previewPrice = Number(form.price)
// // //   const hasPrice = form.price !== '' && Number.isFinite(previewPrice) && previewPrice > 0

// // //   const handleSave = async (e) => {
// // //     e.preventDefault()
// // //     if (saving) return

// // //     if (!preview) {
// // //       return toast.error(
// // //         isQty ? 'Quantity must be greater than 0.' : 'Member count must be at least 1.'
// // //       )
// // //     }

// // //     if (editingV && !hasPrice) return toast.error('Price must be greater than 0.')

// // //     const applyAll = !editingV

// // //     const duplicate = variants.some(
// // //       (v) => v._id !== editingV?._id && sameVariant(v, preview)
// // //     )

// // //     if (duplicate && !applyAll) {
// // //       return toast.error('This variant already exists for this product.')
// // //     }

// // //     const payload = {
// // //       ...preview,
// // //       price: editingV ? previewPrice : 0,
// // //       status: form.active ? 'active' : 'inactive',
// // //     }

// // //     setSaving(true)

// // //     try {
// // //       if (applyAll) {
// // //         const r = await addVariantToAllProducts(payload, form.availability)
// // //         const parts = [`Added to ${r.added} of ${r.total} products`]
// // //         if (r.existed) parts.push(`${r.existed} already had it`)
// // //         if (r.failed) parts.push(`${r.failed} failed`)

// // //         if (r.failed) toast.error(parts.join(' · '), { duration: 6000 })
// // //         else toast.success(parts.join(' · '), { duration: 5000 })
// // //       } else if (editingV) {
// // //         await updateVariant(editingV._id, payload)

// // //         if ((editingV.availability !== false) !== form.availability) {
// // //           await updateVariantAvailability(editingV._id, form.availability)
// // //         }

// // //         toast.success('Variant updated.')
// // //       } else {
// // //         const res = await createVariant(product._id, payload)
// // //         const newId = res?.data?.data?._id

// // //         if (!form.availability && newId) {
// // //           await updateVariantAvailability(newId, false)
// // //         }

// // //         toast.success('Variant added.')
// // //       }

// // //       await loadVariants()
// // //       onSaved()
// // //       backToList()
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed to save variant.')
// // //     } finally {
// // //       setSaving(false)
// // //     }
// // //   }

// // //   const toggleAvail = async (v) => {
// // //     if (busyId) return
// // //     setBusyId(v._id)

// // //     try {
// // //       const { data } = await updateVariantAvailability(v._id, !(v.availability !== false))
// // //       toast.success('Availability updated.')

// // //       if (data?.data?.all_variants_unavailable) {
// // //         toast('All variants are unavailable. Customers cannot order this product.', {
// // //           icon: '⚠️',
// // //           duration: 5000,
// // //         })
// // //       }

// // //       await loadVariants()
// // //       onSaved()
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed to update availability.')
// // //     } finally {
// // //       setBusyId(null)
// // //     }
// // //   }

// // //   const toggleActive = async (v) => {
// // //     if (busyId) return
// // //     setBusyId(v._id)

// // //     try {
// // //       await updateVariantStatus(v._id, v.status === 'active' ? 'inactive' : 'active')
// // //       toast.success('Status updated.')
// // //       await loadVariants()
// // //       onSaved()
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed to update status.')
// // //     } finally {
// // //       setBusyId(null)
// // //     }
// // //   }

// // //   const removeVariant = async (v) => {
// // //     if (busyId) return
// // //     if (!window.confirm(`Delete variant ${v.variant_name}?`)) return

// // //     setBusyId(v._id)

// // //     try {
// // //       await deleteVariant(v._id)
// // //       toast.success('Variant deleted.')
// // //       await loadVariants()
// // //       onSaved()
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed to delete variant.')
// // //     } finally {
// // //       setBusyId(null)
// // //     }
// // //   }

// // //   const title =
// // //     view === 'list' ? `Variants — ${product.name}` : editingV ? 'Edit variant' : 'Add variant'

// // //   return (
// // //     <Shell title={title} onClose={onClose} locked={saving}>
// // //       <style>{CSS}</style>
// // //       {view === 'list' ? (
// // //         <>
// // //           {loading ? (
// // //             <div className="pv-loader">
// // //               <span className="pv-spin" />
// // //             </div>
// // //           ) : variants.length === 0 ? (
// // //             <div className="pv-empty">No variants yet. Add the first one.</div>
// // //           ) : (
// // //             variants.map((v) => (
// // //               <div className="pv-vitem" key={v._id}>
// // //                 <div className="pv-vitem-top">
// // //                   <div>
// // //                     <strong>{v.variant_name}</strong>
// // //                     <div className="pv-prod-desc">
// // //                       {v.variant_type === 'member'
// // //                         ? `${v.member_count} Members`
// // //                         : `${v.quantity_value} ${v.quantity_unit}`}
// // //                     </div>
// // //                   </div>
// // //                   <div className="pv-vprice">{formatPrice(v.price)}</div>
// // //                 </div>

// // //                 <div className="pv-vitem-bottom">
// // //                   <label className="pv-mini">
// // //                     Available
// // //                     <Switch
// // //                       checked={v.availability !== false}
// // //                       label={`Availability of ${v.variant_name}`}
// // //                       disabled={busyId === v._id}
// // //                       onChange={() => toggleAvail(v)}
// // //                     />
// // //                   </label>

// // //                   <label className="pv-mini">
// // //                     Active
// // //                     <Switch
// // //                       checked={v.status === 'active'}
// // //                       label={`Status of ${v.variant_name}`}
// // //                       disabled={busyId === v._id}
// // //                       onChange={() => toggleActive(v)}
// // //                     />
// // //                   </label>

// // //                   <div className="pv-actions" style={{ marginLeft: 'auto' }}>
// // //                     <button
// // //                       type="button"
// // //                       className="pv-btn pv-btn--sm"
// // //                       onClick={() => openEdit(v)}
// // //                     >
// // //                       Edit
// // //                     </button>

// // //                     <button
// // //                       type="button"
// // //                       className="pv-btn pv-btn--sm pv-btn--danger"
// // //                       title="Delete"
// // //                       disabled={busyId === v._id}
// // //                       onClick={() => removeVariant(v)}
// // //                     >
// // //                       <Trash2 size={14} />
// // //                     </button>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))
// // //           )}

// // //           <div className="pv-btns" style={{ marginTop: 16 }}>
// // //             <button type="button" className="pv-btn pv-btn--primary" onClick={openAdd}>
// // //               + Add variant
// // //             </button>
// // //             <button type="button" className="pv-btn" onClick={onClose}>
// // //               Close
// // //             </button>
// // //           </div>
// // //         </>
// // //       ) : (
// // //         <form onSubmit={handleSave}>
// // //           <button type="button" className="pv-back" onClick={backToList} disabled={saving}>
// // //             ‹ {product.name}
// // //           </button>

// // //           <div className="pv-field">
// // //             <label className="pv-label">Variant type</label>

// // //             <div className="pv-segtabs">
// // //               <button
// // //                 type="button"
// // //                 aria-pressed={isQty}
// // //                 disabled={!!editingV}
// // //                 onClick={() => setForm({ ...form, variant_type: 'quantity' })}
// // //               >
// // //                 Quantity (KG / L...)
// // //               </button>

// // //               <button
// // //                 type="button"
// // //                 aria-pressed={!isQty}
// // //                 disabled={!!editingV}
// // //                 onClick={() => setForm({ ...form, variant_type: 'member' })}
// // //               >
// // //                 Members
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {isQty ? (
// // //             <div className="pv-field">
// // //               <div className="pv-row2" style={{ alignItems: 'flex-start' }}>
// // //                 <div className="pv-grow">
// // //                   <label className="pv-label">Quantity *</label>
// // //                   <input
// // //                     className="pv-input"
// // //                     type="number"
// // //                     step="any"
// // //                     min="0.01"
// // //                     placeholder="0.5"
// // //                     value={form.quantity_value}
// // //                     onChange={(e) => setForm({ ...form, quantity_value: e.target.value })}
// // //                   />
// // //                 </div>

// // //                 <div style={{ width: 130 }}>
// // //                   <label className="pv-label">Unit</label>
// // //                   <select
// // //                     className="pv-select"
// // //                     value={form.quantity_unit}
// // //                     onChange={(e) => setForm({ ...form, quantity_unit: e.target.value })}
// // //                   >
// // //                     {allowedUnits.map((u) => (
// // //                       <option key={u} value={u}>
// // //                         {u}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           ) : (
// // //             <div className="pv-field">
// // //               <label className="pv-label">Member count *</label>
// // //               <input
// // //                 className="pv-input"
// // //                 type="number"
// // //                 min="1"
// // //                 step="1"
// // //                 placeholder="5"
// // //                 value={form.member_count}
// // //                 onChange={(e) => setForm({ ...form, member_count: e.target.value })}
// // //               />
// // //             </div>
// // //           )}

// // //           {editingV && (
// // //             <div className="pv-field">
// // //               <label className="pv-label">Price *</label>
// // //               <div className="pv-price" style={{ padding: '0 14px' }}>
// // //                 <span>₹</span>
// // //                 <input
// // //                   type="number"
// // //                   min="0.01"
// // //                   step="0.01"
// // //                   placeholder="500"
// // //                   value={form.price}
// // //                   onChange={(e) => setForm({ ...form, price: e.target.value })}
// // //                 />
// // //               </div>
// // //             </div>
// // //           )}

// // //           {!editingV && (
// // //             <p className="pv-prod-desc">
// // //               This variant will be added to every product. Set individual prices later.
// // //             </p>
// // //           )}

// // //           <div className="pv-field pv-toggles">
// // //             <div className="pv-toggle">
// // //               Available
// // //               <Switch
// // //                 checked={form.availability}
// // //                 label="Available"
// // //                 onChange={(val) => setForm({ ...form, availability: val })}
// // //               />
// // //             </div>

// // //             <div className="pv-toggle">
// // //               Active
// // //               <Switch
// // //                 checked={form.active}
// // //                 label="Active"
// // //                 onChange={(val) => setForm({ ...form, active: val })}
// // //               />
// // //             </div>
// // //           </div>

// // //           <h4 className="pv-h3">Live preview</h4>

// // //           <div className="pv-prev">
// // //             <div className="pv-prev-body" style={{ width: '100%', boxSizing: 'border-box' }}>
// // //               <div className="pv-prev-desc">{product.name}</div>

// // //               <div className="pv-vprev-row">
// // //                 <span className="pv-vprev-name">{preview?.variant_name || 'Variant name'}</span>
// // //                 <span className="pv-vprev-price">
// // //                   {editingV && hasPrice ? `₹ ${previewPrice.toLocaleString('en-IN')}` : 'Price set later'}
// // //                 </span>
// // //               </div>

// // //               <span
// // //                 className={`pv-badge ${form.availability ? 'pv-badge--green' : 'pv-badge--red'}`}
// // //               >
// // //                 {form.availability ? 'Available' : 'Unavailable'}
// // //               </span>
// // //             </div>
// // //           </div>

// // //           <div className="pv-btns">
// // //             <button type="submit" className="pv-btn pv-btn--primary" disabled={saving}>
// // //               {saving
// // //                 ? 'Saving...'
// // //                 : editingV
// // //                   ? 'Save variant'
// // //                   : 'Add to all products'}
// // //             </button>

// // //             <button type="button" className="pv-btn" onClick={backToList} disabled={saving}>
// // //               Cancel
// // //             </button>
// // //           </div>
// // //         </form>
// // //       )}
// // //     </Shell>
// // //   )
// // // }

// // // /* ───────────────────────── PRODUCT FORM MODAL ───────────────────────── */

// // // function ProductFormModal({ product, categories, onClose, onSaved }) {
// // //   const editing = !!product

// // //   const [name, setName] = useState(product?.name || '')
// // //   const [categoryId, setCategoryId] = useState(
// // //     product?.category_id?._id || product?.category_id || ''
// // //   )
// // //   const [description, setDescription] = useState(product?.description || '')
// // //   const [displayOrder, setDisplayOrder] = useState(product?.display_order ?? 0)
// // //   const [active, setActive] = useState((product?.status || 'active') === 'active')
// // //   const [available, setAvailable] = useState(
// // //     editing ? !!product.availability : true
// // //   )
// // //   const [weightageOptions, setWeightageOptions] = useState([])
// // //   const [originalVariants, setOriginalVariants] = useState([])
// // //   const [selectedWeightages, setSelectedWeightages] = useState([])
// // //   const [weightagePrices, setWeightagePrices] = useState({})
// // //   const [loadingWeightages, setLoadingWeightages] = useState(true)

// // //   const [imageFile, setImageFile] = useState(null)
// // //   const [imagePreview, setImagePreview] = useState(
// // //     product?.image_url ? imgSrc(product.image_url) : ''
// // //   )
// // //   const [dragOver, setDragOver] = useState(false)
// // //   const [saving, setSaving] = useState(false)

// // //   const fileRef = useRef()
// // //   const previewUrlRef = useRef('')

// // //   const clearPreviewUrl = () => {
// // //     if (previewUrlRef.current) {
// // //       URL.revokeObjectURL(previewUrlRef.current)
// // //       previewUrlRef.current = ''
// // //     }
// // //   }

// // //   useEffect(() => () => clearPreviewUrl(), [])

// // //   useEffect(() => {
// // //     let active_ = true

// // //     const loadWeightages = async () => {
// // //       setLoadingWeightages(true)

// // //       try {
// // //         const allProducts = await fetchAllProducts()
// // //         const variantsByProduct = await Promise.all(
// // //           allProducts.map(async (item) => {
// // //             const { data } = await getVariants(item._id)
// // //             return {
// // //               productId: item._id,
// // //               variants: Array.isArray(data?.data) ? data.data : [],
// // //             }
// // //           })
// // //         )

// // //         if (!active_) return

// // //         const allVariants = variantsByProduct.flatMap(({ variants }) => variants)
// // //         const uniqueWeightages = new Map()

// // //         allVariants
// // //           .filter(
// // //             (variant) =>
// // //               variant.variant_type === 'quantity' &&
// // //               Number(variant.quantity_value) > 0 &&
// // //               UNIT_GROUP[variant.quantity_unit]
// // //           )
// // //           .forEach((variant) => {
// // //             const key = quantityVariantKey(variant)
// // //             if (!uniqueWeightages.has(key)) {
// // //               uniqueWeightages.set(key, {
// // //                 key,
// // //                 variant_type: 'quantity',
// // //                 variant_name: `${Number(variant.quantity_value)} ${variant.quantity_unit}`,
// // //                 quantity_value: Number(variant.quantity_value),
// // //                 quantity_unit: variant.quantity_unit,
// // //               })
// // //             }
// // //           })

// // //         const options = Array.from(uniqueWeightages.values()).sort((a, b) =>
// // //           a.quantity_unit === b.quantity_unit
// // //             ? a.quantity_value - b.quantity_value
// // //             : a.quantity_unit.localeCompare(b.quantity_unit)
// // //         )
// // //         const currentVariants =
// // //           variantsByProduct.find(({ productId }) => productId === product?._id)?.variants || []
// // //         const currentQuantityVariants = currentVariants.filter(
// // //           (variant) => variant.variant_type === 'quantity'
// // //         )

// // //         setWeightageOptions(options)
// // //         setOriginalVariants(currentVariants)
// // //         setSelectedWeightages(
// // //           currentQuantityVariants.map(quantityVariantKey)
// // //         )
// // //         setWeightagePrices(
// // //           Object.fromEntries(
// // //             currentQuantityVariants.map((variant) => [
// // //               quantityVariantKey(variant),
// // //               Number(variant.price) > 0 ? String(variant.price) : '',
// // //             ])
// // //           )
// // //         )
// // //       } catch (err) {
// // //         if (active_) {
// // //           toast.error(
// // //             err.response?.data?.message || 'Failed to load product weightages.'
// // //           )
// // //         }
// // //       } finally {
// // //         if (active_) setLoadingWeightages(false)
// // //       }
// // //     }

// // //     loadWeightages()

// // //     return () => {
// // //       active_ = false
// // //     }
// // //   }, [product?._id])

// // //   const acceptFile = async (file) => {
// // //     if (!file) return

// // //     const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// // //     if (!allowed.includes(file.type)) {
// // //       toast.error('Only JPG, PNG, WEBP allowed.')
// // //       return
// // //     }

// // //     if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
// // //       toast.error(`Max ${MAX_IMAGE_MB} MB allowed.`)
// // //       return
// // //     }

// // //     const optimized = await optimizeImage(file)

// // //     clearPreviewUrl()
// // //     const url = URL.createObjectURL(optimized)
// // //     previewUrlRef.current = url

// // //     setImageFile(optimized)
// // //     setImagePreview(url)
// // //   }

// // //   const removeImage = () => {
// // //     clearPreviewUrl()
// // //     setImageFile(null)
// // //     setImagePreview('')
// // //     if (fileRef.current) fileRef.current.value = ''
// // //   }

// // //   const handleSave = async (e) => {
// // //     e.preventDefault()
// // //     if (saving) return

// // //     if (!name.trim()) return toast.error('Name is required.')
// // //     if (!categoryId) return toast.error('Category is required.')

// // //     // Empty price = not set yet (allowed). Anything typed must be greater than 0.
// // //     for (const key of selectedWeightages) {
// // //       const raw = weightagePrices[key]
// // //       if (raw === undefined || raw === '') continue
// // //       const price = Number(raw)
// // //       if (!Number.isFinite(price) || price <= 0) {
// // //         return toast.error('Variant prices must be greater than 0.')
// // //       }
// // //     }

// // //     setSaving(true)

// // //     try {
// // //       const fd = new FormData()
// // //       fd.append('name', name.trim())
// // //       fd.append('category_id', categoryId)
// // //       fd.append('description', description || '')
// // //       fd.append('display_order', String(Math.max(0, Number(displayOrder) || 0)))
// // //       fd.append('status', active ? 'active' : 'inactive')
// // //       fd.append('availability', String(available))
// // //       if (imageFile) fd.append('image', imageFile)

// // //       let productId = product?._id

// // //       if (editing) {
// // //         await updateProduct(product._id, fd)
// // //       } else {
// // //         const { data } = await createProduct(fd)
// // //         const created = data?.data
// // //         productId = created?._id || created?.product?._id
// // //       }

// // //       if (!productId) {
// // //         throw new Error('Product was saved, but its variants could not be linked.')
// // //       }

// // //       const selectedKeys = new Set(selectedWeightages)
// // //       const originalQuantityVariants = originalVariants.filter(
// // //         (variant) => variant.variant_type === 'quantity'
// // //       )

// // //       for (const variant of originalQuantityVariants) {
// // //         if (!selectedKeys.has(quantityVariantKey(variant))) {
// // //           await deleteVariant(variant._id)
// // //         }
// // //       }

// // //       for (const weightage of weightageOptions) {
// // //         if (!selectedKeys.has(weightage.key)) continue

// // //         const existing = originalQuantityVariants.find(
// // //           (variant) => quantityVariantKey(variant) === weightage.key
// // //         )
// // //         const priceValue = weightagePrices[weightage.key]

// // //         if (existing) {
// // //           const newPrice =
// // //             priceValue === '' || priceValue === undefined
// // //               ? Number(existing.price)
// // //               : Number(priceValue)
// // //           if (newPrice > 0 && newPrice !== Number(existing.price)) {
// // //             await updateVariantPrice(existing._id, newPrice)
// // //           }
// // //         } else {
// // //           await createVariant(productId, {
// // //             variant_type: 'quantity',
// // //             variant_name: weightage.variant_name,
// // //             quantity_value: weightage.quantity_value,
// // //             quantity_unit: weightage.quantity_unit,
// // //             member_count: null,
// // //             price: priceValue === '' || priceValue === undefined ? 0 : Number(priceValue),
// // //             status: 'active',
// // //           })
// // //         }
// // //       }

// // //       toast.success(editing ? 'Product updated.' : 'Product created.')
// // //       onSaved()
// // //       onClose()
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || err.message || 'Failed to save.')
// // //     } finally {
// // //       setSaving(false)
// // //     }
// // //   }

// // //   return (
// // //     <Shell
// // //       title={editing ? 'Edit product' : 'Add product'}
// // //       onClose={onClose}
// // //       locked={saving}
// // //     >
// // //       <form onSubmit={handleSave}>
// // //         <div className="pv-field">
// // //           <label className="pv-label">Product name *</label>
// // //           <input
// // //             className="pv-input"
// // //             placeholder="e.g. Chicken Curry"
// // //             value={name}
// // //             onChange={(e) => setName(e.target.value)}
// // //           />
// // //         </div>

// // //         <div className="pv-field">
// // //           <label className="pv-label">Category *</label>
// // //           <select
// // //             className="pv-select"
// // //             value={categoryId}
// // //             onChange={(e) => setCategoryId(e.target.value)}
// // //           >
// // //             <option value="">Select category...</option>
// // //             {categories.map((c) => (
// // //               <option key={c._id} value={c._id}>
// // //                 {c.name}
// // //               </option>
// // //             ))}
// // //           </select>
// // //           {categories.length === 0 && (
// // //             <small style={{ color: '#dc2626' }}>
// // //               No active categories found. Create or activate categories first.
// // //             </small>
// // //           )}
// // //         </div>

// // //         <div className="pv-field">
// // //           <label className="pv-label">Description</label>
// // //           <input
// // //             className="pv-input"
// // //             value={description}
// // //             onChange={(e) => setDescription(e.target.value)}
// // //           />
// // //         </div>

// // //         <div className="pv-field">
// // //           <label className="pv-label">
// // //             Photo (JPG, PNG, WEBP · max {MAX_IMAGE_MB} MB)
// // //           </label>

// // //           {imagePreview ? (
// // //             <div className="pv-photo">
// // //               <img src={imagePreview} alt="preview" />
// // //               <button type="button" onClick={removeImage} title="Remove photo">
// // //                 ✕
// // //               </button>
// // //             </div>
// // //           ) : (
// // //             <div
// // //               className={`pv-drop ${dragOver ? 'pv-drop--over' : ''}`}
// // //               role="button"
// // //               tabIndex={0}
// // //               onClick={() => fileRef.current?.click()}
// // //               onKeyDown={(e) => {
// // //                 if (e.key === 'Enter' || e.key === ' ') {
// // //                   e.preventDefault()
// // //                   fileRef.current?.click()
// // //                 }
// // //               }}
// // //               onDragOver={(e) => {
// // //                 e.preventDefault()
// // //                 setDragOver(true)
// // //               }}
// // //               onDragLeave={() => setDragOver(false)}
// // //               onDrop={(e) => {
// // //                 e.preventDefault()
// // //                 setDragOver(false)
// // //                 acceptFile(e.dataTransfer.files?.[0])
// // //               }}
// // //             >
// // //               <span className="pv-drop-ico">📷</span>
// // //               <span className="pv-drop-title">Click or drag a photo here</span>
// // //               <span className="pv-drop-sub">
// // //                 Optimized automatically · live preview below
// // //               </span>
// // //             </div>
// // //           )}

// // //           <input
// // //             ref={fileRef}
// // //             type="file"
// // //             accept="image/jpeg,image/jpg,image/png,image/webp"
// // //             style={{ display: 'none' }}
// // //             onChange={(e) => {
// // //               acceptFile(e.target.files?.[0])
// // //               e.target.value = ''
// // //             }}
// // //           />
// // //         </div>

// // //         <div className="pv-field">
// // //           <div className="pv-row2">
// // //             <div className="pv-grow">
// // //               <label className="pv-label">Display order</label>
// // //               <input
// // //                 className="pv-input"
// // //                 type="number"
// // //                 min={0}
// // //                 value={displayOrder}
// // //                 onChange={(e) =>
// // //                   setDisplayOrder(Math.max(0, Number(e.target.value) || 0))
// // //                 }
// // //               />
// // //             </div>

// // //             <div className="pv-toggle">
// // //               Active
// // //               <Switch checked={active} onChange={setActive} label="Active" />
// // //             </div>

// // //             <div className="pv-toggle">
// // //               Available
// // //               <Switch checked={available} onChange={setAvailable} label="Available" />
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <h4 className="pv-h3">Weightages &amp; prices</h4>
// // //         {loadingWeightages ? (
// // //           <div className="pv-loader">
// // //             <span className="pv-spin" />
// // //           </div>
// // //         ) : weightageOptions.length === 0 ? (
// // //           <p className="pv-prod-desc">
// // //             No weightages exist yet. Create one on the Weightage page first.
// // //           </p>
// // //         ) : (
// // //           <>
// // //             <div
// // //               style={{
// // //                 display: 'grid',
// // //                 gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
// // //                 gap: 8,
// // //               }}
// // //             >
// // //               {weightageOptions.map((weightage) => {
// // //                 const checked = selectedWeightages.includes(weightage.key)
// // //                 return (
// // //                   <label
// // //                     key={weightage.key}
// // //                     style={{
// // //                       display: 'flex',
// // //                       alignItems: 'center',
// // //                       gap: 8,
// // //                       border: '1px solid #e7dfd2',
// // //                       borderRadius: 8,
// // //                       padding: '8px 10px',
// // //                       background: checked ? '#f0fdf4' : '#fff',
// // //                     }}
// // //                   >
// // //                     <input
// // //                       type="checkbox"
// // //                       checked={checked}
// // //                       disabled={saving}
// // //                       onChange={(event) =>
// // //                         setSelectedWeightages((current) =>
// // //                           event.target.checked
// // //                             ? [...current, weightage.key]
// // //                             : current.filter((key) => key !== weightage.key)
// // //                         )
// // //                       }
// // //                     />
// // //                     <strong style={{ minWidth: 62 }}>{weightage.variant_name}</strong>
// // //                     <div className="pv-price" style={{ padding: '0 8px' }}>
// // //                       <span>₹</span>
// // //                       <input
// // //                         type="number"
// // //                         min="0.01"
// // //                         step="0.01"
// // //                         placeholder="Price"
// // //                         aria-label={`Price for ${weightage.variant_name}`}
// // //                         value={weightagePrices[weightage.key] ?? ''}
// // //                         disabled={!checked || saving}
// // //                         onChange={(event) =>
// // //                           setWeightagePrices((current) => ({
// // //                             ...current,
// // //                             [weightage.key]: event.target.value,
// // //                           }))
// // //                         }
// // //                       />
// // //                     </div>
// // //                   </label>
// // //                 )
// // //               })}
// // //             </div>
// // //             <small className="pv-prod-desc" style={{ display: 'block', marginTop: 8 }}>
// // //               Select the weightages for this product and set their prices. New selections
// // //               and price changes are saved with the product.
// // //             </small>
// // //           </>
// // //         )}

// // //         <h4 className="pv-h3" style={{ marginTop: 18 }}>
// // //           Live preview
// // //         </h4>

// // //         <div className="pv-prev">
// // //           <div className="pv-prev-img">
// // //             {imagePreview ? <img src={imagePreview} alt="" /> : '🍲'}
// // //           </div>

// // //           <div className="pv-prev-body">
// // //             <div className="pv-prev-name">{name.trim() || 'Product name'}</div>
// // //             <div className="pv-prev-desc">{description.trim() || 'Description'}</div>

// // //             <span
// // //               className={`pv-badge ${available ? 'pv-badge--green' : 'pv-badge--red'}`}
// // //             >
// // //               {available ? 'Available' : 'Unavailable'}
// // //             </span>
// // //           </div>
// // //         </div>

// // //         <div className="pv-btns">
// // //           <button
// // //             type="submit"
// // //             className="pv-btn pv-btn--primary"
// // //             disabled={saving || categories.length === 0}
// // //           >
// // //             {saving ? 'Saving...' : 'Save product'}
// // //           </button>

// // //           <button
// // //             type="button"
// // //             className="pv-btn"
// // //             onClick={onClose}
// // //             disabled={saving}
// // //           >
// // //             Cancel
// // //           </button>
// // //         </div>
// // //       </form>
// // //     </Shell>
// // //   )
// // // }

// // // /* ───────────────────────── PRE-ORDER MODAL ───────────────────────── */

// // // function ProductPreorderModal({ product, onClose }) {
// // //   const [date, setDate] = useState(getTodayIstDate)
// // //   const [fulfillment, setFulfillment] = useState('pickup')
// // //   const [selectedVariantId, setSelectedVariantId] = useState('')
// // //   const [preorderData, setPreorderData] = useState(null)
// // //   const [loading, setLoading] = useState(true)

// // //   useEffect(() => {
// // //     let active = true

// // //     const loadPreorder = async () => {
// // //       setLoading(true)

// // //       try {
// // //         const response = await getProductPreorder(product._id, date)
// // //         const data = response?.data?.data
// // //         if (!active) return

// // //         setPreorderData(data ?? null)
// // //         setSelectedVariantId((current) =>
// // //           data?.variants?.some((v) => v._id === current)
// // //             ? current
// // //             : data?.variants?.[0]?._id ?? ''
// // //         )
// // //       } catch (error) {
// // //         if (active) {
// // //           toast.error(
// // //             error.response?.data?.message ||
// // //               'Failed to load product pre-order availability.'
// // //           )
// // //           setPreorderData(null)
// // //           setSelectedVariantId('')
// // //         }
// // //       } finally {
// // //         if (active) setLoading(false)
// // //       }
// // //     }

// // //     loadPreorder()
// // //     return () => {
// // //       active = false
// // //     }
// // //   }, [product._id, date])

// // //   const preorder = preorderData?.preorder
// // //   const variant = preorderData?.variants?.find((v) => v._id === selectedVariantId)
// // //   const pricing = variant?.pricing?.[fulfillment]

// // //   return (
// // //     <Shell title={`Pre-order: ${product.name}`} onClose={onClose}>
// // //       <div style={{ display: 'grid', gap: 16 }}>
// // //         <div>
// // //           <label className="pv-label" htmlFor="product-preorder-date">
// // //             Pre-order date
// // //           </label>
// // //           <input
// // //             id="product-preorder-date"
// // //             className="pv-input"
// // //             type="date"
// // //             min={getTodayIstDate()}
// // //             value={date}
// // //             onChange={(e) => setDate(e.target.value)}
// // //           />
// // //         </div>

// // //         {loading ? (
// // //           <div className="pv-loader">
// // //             <span className="pv-spin" />
// // //           </div>
// // //         ) : preorder ? (
// // //           <div className="pv-box">
// // //             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// // //               <CalendarDays size={16} />
// // //               <strong>Pre-order availability</strong>
// // //               <span
// // //                 className={`pv-badge ${preorder.isOpen ? 'pv-badge--green' : 'pv-badge--red'}`}
// // //                 style={{ marginLeft: 'auto' }}
// // //               >
// // //                 {preorder.isOpen ? 'Open' : 'Closed'}
// // //               </span>
// // //             </div>
// // //             <div>
// // //               Date / day:{' '}
// // //               <strong>
// // //                 {preorder.date} ({preorder.day})
// // //               </strong>
// // //             </div>
// // //             <div>
// // //               Opening: <strong>{preorder.openingTime || 'Not configured'}</strong>
// // //             </div>
// // //             <div>
// // //               Closing: <strong>{preorder.closingTime || 'Not configured'}</strong>
// // //             </div>
// // //             {preorder.message && <small>{preorder.message}</small>}
// // //           </div>
// // //         ) : null}

// // //         {!loading && preorderData && (
// // //           <>
// // //             <div>
// // //               <label className="pv-label" htmlFor="product-preorder-variant">
// // //                 Product option
// // //               </label>
// // //               <select
// // //                 id="product-preorder-variant"
// // //                 className="pv-select"
// // //                 value={selectedVariantId}
// // //                 onChange={(e) => setSelectedVariantId(e.target.value)}
// // //                 disabled={!preorderData.variants?.length}
// // //               >
// // //                 {preorderData.variants?.length ? (
// // //                   preorderData.variants.map((item) => (
// // //                     <option key={item._id} value={item._id}>
// // //                       {item.variant_name}
// // //                     </option>
// // //                   ))
// // //                 ) : (
// // //                   <option value="">No available product options</option>
// // //                 )}
// // //               </select>
// // //             </div>

// // //             <div className="pv-seg">
// // //               <button
// // //                 type="button"
// // //                 className="pv-btn"
// // //                 aria-pressed={fulfillment === 'pickup'}
// // //                 onClick={() => setFulfillment('pickup')}
// // //               >
// // //                 <Store size={15} /> Pickup
// // //               </button>
// // //               <button
// // //                 type="button"
// // //                 className="pv-btn"
// // //                 aria-pressed={fulfillment === 'delivery'}
// // //                 onClick={() => setFulfillment('delivery')}
// // //               >
// // //                 <Truck size={15} /> Delivery
// // //               </button>
// // //             </div>

// // //             <div className="pv-box">
// // //               {pricing ? (
// // //                 <>
// // //                   <div className="pv-line">
// // //                     <span>Subtotal</span>
// // //                     <strong>{formatMoney(pricing.subtotal)}</strong>
// // //                   </div>
// // //                   <div className="pv-line">
// // //                     <span>Packing charge</span>
// // //                     <strong>{formatMoney(pricing.packingCharge)}</strong>
// // //                   </div>
// // //                   {fulfillment === 'delivery' && (
// // //                     <div className="pv-line">
// // //                       <span>Delivery charge</span>
// // //                       <strong>{formatMoney(pricing.deliveryCharge)}</strong>
// // //                     </div>
// // //                   )}
// // //                   <div
// // //                     className="pv-line"
// // //                     style={{
// // //                       borderTop: '1px dashed #d6d3d1',
// // //                       paddingTop: 10,
// // //                       fontWeight: 800,
// // //                     }}
// // //                   >
// // //                     <span>Total</span>
// // //                     <span>{formatMoney(pricing.total)}</span>
// // //                   </div>
// // //                 </>
// // //               ) : (
// // //                 <small>Select an available product option to see pricing.</small>
// // //               )}
// // //             </div>
// // //           </>
// // //         )}

// // //         <div className="pv-btns">
// // //           <button type="button" className="pv-btn" onClick={onClose}>
// // //             Close
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </Shell>
// // //   )
// // // }

// // // /* ───────────────────────── PRODUCTS PAGE ───────────────────────── */

// // // export default function Products() {
// // //   const [list, setList] = useState([])
// // //   const [variantsMap, setVariantsMap] = useState({})
// // //   const [categories, setCategories] = useState([])
// // //   const [total, setTotal] = useState(0)
// // //   const [page, setPage] = useState(1)
// // //   const [loading, setLoading] = useState(true)
// // //   const [search, setSearch] = useState('')
// // //   const [categoryFilter, setCategoryFilter] = useState('')
// // //   const [statusFilter, setStatusFilter] = useState('')
// // //   const [busyId, setBusyId] = useState(null)

// // //   const [formOpen, setFormOpen] = useState(false)
// // //   const [editing, setEditing] = useState(null)
// // //   const [preorderProduct, setPreorderProduct] = useState(null)
// // //   const [confirmDelete, setConfirmDelete] = useState(null)
// // //   const [deleting, setDeleting] = useState(false)

// // //   const loadCats = async () => {
// // //     try {
// // //       const { data } = await getCategories({ status: 'active' })
// // //       setCategories(sortCategories(data?.data))
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed to load categories.')
// // //     }
// // //   }

// // //   // Fetch the variants of the products currently shown in the table.
// // //   const loadListVariants = async (items) => {
// // //     const entries = await Promise.all(
// // //       items.map(async (p) => {
// // //         try {
// // //           const { data } = await getVariants(p._id)
// // //           return [p._id, Array.isArray(data?.data) ? data.data : []]
// // //         } catch {
// // //           return [p._id, []]
// // //         }
// // //       })
// // //     )

// // //     setVariantsMap((current) => ({ ...current, ...Object.fromEntries(entries) }))
// // //   }

// // //   const loadProducts = async () => {
// // //     setLoading(true)

// // //     try {
// // //       const { data } = await getProducts({
// // //         search,
// // //         status: statusFilter,
// // //         category_id: categoryFilter,
// // //         page,
// // //         limit: LIMIT,
// // //       })

// // //       const result = data?.data
// // //       const items = Array.isArray(result?.products) ? result.products : []

// // //       setList(items)
// // //       setTotal(Number(result?.total) || 0)
// // //       loadListVariants(items)
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed to load products.')
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     loadCats()
// // //   }, [])

// // //   useEffect(() => {
// // //     loadProducts()
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [search, statusFilter, categoryFilter, page])

// // //   const refresh = async () => {
// // //     await loadProducts()
// // //   }

// // //   const openAdd = () => {
// // //     setEditing(null)
// // //     setFormOpen(true)
// // //   }

// // //   const openEdit = (p) => {
// // //     setEditing(p)
// // //     setFormOpen(true)
// // //   }

// // //   const toggleStatus = async (p) => {
// // //     if (busyId) return
// // //     setBusyId(p._id)

// // //     try {
// // //       await updateProductStatus(p._id, p.status === 'active' ? 'inactive' : 'active')
// // //       toast.success('Status updated.')
// // //       await loadProducts()
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed.')
// // //     } finally {
// // //       setBusyId(null)
// // //     }
// // //   }

// // //   const toggleAvailability = async (p) => {
// // //     if (busyId) return
// // //     setBusyId(p._id)

// // //     try {
// // //       const { data } = await updateProductAvailability(p._id, !p.availability)
// // //       toast.success('Availability updated.')

// // //       if (data?.data?.all_variants_unavailable) {
// // //         toast(
// // //           'All variants are also unavailable. Customers cannot order this product.',
// // //           { icon: '⚠️', duration: 5000 }
// // //         )
// // //       }

// // //       await loadProducts()
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed.')
// // //     } finally {
// // //       setBusyId(null)
// // //     }
// // //   }

// // //   const handleDelete = async () => {
// // //     if (!confirmDelete || deleting) return
// // //     setDeleting(true)

// // //     try {
// // //       await deleteProduct(confirmDelete._id)
// // //       toast.success('Product deleted.')
// // //       setConfirmDelete(null)

// // //       if (list.length === 1 && page > 1) {
// // //         setPage((n) => n - 1)
// // //       } else {
// // //         await loadProducts()
// // //       }
// // //     } catch (err) {
// // //       toast.error(err.response?.data?.message || 'Failed to delete.')
// // //     } finally {
// // //       setDeleting(false)
// // //     }
// // //   }

// // //   // Category filter is also applied client-side in case the API ignores it.
// // //   const visible = categoryFilter
// // //     ? list.filter(
// // //         (p) => (p.category_id?._id || p.category_id) === categoryFilter
// // //       )
// // //     : list

// // //   return (
// // //     <div className="pv-page">
// // //       <style>{CSS}</style>

// // //       <div className="pv-head">
// // //         <div>
// // //           <h2 className="pv-title">Products</h2>
// // //           <p className="pv-sub">Manage your menu items</p>
// // //         </div>

// // //         <button type="button" className="pv-btn pv-btn--primary" onClick={openAdd}>
// // //           + Add product
// // //         </button>
// // //       </div>

// // //       <div className="pv-card">
// // //         <div className="pv-filters">
// // //           <input
// // //             className="pv-input"
// // //             placeholder="🔍 Search product"
// // //             value={search}
// // //             onChange={(e) => {
// // //               setSearch(e.target.value)
// // //               setPage(1)
// // //             }}
// // //           />

// // //           <select
// // //             className="pv-select"
// // //             value={categoryFilter}
// // //             onChange={(e) => {
// // //               setCategoryFilter(e.target.value)
// // //               setPage(1)
// // //             }}
// // //           >
// // //             <option value="">All categories</option>
// // //             {categories.map((c) => (
// // //               <option key={c._id} value={c._id}>
// // //                 {c.name}
// // //               </option>
// // //             ))}
// // //           </select>

// // //           <select
// // //             className="pv-select"
// // //             value={statusFilter}
// // //             onChange={(e) => {
// // //               setStatusFilter(e.target.value)
// // //               setPage(1)
// // //             }}
// // //           >
// // //             <option value="">All status</option>
// // //             <option value="active">Active</option>
// // //             <option value="inactive">Inactive</option>
// // //           </select>
// // //         </div>

// // //         {loading ? (
// // //           <div className="pv-loader">
// // //             <span className="pv-spin" />
// // //           </div>
// // //         ) : (
// // //           <div className="pv-wrap">
// // //             <table className="pv-table">
// // //               <thead>
// // //                 <tr>
// // //                   <th>Product</th>
// // //                   <th>Category</th>
// // //                   <th>Weightages</th>
// // //                   <th>Available</th>
// // //                   <th>Status</th>
// // //                   <th>Actions</th>
// // //                 </tr>
// // //               </thead>

// // //               <tbody>
// // //                 {visible.length === 0 && (
// // //                   <tr>
// // //                     <td colSpan={6}>
// // //                       <div className="pv-empty">No products found.</div>
// // //                     </td>
// // //                   </tr>
// // //                 )}

// // //                 {visible.map((p) => {
// // //                   const productVariants = variantsMap[p._id]

// // //                   return (
// // //                     <tr key={p._id}>
// // //                       <td>
// // //                         <div className="pv-prod">
// // //                           <div className="pv-thumb">
// // //                             {p.image_url ? (
// // //                               <img src={imgSrc(p.image_url)} alt={p.name} />
// // //                             ) : (
// // //                               '🍲'
// // //                             )}
// // //                           </div>

// // //                           <div>
// // //                             <div className="pv-prod-name">{p.name}</div>
// // //                             {p.description && (
// // //                               <div className="pv-prod-desc">{p.description}</div>
// // //                             )}
// // //                           </div>
// // //                         </div>
// // //                       </td>

// // //                       <td>{p.category_id?.name || '—'}</td>

// // //                       <td>
// // //                         {productVariants === undefined ? (
// // //                           <span className="pv-prod-desc">Loading...</span>
// // //                         ) : productVariants.length === 0 ? (
// // //                           <span className="pv-prod-desc">No variants</span>
// // //                         ) : (
// // //                           <div className="pv-chips">
// // //                             {sortVariants(productVariants).map((v) => {
// // //                               const off = v.status !== 'active' || v.availability === false

// // //                               return (
// // //                                 <span
// // //                                   key={v._id}
// // //                                   className={`pv-chip ${off ? 'pv-chip--off' : ''}`}
// // //                                   title={off ? 'Inactive or unavailable' : v.variant_name}
// // //                                 >
// // //                                   {v.variant_name} ·{' '}
// // //                                   {Number(v.price) > 0 ? formatPrice(v.price) : 'no price'}
// // //                                 </span>
// // //                               )
// // //                             })}
// // //                           </div>
// // //                         )}
// // //                       </td>

// // //                       <td>
// // //                         <Switch
// // //                           checked={!!p.availability}
// // //                           label={`Availability of ${p.name}`}
// // //                           disabled={busyId === p._id}
// // //                           onChange={() => toggleAvailability(p)}
// // //                         />
// // //                       </td>

// // //                       <td>
// // //                         <span
// // //                           className={`pv-badge ${
// // //                             p.status === 'active' ? 'pv-badge--green' : 'pv-badge--red'
// // //                           }`}
// // //                         >
// // //                           {p.status === 'active' ? 'Active' : 'Inactive'}
// // //                         </span>
// // //                       </td>

// // //                       <td>
// // //                         <div className="pv-actions">
// // //                           <button
// // //                             type="button"
// // //                             className="pv-btn pv-btn--sm"
// // //                             onClick={() => openEdit(p)}
// // //                           >
// // //                             Edit
// // //                           </button>

// // //                           <button
// // //                             type="button"
// // //                             className="pv-btn pv-btn--sm"
// // //                             title="Pre-order details"
// // //                             onClick={() => setPreorderProduct(p)}
// // //                           >
// // //                             <CalendarDays size={14} />
// // //                           </button>

// // //                           <button
// // //                             type="button"
// // //                             className="pv-btn pv-btn--sm"
// // //                             disabled={busyId === p._id}
// // //                             onClick={() => toggleStatus(p)}
// // //                           >
// // //                             {p.status === 'active' ? 'Deactivate' : 'Activate'}
// // //                           </button>

// // //                           <button
// // //                             type="button"
// // //                             className="pv-btn pv-btn--sm pv-btn--danger"
// // //                             title="Delete"
// // //                             onClick={() => setConfirmDelete(p)}
// // //                           >
// // //                             <Trash2 size={14} />
// // //                           </button>
// // //                         </div>
// // //                       </td>
// // //                     </tr>
// // //                   )
// // //                 })}
// // //               </tbody>
// // //             </table>
// // //           </div>
// // //         )}

// // //         <div className="pv-foot">
// // //           <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />
// // //         </div>
// // //       </div>

// // //       {formOpen && (
// // //         <ProductFormModal
// // //           key={editing?._id || 'new'}
// // //           product={editing}
// // //           categories={categories}
// // //           onClose={() => setFormOpen(false)}
// // //           onSaved={refresh}
// // //         />
// // //       )}

// // //       {preorderProduct && (
// // //         <ProductPreorderModal
// // //           product={preorderProduct}
// // //           onClose={() => setPreorderProduct(null)}
// // //         />
// // //       )}

// // //       {confirmDelete && (
// // //         <Shell
// // //           title="Delete product"
// // //           onClose={() => setConfirmDelete(null)}
// // //           locked={deleting}
// // //         >
// // //           <p style={{ margin: '0 0 4px' }}>
// // //             Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
// // //           </p>
// // //           <p className="pv-sub" style={{ marginBottom: 16 }}>
// // //             This action cannot be undone.
// // //           </p>

// // //           <div className="pv-btns">
// // //             <button
// // //               type="button"
// // //               className="pv-btn"
// // //               onClick={() => setConfirmDelete(null)}
// // //               disabled={deleting}
// // //             >
// // //               Cancel
// // //             </button>

// // //             <button
// // //               type="button"
// // //               className="pv-btn pv-btn--primary"
// // //               onClick={handleDelete}
// // //               disabled={deleting}
// // //             >
// // //               {deleting ? 'Deleting...' : 'Delete'}
// // //             </button>
// // //           </div>
// // //         </Shell>
// // //       )}
// // //     </div>
// // //   )
// // // }
// // import { useEffect, useRef, useState } from 'react'
// // import { CalendarDays, Store, Truck, Trash2 } from 'lucide-react'
// // import {
// //   getProducts,
// //   getProductPreorder,
// //   createProduct,
// //   updateProduct,
// //   updateProductStatus,
// //   updateProductAvailability,
// //   deleteProduct,
// //   getCategories,
// //   getVariants,
// //   createVariant,
// //   updateVariant,
// //   updateVariantPrice,
// //   updateVariantAvailability,
// //   deleteVariant,
// //   updateVariantStatus,
// // } from '../../services/adminService'

// // import Pagination from '../../components/ui/Pagination'
// // import toast from 'react-hot-toast'

// // const LIMIT = 20
// // const FILE_BASE = 'http://localhost:5000'
// // const MAX_IMAGE_MB = 2
// // const MENU_CATEGORY_ORDER = ['curries', 'fry', 'biryani', 'specials']
// // const UNITS = ['KG', 'G', 'L', 'ML', 'PCS']
// // const UNIT_GROUP = { KG: 'weight', G: 'weight', L: 'volume', ML: 'volume', PCS: 'count' }

// // const imgSrc = (url) => {
// //   if (!url) return ''
// //   return url.startsWith('http') ? url : `${FILE_BASE}${url}`
// // }

// // const getTodayIstDate = () => {
// //   const parts = new Intl.DateTimeFormat('en-CA', {
// //     timeZone: 'Asia/Kolkata',
// //     year: 'numeric',
// //     month: '2-digit',
// //     day: '2-digit',
// //   }).formatToParts(new Date())
// //   const get = (type) => parts.find((p) => p.type === type)?.value
// //   return `${get('year')}-${get('month')}-${get('day')}`
// // }

// // const formatMoney = (value) =>
// //   `₹${Number(value ?? 0).toLocaleString('en-IN', {
// //     minimumFractionDigits: 2,
// //     maximumFractionDigits: 2,
// //   })}`

// // const formatPrice = (value) =>
// //   `₹${Number(value ?? 0).toLocaleString('en-IN')}`

// // /* order rules: weight limit and minimum preparation time */
// // const hasKgRule = (p) => p?.preorder_above_kg != null && Number(p.preorder_above_kg) > 0
// // const hasPrepRule = (p) => Number(p?.min_prep_hours) > 0

// // /* "0.5 KG" -> quantity variant, "5 Members" -> member variant */
// // const parseVariantName = (raw) => {
// //   const name = String(raw || '').trim()

// //   let m = name.match(/^(\d*\.?\d+)\s*(kg|g|l|ml|pcs)$/i)
// //   if (m) {
// //     const qty = Number(m[1])
// //     const unit = m[2].toUpperCase()
// //     if (!(qty > 0)) return null
// //     return {
// //       variant_type: 'quantity',
// //       variant_name: `${qty} ${unit}`,
// //       quantity_value: qty,
// //       quantity_unit: unit,
// //       member_count: null,
// //     }
// //   }

// //   m = name.match(/^(\d+)\s*members?$/i)
// //   if (m && Number(m[1]) > 0) {
// //     const count = Number(m[1])
// //     return {
// //       variant_type: 'member',
// //       variant_name: `${count} Members`,
// //       quantity_value: 0,
// //       quantity_unit: 'PCS',
// //       member_count: count,
// //     }
// //   }

// //   return null
// // }

// // /* same variant = same quantity+unit (or same member count) */
// // const sameVariant = (v, parsed) =>
// //   parsed.variant_type === 'quantity'
// //     ? v.variant_type === 'quantity' &&
// //       Number(v.quantity_value) === parsed.quantity_value &&
// //       v.quantity_unit === parsed.quantity_unit
// //     : v.variant_type === 'member' && Number(v.member_count) === parsed.member_count

// // const quantityVariantKey = (variant) =>
// //   `${Number(variant.quantity_value)}-${variant.quantity_unit}`

// // /* quantity variants first (by unit, then size), member variants after */
// // const sortVariants = (items) =>
// //   [...items].sort((a, b) => {
// //     if (a.variant_type !== b.variant_type) {
// //       return a.variant_type === 'quantity' ? -1 : 1
// //     }
// //     if (a.variant_type === 'member') {
// //       return Number(a.member_count) - Number(b.member_count)
// //     }
// //     if (a.quantity_unit !== b.quantity_unit) {
// //       return String(a.quantity_unit).localeCompare(String(b.quantity_unit))
// //     }
// //     return Number(a.quantity_value) - Number(b.quantity_value)
// //   })

// // const fetchAllProducts = async () => {
// //   const all = []
// //   let page = 1

// //   for (;;) {
// //     const { data } = await getProducts({
// //       search: '',
// //       status: '',
// //       category_id: '',
// //       page,
// //       limit: 100,
// //     })

// //     const result = data?.data
// //     const items = Array.isArray(result?.products) ? result.products : []
// //     all.push(...items)

// //     const total = Number(result?.total) || 0
// //     if (items.length === 0 || all.length >= total || page >= 200) break
// //     page += 1
// //   }

// //   return all
// // }

// // /* Adds one variant to every product. Skips products that already have it. */
// // const addVariantToAllProducts = async (payload, availability) => {
// //   const products = await fetchAllProducts()
// //   const result = { total: products.length, added: 0, existed: 0, skipped: 0, failed: 0 }

// //   const run = async (prod) => {
// //     try {
// //       const { data } = await getVariants(prod._id)
// //       const existing = Array.isArray(data?.data) ? data.data : []

// //       if (existing.some((v) => sameVariant(v, payload))) {
// //         result.existed += 1
// //         return
// //       }

// //       const res = await createVariant(prod._id, payload)
// //       const newId = res?.data?.data?._id

// //       if (!availability && newId) {
// //         await updateVariantAvailability(newId, false)
// //       }

// //       result.added += 1
// //     } catch {
// //       result.failed += 1
// //     }
// //   }

// //   for (let i = 0; i < products.length; i += 5) {
// //     await Promise.all(products.slice(i, i + 5).map(run))
// //   }

// //   return result
// // }

// // const optimizeImage = (file) =>
// //   new Promise((resolve) => {
// //     const url = URL.createObjectURL(file)
// //     const img = new Image()

// //     img.onload = () => {
// //       const max = 1200
// //       const scale = Math.min(1, max / Math.max(img.width, img.height))
// //       const canvas = document.createElement('canvas')
// //       canvas.width = Math.round(img.width * scale)
// //       canvas.height = Math.round(img.height * scale)
// //       canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
// //       URL.revokeObjectURL(url)

// //       canvas.toBlob(
// //         (blob) => {
// //           if (!blob || blob.size >= file.size) return resolve(file)
// //           resolve(
// //             new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', {
// //               type: 'image/webp',
// //             })
// //           )
// //         },
// //         'image/webp',
// //         0.85
// //       )
// //     }

// //     img.onerror = () => {
// //       URL.revokeObjectURL(url)
// //       resolve(file)
// //     }

// //     img.src = url
// //   })

// // const sortCategories = (items) => {
// //   if (!Array.isArray(items)) return []

// //   return [...items].sort((a, b) => {
// //     const nameA = String(a.name || '').trim().toLowerCase()
// //     const nameB = String(b.name || '').trim().toLowerCase()
// //     const iA = MENU_CATEGORY_ORDER.indexOf(nameA)
// //     const iB = MENU_CATEGORY_ORDER.indexOf(nameB)
// //     const oA = iA === -1 ? MENU_CATEGORY_ORDER.length : iA
// //     const oB = iB === -1 ? MENU_CATEGORY_ORDER.length : iB
// //     if (oA !== oB) return oA - oB
// //     return nameA.localeCompare(nameB)
// //   })
// // }

// // /* ───────────────────────── STYLES ───────────────────────── */

// // const CSS = `
// // .pv-page{background:#f4f0e9;min-height:100%;padding:20px;color:#1c1917;font-family:inherit}
// // .pv-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px}
// // .pv-title{font-size:26px;font-weight:800;margin:0}
// // .pv-sub{color:#78716c;font-size:14px;margin:2px 0 0}
// // .pv-btn{border:1px solid #e7dfd2;background:#fff;color:#1c1917;border-radius:10px;padding:9px 14px;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
// // .pv-btn:disabled{opacity:.55;cursor:not-allowed}
// // .pv-btn--primary{background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;border:none}
// // .pv-btn--danger{color:#dc2626}
// // .pv-btn--sm{padding:7px 12px;font-size:13px}
// // .pv-card{background:#fff;border:1px solid #eadfce;border-radius:16px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,.04)}
// // .pv-filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
// // .pv-input,.pv-select{width:100%;box-sizing:border-box;border:1px solid #e7dfd2;background:#fff;border-radius:12px;padding:12px 14px;font-size:15px;font-family:inherit;color:#1c1917;outline:none}
// // .pv-input:focus,.pv-select:focus{border-color:#ea580c}
// // .pv-filters .pv-input,.pv-filters .pv-select{width:auto;flex:1 1 170px}
// // .pv-wrap{overflow-x:auto}
// // .pv-table{width:100%;border-collapse:collapse;min-width:900px}
// // .pv-table th{text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#78716c;padding:12px 8px;border-bottom:1px solid #eee6d9}
// // .pv-table td{padding:14px 8px;border-bottom:1px solid #eee6d9;vertical-align:middle;font-size:14px}
// // .pv-prod{display:flex;gap:12px;align-items:center}
// // .pv-thumb{width:46px;height:46px;border-radius:12px;background:#fde9db;display:grid;place-items:center;font-size:22px;flex:none;overflow:hidden}
// // .pv-thumb img{width:100%;height:100%;object-fit:cover}
// // .pv-prod-name{font-weight:700}
// // .pv-prod-desc{color:#78716c;font-size:13px;max-width:180px}
// // .pv-chips{display:flex;flex-wrap:wrap;gap:5px;max-width:320px}
// // .pv-chip{background:#f5efe4;border:1px solid #e7dfd2;border-radius:8px;padding:3px 8px;font-size:12px;font-weight:600;white-space:nowrap}
// // .pv-chip--off{opacity:.5}
// // .pv-chip--rule{background:#fde9db;border-color:#f3c3a3;color:#c2410c}
// // .pv-rules{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}
// // .pv-badge{display:inline-block;border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
// // .pv-badge--green{background:#dcfce7;color:#15803d}
// // .pv-badge--red{background:#fee2e2;color:#b91c1c}
// // .pv-actions{display:flex;gap:6px;flex-wrap:wrap}
// // .pv-switch{width:44px;height:26px;border-radius:999px;border:none;background:#d6d3d1;position:relative;cursor:pointer;padding:0;flex:none;transition:background .15s}
// // .pv-switch::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .15s}
// // .pv-switch[aria-checked="true"]{background:#15803d}
// // .pv-switch[aria-checked="true"]::after{transform:translateX(18px)}
// // .pv-switch:disabled{opacity:.6;cursor:not-allowed}
// // .pv-empty{text-align:center;color:#78716c;padding:28px 0}
// // .pv-loader{display:grid;place-items:center;padding:40px}
// // .pv-spin{width:28px;height:28px;border:3px solid #eadfce;border-top-color:#ea580c;border-radius:50%;animation:pvspin .8s linear infinite}
// // @keyframes pvspin{to{transform:rotate(360deg)}}
// // .pv-foot{margin-top:12px}

// // .pv-overlay{position:fixed;inset:0;background:rgba(28,25,23,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000}
// // .pv-modal{background:#f4f0e9;border-radius:18px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;padding:20px;box-sizing:border-box}
// // .pv-modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
// // .pv-modal-title{font-size:22px;font-weight:800;margin:0}
// // .pv-x{width:40px;height:40px;border-radius:12px;border:1px solid #e7dfd2;background:#fff;font-size:18px;cursor:pointer}
// // .pv-field{margin-bottom:16px}
// // .pv-label{display:block;font-size:13px;font-weight:700;color:#78716c;margin-bottom:6px}
// // .pv-drop{border:2px dashed #d9b9a5;background:#fdf9f2;border-radius:18px;padding:34px 12px;text-align:center;cursor:pointer;display:grid;gap:4px;justify-items:center}
// // .pv-drop--over{background:#fdeede;border-color:#ea580c}
// // .pv-drop-ico{font-size:30px}
// // .pv-drop-title{font-weight:800;font-size:15px}
// // .pv-drop-sub{font-size:13px;color:#78716c}
// // .pv-photo{position:relative;border-radius:16px;overflow:hidden;border:1px solid #e7dfd2;background:#fff}
// // .pv-photo img{display:block;width:100%;max-height:200px;object-fit:cover}
// // .pv-photo button{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;border:none;background:rgba(0,0,0,.6);color:#fff;cursor:pointer}
// // .pv-row2{display:flex;gap:12px;align-items:flex-end}
// // .pv-row2 .pv-grow{flex:1}
// // .pv-toggle{display:grid;gap:6px;justify-items:center;font-size:12px;font-weight:700;color:#78716c}
// // .pv-h3{font-size:17px;font-weight:800;margin:6px 0 10px}
// // .pv-vhead,.pv-vrow{display:grid;grid-template-columns:1fr 108px 56px 40px;gap:8px;align-items:center}
// // .pv-vhead{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#78716c;font-weight:700;margin-bottom:6px}
// // .pv-vrow{margin-bottom:8px}
// // .pv-vrow .pv-input{padding:11px 12px}
// // .pv-price{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #e7dfd2;border-radius:12px;padding:0 10px}
// // .pv-price input{border:none;outline:none;width:100%;padding:11px 0;font-size:15px;background:transparent;font-family:inherit}
// // .pv-rm{width:40px;height:40px;border-radius:12px;border:1px solid #e7dfd2;background:#fff;color:#dc2626;cursor:pointer;font-size:16px}
// // .pv-prev{background:#fff;border:1px solid #e7dfd2;border-radius:16px;overflow:hidden;margin-bottom:16px}
// // .pv-prev-img{background:#fde9db;height:120px;display:grid;place-items:center;font-size:30px}
// // .pv-prev-img img{width:100%;height:100%;object-fit:cover}
// // .pv-prev-body{padding:14px 16px;display:grid;gap:6px;justify-items:start}
// // .pv-prev-name{font-weight:800;font-size:16px}
// // .pv-prev-desc{color:#78716c;font-size:14px}
// // .pv-prev-chips{display:flex;gap:6px;flex-wrap:wrap}
// // .pv-btns{display:flex;gap:10px}
// // .pv-btns .pv-btn{justify-content:center;padding:14px 16px;font-size:15px}
// // .pv-btns .pv-btn--primary{flex:1}
// // .pv-box{background:#fff;border:1px solid #e7dfd2;border-radius:12px;padding:14px;display:grid;gap:8px;font-size:14px}
// // .pv-line{display:flex;justify-content:space-between}
// // .pv-seg{display:grid;grid-template-columns:1fr 1fr;gap:8px}
// // .pv-seg .pv-btn[aria-pressed="true"]{background:#fde9db;border-color:#ea580c;color:#c2410c}
// // .pv-back{border:1px solid #e7dfd2;background:#fff;border-radius:12px;padding:8px 14px;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:16px;font-family:inherit;color:#1c1917}
// // .pv-segtabs{display:flex;gap:4px;background:#faf6ee;border:1px solid #eadfce;border-radius:14px;padding:4px}
// // .pv-segtabs button{flex:1;border:none;background:transparent;padding:12px 8px;border-radius:10px;font-size:15px;font-weight:700;color:#78716c;cursor:pointer;font-family:inherit}
// // .pv-segtabs button[aria-pressed="true"]{background:#fff;color:#c2410c;box-shadow:0 1px 4px rgba(0,0,0,.08)}
// // .pv-segtabs button:disabled{cursor:not-allowed;opacity:.7}
// // .pv-toggles{display:grid;grid-template-columns:1fr 1fr;gap:12px}
// // .pv-toggles .pv-toggle{justify-items:start}
// // .pv-vitem{background:#fff;border:1px solid #e7dfd2;border-radius:14px;padding:12px 14px;margin-bottom:10px}
// // .pv-vitem-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px}
// // .pv-vprice{color:#c2410c;font-weight:800;font-size:17px}
// // .pv-vitem-bottom{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
// // .pv-mini{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#78716c}
// // .pv-vprev-row{display:flex;justify-content:space-between;align-items:baseline;width:100%}
// // .pv-vprev-name{font-size:21px;font-weight:800}
// // .pv-vprev-price{font-size:20px;font-weight:800;color:#c2410c}
// // .pv-applyall{display:flex;justify-content:space-between;align-items:center;gap:14px;background:#fff;border:1px solid #e7dfd2;border-radius:14px;padding:12px 14px}
// // .pv-applyall small{display:block;color:#78716c;font-size:12px;margin-top:2px;font-weight:500}
// // `

// // /* ───────────────────────── SMALL UI PIECES ───────────────────────── */

// // function Switch({ checked, onChange, disabled, label }) {
// //   return (
// //     <button
// //       type="button"
// //       role="switch"
// //       aria-checked={checked}
// //       aria-label={label}
// //       className="pv-switch"
// //       disabled={disabled}
// //       onClick={() => onChange(!checked)}
// //     />
// //   )
// // }

// // function Shell({ title, onClose, children, locked }) {
// //   return (
// //     <div
// //       className="pv-overlay"
// //       onMouseDown={(e) => {
// //         if (e.target === e.currentTarget && !locked) onClose()
// //       }}
// //     >
// //       <div className="pv-modal">
// //         <div className="pv-modal-head">
// //           <h3 className="pv-modal-title">{title}</h3>
// //           <button
// //             type="button"
// //             className="pv-x"
// //             onClick={() => !locked && onClose()}
// //             aria-label="Close"
// //           >
// //             ✕
// //           </button>
// //         </div>
// //         {children}
// //       </div>
// //     </div>
// //   )
// // }

// // /* ───────────────────────── VARIANTS MODAL ───────────────────────── */

// // const emptyVariantForm = (unit) => ({
// //   variant_type: 'quantity',
// //   quantity_value: '',
// //   quantity_unit: unit,
// //   member_count: '1',
// //   price: '',
// //   availability: true,
// //   active: true,
// // })

// // export function VariantsModal({ product, onClose, onSaved }) {
// //   const baseUnit = UNIT_GROUP[product.price_unit] ? product.price_unit : 'KG'
// //   const allowedUnits = UNITS.filter((u) => UNIT_GROUP[u] === UNIT_GROUP[baseUnit])

// //   const [variants, setVariants] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [view, setView] = useState('list') // 'list' | 'form'
// //   const [editingV, setEditingV] = useState(null)
// //   const [form, setForm] = useState(() => emptyVariantForm(baseUnit))
// //   const [saving, setSaving] = useState(false)
// //   const [busyId, setBusyId] = useState(null)

// //   const loadVariants = async () => {
// //     try {
// //       const { data } = await getVariants(product._id)
// //       setVariants(Array.isArray(data?.data) ? data.data : [])
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to load variants.')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     setLoading(true)
// //     loadVariants()
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [product._id])

// //   const backToList = () => {
// //     setView('list')
// //     setEditingV(null)
// //     setForm(emptyVariantForm(baseUnit))
// //   }

// //   const openAdd = () => {
// //     setEditingV(null)
// //     setForm(emptyVariantForm(baseUnit))
// //     setView('form')
// //   }

// //   const openEdit = (v) => {
// //     setEditingV(v)
// //     setForm({
// //       variant_type: v.variant_type || 'quantity',
// //       quantity_value: v.quantity_value > 0 ? String(v.quantity_value) : '',
// //       quantity_unit: v.quantity_unit && v.quantity_unit !== 'PCS' ? v.quantity_unit : baseUnit,
// //       member_count: v.member_count > 0 ? String(v.member_count) : '1',
// //       price: v.price != null ? String(v.price) : '',
// //       availability: v.availability !== false,
// //       active: (v.status || 'active') === 'active',
// //     })
// //     setView('form')
// //   }

// //   const isQty = form.variant_type === 'quantity'

// //   // What the saved variant will look like (null while the inputs are invalid).
// //   const preview = isQty
// //     ? Number(form.quantity_value) > 0
// //       ? parseVariantName(`${Number(form.quantity_value)} ${form.quantity_unit}`)
// //       : null
// //     : Number.isInteger(Number(form.member_count)) && Number(form.member_count) >= 1
// //       ? parseVariantName(`${Number(form.member_count)} Members`)
// //       : null

// //   const previewPrice = Number(form.price)
// //   const hasPrice = form.price !== '' && Number.isFinite(previewPrice) && previewPrice > 0

// //   const handleSave = async (e) => {
// //     e.preventDefault()
// //     if (saving) return

// //     if (!preview) {
// //       return toast.error(
// //         isQty ? 'Quantity must be greater than 0.' : 'Member count must be at least 1.'
// //       )
// //     }

// //     if (editingV && !hasPrice) return toast.error('Price must be greater than 0.')

// //     const applyAll = !editingV

// //     const duplicate = variants.some(
// //       (v) => v._id !== editingV?._id && sameVariant(v, preview)
// //     )

// //     if (duplicate && !applyAll) {
// //       return toast.error('This variant already exists for this product.')
// //     }

// //     const payload = {
// //       ...preview,
// //       price: editingV ? previewPrice : 0,
// //       status: form.active ? 'active' : 'inactive',
// //     }

// //     setSaving(true)

// //     try {
// //       if (applyAll) {
// //         const r = await addVariantToAllProducts(payload, form.availability)
// //         const parts = [`Added to ${r.added} of ${r.total} products`]
// //         if (r.existed) parts.push(`${r.existed} already had it`)
// //         if (r.failed) parts.push(`${r.failed} failed`)

// //         if (r.failed) toast.error(parts.join(' · '), { duration: 6000 })
// //         else toast.success(parts.join(' · '), { duration: 5000 })
// //       } else if (editingV) {
// //         await updateVariant(editingV._id, payload)

// //         if ((editingV.availability !== false) !== form.availability) {
// //           await updateVariantAvailability(editingV._id, form.availability)
// //         }

// //         toast.success('Variant updated.')
// //       } else {
// //         const res = await createVariant(product._id, payload)
// //         const newId = res?.data?.data?._id

// //         if (!form.availability && newId) {
// //           await updateVariantAvailability(newId, false)
// //         }

// //         toast.success('Variant added.')
// //       }

// //       await loadVariants()
// //       onSaved()
// //       backToList()
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to save variant.')
// //     } finally {
// //       setSaving(false)
// //     }
// //   }

// //   const toggleAvail = async (v) => {
// //     if (busyId) return
// //     setBusyId(v._id)

// //     try {
// //       const { data } = await updateVariantAvailability(v._id, !(v.availability !== false))
// //       toast.success('Availability updated.')

// //       if (data?.data?.all_variants_unavailable) {
// //         toast('All variants are unavailable. Customers cannot order this product.', {
// //           icon: '⚠️',
// //           duration: 5000,
// //         })
// //       }

// //       await loadVariants()
// //       onSaved()
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to update availability.')
// //     } finally {
// //       setBusyId(null)
// //     }
// //   }

// //   const toggleActive = async (v) => {
// //     if (busyId) return
// //     setBusyId(v._id)

// //     try {
// //       await updateVariantStatus(v._id, v.status === 'active' ? 'inactive' : 'active')
// //       toast.success('Status updated.')
// //       await loadVariants()
// //       onSaved()
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to update status.')
// //     } finally {
// //       setBusyId(null)
// //     }
// //   }

// //   const removeVariant = async (v) => {
// //     if (busyId) return
// //     if (!window.confirm(`Delete variant ${v.variant_name}?`)) return

// //     setBusyId(v._id)

// //     try {
// //       await deleteVariant(v._id)
// //       toast.success('Variant deleted.')
// //       await loadVariants()
// //       onSaved()
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to delete variant.')
// //     } finally {
// //       setBusyId(null)
// //     }
// //   }

// //   const title =
// //     view === 'list' ? `Variants — ${product.name}` : editingV ? 'Edit variant' : 'Add variant'

// //   return (
// //     <Shell title={title} onClose={onClose} locked={saving}>
// //       <style>{CSS}</style>
// //       {view === 'list' ? (
// //         <>
// //           {loading ? (
// //             <div className="pv-loader">
// //               <span className="pv-spin" />
// //             </div>
// //           ) : variants.length === 0 ? (
// //             <div className="pv-empty">No variants yet. Add the first one.</div>
// //           ) : (
// //             variants.map((v) => (
// //               <div className="pv-vitem" key={v._id}>
// //                 <div className="pv-vitem-top">
// //                   <div>
// //                     <strong>{v.variant_name}</strong>
// //                     <div className="pv-prod-desc">
// //                       {v.variant_type === 'member'
// //                         ? `${v.member_count} Members`
// //                         : `${v.quantity_value} ${v.quantity_unit}`}
// //                     </div>
// //                   </div>
// //                   <div className="pv-vprice">{formatPrice(v.price)}</div>
// //                 </div>

// //                 <div className="pv-vitem-bottom">
// //                   <label className="pv-mini">
// //                     Available
// //                     <Switch
// //                       checked={v.availability !== false}
// //                       label={`Availability of ${v.variant_name}`}
// //                       disabled={busyId === v._id}
// //                       onChange={() => toggleAvail(v)}
// //                     />
// //                   </label>

// //                   <label className="pv-mini">
// //                     Active
// //                     <Switch
// //                       checked={v.status === 'active'}
// //                       label={`Status of ${v.variant_name}`}
// //                       disabled={busyId === v._id}
// //                       onChange={() => toggleActive(v)}
// //                     />
// //                   </label>

// //                   <div className="pv-actions" style={{ marginLeft: 'auto' }}>
// //                     <button
// //                       type="button"
// //                       className="pv-btn pv-btn--sm"
// //                       onClick={() => openEdit(v)}
// //                     >
// //                       Edit
// //                     </button>

// //                     <button
// //                       type="button"
// //                       className="pv-btn pv-btn--sm pv-btn--danger"
// //                       title="Delete"
// //                       disabled={busyId === v._id}
// //                       onClick={() => removeVariant(v)}
// //                     >
// //                       <Trash2 size={14} />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))
// //           )}

// //           <div className="pv-btns" style={{ marginTop: 16 }}>
// //             <button type="button" className="pv-btn pv-btn--primary" onClick={openAdd}>
// //               + Add variant
// //             </button>
// //             <button type="button" className="pv-btn" onClick={onClose}>
// //               Close
// //             </button>
// //           </div>
// //         </>
// //       ) : (
// //         <form onSubmit={handleSave}>
// //           <button type="button" className="pv-back" onClick={backToList} disabled={saving}>
// //             ‹ {product.name}
// //           </button>

// //           <div className="pv-field">
// //             <label className="pv-label">Variant type</label>

// //             <div className="pv-segtabs">
// //               <button
// //                 type="button"
// //                 aria-pressed={isQty}
// //                 disabled={!!editingV}
// //                 onClick={() => setForm({ ...form, variant_type: 'quantity' })}
// //               >
// //                 Quantity (KG / L...)
// //               </button>

// //               <button
// //                 type="button"
// //                 aria-pressed={!isQty}
// //                 disabled={!!editingV}
// //                 onClick={() => setForm({ ...form, variant_type: 'member' })}
// //               >
// //                 Members
// //               </button>
// //             </div>
// //           </div>

// //           {isQty ? (
// //             <div className="pv-field">
// //               <div className="pv-row2" style={{ alignItems: 'flex-start' }}>
// //                 <div className="pv-grow">
// //                   <label className="pv-label">Quantity *</label>
// //                   <input
// //                     className="pv-input"
// //                     type="number"
// //                     step="any"
// //                     min="0.01"
// //                     placeholder="0.5"
// //                     value={form.quantity_value}
// //                     onChange={(e) => setForm({ ...form, quantity_value: e.target.value })}
// //                   />
// //                 </div>

// //                 <div style={{ width: 130 }}>
// //                   <label className="pv-label">Unit</label>
// //                   <select
// //                     className="pv-select"
// //                     value={form.quantity_unit}
// //                     onChange={(e) => setForm({ ...form, quantity_unit: e.target.value })}
// //                   >
// //                     {allowedUnits.map((u) => (
// //                       <option key={u} value={u}>
// //                         {u}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="pv-field">
// //               <label className="pv-label">Member count *</label>
// //               <input
// //                 className="pv-input"
// //                 type="number"
// //                 min="1"
// //                 step="1"
// //                 placeholder="5"
// //                 value={form.member_count}
// //                 onChange={(e) => setForm({ ...form, member_count: e.target.value })}
// //               />
// //             </div>
// //           )}

// //           {editingV && (
// //             <div className="pv-field">
// //               <label className="pv-label">Price *</label>
// //               <div className="pv-price" style={{ padding: '0 14px' }}>
// //                 <span>₹</span>
// //                 <input
// //                   type="number"
// //                   min="0.01"
// //                   step="0.01"
// //                   placeholder="500"
// //                   value={form.price}
// //                   onChange={(e) => setForm({ ...form, price: e.target.value })}
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           {!editingV && (
// //             <p className="pv-prod-desc">
// //               This variant will be added to every product. Set individual prices later.
// //             </p>
// //           )}

// //           <div className="pv-field pv-toggles">
// //             <div className="pv-toggle">
// //               Available
// //               <Switch
// //                 checked={form.availability}
// //                 label="Available"
// //                 onChange={(val) => setForm({ ...form, availability: val })}
// //               />
// //             </div>

// //             <div className="pv-toggle">
// //               Active
// //               <Switch
// //                 checked={form.active}
// //                 label="Active"
// //                 onChange={(val) => setForm({ ...form, active: val })}
// //               />
// //             </div>
// //           </div>

// //           <h4 className="pv-h3">Live preview</h4>

// //           <div className="pv-prev">
// //             <div className="pv-prev-body" style={{ width: '100%', boxSizing: 'border-box' }}>
// //               <div className="pv-prev-desc">{product.name}</div>

// //               <div className="pv-vprev-row">
// //                 <span className="pv-vprev-name">{preview?.variant_name || 'Variant name'}</span>
// //                 <span className="pv-vprev-price">
// //                   {editingV && hasPrice ? `₹ ${previewPrice.toLocaleString('en-IN')}` : 'Price set later'}
// //                 </span>
// //               </div>

// //               <span
// //                 className={`pv-badge ${form.availability ? 'pv-badge--green' : 'pv-badge--red'}`}
// //               >
// //                 {form.availability ? 'Available' : 'Unavailable'}
// //               </span>
// //             </div>
// //           </div>

// //           <div className="pv-btns">
// //             <button type="submit" className="pv-btn pv-btn--primary" disabled={saving}>
// //               {saving
// //                 ? 'Saving...'
// //                 : editingV
// //                   ? 'Save variant'
// //                   : 'Add to all products'}
// //             </button>

// //             <button type="button" className="pv-btn" onClick={backToList} disabled={saving}>
// //               Cancel
// //             </button>
// //           </div>
// //         </form>
// //       )}
// //     </Shell>
// //   )
// // }

// // /* ───────────────────────── PRODUCT FORM MODAL ───────────────────────── */

// // function ProductFormModal({ product, categories, onClose, onSaved }) {
// //   const editing = !!product

// //   const [name, setName] = useState(product?.name || '')
// //   const [categoryId, setCategoryId] = useState(
// //     product?.category_id?._id || product?.category_id || ''
// //   )
// //   const [description, setDescription] = useState(product?.description || '')
// //   const [displayOrder, setDisplayOrder] = useState(product?.display_order ?? 0)
// //   const [active, setActive] = useState((product?.status || 'active') === 'active')
// //   const [available, setAvailable] = useState(
// //     editing ? !!product.availability : true
// //   )
// //   const [preorderAboveKg, setPreorderAboveKg] = useState(
// //     hasKgRule(product) ? String(product.preorder_above_kg) : ''
// //   )
// //   const [minPrepHours, setMinPrepHours] = useState(
// //     hasPrepRule(product) ? String(product.min_prep_hours) : ''
// //   )
// //   const [weightageOptions, setWeightageOptions] = useState([])
// //   const [originalVariants, setOriginalVariants] = useState([])
// //   const [selectedWeightages, setSelectedWeightages] = useState([])
// //   const [weightagePrices, setWeightagePrices] = useState({})
// //   const [loadingWeightages, setLoadingWeightages] = useState(true)

// //   const [imageFile, setImageFile] = useState(null)
// //   const [imagePreview, setImagePreview] = useState(
// //     product?.image_url ? imgSrc(product.image_url) : ''
// //   )
// //   const [dragOver, setDragOver] = useState(false)
// //   const [saving, setSaving] = useState(false)

// //   const fileRef = useRef()
// //   const previewUrlRef = useRef('')

// //   const clearPreviewUrl = () => {
// //     if (previewUrlRef.current) {
// //       URL.revokeObjectURL(previewUrlRef.current)
// //       previewUrlRef.current = ''
// //     }
// //   }

// //   useEffect(() => () => clearPreviewUrl(), [])

// //   useEffect(() => {
// //     let active_ = true

// //     const loadWeightages = async () => {
// //       setLoadingWeightages(true)

// //       try {
// //         const allProducts = await fetchAllProducts()
// //         const variantsByProduct = await Promise.all(
// //           allProducts.map(async (item) => {
// //             const { data } = await getVariants(item._id)
// //             return {
// //               productId: item._id,
// //               variants: Array.isArray(data?.data) ? data.data : [],
// //             }
// //           })
// //         )

// //         if (!active_) return

// //         const allVariants = variantsByProduct.flatMap(({ variants }) => variants)
// //         const uniqueWeightages = new Map()

// //         allVariants
// //           .filter(
// //             (variant) =>
// //               variant.variant_type === 'quantity' &&
// //               Number(variant.quantity_value) > 0 &&
// //               UNIT_GROUP[variant.quantity_unit]
// //           )
// //           .forEach((variant) => {
// //             const key = quantityVariantKey(variant)
// //             if (!uniqueWeightages.has(key)) {
// //               uniqueWeightages.set(key, {
// //                 key,
// //                 variant_type: 'quantity',
// //                 variant_name: `${Number(variant.quantity_value)} ${variant.quantity_unit}`,
// //                 quantity_value: Number(variant.quantity_value),
// //                 quantity_unit: variant.quantity_unit,
// //               })
// //             }
// //           })

// //         const options = Array.from(uniqueWeightages.values()).sort((a, b) =>
// //           a.quantity_unit === b.quantity_unit
// //             ? a.quantity_value - b.quantity_value
// //             : a.quantity_unit.localeCompare(b.quantity_unit)
// //         )
// //         const currentVariants =
// //           variantsByProduct.find(({ productId }) => productId === product?._id)?.variants || []
// //         const currentQuantityVariants = currentVariants.filter(
// //           (variant) => variant.variant_type === 'quantity'
// //         )

// //         setWeightageOptions(options)
// //         setOriginalVariants(currentVariants)
// //         setSelectedWeightages(
// //           currentQuantityVariants.map(quantityVariantKey)
// //         )
// //         setWeightagePrices(
// //           Object.fromEntries(
// //             currentQuantityVariants.map((variant) => [
// //               quantityVariantKey(variant),
// //               Number(variant.price) > 0 ? String(variant.price) : '',
// //             ])
// //           )
// //         )
// //       } catch (err) {
// //         if (active_) {
// //           toast.error(
// //             err.response?.data?.message || 'Failed to load product weightages.'
// //           )
// //         }
// //       } finally {
// //         if (active_) setLoadingWeightages(false)
// //       }
// //     }

// //     loadWeightages()

// //     return () => {
// //       active_ = false
// //     }
// //   }, [product?._id])

// //   const acceptFile = async (file) => {
// //     if (!file) return

// //     const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// //     if (!allowed.includes(file.type)) {
// //       toast.error('Only JPG, PNG, WEBP allowed.')
// //       return
// //     }

// //     if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
// //       toast.error(`Max ${MAX_IMAGE_MB} MB allowed.`)
// //       return
// //     }

// //     const optimized = await optimizeImage(file)

// //     clearPreviewUrl()
// //     const url = URL.createObjectURL(optimized)
// //     previewUrlRef.current = url

// //     setImageFile(optimized)
// //     setImagePreview(url)
// //   }

// //   const removeImage = () => {
// //     clearPreviewUrl()
// //     setImageFile(null)
// //     setImagePreview('')
// //     if (fileRef.current) fileRef.current.value = ''
// //   }

// //   const kgRaw = String(preorderAboveKg).trim()
// //   const prepRaw = String(minPrepHours).trim()
// //   const previewKgRule = kgRaw !== '' && Number(kgRaw) > 0
// //   const previewPrepRule = prepRaw !== '' && Number(prepRaw) > 0

// //   const handleSave = async (e) => {
// //     e.preventDefault()
// //     if (saving) return

// //     if (!name.trim()) return toast.error('Name is required.')
// //     if (!categoryId) return toast.error('Category is required.')

// //     if (kgRaw !== '' && !(Number(kgRaw) > 0)) {
// //       return toast.error('Pre-order limit must be greater than 0 KG, or leave it empty.')
// //     }

// //     if (prepRaw !== '' && !(Number(prepRaw) >= 0)) {
// //       return toast.error('Minimum preparation time cannot be negative.')
// //     }

// //     // Empty price = not set yet (allowed). Anything typed must be greater than 0.
// //     for (const key of selectedWeightages) {
// //       const raw = weightagePrices[key]
// //       if (raw === undefined || raw === '') continue
// //       const price = Number(raw)
// //       if (!Number.isFinite(price) || price <= 0) {
// //         return toast.error('Variant prices must be greater than 0.')
// //       }
// //     }

// //     setSaving(true)

// //     try {
// //       const fd = new FormData()
// //       fd.append('name', name.trim())
// //       fd.append('category_id', categoryId)
// //       fd.append('description', description || '')
// //       fd.append('display_order', String(Math.max(0, Number(displayOrder) || 0)))
// //       fd.append('status', active ? 'active' : 'inactive')
// //       fd.append('availability', String(available))
// //       fd.append('preorder_above_kg', kgRaw)
// //       fd.append('min_prep_hours', prepRaw === '' ? '0' : prepRaw)
// //       if (imageFile) fd.append('image', imageFile)

// //       let productId = product?._id

// //       if (editing) {
// //         await updateProduct(product._id, fd)
// //       } else {
// //         const { data } = await createProduct(fd)
// //         const created = data?.data
// //         productId = created?._id || created?.product?._id
// //       }

// //       if (!productId) {
// //         throw new Error('Product was saved, but its variants could not be linked.')
// //       }

// //       const selectedKeys = new Set(selectedWeightages)
// //       const originalQuantityVariants = originalVariants.filter(
// //         (variant) => variant.variant_type === 'quantity'
// //       )

// //       for (const variant of originalQuantityVariants) {
// //         if (!selectedKeys.has(quantityVariantKey(variant))) {
// //           await deleteVariant(variant._id)
// //         }
// //       }

// //       for (const weightage of weightageOptions) {
// //         if (!selectedKeys.has(weightage.key)) continue

// //         const existing = originalQuantityVariants.find(
// //           (variant) => quantityVariantKey(variant) === weightage.key
// //         )
// //         const priceValue = weightagePrices[weightage.key]

// //         if (existing) {
// //           const newPrice =
// //             priceValue === '' || priceValue === undefined
// //               ? Number(existing.price)
// //               : Number(priceValue)
// //           if (newPrice > 0 && newPrice !== Number(existing.price)) {
// //             await updateVariantPrice(existing._id, newPrice)
// //           }
// //         } else {
// //           await createVariant(productId, {
// //             variant_type: 'quantity',
// //             variant_name: weightage.variant_name,
// //             quantity_value: weightage.quantity_value,
// //             quantity_unit: weightage.quantity_unit,
// //             member_count: null,
// //             price: priceValue === '' || priceValue === undefined ? 0 : Number(priceValue),
// //             status: 'active',
// //           })
// //         }
// //       }

// //       toast.success(editing ? 'Product updated.' : 'Product created.')
// //       onSaved()
// //       onClose()
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || err.message || 'Failed to save.')
// //     } finally {
// //       setSaving(false)
// //     }
// //   }

// //   return (
// //     <Shell
// //       title={editing ? 'Edit product' : 'Add product'}
// //       onClose={onClose}
// //       locked={saving}
// //     >
// //       <form onSubmit={handleSave}>
// //         <div className="pv-field">
// //           <label className="pv-label">Product name *</label>
// //           <input
// //             className="pv-input"
// //             placeholder="e.g. Chicken Curry"
// //             value={name}
// //             onChange={(e) => setName(e.target.value)}
// //           />
// //         </div>

// //         <div className="pv-field">
// //           <label className="pv-label">Category *</label>
// //           <select
// //             className="pv-select"
// //             value={categoryId}
// //             onChange={(e) => setCategoryId(e.target.value)}
// //           >
// //             <option value="">Select category...</option>
// //             {categories.map((c) => (
// //               <option key={c._id} value={c._id}>
// //                 {c.name}
// //               </option>
// //             ))}
// //           </select>
// //           {categories.length === 0 && (
// //             <small style={{ color: '#dc2626' }}>
// //               No active categories found. Create or activate categories first.
// //             </small>
// //           )}
// //         </div>

// //         <div className="pv-field">
// //           <label className="pv-label">Description</label>
// //           <input
// //             className="pv-input"
// //             value={description}
// //             onChange={(e) => setDescription(e.target.value)}
// //           />
// //         </div>

// //         <div className="pv-field">
// //           <label className="pv-label">
// //             Photo (JPG, PNG, WEBP · max {MAX_IMAGE_MB} MB)
// //           </label>

// //           {imagePreview ? (
// //             <div className="pv-photo">
// //               <img src={imagePreview} alt="preview" />
// //               <button type="button" onClick={removeImage} title="Remove photo">
// //                 ✕
// //               </button>
// //             </div>
// //           ) : (
// //             <div
// //               className={`pv-drop ${dragOver ? 'pv-drop--over' : ''}`}
// //               role="button"
// //               tabIndex={0}
// //               onClick={() => fileRef.current?.click()}
// //               onKeyDown={(e) => {
// //                 if (e.key === 'Enter' || e.key === ' ') {
// //                   e.preventDefault()
// //                   fileRef.current?.click()
// //                 }
// //               }}
// //               onDragOver={(e) => {
// //                 e.preventDefault()
// //                 setDragOver(true)
// //               }}
// //               onDragLeave={() => setDragOver(false)}
// //               onDrop={(e) => {
// //                 e.preventDefault()
// //                 setDragOver(false)
// //                 acceptFile(e.dataTransfer.files?.[0])
// //               }}
// //             >
// //               <span className="pv-drop-ico">📷</span>
// //               <span className="pv-drop-title">Click or drag a photo here</span>
// //               <span className="pv-drop-sub">
// //                 Optimized automatically · live preview below
// //               </span>
// //             </div>
// //           )}

// //           <input
// //             ref={fileRef}
// //             type="file"
// //             accept="image/jpeg,image/jpg,image/png,image/webp"
// //             style={{ display: 'none' }}
// //             onChange={(e) => {
// //               acceptFile(e.target.files?.[0])
// //               e.target.value = ''
// //             }}
// //           />
// //         </div>

// //         <div className="pv-field">
// //           <div className="pv-row2">
// //             <div className="pv-grow">
// //               <label className="pv-label">Display order</label>
// //               <input
// //                 className="pv-input"
// //                 type="number"
// //                 min={0}
// //                 value={displayOrder}
// //                 onChange={(e) =>
// //                   setDisplayOrder(Math.max(0, Number(e.target.value) || 0))
// //                 }
// //               />
// //             </div>

// //             <div className="pv-toggle">
// //               Active
// //               <Switch checked={active} onChange={setActive} label="Active" />
// //             </div>

// //             <div className="pv-toggle">
// //               Available
// //               <Switch checked={available} onChange={setAvailable} label="Available" />
// //             </div>
// //           </div>
// //         </div>

// //         <h4 className="pv-h3">Order rules</h4>

// //         <div className="pv-field">
// //           <div className="pv-row2" style={{ alignItems: 'flex-start' }}>
// //             <div className="pv-grow">
// //               <label className="pv-label" htmlFor="pv-preorder-kg">
// //                 Pre-order above (KG)
// //               </label>
// //               <input
// //                 id="pv-preorder-kg"
// //                 className="pv-input"
// //                 type="number"
// //                 min="0"
// //                 step="any"
// //                 placeholder="e.g. 5"
// //                 value={preorderAboveKg}
// //                 onChange={(e) => setPreorderAboveKg(e.target.value)}
// //               />
// //             </div>

// //             <div className="pv-grow">
// //               <label className="pv-label" htmlFor="pv-prep-hours">
// //                 Min preparation time (hours)
// //               </label>
// //               <input
// //                 id="pv-prep-hours"
// //                 className="pv-input"
// //                 type="number"
// //                 min="0"
// //                 step="any"
// //                 placeholder="e.g. 2"
// //                 value={minPrepHours}
// //                 onChange={(e) => setMinPrepHours(e.target.value)}
// //               />
// //             </div>
// //           </div>

// //           <small
// //             className="pv-prod-desc"
// //             style={{ display: 'block', marginTop: 8, maxWidth: 'none' }}
// //           >
// //             Orders above the KG limit must be placed as pre-orders. The preparation time is the
// //             minimum gap between ordering and pickup/delivery. Leave empty for no rule. Changes
// //             apply to the next order.
// //           </small>
// //         </div>

// //         <h4 className="pv-h3">Weightages &amp; prices</h4>
// //         {loadingWeightages ? (
// //           <div className="pv-loader">
// //             <span className="pv-spin" />
// //           </div>
// //         ) : weightageOptions.length === 0 ? (
// //           <p className="pv-prod-desc">
// //             No weightages exist yet. Create one on the Weightage page first.
// //           </p>
// //         ) : (
// //           <>
// //             <div
// //               style={{
// //                 display: 'grid',
// //                 gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
// //                 gap: 8,
// //               }}
// //             >
// //               {weightageOptions.map((weightage) => {
// //                 const checked = selectedWeightages.includes(weightage.key)
// //                 return (
// //                   <label
// //                     key={weightage.key}
// //                     style={{
// //                       display: 'flex',
// //                       alignItems: 'center',
// //                       gap: 8,
// //                       border: '1px solid #e7dfd2',
// //                       borderRadius: 8,
// //                       padding: '8px 10px',
// //                       background: checked ? '#f0fdf4' : '#fff',
// //                     }}
// //                   >
// //                     <input
// //                       type="checkbox"
// //                       checked={checked}
// //                       disabled={saving}
// //                       onChange={(event) =>
// //                         setSelectedWeightages((current) =>
// //                           event.target.checked
// //                             ? [...current, weightage.key]
// //                             : current.filter((key) => key !== weightage.key)
// //                         )
// //                       }
// //                     />
// //                     <strong style={{ minWidth: 62 }}>{weightage.variant_name}</strong>
// //                     <div className="pv-price" style={{ padding: '0 8px' }}>
// //                       <span>₹</span>
// //                       <input
// //                         type="number"
// //                         min="0.01"
// //                         step="0.01"
// //                         placeholder="Price"
// //                         aria-label={`Price for ${weightage.variant_name}`}
// //                         value={weightagePrices[weightage.key] ?? ''}
// //                         disabled={!checked || saving}
// //                         onChange={(event) =>
// //                           setWeightagePrices((current) => ({
// //                             ...current,
// //                             [weightage.key]: event.target.value,
// //                           }))
// //                         }
// //                       />
// //                     </div>
// //                   </label>
// //                 )
// //               })}
// //             </div>
// //             <small className="pv-prod-desc" style={{ display: 'block', marginTop: 8 }}>
// //               Select the weightages for this product and set their prices. New selections
// //               and price changes are saved with the product.
// //             </small>
// //           </>
// //         )}

// //         <h4 className="pv-h3" style={{ marginTop: 18 }}>
// //           Live preview
// //         </h4>

// //         <div className="pv-prev">
// //           <div className="pv-prev-img">
// //             {imagePreview ? <img src={imagePreview} alt="" /> : '🍲'}
// //           </div>

// //           <div className="pv-prev-body">
// //             <div className="pv-prev-name">{name.trim() || 'Product name'}</div>
// //             <div className="pv-prev-desc">{description.trim() || 'Description'}</div>

// //             <span
// //               className={`pv-badge ${available ? 'pv-badge--green' : 'pv-badge--red'}`}
// //             >
// //               {available ? 'Available' : 'Unavailable'}
// //             </span>

// //             {(previewKgRule || previewPrepRule) && (
// //               <div className="pv-prev-chips">
// //                 {previewKgRule && (
// //                   <span className="pv-chip pv-chip--rule">Pre-order above {Number(kgRaw)} KG</span>
// //                 )}
// //                 {previewPrepRule && (
// //                   <span className="pv-chip pv-chip--rule">Min {Number(prepRaw)} h preparation</span>
// //                 )}
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         <div className="pv-btns">
// //           <button
// //             type="submit"
// //             className="pv-btn pv-btn--primary"
// //             disabled={saving || categories.length === 0}
// //           >
// //             {saving ? 'Saving...' : 'Save product'}
// //           </button>

// //           <button
// //             type="button"
// //             className="pv-btn"
// //             onClick={onClose}
// //             disabled={saving}
// //           >
// //             Cancel
// //           </button>
// //         </div>
// //       </form>
// //     </Shell>
// //   )
// // }

// // /* ───────────────────────── PRE-ORDER MODAL ───────────────────────── */

// // function ProductPreorderModal({ product, onClose }) {
// //   const [date, setDate] = useState(getTodayIstDate)
// //   const [fulfillment, setFulfillment] = useState('pickup')
// //   const [selectedVariantId, setSelectedVariantId] = useState('')
// //   const [preorderData, setPreorderData] = useState(null)
// //   const [loading, setLoading] = useState(true)

// //   useEffect(() => {
// //     let active = true

// //     const loadPreorder = async () => {
// //       setLoading(true)

// //       try {
// //         const response = await getProductPreorder(product._id, date)
// //         const data = response?.data?.data
// //         if (!active) return

// //         setPreorderData(data ?? null)
// //         setSelectedVariantId((current) =>
// //           data?.variants?.some((v) => v._id === current)
// //             ? current
// //             : data?.variants?.[0]?._id ?? ''
// //         )
// //       } catch (error) {
// //         if (active) {
// //           toast.error(
// //             error.response?.data?.message ||
// //               'Failed to load product pre-order availability.'
// //           )
// //           setPreorderData(null)
// //           setSelectedVariantId('')
// //         }
// //       } finally {
// //         if (active) setLoading(false)
// //       }
// //     }

// //     loadPreorder()
// //     return () => {
// //       active = false
// //     }
// //   }, [product._id, date])

// //   const preorder = preorderData?.preorder
// //   const variant = preorderData?.variants?.find((v) => v._id === selectedVariantId)
// //   const pricing = variant?.pricing?.[fulfillment]

// //   return (
// //     <Shell title={`Pre-order: ${product.name}`} onClose={onClose}>
// //       <div style={{ display: 'grid', gap: 16 }}>
// //         <div>
// //           <label className="pv-label" htmlFor="product-preorder-date">
// //             Pre-order date
// //           </label>
// //           <input
// //             id="product-preorder-date"
// //             className="pv-input"
// //             type="date"
// //             min={getTodayIstDate()}
// //             value={date}
// //             onChange={(e) => setDate(e.target.value)}
// //           />
// //         </div>

// //         {loading ? (
// //           <div className="pv-loader">
// //             <span className="pv-spin" />
// //           </div>
// //         ) : preorder ? (
// //           <div className="pv-box">
// //             <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //               <CalendarDays size={16} />
// //               <strong>Pre-order availability</strong>
// //               <span
// //                 className={`pv-badge ${preorder.isOpen ? 'pv-badge--green' : 'pv-badge--red'}`}
// //                 style={{ marginLeft: 'auto' }}
// //               >
// //                 {preorder.isOpen ? 'Open' : 'Closed'}
// //               </span>
// //             </div>
// //             <div>
// //               Date / day:{' '}
// //               <strong>
// //                 {preorder.date} ({preorder.day})
// //               </strong>
// //             </div>
// //             <div>
// //               Opening: <strong>{preorder.openingTime || 'Not configured'}</strong>
// //             </div>
// //             <div>
// //               Closing: <strong>{preorder.closingTime || 'Not configured'}</strong>
// //             </div>
// //             {preorder.message && <small>{preorder.message}</small>}
// //           </div>
// //         ) : null}

// //         {!loading && preorderData && (
// //           <>
// //             <div>
// //               <label className="pv-label" htmlFor="product-preorder-variant">
// //                 Product option
// //               </label>
// //               <select
// //                 id="product-preorder-variant"
// //                 className="pv-select"
// //                 value={selectedVariantId}
// //                 onChange={(e) => setSelectedVariantId(e.target.value)}
// //                 disabled={!preorderData.variants?.length}
// //               >
// //                 {preorderData.variants?.length ? (
// //                   preorderData.variants.map((item) => (
// //                     <option key={item._id} value={item._id}>
// //                       {item.variant_name}
// //                     </option>
// //                   ))
// //                 ) : (
// //                   <option value="">No available product options</option>
// //                 )}
// //               </select>
// //             </div>

// //             <div className="pv-seg">
// //               <button
// //                 type="button"
// //                 className="pv-btn"
// //                 aria-pressed={fulfillment === 'pickup'}
// //                 onClick={() => setFulfillment('pickup')}
// //               >
// //                 <Store size={15} /> Pickup
// //               </button>
// //               <button
// //                 type="button"
// //                 className="pv-btn"
// //                 aria-pressed={fulfillment === 'delivery'}
// //                 onClick={() => setFulfillment('delivery')}
// //               >
// //                 <Truck size={15} /> Delivery
// //               </button>
// //             </div>

// //             <div className="pv-box">
// //               {pricing ? (
// //                 <>
// //                   <div className="pv-line">
// //                     <span>Subtotal</span>
// //                     <strong>{formatMoney(pricing.subtotal)}</strong>
// //                   </div>
// //                   <div className="pv-line">
// //                     <span>Packing charge</span>
// //                     <strong>{formatMoney(pricing.packingCharge)}</strong>
// //                   </div>
// //                   {fulfillment === 'delivery' && (
// //                     <div className="pv-line">
// //                       <span>Delivery charge</span>
// //                       <strong>{formatMoney(pricing.deliveryCharge)}</strong>
// //                     </div>
// //                   )}
// //                   <div
// //                     className="pv-line"
// //                     style={{
// //                       borderTop: '1px dashed #d6d3d1',
// //                       paddingTop: 10,
// //                       fontWeight: 800,
// //                     }}
// //                   >
// //                     <span>Total</span>
// //                     <span>{formatMoney(pricing.total)}</span>
// //                   </div>
// //                 </>
// //               ) : (
// //                 <small>Select an available product option to see pricing.</small>
// //               )}
// //             </div>
// //           </>
// //         )}

// //         <div className="pv-btns">
// //           <button type="button" className="pv-btn" onClick={onClose}>
// //             Close
// //           </button>
// //         </div>
// //       </div>
// //     </Shell>
// //   )
// // }

// // /* ───────────────────────── PRODUCTS PAGE ───────────────────────── */

// // export default function Products() {
// //   const [list, setList] = useState([])
// //   const [variantsMap, setVariantsMap] = useState({})
// //   const [categories, setCategories] = useState([])
// //   const [total, setTotal] = useState(0)
// //   const [page, setPage] = useState(1)
// //   const [loading, setLoading] = useState(true)
// //   const [search, setSearch] = useState('')
// //   const [categoryFilter, setCategoryFilter] = useState('')
// //   const [statusFilter, setStatusFilter] = useState('')
// //   const [busyId, setBusyId] = useState(null)

// //   const [formOpen, setFormOpen] = useState(false)
// //   const [editing, setEditing] = useState(null)
// //   const [preorderProduct, setPreorderProduct] = useState(null)
// //   const [confirmDelete, setConfirmDelete] = useState(null)
// //   const [deleting, setDeleting] = useState(false)

// //   const loadCats = async () => {
// //     try {
// //       const { data } = await getCategories({ status: 'active' })
// //       setCategories(sortCategories(data?.data))
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to load categories.')
// //     }
// //   }

// //   // Fetch the variants of the products currently shown in the table.
// //   const loadListVariants = async (items) => {
// //     const entries = await Promise.all(
// //       items.map(async (p) => {
// //         try {
// //           const { data } = await getVariants(p._id)
// //           return [p._id, Array.isArray(data?.data) ? data.data : []]
// //         } catch {
// //           return [p._id, []]
// //         }
// //       })
// //     )

// //     setVariantsMap((current) => ({ ...current, ...Object.fromEntries(entries) }))
// //   }

// //   const loadProducts = async () => {
// //     setLoading(true)

// //     try {
// //       const { data } = await getProducts({
// //         search,
// //         status: statusFilter,
// //         category_id: categoryFilter,
// //         page,
// //         limit: LIMIT,
// //       })

// //       const result = data?.data
// //       const items = Array.isArray(result?.products) ? result.products : []

// //       setList(items)
// //       setTotal(Number(result?.total) || 0)
// //       loadListVariants(items)
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to load products.')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   useEffect(() => {
// //     loadCats()
// //   }, [])

// //   useEffect(() => {
// //     loadProducts()
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [search, statusFilter, categoryFilter, page])

// //   const refresh = async () => {
// //     await loadProducts()
// //   }

// //   const openAdd = () => {
// //     setEditing(null)
// //     setFormOpen(true)
// //   }

// //   const openEdit = (p) => {
// //     setEditing(p)
// //     setFormOpen(true)
// //   }

// //   const toggleStatus = async (p) => {
// //     if (busyId) return
// //     setBusyId(p._id)

// //     try {
// //       await updateProductStatus(p._id, p.status === 'active' ? 'inactive' : 'active')
// //       toast.success('Status updated.')
// //       await loadProducts()
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed.')
// //     } finally {
// //       setBusyId(null)
// //     }
// //   }

// //   const toggleAvailability = async (p) => {
// //     if (busyId) return
// //     setBusyId(p._id)

// //     try {
// //       const { data } = await updateProductAvailability(p._id, !p.availability)
// //       toast.success('Availability updated.')

// //       if (data?.data?.all_variants_unavailable) {
// //         toast(
// //           'All variants are also unavailable. Customers cannot order this product.',
// //           { icon: '⚠️', duration: 5000 }
// //         )
// //       }

// //       await loadProducts()
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed.')
// //     } finally {
// //       setBusyId(null)
// //     }
// //   }

// //   const handleDelete = async () => {
// //     if (!confirmDelete || deleting) return
// //     setDeleting(true)

// //     try {
// //       await deleteProduct(confirmDelete._id)
// //       toast.success('Product deleted.')
// //       setConfirmDelete(null)

// //       if (list.length === 1 && page > 1) {
// //         setPage((n) => n - 1)
// //       } else {
// //         await loadProducts()
// //       }
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to delete.')
// //     } finally {
// //       setDeleting(false)
// //     }
// //   }

// //   // Category filter is also applied client-side in case the API ignores it.
// //   const visible = categoryFilter
// //     ? list.filter(
// //         (p) => (p.category_id?._id || p.category_id) === categoryFilter
// //       )
// //     : list

// //   return (
// //     <div className="pv-page">
// //       <style>{CSS}</style>

// //       <div className="pv-head">
// //         <div>
// //           <h2 className="pv-title">Products</h2>
// //           <p className="pv-sub">Manage your menu items</p>
// //         </div>

// //         <button type="button" className="pv-btn pv-btn--primary" onClick={openAdd}>
// //           + Add product
// //         </button>
// //       </div>

// //       <div className="pv-card">
// //         <div className="pv-filters">
// //           <input
// //             className="pv-input"
// //             placeholder="🔍 Search product"
// //             value={search}
// //             onChange={(e) => {
// //               setSearch(e.target.value)
// //               setPage(1)
// //             }}
// //           />

// //           <select
// //             className="pv-select"
// //             value={categoryFilter}
// //             onChange={(e) => {
// //               setCategoryFilter(e.target.value)
// //               setPage(1)
// //             }}
// //           >
// //             <option value="">All categories</option>
// //             {categories.map((c) => (
// //               <option key={c._id} value={c._id}>
// //                 {c.name}
// //               </option>
// //             ))}
// //           </select>

// //           <select
// //             className="pv-select"
// //             value={statusFilter}
// //             onChange={(e) => {
// //               setStatusFilter(e.target.value)
// //               setPage(1)
// //             }}
// //           >
// //             <option value="">All status</option>
// //             <option value="active">Active</option>
// //             <option value="inactive">Inactive</option>
// //           </select>
// //         </div>

// //         {loading ? (
// //           <div className="pv-loader">
// //             <span className="pv-spin" />
// //           </div>
// //         ) : (
// //           <div className="pv-wrap">
// //             <table className="pv-table">
// //               <thead>
// //                 <tr>
// //                   <th>Product</th>
// //                   <th>Category</th>
// //                   <th>Weightages</th>
// //                   <th>Available</th>
// //                   <th>Status</th>
// //                   <th>Actions</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {visible.length === 0 && (
// //                   <tr>
// //                     <td colSpan={6}>
// //                       <div className="pv-empty">No products found.</div>
// //                     </td>
// //                   </tr>
// //                 )}

// //                 {visible.map((p) => {
// //                   const productVariants = variantsMap[p._id]

// //                   return (
// //                     <tr key={p._id}>
// //                       <td>
// //                         <div className="pv-prod">
// //                           <div className="pv-thumb">
// //                             {p.image_url ? (
// //                               <img src={imgSrc(p.image_url)} alt={p.name} />
// //                             ) : (
// //                               '🍲'
// //                             )}
// //                           </div>

// //                           <div>
// //                             <div className="pv-prod-name">{p.name}</div>
// //                             {p.description && (
// //                               <div className="pv-prod-desc">{p.description}</div>
// //                             )}
// //                             {(hasKgRule(p) || hasPrepRule(p)) && (
// //                               <div className="pv-rules">
// //                                 {hasKgRule(p) && (
// //                                   <span className="pv-chip pv-chip--rule">
// //                                     Pre-order above {Number(p.preorder_above_kg)} KG
// //                                   </span>
// //                                 )}
// //                                 {hasPrepRule(p) && (
// //                                   <span className="pv-chip pv-chip--rule">
// //                                     Min {Number(p.min_prep_hours)} h prep
// //                                   </span>
// //                                 )}
// //                               </div>
// //                             )}
// //                           </div>
// //                         </div>
// //                       </td>

// //                       <td>{p.category_id?.name || '—'}</td>

// //                       <td>
// //                         {productVariants === undefined ? (
// //                           <span className="pv-prod-desc">Loading...</span>
// //                         ) : productVariants.length === 0 ? (
// //                           <span className="pv-prod-desc">No variants</span>
// //                         ) : (
// //                           <div className="pv-chips">
// //                             {sortVariants(productVariants).map((v) => {
// //                               const off = v.status !== 'active' || v.availability === false

// //                               return (
// //                                 <span
// //                                   key={v._id}
// //                                   className={`pv-chip ${off ? 'pv-chip--off' : ''}`}
// //                                   title={off ? 'Inactive or unavailable' : v.variant_name}
// //                                 >
// //                                   {v.variant_name} ·{' '}
// //                                   {Number(v.price) > 0 ? formatPrice(v.price) : 'no price'}
// //                                 </span>
// //                               )
// //                             })}
// //                           </div>
// //                         )}
// //                       </td>

// //                       <td>
// //                         <Switch
// //                           checked={!!p.availability}
// //                           label={`Availability of ${p.name}`}
// //                           disabled={busyId === p._id}
// //                           onChange={() => toggleAvailability(p)}
// //                         />
// //                       </td>

// //                       <td>
// //                         <span
// //                           className={`pv-badge ${
// //                             p.status === 'active' ? 'pv-badge--green' : 'pv-badge--red'
// //                           }`}
// //                         >
// //                           {p.status === 'active' ? 'Active' : 'Inactive'}
// //                         </span>
// //                       </td>

// //                       <td>
// //                         <div className="pv-actions">
// //                           <button
// //                             type="button"
// //                             className="pv-btn pv-btn--sm"
// //                             onClick={() => openEdit(p)}
// //                           >
// //                             Edit
// //                           </button>

// //                           <button
// //                             type="button"
// //                             className="pv-btn pv-btn--sm"
// //                             title="Pre-order details"
// //                             onClick={() => setPreorderProduct(p)}
// //                           >
// //                             <CalendarDays size={14} />
// //                           </button>

// //                           <button
// //                             type="button"
// //                             className="pv-btn pv-btn--sm"
// //                             disabled={busyId === p._id}
// //                             onClick={() => toggleStatus(p)}
// //                           >
// //                             {p.status === 'active' ? 'Deactivate' : 'Activate'}
// //                           </button>

// //                           <button
// //                             type="button"
// //                             className="pv-btn pv-btn--sm pv-btn--danger"
// //                             title="Delete"
// //                             onClick={() => setConfirmDelete(p)}
// //                           >
// //                             <Trash2 size={14} />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   )
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>
// //         )}

// //         <div className="pv-foot">
// //           <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />
// //         </div>
// //       </div>

// //       {formOpen && (
// //         <ProductFormModal
// //           key={editing?._id || 'new'}
// //           product={editing}
// //           categories={categories}
// //           onClose={() => setFormOpen(false)}
// //           onSaved={refresh}
// //         />
// //       )}

// //       {preorderProduct && (
// //         <ProductPreorderModal
// //           product={preorderProduct}
// //           onClose={() => setPreorderProduct(null)}
// //         />
// //       )}

// //       {confirmDelete && (
// //         <Shell
// //           title="Delete product"
// //           onClose={() => setConfirmDelete(null)}
// //           locked={deleting}
// //         >
// //           <p style={{ margin: '0 0 4px' }}>
// //             Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
// //           </p>
// //           <p className="pv-sub" style={{ marginBottom: 16 }}>
// //             This action cannot be undone.
// //           </p>

// //           <div className="pv-btns">
// //             <button
// //               type="button"
// //               className="pv-btn"
// //               onClick={() => setConfirmDelete(null)}
// //               disabled={deleting}
// //             >
// //               Cancel
// //             </button>

// //             <button
// //               type="button"
// //               className="pv-btn pv-btn--primary"
// //               onClick={handleDelete}
// //               disabled={deleting}
// //             >
// //               {deleting ? 'Deleting...' : 'Delete'}
// //             </button>
// //           </div>
// //         </Shell>
// //       )}
// //     </div>
// //   )
// // }
// import { useEffect, useRef, useState } from 'react'
// import { Trash2 } from 'lucide-react'
// import {
//   getProducts,
//   createProduct,
//   updateProduct,
//   updateProductStatus,
//   updateProductAvailability,
//   deleteProduct,
//   getCategories,
//   getVariants,
//   createVariant,
//   updateVariant,
//   updateVariantPrice,
//   updateVariantAvailability,
//   deleteVariant,
//   updateVariantStatus,
// } from '../../services/adminService'

// import Pagination from '../../components/ui/Pagination'
// import toast from 'react-hot-toast'

// const LIMIT = 20
// const FILE_BASE = 'http://localhost:5000'
// const MAX_IMAGE_MB = 2
// const MENU_CATEGORY_ORDER = ['curries', 'fry', 'biryani', 'specials']
// const UNITS = ['KG', 'G', 'L', 'ML', 'PCS']
// const UNIT_GROUP = { KG: 'weight', G: 'weight', L: 'volume', ML: 'volume', PCS: 'count' }

// const imgSrc = (url) => {
//   if (!url) return ''
//   return url.startsWith('http') ? url : `${FILE_BASE}${url}`
// }

// const formatPrice = (value) =>
//   `₹${Number(value ?? 0).toLocaleString('en-IN')}`

// /* order rules: weight limit and minimum preparation time */
// const hasKgRule = (p) => p?.preorder_above_kg != null && Number(p.preorder_above_kg) > 0
// const hasPrepRule = (p) => Number(p?.min_prep_hours) > 0

// /* "0.5 KG" -> quantity variant, "5 Members" -> member variant */
// const parseVariantName = (raw) => {
//   const name = String(raw || '').trim()

//   let m = name.match(/^(\d*\.?\d+)\s*(kg|g|l|ml|pcs)$/i)
//   if (m) {
//     const qty = Number(m[1])
//     const unit = m[2].toUpperCase()
//     if (!(qty > 0)) return null
//     return {
//       variant_type: 'quantity',
//       variant_name: `${qty} ${unit}`,
//       quantity_value: qty,
//       quantity_unit: unit,
//       member_count: null,
//     }
//   }

//   m = name.match(/^(\d+)\s*members?$/i)
//   if (m && Number(m[1]) > 0) {
//     const count = Number(m[1])
//     return {
//       variant_type: 'member',
//       variant_name: `${count} Members`,
//       quantity_value: 0,
//       quantity_unit: 'PCS',
//       member_count: count,
//     }
//   }

//   return null
// }

// /* same variant = same quantity+unit (or same member count) */
// const sameVariant = (v, parsed) =>
//   parsed.variant_type === 'quantity'
//     ? v.variant_type === 'quantity' &&
//       Number(v.quantity_value) === parsed.quantity_value &&
//       v.quantity_unit === parsed.quantity_unit
//     : v.variant_type === 'member' && Number(v.member_count) === parsed.member_count

// const quantityVariantKey = (variant) =>
//   `${Number(variant.quantity_value)}-${variant.quantity_unit}`

// /* quantity variants first (by unit, then size), member variants after */
// const sortVariants = (items) =>
//   [...items].sort((a, b) => {
//     if (a.variant_type !== b.variant_type) {
//       return a.variant_type === 'quantity' ? -1 : 1
//     }
//     if (a.variant_type === 'member') {
//       return Number(a.member_count) - Number(b.member_count)
//     }
//     if (a.quantity_unit !== b.quantity_unit) {
//       return String(a.quantity_unit).localeCompare(String(b.quantity_unit))
//     }
//     return Number(a.quantity_value) - Number(b.quantity_value)
//   })

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
//     const items = Array.isArray(result?.products) ? result.products : []
//     all.push(...items)

//     const total = Number(result?.total) || 0
//     if (items.length === 0 || all.length >= total || page >= 200) break
//     page += 1
//   }

//   return all
// }

// /* Adds one variant to every product. Skips products that already have it. */
// const addVariantToAllProducts = async (payload, availability) => {
//   const products = await fetchAllProducts()
//   const result = { total: products.length, added: 0, existed: 0, skipped: 0, failed: 0 }

//   const run = async (prod) => {
//     try {
//       const { data } = await getVariants(prod._id)
//       const existing = Array.isArray(data?.data) ? data.data : []

//       if (existing.some((v) => sameVariant(v, payload))) {
//         result.existed += 1
//         return
//       }

//       const res = await createVariant(prod._id, payload)
//       const newId = res?.data?.data?._id

//       if (!availability && newId) {
//         await updateVariantAvailability(newId, false)
//       }

//       result.added += 1
//     } catch {
//       result.failed += 1
//     }
//   }

//   for (let i = 0; i < products.length; i += 5) {
//     await Promise.all(products.slice(i, i + 5).map(run))
//   }

//   return result
// }

// const optimizeImage = (file) =>
//   new Promise((resolve) => {
//     const url = URL.createObjectURL(file)
//     const img = new Image()

//     img.onload = () => {
//       const max = 1200
//       const scale = Math.min(1, max / Math.max(img.width, img.height))
//       const canvas = document.createElement('canvas')
//       canvas.width = Math.round(img.width * scale)
//       canvas.height = Math.round(img.height * scale)
//       canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
//       URL.revokeObjectURL(url)

//       canvas.toBlob(
//         (blob) => {
//           if (!blob || blob.size >= file.size) return resolve(file)
//           resolve(
//             new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', {
//               type: 'image/webp',
//             })
//           )
//         },
//         'image/webp',
//         0.85
//       )
//     }

//     img.onerror = () => {
//       URL.revokeObjectURL(url)
//       resolve(file)
//     }

//     img.src = url
//   })

// const sortCategories = (items) => {
//   if (!Array.isArray(items)) return []

//   return [...items].sort((a, b) => {
//     const nameA = String(a.name || '').trim().toLowerCase()
//     const nameB = String(b.name || '').trim().toLowerCase()
//     const iA = MENU_CATEGORY_ORDER.indexOf(nameA)
//     const iB = MENU_CATEGORY_ORDER.indexOf(nameB)
//     const oA = iA === -1 ? MENU_CATEGORY_ORDER.length : iA
//     const oB = iB === -1 ? MENU_CATEGORY_ORDER.length : iB
//     if (oA !== oB) return oA - oB
//     return nameA.localeCompare(nameB)
//   })
// }

// /* ───────────────────────── STYLES ───────────────────────── */

// const CSS = `
// .pv-page{background:#f4f0e9;min-height:100%;padding:20px;color:#1c1917;font-family:inherit}
// .pv-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px}
// .pv-title{font-size:26px;font-weight:800;margin:0}
// .pv-sub{color:#78716c;font-size:14px;margin:2px 0 0}
// .pv-btn{border:1px solid #e7dfd2;background:#fff;color:#1c1917;border-radius:10px;padding:9px 14px;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
// .pv-btn:disabled{opacity:.55;cursor:not-allowed}
// .pv-btn--primary{background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;border:none}
// .pv-btn--danger{color:#dc2626}
// .pv-btn--sm{padding:7px 12px;font-size:13px}
// .pv-card{background:#fff;border:1px solid #eadfce;border-radius:16px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,.04)}
// .pv-filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
// .pv-input,.pv-select{width:100%;box-sizing:border-box;border:1px solid #e7dfd2;background:#fff;border-radius:12px;padding:12px 14px;font-size:15px;font-family:inherit;color:#1c1917;outline:none}
// .pv-input:focus,.pv-select:focus{border-color:#ea580c}
// .pv-filters .pv-input,.pv-filters .pv-select{width:auto;flex:1 1 170px}
// .pv-wrap{overflow-x:auto}
// .pv-table{width:100%;border-collapse:collapse;min-width:900px}
// .pv-table th{text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#78716c;padding:12px 8px;border-bottom:1px solid #eee6d9}
// .pv-table td{padding:14px 8px;border-bottom:1px solid #eee6d9;vertical-align:middle;font-size:14px}
// .pv-prod{display:flex;gap:12px;align-items:center}
// .pv-thumb{width:46px;height:46px;border-radius:12px;background:#fde9db;display:grid;place-items:center;font-size:22px;flex:none;overflow:hidden}
// .pv-thumb img{width:100%;height:100%;object-fit:cover}
// .pv-prod-name{font-weight:700}
// .pv-prod-desc{color:#78716c;font-size:13px;max-width:180px}
// .pv-chips{display:flex;flex-wrap:wrap;gap:5px;max-width:320px}
// .pv-chip{background:#f5efe4;border:1px solid #e7dfd2;border-radius:8px;padding:3px 8px;font-size:12px;font-weight:600;white-space:nowrap}
// .pv-chip--off{opacity:.5}
// .pv-chip--rule{background:#fde9db;border-color:#f3c3a3;color:#c2410c}
// .pv-rules{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}
// .pv-badge{display:inline-block;border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
// .pv-badge--green{background:#dcfce7;color:#15803d}
// .pv-badge--red{background:#fee2e2;color:#b91c1c}
// .pv-actions{display:flex;gap:6px;flex-wrap:wrap}
// .pv-switch{width:44px;height:26px;border-radius:999px;border:none;background:#d6d3d1;position:relative;cursor:pointer;padding:0;flex:none;transition:background .15s}
// .pv-switch::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .15s}
// .pv-switch[aria-checked="true"]{background:#15803d}
// .pv-switch[aria-checked="true"]::after{transform:translateX(18px)}
// .pv-switch:disabled{opacity:.6;cursor:not-allowed}
// .pv-empty{text-align:center;color:#78716c;padding:28px 0}
// .pv-loader{display:grid;place-items:center;padding:40px}
// .pv-spin{width:28px;height:28px;border:3px solid #eadfce;border-top-color:#ea580c;border-radius:50%;animation:pvspin .8s linear infinite}
// @keyframes pvspin{to{transform:rotate(360deg)}}
// .pv-foot{margin-top:12px}

// .pv-overlay{position:fixed;inset:0;background:rgba(28,25,23,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000}
// .pv-modal{background:#f4f0e9;border-radius:18px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;padding:20px;box-sizing:border-box}
// .pv-modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
// .pv-modal-title{font-size:22px;font-weight:800;margin:0}
// .pv-x{width:40px;height:40px;border-radius:12px;border:1px solid #e7dfd2;background:#fff;font-size:18px;cursor:pointer}
// .pv-field{margin-bottom:16px}
// .pv-label{display:block;font-size:13px;font-weight:700;color:#78716c;margin-bottom:6px}
// .pv-drop{border:2px dashed #d9b9a5;background:#fdf9f2;border-radius:18px;padding:34px 12px;text-align:center;cursor:pointer;display:grid;gap:4px;justify-items:center}
// .pv-drop--over{background:#fdeede;border-color:#ea580c}
// .pv-drop-ico{font-size:30px}
// .pv-drop-title{font-weight:800;font-size:15px}
// .pv-drop-sub{font-size:13px;color:#78716c}
// .pv-photo{position:relative;border-radius:16px;overflow:hidden;border:1px solid #e7dfd2;background:#fff}
// .pv-photo img{display:block;width:100%;max-height:200px;object-fit:cover}
// .pv-photo button{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;border:none;background:rgba(0,0,0,.6);color:#fff;cursor:pointer}
// .pv-row2{display:flex;gap:12px;align-items:flex-end}
// .pv-row2 .pv-grow{flex:1}
// .pv-toggle{display:grid;gap:6px;justify-items:center;font-size:12px;font-weight:700;color:#78716c}
// .pv-h3{font-size:17px;font-weight:800;margin:6px 0 10px}
// .pv-vhead,.pv-vrow{display:grid;grid-template-columns:1fr 108px 56px 40px;gap:8px;align-items:center}
// .pv-vhead{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#78716c;font-weight:700;margin-bottom:6px}
// .pv-vrow{margin-bottom:8px}
// .pv-vrow .pv-input{padding:11px 12px}
// .pv-price{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #e7dfd2;border-radius:12px;padding:0 10px}
// .pv-price input{border:none;outline:none;width:100%;padding:11px 0;font-size:15px;background:transparent;font-family:inherit}
// .pv-rm{width:40px;height:40px;border-radius:12px;border:1px solid #e7dfd2;background:#fff;color:#dc2626;cursor:pointer;font-size:16px}
// .pv-prev{background:#fff;border:1px solid #e7dfd2;border-radius:16px;overflow:hidden;margin-bottom:16px}
// .pv-prev-img{background:#fde9db;height:120px;display:grid;place-items:center;font-size:30px}
// .pv-prev-img img{width:100%;height:100%;object-fit:cover}
// .pv-prev-body{padding:14px 16px;display:grid;gap:6px;justify-items:start}
// .pv-prev-name{font-weight:800;font-size:16px}
// .pv-prev-desc{color:#78716c;font-size:14px}
// .pv-prev-chips{display:flex;gap:6px;flex-wrap:wrap}
// .pv-btns{display:flex;gap:10px}
// .pv-btns .pv-btn{justify-content:center;padding:14px 16px;font-size:15px}
// .pv-btns .pv-btn--primary{flex:1}
// .pv-back{border:1px solid #e7dfd2;background:#fff;border-radius:12px;padding:8px 14px;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:16px;font-family:inherit;color:#1c1917}
// .pv-segtabs{display:flex;gap:4px;background:#faf6ee;border:1px solid #eadfce;border-radius:14px;padding:4px}
// .pv-segtabs button{flex:1;border:none;background:transparent;padding:12px 8px;border-radius:10px;font-size:15px;font-weight:700;color:#78716c;cursor:pointer;font-family:inherit}
// .pv-segtabs button[aria-pressed="true"]{background:#fff;color:#c2410c;box-shadow:0 1px 4px rgba(0,0,0,.08)}
// .pv-segtabs button:disabled{cursor:not-allowed;opacity:.7}
// .pv-toggles{display:grid;grid-template-columns:1fr 1fr;gap:12px}
// .pv-toggles .pv-toggle{justify-items:start}
// .pv-vitem{background:#fff;border:1px solid #e7dfd2;border-radius:14px;padding:12px 14px;margin-bottom:10px}
// .pv-vitem-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px}
// .pv-vprice{color:#c2410c;font-weight:800;font-size:17px}
// .pv-vitem-bottom{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
// .pv-mini{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#78716c}
// .pv-vprev-row{display:flex;justify-content:space-between;align-items:baseline;width:100%}
// .pv-vprev-name{font-size:21px;font-weight:800}
// .pv-vprev-price{font-size:20px;font-weight:800;color:#c2410c}
// .pv-applyall{display:flex;justify-content:space-between;align-items:center;gap:14px;background:#fff;border:1px solid #e7dfd2;border-radius:14px;padding:12px 14px}
// .pv-applyall small{display:block;color:#78716c;font-size:12px;margin-top:2px;font-weight:500}
// `

// /* ───────────────────────── SMALL UI PIECES ───────────────────────── */

// function Switch({ checked, onChange, disabled, label }) {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       aria-label={label}
//       className="pv-switch"
//       disabled={disabled}
//       onClick={() => onChange(!checked)}
//     />
//   )
// }

// function Shell({ title, onClose, children, locked }) {
//   return (
//     <div
//       className="pv-overlay"
//       onMouseDown={(e) => {
//         if (e.target === e.currentTarget && !locked) onClose()
//       }}
//     >
//       <div className="pv-modal">
//         <div className="pv-modal-head">
//           <h3 className="pv-modal-title">{title}</h3>
//           <button
//             type="button"
//             className="pv-x"
//             onClick={() => !locked && onClose()}
//             aria-label="Close"
//           >
//             ✕
//           </button>
//         </div>
//         {children}
//       </div>
//     </div>
//   )
// }

// /* ───────────────────────── VARIANTS MODAL ───────────────────────── */

// const emptyVariantForm = (unit) => ({
//   variant_type: 'quantity',
//   quantity_value: '',
//   quantity_unit: unit,
//   member_count: '1',
//   price: '',
//   availability: true,
//   active: true,
// })

// export function VariantsModal({ product, onClose, onSaved }) {
//   const baseUnit = UNIT_GROUP[product.price_unit] ? product.price_unit : 'KG'
//   const allowedUnits = UNITS.filter((u) => UNIT_GROUP[u] === UNIT_GROUP[baseUnit])

//   const [variants, setVariants] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [view, setView] = useState('list') // 'list' | 'form'
//   const [editingV, setEditingV] = useState(null)
//   const [form, setForm] = useState(() => emptyVariantForm(baseUnit))
//   const [saving, setSaving] = useState(false)
//   const [busyId, setBusyId] = useState(null)

//   const loadVariants = async () => {
//     try {
//       const { data } = await getVariants(product._id)
//       setVariants(Array.isArray(data?.data) ? data.data : [])
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to load variants.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     setLoading(true)
//     loadVariants()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [product._id])

//   const backToList = () => {
//     setView('list')
//     setEditingV(null)
//     setForm(emptyVariantForm(baseUnit))
//   }

//   const openAdd = () => {
//     setEditingV(null)
//     setForm(emptyVariantForm(baseUnit))
//     setView('form')
//   }

//   const openEdit = (v) => {
//     setEditingV(v)
//     setForm({
//       variant_type: v.variant_type || 'quantity',
//       quantity_value: v.quantity_value > 0 ? String(v.quantity_value) : '',
//       quantity_unit: v.quantity_unit && v.quantity_unit !== 'PCS' ? v.quantity_unit : baseUnit,
//       member_count: v.member_count > 0 ? String(v.member_count) : '1',
//       price: v.price != null ? String(v.price) : '',
//       availability: v.availability !== false,
//       active: (v.status || 'active') === 'active',
//     })
//     setView('form')
//   }

//   const isQty = form.variant_type === 'quantity'

//   // What the saved variant will look like (null while the inputs are invalid).
//   const preview = isQty
//     ? Number(form.quantity_value) > 0
//       ? parseVariantName(`${Number(form.quantity_value)} ${form.quantity_unit}`)
//       : null
//     : Number.isInteger(Number(form.member_count)) && Number(form.member_count) >= 1
//       ? parseVariantName(`${Number(form.member_count)} Members`)
//       : null

//   const previewPrice = Number(form.price)
//   const hasPrice = form.price !== '' && Number.isFinite(previewPrice) && previewPrice > 0

//   const handleSave = async (e) => {
//     e.preventDefault()
//     if (saving) return

//     if (!preview) {
//       return toast.error(
//         isQty ? 'Quantity must be greater than 0.' : 'Member count must be at least 1.'
//       )
//     }

//     if (editingV && !hasPrice) return toast.error('Price must be greater than 0.')

//     const applyAll = !editingV

//     const duplicate = variants.some(
//       (v) => v._id !== editingV?._id && sameVariant(v, preview)
//     )

//     if (duplicate && !applyAll) {
//       return toast.error('This variant already exists for this product.')
//     }

//     const payload = {
//       ...preview,
//       price: editingV ? previewPrice : 0,
//       status: form.active ? 'active' : 'inactive',
//     }

//     setSaving(true)

//     try {
//       if (applyAll) {
//         const r = await addVariantToAllProducts(payload, form.availability)
//         const parts = [`Added to ${r.added} of ${r.total} products`]
//         if (r.existed) parts.push(`${r.existed} already had it`)
//         if (r.failed) parts.push(`${r.failed} failed`)

//         if (r.failed) toast.error(parts.join(' · '), { duration: 6000 })
//         else toast.success(parts.join(' · '), { duration: 5000 })
//       } else if (editingV) {
//         await updateVariant(editingV._id, payload)

//         if ((editingV.availability !== false) !== form.availability) {
//           await updateVariantAvailability(editingV._id, form.availability)
//         }

//         toast.success('Variant updated.')
//       } else {
//         const res = await createVariant(product._id, payload)
//         const newId = res?.data?.data?._id

//         if (!form.availability && newId) {
//           await updateVariantAvailability(newId, false)
//         }

//         toast.success('Variant added.')
//       }

//       await loadVariants()
//       onSaved()
//       backToList()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to save variant.')
//     } finally {
//       setSaving(false)
//     }
//   }

//   const toggleAvail = async (v) => {
//     if (busyId) return
//     setBusyId(v._id)

//     try {
//       const { data } = await updateVariantAvailability(v._id, !(v.availability !== false))
//       toast.success('Availability updated.')

//       if (data?.data?.all_variants_unavailable) {
//         toast('All variants are unavailable. Customers cannot order this product.', {
//           icon: '⚠️',
//           duration: 5000,
//         })
//       }

//       await loadVariants()
//       onSaved()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to update availability.')
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const toggleActive = async (v) => {
//     if (busyId) return
//     setBusyId(v._id)

//     try {
//       await updateVariantStatus(v._id, v.status === 'active' ? 'inactive' : 'active')
//       toast.success('Status updated.')
//       await loadVariants()
//       onSaved()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to update status.')
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const removeVariant = async (v) => {
//     if (busyId) return
//     if (!window.confirm(`Delete variant ${v.variant_name}?`)) return

//     setBusyId(v._id)

//     try {
//       await deleteVariant(v._id)
//       toast.success('Variant deleted.')
//       await loadVariants()
//       onSaved()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete variant.')
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const title =
//     view === 'list' ? `Variants — ${product.name}` : editingV ? 'Edit variant' : 'Add variant'

//   return (
//     <Shell title={title} onClose={onClose} locked={saving}>
//       <style>{CSS}</style>
//       {view === 'list' ? (
//         <>
//           {loading ? (
//             <div className="pv-loader">
//               <span className="pv-spin" />
//             </div>
//           ) : variants.length === 0 ? (
//             <div className="pv-empty">No variants yet. Add the first one.</div>
//           ) : (
//             variants.map((v) => (
//               <div className="pv-vitem" key={v._id}>
//                 <div className="pv-vitem-top">
//                   <div>
//                     <strong>{v.variant_name}</strong>
//                     <div className="pv-prod-desc">
//                       {v.variant_type === 'member'
//                         ? `${v.member_count} Members`
//                         : `${v.quantity_value} ${v.quantity_unit}`}
//                     </div>
//                   </div>
//                   <div className="pv-vprice">{formatPrice(v.price)}</div>
//                 </div>

//                 <div className="pv-vitem-bottom">
//                   <label className="pv-mini">
//                     Available
//                     <Switch
//                       checked={v.availability !== false}
//                       label={`Availability of ${v.variant_name}`}
//                       disabled={busyId === v._id}
//                       onChange={() => toggleAvail(v)}
//                     />
//                   </label>

//                   <label className="pv-mini">
//                     Active
//                     <Switch
//                       checked={v.status === 'active'}
//                       label={`Status of ${v.variant_name}`}
//                       disabled={busyId === v._id}
//                       onChange={() => toggleActive(v)}
//                     />
//                   </label>

//                   <div className="pv-actions" style={{ marginLeft: 'auto' }}>
//                     <button
//                       type="button"
//                       className="pv-btn pv-btn--sm"
//                       onClick={() => openEdit(v)}
//                     >
//                       Edit
//                     </button>

//                     <button
//                       type="button"
//                       className="pv-btn pv-btn--sm pv-btn--danger"
//                       title="Delete"
//                       disabled={busyId === v._id}
//                       onClick={() => removeVariant(v)}
//                     >
//                       <Trash2 size={14} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}

//           <div className="pv-btns" style={{ marginTop: 16 }}>
//             <button type="button" className="pv-btn pv-btn--primary" onClick={openAdd}>
//               + Add variant
//             </button>
//             <button type="button" className="pv-btn" onClick={onClose}>
//               Close
//             </button>
//           </div>
//         </>
//       ) : (
//         <form onSubmit={handleSave}>
//           <button type="button" className="pv-back" onClick={backToList} disabled={saving}>
//             ‹ {product.name}
//           </button>

//           <div className="pv-field">
//             <label className="pv-label">Variant type</label>

//             <div className="pv-segtabs">
//               <button
//                 type="button"
//                 aria-pressed={isQty}
//                 disabled={!!editingV}
//                 onClick={() => setForm({ ...form, variant_type: 'quantity' })}
//               >
//                 Quantity (KG / L...)
//               </button>

//               <button
//                 type="button"
//                 aria-pressed={!isQty}
//                 disabled={!!editingV}
//                 onClick={() => setForm({ ...form, variant_type: 'member' })}
//               >
//                 Members
//               </button>
//             </div>
//           </div>

//           {isQty ? (
//             <div className="pv-field">
//               <div className="pv-row2" style={{ alignItems: 'flex-start' }}>
//                 <div className="pv-grow">
//                   <label className="pv-label">Quantity *</label>
//                   <input
//                     className="pv-input"
//                     type="number"
//                     step="any"
//                     min="0.01"
//                     placeholder="0.5"
//                     value={form.quantity_value}
//                     onChange={(e) => setForm({ ...form, quantity_value: e.target.value })}
//                   />
//                 </div>

//                 <div style={{ width: 130 }}>
//                   <label className="pv-label">Unit</label>
//                   <select
//                     className="pv-select"
//                     value={form.quantity_unit}
//                     onChange={(e) => setForm({ ...form, quantity_unit: e.target.value })}
//                   >
//                     {allowedUnits.map((u) => (
//                       <option key={u} value={u}>
//                         {u}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="pv-field">
//               <label className="pv-label">Member count *</label>
//               <input
//                 className="pv-input"
//                 type="number"
//                 min="1"
//                 step="1"
//                 placeholder="5"
//                 value={form.member_count}
//                 onChange={(e) => setForm({ ...form, member_count: e.target.value })}
//               />
//             </div>
//           )}

//           {editingV && (
//             <div className="pv-field">
//               <label className="pv-label">Price *</label>
//               <div className="pv-price" style={{ padding: '0 14px' }}>
//                 <span>₹</span>
//                 <input
//                   type="number"
//                   min="0.01"
//                   step="0.01"
//                   placeholder="500"
//                   value={form.price}
//                   onChange={(e) => setForm({ ...form, price: e.target.value })}
//                 />
//               </div>
//             </div>
//           )}

//           {!editingV && (
//             <p className="pv-prod-desc">
//               This variant will be added to every product. Set individual prices later.
//             </p>
//           )}

//           <div className="pv-field pv-toggles">
//             <div className="pv-toggle">
//               Available
//               <Switch
//                 checked={form.availability}
//                 label="Available"
//                 onChange={(val) => setForm({ ...form, availability: val })}
//               />
//             </div>

//             <div className="pv-toggle">
//               Active
//               <Switch
//                 checked={form.active}
//                 label="Active"
//                 onChange={(val) => setForm({ ...form, active: val })}
//               />
//             </div>
//           </div>

//           <h4 className="pv-h3">Live preview</h4>

//           <div className="pv-prev">
//             <div className="pv-prev-body" style={{ width: '100%', boxSizing: 'border-box' }}>
//               <div className="pv-prev-desc">{product.name}</div>

//               <div className="pv-vprev-row">
//                 <span className="pv-vprev-name">{preview?.variant_name || 'Variant name'}</span>
//                 <span className="pv-vprev-price">
//                   {editingV && hasPrice ? `₹ ${previewPrice.toLocaleString('en-IN')}` : 'Price set later'}
//                 </span>
//               </div>

//               <span
//                 className={`pv-badge ${form.availability ? 'pv-badge--green' : 'pv-badge--red'}`}
//               >
//                 {form.availability ? 'Available' : 'Unavailable'}
//               </span>
//             </div>
//           </div>

//           <div className="pv-btns">
//             <button type="submit" className="pv-btn pv-btn--primary" disabled={saving}>
//               {saving
//                 ? 'Saving...'
//                 : editingV
//                   ? 'Save variant'
//                   : 'Add to all products'}
//             </button>

//             <button type="button" className="pv-btn" onClick={backToList} disabled={saving}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       )}
//     </Shell>
//   )
// }

// /* ───────────────────────── PRODUCT FORM MODAL ───────────────────────── */

// function ProductFormModal({ product, categories, onClose, onSaved }) {
//   const editing = !!product

//   const [name, setName] = useState(product?.name || '')
//   const [categoryId, setCategoryId] = useState(
//     product?.category_id?._id || product?.category_id || ''
//   )
//   const [description, setDescription] = useState(product?.description || '')
//   const [displayOrder, setDisplayOrder] = useState(product?.display_order ?? 0)
//   const [active, setActive] = useState((product?.status || 'active') === 'active')
//   const [available, setAvailable] = useState(
//     editing ? !!product.availability : true
//   )
//   const [preorderAboveKg, setPreorderAboveKg] = useState(
//     hasKgRule(product) ? String(product.preorder_above_kg) : ''
//   )
//   const [minPrepHours, setMinPrepHours] = useState(
//     hasPrepRule(product) ? String(product.min_prep_hours) : ''
//   )
//   const [weightageOptions, setWeightageOptions] = useState([])
//   const [originalVariants, setOriginalVariants] = useState([])
//   const [selectedWeightages, setSelectedWeightages] = useState([])
//   const [weightagePrices, setWeightagePrices] = useState({})
//   const [loadingWeightages, setLoadingWeightages] = useState(true)

//   const [imageFile, setImageFile] = useState(null)
//   const [imagePreview, setImagePreview] = useState(
//     product?.image_url ? imgSrc(product.image_url) : ''
//   )
//   const [dragOver, setDragOver] = useState(false)
//   const [saving, setSaving] = useState(false)

//   const fileRef = useRef()
//   const previewUrlRef = useRef('')

//   const clearPreviewUrl = () => {
//     if (previewUrlRef.current) {
//       URL.revokeObjectURL(previewUrlRef.current)
//       previewUrlRef.current = ''
//     }
//   }

//   useEffect(() => () => clearPreviewUrl(), [])

//   useEffect(() => {
//     let active_ = true

//     const loadWeightages = async () => {
//       setLoadingWeightages(true)

//       try {
//         const allProducts = await fetchAllProducts()
//         const variantsByProduct = await Promise.all(
//           allProducts.map(async (item) => {
//             const { data } = await getVariants(item._id)
//             return {
//               productId: item._id,
//               variants: Array.isArray(data?.data) ? data.data : [],
//             }
//           })
//         )

//         if (!active_) return

//         const allVariants = variantsByProduct.flatMap(({ variants }) => variants)
//         const uniqueWeightages = new Map()

//         allVariants
//           .filter(
//             (variant) =>
//               variant.variant_type === 'quantity' &&
//               Number(variant.quantity_value) > 0 &&
//               UNIT_GROUP[variant.quantity_unit]
//           )
//           .forEach((variant) => {
//             const key = quantityVariantKey(variant)
//             if (!uniqueWeightages.has(key)) {
//               uniqueWeightages.set(key, {
//                 key,
//                 variant_type: 'quantity',
//                 variant_name: `${Number(variant.quantity_value)} ${variant.quantity_unit}`,
//                 quantity_value: Number(variant.quantity_value),
//                 quantity_unit: variant.quantity_unit,
//               })
//             }
//           })

//         const options = Array.from(uniqueWeightages.values()).sort((a, b) =>
//           a.quantity_unit === b.quantity_unit
//             ? a.quantity_value - b.quantity_value
//             : a.quantity_unit.localeCompare(b.quantity_unit)
//         )
//         const currentVariants =
//           variantsByProduct.find(({ productId }) => productId === product?._id)?.variants || []
//         const currentQuantityVariants = currentVariants.filter(
//           (variant) => variant.variant_type === 'quantity'
//         )

//         setWeightageOptions(options)
//         setOriginalVariants(currentVariants)
//         setSelectedWeightages(
//           currentQuantityVariants.map(quantityVariantKey)
//         )
//         setWeightagePrices(
//           Object.fromEntries(
//             currentQuantityVariants.map((variant) => [
//               quantityVariantKey(variant),
//               Number(variant.price) > 0 ? String(variant.price) : '',
//             ])
//           )
//         )
//       } catch (err) {
//         if (active_) {
//           toast.error(
//             err.response?.data?.message || 'Failed to load product weightages.'
//           )
//         }
//       } finally {
//         if (active_) setLoadingWeightages(false)
//       }
//     }

//     loadWeightages()

//     return () => {
//       active_ = false
//     }
//   }, [product?._id])

//   const acceptFile = async (file) => {
//     if (!file) return

//     const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

//     if (!allowed.includes(file.type)) {
//       toast.error('Only JPG, PNG, WEBP allowed.')
//       return
//     }

//     if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
//       toast.error(`Max ${MAX_IMAGE_MB} MB allowed.`)
//       return
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

//   const kgRaw = String(preorderAboveKg).trim()
//   const prepRaw = String(minPrepHours).trim()
//   const previewKgRule = kgRaw !== '' && Number(kgRaw) > 0
//   const previewPrepRule = prepRaw !== '' && Number(prepRaw) > 0

//   const handleSave = async (e) => {
//     e.preventDefault()
//     if (saving) return

//     if (!name.trim()) return toast.error('Name is required.')
//     if (!categoryId) return toast.error('Category is required.')

//     if (kgRaw !== '' && !(Number(kgRaw) > 0)) {
//       return toast.error('Pre-order limit must be greater than 0 KG, or leave it empty.')
//     }

//     if (prepRaw !== '' && !(Number(prepRaw) >= 0)) {
//       return toast.error('Minimum preparation time cannot be negative.')
//     }

//     // Empty price = not set yet (allowed). Anything typed must be greater than 0.
//     for (const key of selectedWeightages) {
//       const raw = weightagePrices[key]
//       if (raw === undefined || raw === '') continue
//       const price = Number(raw)
//       if (!Number.isFinite(price) || price <= 0) {
//         return toast.error('Variant prices must be greater than 0.')
//       }
//     }

//     setSaving(true)

//     try {
//       const fd = new FormData()
//       fd.append('name', name.trim())
//       fd.append('category_id', categoryId)
//       fd.append('description', description || '')
//       fd.append('display_order', String(Math.max(0, Number(displayOrder) || 0)))
//       fd.append('status', active ? 'active' : 'inactive')
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
//         throw new Error('Product was saved, but its variants could not be linked.')
//       }

//       const selectedKeys = new Set(selectedWeightages)
//       const originalQuantityVariants = originalVariants.filter(
//         (variant) => variant.variant_type === 'quantity'
//       )

//       for (const variant of originalQuantityVariants) {
//         if (!selectedKeys.has(quantityVariantKey(variant))) {
//           await deleteVariant(variant._id)
//         }
//       }

//       for (const weightage of weightageOptions) {
//         if (!selectedKeys.has(weightage.key)) continue

//         const existing = originalQuantityVariants.find(
//           (variant) => quantityVariantKey(variant) === weightage.key
//         )
//         const priceValue = weightagePrices[weightage.key]

//         if (existing) {
//           const newPrice =
//             priceValue === '' || priceValue === undefined
//               ? Number(existing.price)
//               : Number(priceValue)
//           if (newPrice > 0 && newPrice !== Number(existing.price)) {
//             await updateVariantPrice(existing._id, newPrice)
//           }
//         } else {
//           await createVariant(productId, {
//             variant_type: 'quantity',
//             variant_name: weightage.variant_name,
//             quantity_value: weightage.quantity_value,
//             quantity_unit: weightage.quantity_unit,
//             member_count: null,
//             price: priceValue === '' || priceValue === undefined ? 0 : Number(priceValue),
//             status: 'active',
//           })
//         }
//       }

//       toast.success(editing ? 'Product updated.' : 'Product created.')
//       onSaved()
//       onClose()
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || 'Failed to save.')
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <Shell
//       title={editing ? 'Edit product' : 'Add product'}
//       onClose={onClose}
//       locked={saving}
//     >
//       <form onSubmit={handleSave}>
//         <div className="pv-field">
//           <label className="pv-label">Product name *</label>
//           <input
//             className="pv-input"
//             placeholder="e.g. Chicken Curry"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         <div className="pv-field">
//           <label className="pv-label">Category *</label>
//           <select
//             className="pv-select"
//             value={categoryId}
//             onChange={(e) => setCategoryId(e.target.value)}
//           >
//             <option value="">Select category...</option>
//             {categories.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//           {categories.length === 0 && (
//             <small style={{ color: '#dc2626' }}>
//               No active categories found. Create or activate categories first.
//             </small>
//           )}
//         </div>

//         <div className="pv-field">
//           <label className="pv-label">Description</label>
//           <input
//             className="pv-input"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//           />
//         </div>

//         <div className="pv-field">
//           <label className="pv-label">
//             Photo (JPG, PNG, WEBP · max {MAX_IMAGE_MB} MB)
//           </label>

//           {imagePreview ? (
//             <div className="pv-photo">
//               <img src={imagePreview} alt="preview" />
//               <button type="button" onClick={removeImage} title="Remove photo">
//                 ✕
//               </button>
//             </div>
//           ) : (
//             <div
//               className={`pv-drop ${dragOver ? 'pv-drop--over' : ''}`}
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
//               <span className="pv-drop-ico">📷</span>
//               <span className="pv-drop-title">Click or drag a photo here</span>
//               <span className="pv-drop-sub">
//                 Optimized automatically · live preview below
//               </span>
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

//         <div className="pv-field">
//           <div className="pv-row2">
//             <div className="pv-grow">
//               <label className="pv-label">Display order</label>
//               <input
//                 className="pv-input"
//                 type="number"
//                 min={0}
//                 value={displayOrder}
//                 onChange={(e) =>
//                   setDisplayOrder(Math.max(0, Number(e.target.value) || 0))
//                 }
//               />
//             </div>

//             <div className="pv-toggle">
//               Active
//               <Switch checked={active} onChange={setActive} label="Active" />
//             </div>

//             <div className="pv-toggle">
//               Available
//               <Switch checked={available} onChange={setAvailable} label="Available" />
//             </div>
//           </div>
//         </div>

//         <h4 className="pv-h3">Order rules</h4>

//         <div className="pv-field">
//           <div className="pv-row2" style={{ alignItems: 'flex-start' }}>
//             <div className="pv-grow">
//               <label className="pv-label" htmlFor="pv-preorder-kg">
//                 Pre-order above (KG)
//               </label>
//               <input
//                 id="pv-preorder-kg"
//                 className="pv-input"
//                 type="number"
//                 min="0"
//                 step="any"
//                 placeholder="e.g. 5"
//                 value={preorderAboveKg}
//                 onChange={(e) => setPreorderAboveKg(e.target.value)}
//               />
//             </div>

//             <div className="pv-grow">
//               <label className="pv-label" htmlFor="pv-prep-hours">
//                 Min preparation time (hours)
//               </label>
//               <input
//                 id="pv-prep-hours"
//                 className="pv-input"
//                 type="number"
//                 min="0"
//                 step="any"
//                 placeholder="e.g. 2"
//                 value={minPrepHours}
//                 onChange={(e) => setMinPrepHours(e.target.value)}
//               />
//             </div>
//           </div>

//           <small
//             className="pv-prod-desc"
//             style={{ display: 'block', marginTop: 8, maxWidth: 'none' }}
//           >
//             Orders above the KG limit must be placed as pre-orders. The preparation time is the
//             minimum gap between ordering and pickup/delivery. Leave empty for no rule. Changes
//             apply to the next order.
//           </small>
//         </div>

//         <h4 className="pv-h3">Weightages &amp; prices</h4>
//         {loadingWeightages ? (
//           <div className="pv-loader">
//             <span className="pv-spin" />
//           </div>
//         ) : weightageOptions.length === 0 ? (
//           <p className="pv-prod-desc">
//             No weightages exist yet. Create one on the Weightage page first.
//           </p>
//         ) : (
//           <>
//             <div
//               style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
//                 gap: 8,
//               }}
//             >
//               {weightageOptions.map((weightage) => {
//                 const checked = selectedWeightages.includes(weightage.key)
//                 return (
//                   <label
//                     key={weightage.key}
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 8,
//                       border: '1px solid #e7dfd2',
//                       borderRadius: 8,
//                       padding: '8px 10px',
//                       background: checked ? '#f0fdf4' : '#fff',
//                     }}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={checked}
//                       disabled={saving}
//                       onChange={(event) =>
//                         setSelectedWeightages((current) =>
//                           event.target.checked
//                             ? [...current, weightage.key]
//                             : current.filter((key) => key !== weightage.key)
//                         )
//                       }
//                     />
//                     <strong style={{ minWidth: 62 }}>{weightage.variant_name}</strong>
//                     <div className="pv-price" style={{ padding: '0 8px' }}>
//                       <span>₹</span>
//                       <input
//                         type="number"
//                         min="0.01"
//                         step="0.01"
//                         placeholder="Price"
//                         aria-label={`Price for ${weightage.variant_name}`}
//                         value={weightagePrices[weightage.key] ?? ''}
//                         disabled={!checked || saving}
//                         onChange={(event) =>
//                           setWeightagePrices((current) => ({
//                             ...current,
//                             [weightage.key]: event.target.value,
//                           }))
//                         }
//                       />
//                     </div>
//                   </label>
//                 )
//               })}
//             </div>
//             <small className="pv-prod-desc" style={{ display: 'block', marginTop: 8 }}>
//               Select the weightages for this product and set their prices. New selections
//               and price changes are saved with the product.
//             </small>
//           </>
//         )}

//         <h4 className="pv-h3" style={{ marginTop: 18 }}>
//           Live preview
//         </h4>

//         <div className="pv-prev">
//           <div className="pv-prev-img">
//             {imagePreview ? <img src={imagePreview} alt="" /> : '🍲'}
//           </div>

//           <div className="pv-prev-body">
//             <div className="pv-prev-name">{name.trim() || 'Product name'}</div>
//             <div className="pv-prev-desc">{description.trim() || 'Description'}</div>

//             <span
//               className={`pv-badge ${available ? 'pv-badge--green' : 'pv-badge--red'}`}
//             >
//               {available ? 'Available' : 'Unavailable'}
//             </span>

//             {(previewKgRule || previewPrepRule) && (
//               <div className="pv-prev-chips">
//                 {previewKgRule && (
//                   <span className="pv-chip pv-chip--rule">Pre-order above {Number(kgRaw)} KG</span>
//                 )}
//                 {previewPrepRule && (
//                   <span className="pv-chip pv-chip--rule">Min {Number(prepRaw)} h preparation</span>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="pv-btns">
//           <button
//             type="submit"
//             className="pv-btn pv-btn--primary"
//             disabled={saving || categories.length === 0}
//           >
//             {saving ? 'Saving...' : 'Save product'}
//           </button>

//           <button
//             type="button"
//             className="pv-btn"
//             onClick={onClose}
//             disabled={saving}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </Shell>
//   )
// }

// /* ───────────────────────── PRODUCTS PAGE ───────────────────────── */

// export default function Products() {
//   const [list, setList] = useState([])
//   const [variantsMap, setVariantsMap] = useState({})
//   const [categories, setCategories] = useState([])
//   const [total, setTotal] = useState(0)
//   const [page, setPage] = useState(1)
//   const [loading, setLoading] = useState(true)
//   const [search, setSearch] = useState('')
//   const [categoryFilter, setCategoryFilter] = useState('')
//   const [statusFilter, setStatusFilter] = useState('')
//   const [busyId, setBusyId] = useState(null)

//   const [formOpen, setFormOpen] = useState(false)
//   const [editing, setEditing] = useState(null)
//   const [confirmDelete, setConfirmDelete] = useState(null)
//   const [deleting, setDeleting] = useState(false)

//   const loadCats = async () => {
//     try {
//       const { data } = await getCategories({ status: 'active' })
//       setCategories(sortCategories(data?.data))
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to load categories.')
//     }
//   }

//   // Fetch the variants of the products currently shown in the table.
//   const loadListVariants = async (items) => {
//     const entries = await Promise.all(
//       items.map(async (p) => {
//         try {
//           const { data } = await getVariants(p._id)
//           return [p._id, Array.isArray(data?.data) ? data.data : []]
//         } catch {
//           return [p._id, []]
//         }
//       })
//     )

//     setVariantsMap((current) => ({ ...current, ...Object.fromEntries(entries) }))
//   }

//   const loadProducts = async () => {
//     setLoading(true)

//     try {
//       const { data } = await getProducts({
//         search,
//         status: statusFilter,
//         category_id: categoryFilter,
//         page,
//         limit: LIMIT,
//       })

//       const result = data?.data
//       const items = Array.isArray(result?.products) ? result.products : []

//       setList(items)
//       setTotal(Number(result?.total) || 0)
//       loadListVariants(items)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to load products.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     loadCats()
//   }, [])

//   useEffect(() => {
//     loadProducts()
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search, statusFilter, categoryFilter, page])

//   const refresh = async () => {
//     await loadProducts()
//   }

//   const openAdd = () => {
//     setEditing(null)
//     setFormOpen(true)
//   }

//   const openEdit = (p) => {
//     setEditing(p)
//     setFormOpen(true)
//   }

//   const toggleStatus = async (p) => {
//     if (busyId) return
//     setBusyId(p._id)

//     try {
//       await updateProductStatus(p._id, p.status === 'active' ? 'inactive' : 'active')
//       toast.success('Status updated.')
//       await loadProducts()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed.')
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const toggleAvailability = async (p) => {
//     if (busyId) return
//     setBusyId(p._id)

//     try {
//       const { data } = await updateProductAvailability(p._id, !p.availability)
//       toast.success('Availability updated.')

//       if (data?.data?.all_variants_unavailable) {
//         toast(
//           'All variants are also unavailable. Customers cannot order this product.',
//           { icon: '⚠️', duration: 5000 }
//         )
//       }

//       await loadProducts()
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed.')
//     } finally {
//       setBusyId(null)
//     }
//   }

//   const handleDelete = async () => {
//     if (!confirmDelete || deleting) return
//     setDeleting(true)

//     try {
//       await deleteProduct(confirmDelete._id)
//       toast.success('Product deleted.')
//       setConfirmDelete(null)

//       if (list.length === 1 && page > 1) {
//         setPage((n) => n - 1)
//       } else {
//         await loadProducts()
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to delete.')
//     } finally {
//       setDeleting(false)
//     }
//   }

//   // Category filter is also applied client-side in case the API ignores it.
//   const visible = categoryFilter
//     ? list.filter(
//         (p) => (p.category_id?._id || p.category_id) === categoryFilter
//       )
//     : list

//   return (
//     <div className="pv-page">
//       <style>{CSS}</style>

//       <div className="pv-head">
//         <div>
//           <h2 className="pv-title">Products</h2>
//           <p className="pv-sub">Manage your menu items</p>
//         </div>

//         <button type="button" className="pv-btn pv-btn--primary" onClick={openAdd}>
//           + Add product
//         </button>
//       </div>

//       <div className="pv-card">
//         <div className="pv-filters">
//           <input
//             className="pv-input"
//             placeholder="🔍 Search product"
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value)
//               setPage(1)
//             }}
//           />

//           <select
//             className="pv-select"
//             value={categoryFilter}
//             onChange={(e) => {
//               setCategoryFilter(e.target.value)
//               setPage(1)
//             }}
//           >
//             <option value="">All categories</option>
//             {categories.map((c) => (
//               <option key={c._id} value={c._id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>

//           <select
//             className="pv-select"
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value)
//               setPage(1)
//             }}
//           >
//             <option value="">All status</option>
//             <option value="active">Active</option>
//             <option value="inactive">Inactive</option>
//           </select>
//         </div>

//         {loading ? (
//           <div className="pv-loader">
//             <span className="pv-spin" />
//           </div>
//         ) : (
//           <div className="pv-wrap">
//             <table className="pv-table">
//               <thead>
//                 <tr>
//                   <th>Product</th>
//                   <th>Category</th>
//                   <th>Weightages</th>
//                   <th>Available</th>
//                   <th>Status</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {visible.length === 0 && (
//                   <tr>
//                     <td colSpan={6}>
//                       <div className="pv-empty">No products found.</div>
//                     </td>
//                   </tr>
//                 )}

//                 {visible.map((p) => {
//                   const productVariants = variantsMap[p._id]

//                   return (
//                     <tr key={p._id}>
//                       <td>
//                         <div className="pv-prod">
//                           <div className="pv-thumb">
//                             {p.image_url ? (
//                               <img src={imgSrc(p.image_url)} alt={p.name} />
//                             ) : (
//                               '🍲'
//                             )}
//                           </div>

//                           <div>
//                             <div className="pv-prod-name">{p.name}</div>
//                             {p.description && (
//                               <div className="pv-prod-desc">{p.description}</div>
//                             )}
//                             {(hasKgRule(p) || hasPrepRule(p)) && (
//                               <div className="pv-rules">
//                                 {hasKgRule(p) && (
//                                   <span className="pv-chip pv-chip--rule">
//                                     Pre-order above {Number(p.preorder_above_kg)} KG
//                                   </span>
//                                 )}
//                                 {hasPrepRule(p) && (
//                                   <span className="pv-chip pv-chip--rule">
//                                     Min {Number(p.min_prep_hours)} h prep
//                                   </span>
//                                 )}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       </td>

//                       <td>{p.category_id?.name || '—'}</td>

//                       <td>
//                         {productVariants === undefined ? (
//                           <span className="pv-prod-desc">Loading...</span>
//                         ) : productVariants.length === 0 ? (
//                           <span className="pv-prod-desc">No variants</span>
//                         ) : (
//                           <div className="pv-chips">
//                             {sortVariants(productVariants).map((v) => {
//                               const off = v.status !== 'active' || v.availability === false

//                               return (
//                                 <span
//                                   key={v._id}
//                                   className={`pv-chip ${off ? 'pv-chip--off' : ''}`}
//                                   title={off ? 'Inactive or unavailable' : v.variant_name}
//                                 >
//                                   {v.variant_name} ·{' '}
//                                   {Number(v.price) > 0 ? formatPrice(v.price) : 'no price'}
//                                 </span>
//                               )
//                             })}
//                           </div>
//                         )}
//                       </td>

//                       <td>
//                         <Switch
//                           checked={!!p.availability}
//                           label={`Availability of ${p.name}`}
//                           disabled={busyId === p._id}
//                           onChange={() => toggleAvailability(p)}
//                         />
//                       </td>

//                       <td>
//                         <span
//                           className={`pv-badge ${
//                             p.status === 'active' ? 'pv-badge--green' : 'pv-badge--red'
//                           }`}
//                         >
//                           {p.status === 'active' ? 'Active' : 'Inactive'}
//                         </span>
//                       </td>

//                       <td>
//                         <div className="pv-actions">
//                           <button
//                             type="button"
//                             className="pv-btn pv-btn--sm"
//                             onClick={() => openEdit(p)}
//                           >
//                             Edit
//                           </button>

//                           <button
//                             type="button"
//                             className="pv-btn pv-btn--sm"
//                             disabled={busyId === p._id}
//                             onClick={() => toggleStatus(p)}
//                           >
//                             {p.status === 'active' ? 'Deactivate' : 'Activate'}
//                           </button>

//                           <button
//                             type="button"
//                             className="pv-btn pv-btn--sm pv-btn--danger"
//                             title="Delete"
//                             onClick={() => setConfirmDelete(p)}
//                           >
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}

//         <div className="pv-foot">
//           <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />
//         </div>
//       </div>

//       {formOpen && (
//         <ProductFormModal
//           key={editing?._id || 'new'}
//           product={editing}
//           categories={categories}
//           onClose={() => setFormOpen(false)}
//           onSaved={refresh}
//         />
//       )}

//       {confirmDelete && (
//         <Shell
//           title="Delete product"
//           onClose={() => setConfirmDelete(null)}
//           locked={deleting}
//         >
//           <p style={{ margin: '0 0 4px' }}>
//             Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
//           </p>
//           <p className="pv-sub" style={{ marginBottom: 16 }}>
//             This action cannot be undone.
//           </p>

//           <div className="pv-btns">
//             <button
//               type="button"
//               className="pv-btn"
//               onClick={() => setConfirmDelete(null)}
//               disabled={deleting}
//             >
//               Cancel
//             </button>

//             <button
//               type="button"
//               className="pv-btn pv-btn--primary"
//               onClick={handleDelete}
//               disabled={deleting}
//             >
//               {deleting ? 'Deleting...' : 'Delete'}
//             </button>
//           </div>
//         </Shell>
//       )}
//     </div>
//   )
// }
import { useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  getProducts,
  createProduct,
  updateProduct,
  updateProductStatus,
  updateProductAvailability,
  deleteProduct,
  getCategories,
  getVariants,
  createVariant,
  updateVariant,
  updateVariantPrice,
  updateVariantAvailability,
  deleteVariant,
  updateVariantStatus,
} from '../../services/adminService'

import Pagination from '../../components/ui/Pagination'
import toast from 'react-hot-toast'

const LIMIT = 20
const FILE_BASE = 'http://localhost:5000'
const MAX_IMAGE_MB = 2
const MENU_CATEGORY_ORDER = ['curries', 'fry', 'biryani', 'hundi', 'specials']
const UNITS = ['KG', 'G', 'L', 'ML', 'PCS']
const UNIT_GROUP = { KG: 'weight', G: 'weight', L: 'volume', ML: 'volume', PCS: 'count' }

/* sizes shown as chips even before any product uses them */
const WEIGHT_PRESETS = [0.25, 0.5, 1, 1.5, 2, 5, 10, 15] // KG
const PEOPLE_PRESETS = [5, 10, 15, 20, 25, 50, 100] // members

const imgSrc = (url) => {
  if (!url) return ''
  return url.startsWith('http') ? url : `${FILE_BASE}${url}`
}

const formatPrice = (value) =>
  `₹${Number(value ?? 0).toLocaleString('en-IN')}`

/* order rules: weight limit and minimum preparation time */
const hasKgRule = (p) => p?.preorder_above_kg != null && Number(p.preorder_above_kg) > 0
const hasPrepRule = (p) => Number(p?.min_prep_hours) > 0

/* "0.5 KG" -> quantity variant, "5 Members" -> member variant */
const parseVariantName = (raw) => {
  const name = String(raw || '').trim()

  let m = name.match(/^(\d*\.?\d+)\s*(kg|g|l|ml|pcs)$/i)
  if (m) {
    const qty = Number(m[1])
    const unit = m[2].toUpperCase()
    if (!(qty > 0)) return null
    return {
      variant_type: 'quantity',
      variant_name: `${qty} ${unit}`,
      quantity_value: qty,
      quantity_unit: unit,
      member_count: null,
    }
  }

  m = name.match(/^(\d+)\s*members?$/i)
  if (m && Number(m[1]) > 0) {
    const count = Number(m[1])
    return {
      variant_type: 'member',
      variant_name: `${count} Members`,
      quantity_value: 0,
      quantity_unit: 'PCS',
      member_count: count,
    }
  }

  return null
}

/* same variant = same quantity+unit (or same member count) */
const sameVariant = (v, parsed) =>
  parsed.variant_type === 'quantity'
    ? v.variant_type === 'quantity' &&
      Number(v.quantity_value) === parsed.quantity_value &&
      v.quantity_unit === parsed.quantity_unit
    : v.variant_type === 'member' && Number(v.member_count) === parsed.member_count

/* one key for both kinds: q-0.5-KG  /  m-5 */
const variantKey = (v) =>
  v.variant_type === 'member'
    ? `m-${Number(v.member_count)}`
    : `q-${Number(v.quantity_value)}-${v.quantity_unit}`

/* quantity variants first (by unit, then size), member variants after */
const sortVariants = (items) =>
  [...items].sort((a, b) => {
    if (a.variant_type !== b.variant_type) {
      return a.variant_type === 'quantity' ? -1 : 1
    }
    if (a.variant_type === 'member') {
      return Number(a.member_count) - Number(b.member_count)
    }
    if (a.quantity_unit !== b.quantity_unit) {
      return String(a.quantity_unit).localeCompare(String(b.quantity_unit))
    }
    return Number(a.quantity_value) - Number(b.quantity_value)
  })

/* builds the chip list for one tab (weight / people) */
const buildSizeOptions = (mode, allVariants) => {
  const map = new Map()

  const add = (parsed) => {
    if (!parsed) return
    const key = variantKey(parsed)
    if (!map.has(key)) map.set(key, { key, ...parsed })
  }

  if (mode === 'weight') {
    WEIGHT_PRESETS.forEach((n) => add(parseVariantName(`${n} KG`)))
    allVariants
      .filter(
        (v) =>
          v.variant_type === 'quantity' &&
          Number(v.quantity_value) > 0 &&
          UNIT_GROUP[v.quantity_unit]
      )
      .forEach((v) => add(parseVariantName(`${Number(v.quantity_value)} ${v.quantity_unit}`)))
  } else {
    PEOPLE_PRESETS.forEach((n) => add(parseVariantName(`${n} Members`)))
    allVariants
      .filter((v) => v.variant_type === 'member' && Number(v.member_count) > 0)
      .forEach((v) => add(parseVariantName(`${Number(v.member_count)} Members`)))
  }

  return Array.from(map.values()).sort((a, b) => {
    if (mode === 'people') return a.member_count - b.member_count
    if (a.quantity_unit !== b.quantity_unit) {
      return UNITS.indexOf(a.quantity_unit) - UNITS.indexOf(b.quantity_unit)
    }
    return a.quantity_value - b.quantity_value
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
    const items = Array.isArray(result?.products) ? result.products : []
    all.push(...items)

    const total = Number(result?.total) || 0
    if (items.length === 0 || all.length >= total || page >= 200) break
    page += 1
  }

  return all
}

/* Adds one variant to every product. Skips products that already have it. */
const addVariantToAllProducts = async (payload, availability) => {
  const products = await fetchAllProducts()
  const result = { total: products.length, added: 0, existed: 0, skipped: 0, failed: 0 }

  const run = async (prod) => {
    try {
      const { data } = await getVariants(prod._id)
      const existing = Array.isArray(data?.data) ? data.data : []

      if (existing.some((v) => sameVariant(v, payload))) {
        result.existed += 1
        return
      }

      const res = await createVariant(prod._id, payload)
      const newId = res?.data?.data?._id

      if (!availability && newId) {
        await updateVariantAvailability(newId, false)
      }

      result.added += 1
    } catch {
      result.failed += 1
    }
  }

  for (let i = 0; i < products.length; i += 5) {
    await Promise.all(products.slice(i, i + 5).map(run))
  }

  return result
}

const optimizeImage = (file) =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      const max = 1200
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) return resolve(file)
          resolve(
            new File([blob], file.name.replace(/\.\w+$/, '') + '.webp', {
              type: 'image/webp',
            })
          )
        },
        'image/webp',
        0.85
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(file)
    }

    img.src = url
  })

const sortCategories = (items) => {
  if (!Array.isArray(items)) return []

  return [...items].sort((a, b) => {
    const nameA = String(a.name || '').trim().toLowerCase()
    const nameB = String(b.name || '').trim().toLowerCase()
    const iA = MENU_CATEGORY_ORDER.indexOf(nameA)
    const iB = MENU_CATEGORY_ORDER.indexOf(nameB)
    const oA = iA === -1 ? MENU_CATEGORY_ORDER.length : iA
    const oB = iB === -1 ? MENU_CATEGORY_ORDER.length : iB
    if (oA !== oB) return oA - oB
    return nameA.localeCompare(nameB)
  })
}

/* ───────────────────────── STYLES ───────────────────────── */

const CSS = `
.pv-page{background:#f4f0e9;min-height:100%;padding:20px;color:#1c1917;font-family:inherit}
.pv-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px}
.pv-title{font-size:26px;font-weight:800;margin:0}
.pv-sub{color:#78716c;font-size:14px;margin:2px 0 0}
.pv-btn{border:1px solid #e7dfd2;background:#fff;color:#1c1917;border-radius:10px;padding:9px 14px;font-size:14px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;white-space:nowrap}
.pv-btn:disabled{opacity:.55;cursor:not-allowed}
.pv-btn--primary{background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;border:none}
.pv-btn--danger{color:#dc2626}
.pv-btn--sm{padding:7px 12px;font-size:13px}
.pv-card{background:#fff;border:1px solid #eadfce;border-radius:16px;padding:16px;box-shadow:0 2px 10px rgba(0,0,0,.04)}
.pv-filters{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.pv-input,.pv-select{width:100%;box-sizing:border-box;border:1px solid #e7dfd2;background:#fff;border-radius:12px;padding:12px 14px;font-size:15px;font-family:inherit;color:#1c1917;outline:none}
.pv-input:focus,.pv-select:focus{border-color:#ea580c}
.pv-filters .pv-input,.pv-filters .pv-select{width:auto;flex:1 1 170px}
.pv-wrap{overflow-x:auto}
.pv-table{width:100%;border-collapse:collapse;min-width:900px}
.pv-table th{text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#78716c;padding:12px 8px;border-bottom:1px solid #eee6d9}
.pv-table td{padding:14px 8px;border-bottom:1px solid #eee6d9;vertical-align:middle;font-size:14px}
.pv-prod{display:flex;gap:12px;align-items:center}
.pv-thumb{width:46px;height:46px;border-radius:12px;background:#fde9db;display:grid;place-items:center;font-size:22px;flex:none;overflow:hidden}
.pv-thumb img{width:100%;height:100%;object-fit:cover}
.pv-prod-name{font-weight:700}
.pv-prod-desc{color:#78716c;font-size:13px;max-width:180px}
.pv-chips{display:flex;flex-wrap:wrap;gap:5px;max-width:320px}
.pv-chip{background:#f5efe4;border:1px solid #e7dfd2;border-radius:8px;padding:3px 8px;font-size:12px;font-weight:600;white-space:nowrap}
.pv-chip--off{opacity:.5}
.pv-chip--rule{background:#fde9db;border-color:#f3c3a3;color:#c2410c}
.pv-rules{display:flex;flex-wrap:wrap;gap:4px;margin-top:5px}
.pv-badge{display:inline-block;border-radius:999px;padding:3px 10px;font-size:12px;font-weight:700}
.pv-badge--green{background:#dcfce7;color:#15803d}
.pv-badge--red{background:#fee2e2;color:#b91c1c}
.pv-actions{display:flex;gap:6px;flex-wrap:wrap}
.pv-switch{width:44px;height:26px;border-radius:999px;border:none;background:#d6d3d1;position:relative;cursor:pointer;padding:0;flex:none;transition:background .15s}
.pv-switch::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .15s}
.pv-switch[aria-checked="true"]{background:#15803d}
.pv-switch[aria-checked="true"]::after{transform:translateX(18px)}
.pv-switch:disabled{opacity:.6;cursor:not-allowed}
.pv-empty{text-align:center;color:#78716c;padding:28px 0}
.pv-loader{display:grid;place-items:center;padding:40px}
.pv-spin{width:28px;height:28px;border:3px solid #eadfce;border-top-color:#ea580c;border-radius:50%;animation:pvspin .8s linear infinite}
@keyframes pvspin{to{transform:rotate(360deg)}}
.pv-foot{margin-top:12px}

.pv-overlay{position:fixed;inset:0;background:rgba(28,25,23,.45);display:flex;align-items:center;justify-content:center;padding:16px;z-index:1000}
.pv-modal{background:#f4f0e9;border-radius:18px;width:100%;max-width:480px;max-height:92vh;overflow-y:auto;padding:20px;box-sizing:border-box}
.pv-modal--wide{max-width:580px}
.pv-modal-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.pv-modal-title{font-size:22px;font-weight:800;margin:0}
.pv-x{width:40px;height:40px;border-radius:12px;border:1px solid #e7dfd2;background:#fff;font-size:18px;cursor:pointer}
.pv-field{margin-bottom:16px}
.pv-label{display:block;font-size:13px;font-weight:700;color:#57534e;margin-bottom:6px}
.pv-drop{border:2px dashed #d9b9a5;background:#fdf9f2;border-radius:18px;padding:34px 12px;text-align:center;cursor:pointer;display:grid;gap:4px;justify-items:center}
.pv-drop--over{background:#fdeede;border-color:#ea580c}
.pv-drop-ico{font-size:30px}
.pv-drop-title{font-weight:800;font-size:15px}
.pv-drop-sub{font-size:13px;color:#78716c}
.pv-photo{position:relative;border-radius:16px;overflow:hidden;border:1px solid #e7dfd2;background:#fff}
.pv-photo img{display:block;width:100%;max-height:200px;object-fit:cover}
.pv-photo button{position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;border:none;background:rgba(0,0,0,.6);color:#fff;cursor:pointer}
.pv-row2{display:flex;gap:12px;align-items:flex-end}
.pv-row2 .pv-grow{flex:1}
.pv-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pv-toggle{display:grid;gap:6px;justify-items:center;font-size:12px;font-weight:700;color:#78716c}
.pv-h3{font-size:17px;font-weight:800;margin:6px 0 10px}
.pv-price{display:flex;align-items:center;gap:4px;background:#fff;border:1px solid #e7dfd2;border-radius:12px;padding:0 10px}
.pv-price input{border:none;outline:none;width:100%;padding:11px 0;font-size:15px;background:transparent;font-family:inherit}
.pv-prev{background:#fff;border:1px solid #e7dfd2;border-radius:16px;overflow:hidden;margin-bottom:16px}
.pv-prev-img{background:#fde9db;height:120px;display:grid;place-items:center;font-size:30px}
.pv-prev-img img{width:100%;height:100%;object-fit:cover}
.pv-prev-body{padding:14px 16px;display:grid;gap:6px;justify-items:start}
.pv-prev-name{font-weight:800;font-size:16px}
.pv-prev-desc{color:#78716c;font-size:14px}
.pv-prev-chips{display:flex;gap:6px;flex-wrap:wrap}
.pv-btns{display:flex;gap:10px}
.pv-btns .pv-btn{justify-content:center;padding:14px 16px;font-size:15px}
.pv-btns .pv-btn--primary{flex:1}
.pv-btns--end{justify-content:flex-end}
.pv-btns--end .pv-btn--primary{flex:none}
.pv-back{border:1px solid #e7dfd2;background:#fff;border-radius:12px;padding:8px 14px;font-size:14px;font-weight:700;cursor:pointer;margin-bottom:16px;font-family:inherit;color:#1c1917}
.pv-segtabs{display:flex;gap:4px;background:#faf6ee;border:1px solid #eadfce;border-radius:14px;padding:4px}
.pv-segtabs button{flex:1;border:none;background:transparent;padding:12px 8px;border-radius:10px;font-size:15px;font-weight:700;color:#78716c;cursor:pointer;font-family:inherit}
.pv-segtabs button[aria-pressed="true"]{background:#fff;color:#c2410c;box-shadow:0 1px 4px rgba(0,0,0,.08)}
.pv-segtabs button:disabled{cursor:not-allowed;opacity:.7}
.pv-toggles{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pv-toggles .pv-toggle{justify-items:start}
.pv-vitem{background:#fff;border:1px solid #e7dfd2;border-radius:14px;padding:12px 14px;margin-bottom:10px}
.pv-vitem-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;gap:8px}
.pv-vprice{color:#c2410c;font-weight:800;font-size:17px}
.pv-vitem-bottom{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.pv-mini{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:700;color:#78716c}
.pv-vprev-row{display:flex;justify-content:space-between;align-items:baseline;width:100%}
.pv-vprev-name{font-size:21px;font-weight:800}
.pv-vprev-price{font-size:20px;font-weight:800;color:#c2410c}

/* ── dish form: chips, tabs, size rows ── */
.pv-pills{display:flex;flex-wrap:wrap;gap:8px}
.pv-pill{border:1px solid #e7dfd2;background:#fff;color:#1c1917;border-radius:999px;padding:9px 16px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;white-space:nowrap}
.pv-pill:disabled{opacity:.55;cursor:not-allowed}
.pv-pill--on{background:#2b3a4f;border-color:#2b3a4f;color:#fff}
.pv-pill--lg{padding:11px 20px;font-size:15px}
.pv-hint{font-size:12px;color:#78716c;font-weight:500}
.pv-label-row{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:6px;flex-wrap:wrap}
.pv-label-row .pv-label{margin:0}
.pv-srow{display:grid;grid-template-columns:84px 1fr 170px 38px;gap:8px;align-items:center;margin-top:8px}
.pv-srow-name{background:#efe8dc;border-radius:12px;padding:13px 12px;font-weight:800;font-size:14px}
.pv-stock{display:grid;grid-template-columns:1fr 1fr;gap:2px;background:#efe8dc;border-radius:12px;padding:3px}
.pv-stock button{border:none;background:transparent;border-radius:9px;padding:10px 4px;font-size:12px;font-weight:700;color:#78716c;cursor:pointer;font-family:inherit}
.pv-stock button[aria-pressed="true"]{background:#fff;color:#15803d;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.pv-stock button.pv-stock--pre[aria-pressed="true"]{color:#c2410c}
.pv-srow-rm{height:42px;border-radius:12px;border:none;background:#efe8dc;color:#78716c;font-size:16px;cursor:pointer}
.pv-note{background:#e9eef2;border-radius:10px;padding:10px 12px;font-size:13px;color:#44403c;margin-top:10px}
.pv-switch-row{display:flex;align-items:center;gap:12px;margin-top:14px}
.pv-switch-row strong{display:block;font-size:15px}
.pv-switch-row small{display:block;color:#78716c;font-size:12px;margin-top:2px}
.pv-switch--on-brown[aria-checked="true"]{background:#15803d}
@media (max-width:520px){
  .pv-srow{grid-template-columns:70px 1fr 38px}
  .pv-srow .pv-stock{grid-column:1 / -1;grid-row:2}
  .pv-grid2{grid-template-columns:1fr}
}
`

/* ───────────────────────── SMALL UI PIECES ───────────────────────── */

function Switch({ checked, onChange, disabled, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="pv-switch"
      disabled={disabled}
      onClick={() => onChange(!checked)}
    />
  )
}

function Shell({ title, onClose, children, locked, wide }) {
  return (
    <div
      className="pv-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !locked) onClose()
      }}
    >
      <div className={`pv-modal ${wide ? 'pv-modal--wide' : ''}`}>
        <div className="pv-modal-head">
          <h3 className="pv-modal-title">{title}</h3>
          <button
            type="button"
            className="pv-x"
            onClick={() => !locked && onClose()}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ───────────────────────── VARIANTS MODAL ───────────────────────── */

const emptyVariantForm = (unit) => ({
  variant_type: 'quantity',
  quantity_value: '',
  quantity_unit: unit,
  member_count: '1',
  price: '',
  availability: true,
  active: true,
})

export function VariantsModal({ product, onClose, onSaved }) {
  const baseUnit = UNIT_GROUP[product.price_unit] ? product.price_unit : 'KG'
  const allowedUnits = UNITS.filter((u) => UNIT_GROUP[u] === UNIT_GROUP[baseUnit])

  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // 'list' | 'form'
  const [editingV, setEditingV] = useState(null)
  const [form, setForm] = useState(() => emptyVariantForm(baseUnit))
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState(null)

  const loadVariants = async () => {
    try {
      const { data } = await getVariants(product._id)
      setVariants(Array.isArray(data?.data) ? data.data : [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load variants.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    loadVariants()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product._id])

  const backToList = () => {
    setView('list')
    setEditingV(null)
    setForm(emptyVariantForm(baseUnit))
  }

  const openAdd = () => {
    setEditingV(null)
    setForm(emptyVariantForm(baseUnit))
    setView('form')
  }

  const openEdit = (v) => {
    setEditingV(v)
    setForm({
      variant_type: v.variant_type || 'quantity',
      quantity_value: v.quantity_value > 0 ? String(v.quantity_value) : '',
      quantity_unit: v.quantity_unit && v.quantity_unit !== 'PCS' ? v.quantity_unit : baseUnit,
      member_count: v.member_count > 0 ? String(v.member_count) : '1',
      price: v.price != null ? String(v.price) : '',
      availability: v.availability !== false,
      active: (v.status || 'active') === 'active',
    })
    setView('form')
  }

  const isQty = form.variant_type === 'quantity'

  // What the saved variant will look like (null while the inputs are invalid).
  const preview = isQty
    ? Number(form.quantity_value) > 0
      ? parseVariantName(`${Number(form.quantity_value)} ${form.quantity_unit}`)
      : null
    : Number.isInteger(Number(form.member_count)) && Number(form.member_count) >= 1
      ? parseVariantName(`${Number(form.member_count)} Members`)
      : null

  const previewPrice = Number(form.price)
  const hasPrice = form.price !== '' && Number.isFinite(previewPrice) && previewPrice > 0

  const handleSave = async (e) => {
    e.preventDefault()
    if (saving) return

    if (!preview) {
      return toast.error(
        isQty ? 'Quantity must be greater than 0.' : 'Member count must be at least 1.'
      )
    }

    if (editingV && !hasPrice) return toast.error('Price must be greater than 0.')

    const applyAll = !editingV

    const duplicate = variants.some(
      (v) => v._id !== editingV?._id && sameVariant(v, preview)
    )

    if (duplicate && !applyAll) {
      return toast.error('This variant already exists for this product.')
    }

    const payload = {
      ...preview,
      price: editingV ? previewPrice : 0,
      status: form.active ? 'active' : 'inactive',
    }

    setSaving(true)

    try {
      if (applyAll) {
        const r = await addVariantToAllProducts(payload, form.availability)
        const parts = [`Added to ${r.added} of ${r.total} products`]
        if (r.existed) parts.push(`${r.existed} already had it`)
        if (r.failed) parts.push(`${r.failed} failed`)

        if (r.failed) toast.error(parts.join(' · '), { duration: 6000 })
        else toast.success(parts.join(' · '), { duration: 5000 })
      } else if (editingV) {
        await updateVariant(editingV._id, payload)

        if ((editingV.availability !== false) !== form.availability) {
          await updateVariantAvailability(editingV._id, form.availability)
        }

        toast.success('Variant updated.')
      } else {
        const res = await createVariant(product._id, payload)
        const newId = res?.data?.data?._id

        if (!form.availability && newId) {
          await updateVariantAvailability(newId, false)
        }

        toast.success('Variant added.')
      }

      await loadVariants()
      onSaved()
      backToList()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save variant.')
    } finally {
      setSaving(false)
    }
  }

  const toggleAvail = async (v) => {
    if (busyId) return
    setBusyId(v._id)

    try {
      const { data } = await updateVariantAvailability(v._id, !(v.availability !== false))
      toast.success('Availability updated.')

      if (data?.data?.all_variants_unavailable) {
        toast('All variants are unavailable. Customers cannot order this product.', {
          icon: '⚠️',
          duration: 5000,
        })
      }

      await loadVariants()
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update availability.')
    } finally {
      setBusyId(null)
    }
  }

  const toggleActive = async (v) => {
    if (busyId) return
    setBusyId(v._id)

    try {
      await updateVariantStatus(v._id, v.status === 'active' ? 'inactive' : 'active')
      toast.success('Status updated.')
      await loadVariants()
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setBusyId(null)
    }
  }

  const removeVariant = async (v) => {
    if (busyId) return
    if (!window.confirm(`Delete variant ${v.variant_name}?`)) return

    setBusyId(v._id)

    try {
      await deleteVariant(v._id)
      toast.success('Variant deleted.')
      await loadVariants()
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete variant.')
    } finally {
      setBusyId(null)
    }
  }

  const title =
    view === 'list' ? `Variants — ${product.name}` : editingV ? 'Edit variant' : 'Add variant'

  return (
    <Shell title={title} onClose={onClose} locked={saving}>
      <style>{CSS}</style>
      {view === 'list' ? (
        <>
          {loading ? (
            <div className="pv-loader">
              <span className="pv-spin" />
            </div>
          ) : variants.length === 0 ? (
            <div className="pv-empty">No variants yet. Add the first one.</div>
          ) : (
            variants.map((v) => (
              <div className="pv-vitem" key={v._id}>
                <div className="pv-vitem-top">
                  <div>
                    <strong>{v.variant_name}</strong>
                    <div className="pv-prod-desc">
                      {v.variant_type === 'member'
                        ? `${v.member_count} Members`
                        : `${v.quantity_value} ${v.quantity_unit}`}
                    </div>
                  </div>
                  <div className="pv-vprice">{formatPrice(v.price)}</div>
                </div>

                <div className="pv-vitem-bottom">
                  <label className="pv-mini">
                    Available
                    <Switch
                      checked={v.availability !== false}
                      label={`Availability of ${v.variant_name}`}
                      disabled={busyId === v._id}
                      onChange={() => toggleAvail(v)}
                    />
                  </label>

                  <label className="pv-mini">
                    Active
                    <Switch
                      checked={v.status === 'active'}
                      label={`Status of ${v.variant_name}`}
                      disabled={busyId === v._id}
                      onChange={() => toggleActive(v)}
                    />
                  </label>

                  <div className="pv-actions" style={{ marginLeft: 'auto' }}>
                    <button
                      type="button"
                      className="pv-btn pv-btn--sm"
                      onClick={() => openEdit(v)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="pv-btn pv-btn--sm pv-btn--danger"
                      title="Delete"
                      disabled={busyId === v._id}
                      onClick={() => removeVariant(v)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="pv-btns" style={{ marginTop: 16 }}>
            <button type="button" className="pv-btn pv-btn--primary" onClick={openAdd}>
              + Add variant
            </button>
            <button type="button" className="pv-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSave}>
          <button type="button" className="pv-back" onClick={backToList} disabled={saving}>
            ‹ {product.name}
          </button>

          <div className="pv-field">
            <label className="pv-label">Variant type</label>

            <div className="pv-segtabs">
              <button
                type="button"
                aria-pressed={isQty}
                disabled={!!editingV}
                onClick={() => setForm({ ...form, variant_type: 'quantity' })}
              >
                Quantity (KG / L...)
              </button>

              <button
                type="button"
                aria-pressed={!isQty}
                disabled={!!editingV}
                onClick={() => setForm({ ...form, variant_type: 'member' })}
              >
                Members
              </button>
            </div>
          </div>

          {isQty ? (
            <div className="pv-field">
              <div className="pv-row2" style={{ alignItems: 'flex-start' }}>
                <div className="pv-grow">
                  <label className="pv-label">Quantity *</label>
                  <input
                    className="pv-input"
                    type="number"
                    step="any"
                    min="0.01"
                    placeholder="0.5"
                    value={form.quantity_value}
                    onChange={(e) => setForm({ ...form, quantity_value: e.target.value })}
                  />
                </div>

                <div style={{ width: 130 }}>
                  <label className="pv-label">Unit</label>
                  <select
                    className="pv-select"
                    value={form.quantity_unit}
                    onChange={(e) => setForm({ ...form, quantity_unit: e.target.value })}
                  >
                    {allowedUnits.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ) : (
            <div className="pv-field">
              <label className="pv-label">Member count *</label>
              <input
                className="pv-input"
                type="number"
                min="1"
                step="1"
                placeholder="5"
                value={form.member_count}
                onChange={(e) => setForm({ ...form, member_count: e.target.value })}
              />
            </div>
          )}

          {editingV && (
            <div className="pv-field">
              <label className="pv-label">Price *</label>
              <div className="pv-price" style={{ padding: '0 14px' }}>
                <span>₹</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="500"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
            </div>
          )}

          {!editingV && (
            <p className="pv-prod-desc">
              This variant will be added to every product. Set individual prices later.
            </p>
          )}

          <div className="pv-field pv-toggles">
            <div className="pv-toggle">
              Available
              <Switch
                checked={form.availability}
                label="Available"
                onChange={(val) => setForm({ ...form, availability: val })}
              />
            </div>

            <div className="pv-toggle">
              Active
              <Switch
                checked={form.active}
                label="Active"
                onChange={(val) => setForm({ ...form, active: val })}
              />
            </div>
          </div>

          <h4 className="pv-h3">Live preview</h4>

          <div className="pv-prev">
            <div className="pv-prev-body" style={{ width: '100%', boxSizing: 'border-box' }}>
              <div className="pv-prev-desc">{product.name}</div>

              <div className="pv-vprev-row">
                <span className="pv-vprev-name">{preview?.variant_name || 'Variant name'}</span>
                <span className="pv-vprev-price">
                  {editingV && hasPrice ? `₹ ${previewPrice.toLocaleString('en-IN')}` : 'Price set later'}
                </span>
              </div>

              <span
                className={`pv-badge ${form.availability ? 'pv-badge--green' : 'pv-badge--red'}`}
              >
                {form.availability ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>

          <div className="pv-btns">
            <button type="submit" className="pv-btn pv-btn--primary" disabled={saving}>
              {saving
                ? 'Saving...'
                : editingV
                  ? 'Save variant'
                  : 'Add to all products'}
            </button>

            <button type="button" className="pv-btn" onClick={backToList} disabled={saving}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </Shell>
  )
}

/* ───────────────────────── PRODUCT FORM MODAL ───────────────────────── */

function ProductFormModal({ product, categories, onClose, onSaved }) {
  const editing = !!product

  const [name, setName] = useState(product?.name || '')
  const [nameTe, setNameTe] = useState(product?.name_te || product?.name_telugu || '')
  const [categoryId, setCategoryId] = useState(
    product?.category_id?._id || product?.category_id || ''
  )
  const [description, setDescription] = useState(product?.description || '')
  const [displayOrder, setDisplayOrder] = useState(product?.display_order ?? 0)
  const [active, setActive] = useState((product?.status || 'active') === 'active')
  const [available, setAvailable] = useState(editing ? !!product.availability : true)
  const [preorderAboveKg, setPreorderAboveKg] = useState(
    hasKgRule(product) ? String(product.preorder_above_kg) : ''
  )
  const [minPrepHours, setMinPrepHours] = useState(
    hasPrepRule(product) ? String(product.min_prep_hours) : ''
  )

  /* tab: 'weight' (Weight KG) or 'people' (Hundi) */
  const [soldBy, setSoldBy] = useState(product?.sold_by === 'people' ? 'people' : 'weight')
  const [allVariants, setAllVariants] = useState([])
  const [originalVariants, setOriginalVariants] = useState([])
  const [selected, setSelected] = useState([]) // variant keys (both tabs)
  const [rows, setRows] = useState({}) // key -> { price: '', stock: true }
  const [loadingSizes, setLoadingSizes] = useState(true)

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(
    product?.image_url ? imgSrc(product.image_url) : ''
  )
  const [dragOver, setDragOver] = useState(false)
  const [saving, setSaving] = useState(false)

  const fileRef = useRef()
  const previewUrlRef = useRef('')

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = ''
    }
  }

  useEffect(() => () => clearPreviewUrl(), [])

  useEffect(() => {
    let active_ = true

    const loadSizes = async () => {
      setLoadingSizes(true)

      try {
        const allProducts = await fetchAllProducts()
        const variantsByProduct = await Promise.all(
          allProducts.map(async (item) => {
            try {
              const { data } = await getVariants(item._id)
              return {
                productId: item._id,
                variants: Array.isArray(data?.data) ? data.data : [],
              }
            } catch {
              return { productId: item._id, variants: [] }
            }
          })
        )

        if (!active_) return

        const flat = variantsByProduct.flatMap(({ variants }) => variants)
        const current =
          variantsByProduct.find(({ productId }) => productId === product?._id)?.variants || []

        setAllVariants(flat)
        setOriginalVariants(current)
        setSelected(current.map(variantKey))
        setRows(
          Object.fromEntries(
            current.map((v) => [
              variantKey(v),
              {
                price: Number(v.price) > 0 ? String(v.price) : '',
                stock: v.order_type !== 'preorder',
              },
            ])
          )
        )

        // old products without sold_by: guess the tab from their variants
        if (product && !product.sold_by) {
          const hasMember = current.some((v) => v.variant_type === 'member')
          const hasQty = current.some((v) => v.variant_type === 'quantity')
          if (hasMember && !hasQty) setSoldBy('people')
        }
      } catch (err) {
        if (active_) {
          toast.error(err.response?.data?.message || 'Failed to load sizes.')
        }
      } finally {
        if (active_) setLoadingSizes(false)
      }
    }

    loadSizes()

    return () => {
      active_ = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?._id])

  /* ── tab helpers ── */
  const isPeople = soldBy === 'people'
  const keyPrefix = isPeople ? 'm-' : 'q-'
  const sizeOptions = buildSizeOptions(soldBy, allVariants)
  const activeSelected = sizeOptions.filter((o) => selected.includes(o.key))

  const toggleSize = (key) => {
    setSelected((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]))
    setRows((cur) => (cur[key] ? cur : { ...cur, [key]: { price: '', stock: true } }))
  }

  const setRow = (key, patch) =>
    setRows((cur) => ({
      ...cur,
      [key]: { price: '', stock: true, ...(cur[key] || {}), ...patch },
    }))

  const orderNowLabel = (() => {
    const list = activeSelected.filter((o) => rows[o.key]?.stock !== false)
    if (list.length === 0) return 'none'
    if (isPeople) return list.map((o) => o.member_count).join(', ') + ' Members'
    return list.map((o) => o.quantity_value).join(', ') + ' ' + list[0].quantity_unit
  })()

  /* ── image ── */
  const acceptFile = async (file) => {
    if (!file) return

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

    if (!allowed.includes(file.type)) {
      toast.error('Only JPG, PNG, WEBP allowed.')
      return
    }

    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`Max ${MAX_IMAGE_MB} MB allowed.`)
      return
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

  const kgRaw = isPeople ? '' : String(preorderAboveKg).trim()
  const prepRaw = String(minPrepHours).trim()
  const previewKgRule = kgRaw !== '' && Number(kgRaw) > 0
  const previewPrepRule = prepRaw !== '' && Number(prepRaw) > 0

  /* ── save ── */
  const handleSave = async (e) => {
    e.preventDefault()
    if (saving) return

    if (!name.trim()) return toast.error('Name is required.')
    if (!categoryId) return toast.error('Category is required.')

    if (kgRaw !== '' && !(Number(kgRaw) > 0)) {
      return toast.error('Pre-order limit must be greater than 0 KG, or leave it empty.')
    }

    if (prepRaw !== '' && !(Number(prepRaw) >= 0)) {
      return toast.error('Minimum preparation time cannot be negative.')
    }

    // Empty price = not set yet (allowed). Anything typed must be greater than 0.
    for (const opt of activeSelected) {
      const raw = rows[opt.key]?.price
      if (raw === undefined || raw === '') continue
      const price = Number(raw)
      if (!Number.isFinite(price) || price <= 0) {
        return toast.error('Prices must be greater than 0.')
      }
    }

    setSaving(true)

    try {
      const fd = new FormData()
      fd.append('name', name.trim())
      fd.append('name_te', nameTe.trim())
      fd.append('category_id', categoryId)
      fd.append('description', description || '')
      fd.append('sold_by', soldBy)
      fd.append('display_order', String(Math.max(0, Number(displayOrder) || 0)))
      fd.append('status', active ? 'active' : 'inactive')
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
        throw new Error('Product was saved, but its sizes could not be linked.')
      }

      const selectedKeys = new Set(activeSelected.map((o) => o.key))

      // remove every old variant that is not selected in the current tab
      // (this also clears the other tab's sizes when the dish type is switched)
      for (const variant of originalVariants) {
        if (!selectedKeys.has(variantKey(variant))) {
          await deleteVariant(variant._id)
        }
      }

      for (const opt of activeSelected) {
        const existing = originalVariants.find((v) => variantKey(v) === opt.key)
        const row = rows[opt.key] || { price: '', stock: true }
        const orderType = row.stock === false ? 'preorder' : 'instock'
        const priceNum = row.price === '' || row.price === undefined ? 0 : Number(row.price)

        if (existing) {
          const newPrice = priceNum > 0 ? priceNum : Number(existing.price)
          const oldType = existing.order_type === 'preorder' ? 'preorder' : 'instock'

          if (oldType !== orderType) {
            await updateVariant(existing._id, {
              variant_type: existing.variant_type,
              variant_name: existing.variant_name,
              quantity_value: existing.quantity_value,
              quantity_unit: existing.quantity_unit,
              member_count: existing.member_count,
              price: newPrice,
              status: existing.status || 'active',
              order_type: orderType,
            })
          } else if (newPrice > 0 && newPrice !== Number(existing.price)) {
            await updateVariantPrice(existing._id, newPrice)
          }
        } else {
          await createVariant(productId, {
            variant_type: opt.variant_type,
            variant_name: opt.variant_name,
            quantity_value: opt.quantity_value,
            quantity_unit: opt.quantity_unit,
            member_count: opt.member_count,
            price: priceNum,
            status: 'active',
            order_type: orderType,
          })
        }
      }

      toast.success(editing ? 'Dish updated.' : 'Dish added to menu.')
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Shell
      title={editing ? 'Edit dish' : 'Add dish'}
      onClose={onClose}
      locked={saving}
      wide
    >
      <form onSubmit={handleSave}>
        <div className="pv-field pv-grid2">
          <div>
            <label className="pv-label">Name (English) *</label>
            <input
              className="pv-input"
              placeholder="e.g. Chicken Curry"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="pv-label">Name (Telugu)</label>
            <input
              className="pv-input"
              placeholder="ఉదా. చికెన్ కర్రీ"
              value={nameTe}
              onChange={(e) => setNameTe(e.target.value)}
            />
          </div>
        </div>

        <div className="pv-field">
          <label className="pv-label">Description</label>
          <textarea
            className="pv-input"
            rows={3}
            style={{ resize: 'vertical' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="pv-field">
          <label className="pv-label">Category *</label>
          <div className="pv-pills">
            {categories.map((c) => (
              <button
                key={c._id}
                type="button"
                disabled={saving}
                className={`pv-pill ${categoryId === c._id ? 'pv-pill--on' : ''}`}
                onClick={() => setCategoryId(c._id)}
              >
                {c.name}
              </button>
            ))}
          </div>
          {categories.length === 0 && (
            <small style={{ color: '#dc2626' }}>
              No active categories found. Create or activate categories first.
            </small>
          )}
        </div>

        <div className="pv-field">
          <label className="pv-label">Photo (JPG, PNG, WEBP · max {MAX_IMAGE_MB} MB)</label>

          {imagePreview ? (
            <div className="pv-photo">
              <img src={imagePreview} alt="preview" />
              <button type="button" onClick={removeImage} title="Remove photo">
                ✕
              </button>
            </div>
          ) : (
            <div
              className={`pv-drop ${dragOver ? 'pv-drop--over' : ''}`}
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
              <span className="pv-drop-ico">📷</span>
              <span className="pv-drop-title">Click or drag a photo here</span>
              <span className="pv-drop-sub">Optimized automatically</span>
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

        {/* ───── SOLD BY TAB SWITCH ───── */}
        <div className="pv-field">
          <label className="pv-label">Sold by</label>
          <div className="pv-pills">
            <button
              type="button"
              disabled={saving}
              className={`pv-pill pv-pill--lg ${!isPeople ? 'pv-pill--on' : ''}`}
              onClick={() => setSoldBy('weight')}
            >
              Weight (KG)
            </button>
            <button
              type="button"
              disabled={saving}
              className={`pv-pill pv-pill--lg ${isPeople ? 'pv-pill--on' : ''}`}
              onClick={() => setSoldBy('people')}
            >
              People (Hundi)
            </button>
          </div>
        </div>

        <div className="pv-field">
          <div className="pv-label-row">
            <label className="pv-label">Sizes &amp; prices</label>
            <span className="pv-hint">Tap sizes to add</span>
          </div>

          {loadingSizes ? (
            <div className="pv-loader">
              <span className="pv-spin" />
            </div>
          ) : (
            <>
              <div className="pv-pills">
                {sizeOptions.map((o) => {
                  const on = selected.includes(o.key)
                  return (
                    <button
                      key={o.key}
                      type="button"
                      disabled={saving}
                      className={`pv-pill ${on ? 'pv-pill--on' : ''}`}
                      onClick={() => toggleSize(o.key)}
                    >
                      {on ? '✓' : '+'} {o.variant_name}
                    </button>
                  )
                })}
              </div>

              {activeSelected.map((o) => {
                const row = rows[o.key] || { price: '', stock: true }
                return (
                  <div className="pv-srow" key={o.key}>
                    <div className="pv-srow-name">{o.variant_name}</div>

                    <div className="pv-price">
                      <span>₹</span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Price"
                        aria-label={`Price for ${o.variant_name}`}
                        value={row.price}
                        disabled={saving}
                        onChange={(e) => setRow(o.key, { price: e.target.value })}
                      />
                    </div>

                    <div className="pv-stock">
                      <button
                        type="button"
                        aria-pressed={row.stock !== false}
                        onClick={() => setRow(o.key, { stock: true })}
                      >
                        In stock
                      </button>
                      <button
                        type="button"
                        className="pv-stock--pre"
                        aria-pressed={row.stock === false}
                        onClick={() => setRow(o.key, { stock: false })}
                      >
                        Pre-order
                      </button>
                    </div>

                    <button
                      type="button"
                      className="pv-srow-rm"
                      title="Remove size"
                      disabled={saving}
                      onClick={() => toggleSize(o.key)}
                    >
                      –
                    </button>
                  </div>
                )
              })}

              {activeSelected.length > 0 && (
                <div className="pv-note">
                  Order now: {orderNowLabel}. “Sold out today” only affects order-now sizes.
                </div>
              )}

              {activeSelected.length === 0 && (
                <p className="pv-prod-desc" style={{ maxWidth: 'none', marginTop: 10 }}>
                  No size selected yet. Tap a size above to add it.
                </p>
              )}
            </>
          )}
        </div>

        {/* order rules only make sense for weight dishes */}
        {!isPeople && (
          <div className="pv-field">
            <h4 className="pv-h3">Order rules</h4>
            <div className="pv-row2" style={{ alignItems: 'flex-start' }}>
              <div className="pv-grow">
                <label className="pv-label" htmlFor="pv-preorder-kg">
                  Pre-order above (KG)
                </label>
                <input
                  id="pv-preorder-kg"
                  className="pv-input"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 5"
                  value={preorderAboveKg}
                  onChange={(e) => setPreorderAboveKg(e.target.value)}
                />
              </div>

              <div className="pv-grow">
                <label className="pv-label" htmlFor="pv-prep-hours">
                  Min preparation time (hours)
                </label>
                <input
                  id="pv-prep-hours"
                  className="pv-input"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 2"
                  value={minPrepHours}
                  onChange={(e) => setMinPrepHours(e.target.value)}
                />
              </div>
            </div>

            <small
              className="pv-prod-desc"
              style={{ display: 'block', marginTop: 8, maxWidth: 'none' }}
            >
              Orders above the KG limit must be placed as pre-orders. Leave empty for no rule.
            </small>
          </div>
        )}

        {isPeople && (
          <div className="pv-field">
            <label className="pv-label" htmlFor="pv-prep-hours-p">
              Min preparation time (hours)
            </label>
            <input
              id="pv-prep-hours-p"
              className="pv-input"
              type="number"
              min="0"
              step="any"
              placeholder="e.g. 2"
              value={minPrepHours}
              onChange={(e) => setMinPrepHours(e.target.value)}
            />
          </div>
        )}

        <div className="pv-field">
          <label className="pv-label">Display order</label>
          <input
            className="pv-input"
            type="number"
            min={0}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Math.max(0, Number(e.target.value) || 0))}
          />
        </div>

        <div className="pv-switch-row">
          <Switch checked={available} onChange={setAvailable} label="In stock today" />
          <div>
            <strong>In stock today</strong>
            <small>
              Off = order-now sizes show “Sold out today”. Pre-order sizes stay bookable.
            </small>
          </div>
        </div>

        <div className="pv-switch-row" style={{ marginBottom: 20 }}>
          <Switch
            checked={!active}
            onChange={(hidden) => setActive(!hidden)}
            label="Hidden from menu"
          />
          <div>
            <strong>Hidden from menu</strong>
            <small>Customers can’t see or search it</small>
          </div>
        </div>

        {(previewKgRule || previewPrepRule) && (
          <div className="pv-prev-chips" style={{ marginBottom: 14 }}>
            {previewKgRule && (
              <span className="pv-chip pv-chip--rule">Pre-order above {Number(kgRaw)} KG</span>
            )}
            {previewPrepRule && (
              <span className="pv-chip pv-chip--rule">Min {Number(prepRaw)} h preparation</span>
            )}
          </div>
        )}

        <div className="pv-btns pv-btns--end">
          <button type="button" className="pv-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>

          <button
            type="submit"
            className="pv-btn pv-btn--primary"
            disabled={saving || categories.length === 0}
          >
            {saving ? 'Saving...' : editing ? 'Save dish' : 'Add to menu'}
          </button>
        </div>
      </form>
    </Shell>
  )
}

/* ───────────────────────── PRODUCTS PAGE ───────────────────────── */

export default function Products() {
  const [list, setList] = useState([])
  const [variantsMap, setVariantsMap] = useState({})
  const [categories, setCategories] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [busyId, setBusyId] = useState(null)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadCats = async () => {
    try {
      const { data } = await getCategories({ status: 'active' })
      setCategories(sortCategories(data?.data))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load categories.')
    }
  }

  // Fetch the variants of the products currently shown in the table.
  const loadListVariants = async (items) => {
    const entries = await Promise.all(
      items.map(async (p) => {
        try {
          const { data } = await getVariants(p._id)
          return [p._id, Array.isArray(data?.data) ? data.data : []]
        } catch {
          return [p._id, []]
        }
      })
    )

    setVariantsMap((current) => ({ ...current, ...Object.fromEntries(entries) }))
  }

  const loadProducts = async () => {
    setLoading(true)

    try {
      const { data } = await getProducts({
        search,
        status: statusFilter,
        category_id: categoryFilter,
        page,
        limit: LIMIT,
      })

      const result = data?.data
      const items = Array.isArray(result?.products) ? result.products : []

      setList(items)
      setTotal(Number(result?.total) || 0)
      loadListVariants(items)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCats()
  }, [])

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, categoryFilter, page])

  const refresh = async () => {
    await loadProducts()
  }

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setFormOpen(true)
  }

  const toggleStatus = async (p) => {
    if (busyId) return
    setBusyId(p._id)

    try {
      await updateProductStatus(p._id, p.status === 'active' ? 'inactive' : 'active')
      toast.success('Status updated.')
      await loadProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.')
    } finally {
      setBusyId(null)
    }
  }

  const toggleAvailability = async (p) => {
    if (busyId) return
    setBusyId(p._id)

    try {
      const { data } = await updateProductAvailability(p._id, !p.availability)
      toast.success('Availability updated.')

      if (data?.data?.all_variants_unavailable) {
        toast(
          'All variants are also unavailable. Customers cannot order this product.',
          { icon: '⚠️', duration: 5000 }
        )
      }

      await loadProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete || deleting) return
    setDeleting(true)

    try {
      await deleteProduct(confirmDelete._id)
      toast.success('Product deleted.')
      setConfirmDelete(null)

      if (list.length === 1 && page > 1) {
        setPage((n) => n - 1)
      } else {
        await loadProducts()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete.')
    } finally {
      setDeleting(false)
    }
  }

  // Category filter is also applied client-side in case the API ignores it.
  const visible = categoryFilter
    ? list.filter(
        (p) => (p.category_id?._id || p.category_id) === categoryFilter
      )
    : list

  return (
    <div className="pv-page">
      <style>{CSS}</style>

      <div className="pv-head">
        <div>
          <h2 className="pv-title">Products</h2>
          <p className="pv-sub">Manage your menu items</p>
        </div>

        <button type="button" className="pv-btn pv-btn--primary" onClick={openAdd}>
          + Add dish
        </button>
      </div>

      <div className="pv-card">
        <div className="pv-filters">
          <input
            className="pv-input"
            placeholder="🔍 Search product"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />

          <select
            className="pv-select"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className="pv-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
          >
            <option value="">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {loading ? (
          <div className="pv-loader">
            <span className="pv-spin" />
          </div>
        ) : (
          <div className="pv-wrap">
            <table className="pv-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Weightages</th>
                  <th>Available</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={6}>
                      <div className="pv-empty">No products found.</div>
                    </td>
                  </tr>
                )}

                {visible.map((p) => {
                  const productVariants = variantsMap[p._id]

                  return (
                    <tr key={p._id}>
                      <td>
                        <div className="pv-prod">
                          <div className="pv-thumb">
                            {p.image_url ? (
                              <img src={imgSrc(p.image_url)} alt={p.name} />
                            ) : (
                              '🍲'
                            )}
                          </div>

                          <div>
                            <div className="pv-prod-name">{p.name}</div>
                            {p.description && (
                              <div className="pv-prod-desc">{p.description}</div>
                            )}
                            {(hasKgRule(p) || hasPrepRule(p)) && (
                              <div className="pv-rules">
                                {hasKgRule(p) && (
                                  <span className="pv-chip pv-chip--rule">
                                    Pre-order above {Number(p.preorder_above_kg)} KG
                                  </span>
                                )}
                                {hasPrepRule(p) && (
                                  <span className="pv-chip pv-chip--rule">
                                    Min {Number(p.min_prep_hours)} h prep
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>{p.category_id?.name || '—'}</td>

                      <td>
                        {productVariants === undefined ? (
                          <span className="pv-prod-desc">Loading...</span>
                        ) : productVariants.length === 0 ? (
                          <span className="pv-prod-desc">No variants</span>
                        ) : (
                          <div className="pv-chips">
                            {sortVariants(productVariants).map((v) => {
                              const off = v.status !== 'active' || v.availability === false

                              return (
                                <span
                                  key={v._id}
                                  className={`pv-chip ${off ? 'pv-chip--off' : ''}`}
                                  title={off ? 'Inactive or unavailable' : v.variant_name}
                                >
                                  {v.variant_name} ·{' '}
                                  {Number(v.price) > 0 ? formatPrice(v.price) : 'no price'}
                                  {v.order_type === 'preorder' ? ' · pre-order' : ''}
                                </span>
                              )
                            })}
                          </div>
                        )}
                      </td>

                      <td>
                        <Switch
                          checked={!!p.availability}
                          label={`Availability of ${p.name}`}
                          disabled={busyId === p._id}
                          onChange={() => toggleAvailability(p)}
                        />
                      </td>

                      <td>
                        <span
                          className={`pv-badge ${
                            p.status === 'active' ? 'pv-badge--green' : 'pv-badge--red'
                          }`}
                        >
                          {p.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td>
                        <div className="pv-actions">
                          <button
                            type="button"
                            className="pv-btn pv-btn--sm"
                            onClick={() => openEdit(p)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="pv-btn pv-btn--sm"
                            disabled={busyId === p._id}
                            onClick={() => toggleStatus(p)}
                          >
                            {p.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>

                          <button
                            type="button"
                            className="pv-btn pv-btn--sm pv-btn--danger"
                            title="Delete"
                            onClick={() => setConfirmDelete(p)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="pv-foot">
          <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />
        </div>
      </div>

      {formOpen && (
        <ProductFormModal
          key={editing?._id || 'new'}
          product={editing}
          categories={categories}
          onClose={() => setFormOpen(false)}
          onSaved={refresh}
        />
      )}

      {confirmDelete && (
        <Shell
          title="Delete product"
          onClose={() => setConfirmDelete(null)}
          locked={deleting}
        >
          <p style={{ margin: '0 0 4px' }}>
            Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
          </p>
          <p className="pv-sub" style={{ marginBottom: 16 }}>
            This action cannot be undone.
          </p>

          <div className="pv-btns">
            <button
              type="button"
              className="pv-btn"
              onClick={() => setConfirmDelete(null)}
              disabled={deleting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="pv-btn pv-btn--primary"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </Shell>
      )}
    </div>
  )
}