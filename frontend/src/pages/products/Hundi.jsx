// import { useEffect, useState } from 'react'
// import { Plus, Pencil, ToggleLeft, ToggleRight } from 'lucide-react'
// import { getHundi, createHundi, updateHundi, updateHundiStatus } from '../../services/adminService'
// import Modal from '../../components/ui/Modal'
// import Badge from '../../components/ui/Badge'
// import toast from 'react-hot-toast'

// const EMPTY = { name: '', member_count: '', price: '', display_order: 0 }

// export default function Hundi() {
//   const [list, setList] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [modal, setModal] = useState(false)
//   const [editing, setEditing] = useState(null)
//   const [form, setForm] = useState(EMPTY)
//   const [saving, setSaving] = useState(false)

//   const fetch = async () => {
//     setLoading(true)
//     try { const { data } = await getHundi(); setList(data.data) }
//     catch { toast.error('Failed to load packages.') }
//     finally { setLoading(false) }
//   }

//   useEffect(() => { fetch() }, [])

//   const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true) }
//   const openEdit = (p) => { setEditing(p); setForm({ name: p.name, member_count: p.member_count, price: p.price, display_order: p.display_order }); setModal(true) }

//   const handleSave = async (e) => {
//     e.preventDefault()
//     if (!form.name.trim()) return toast.error('Name is required.')
//     if (!form.member_count || form.member_count < 1) return toast.error('Member count must be >= 1.')
//     if (form.price === '' || form.price < 0) return toast.error('Price must be >= 0.')
//     setSaving(true)
//     try {
//       if (editing) { await updateHundi(editing._id, form); toast.success('Package updated.') }
//       else { await createHundi(form); toast.success('Package created.') }
//       setModal(false); fetch()
//     } catch (err) { toast.error(err.response?.data?.message || 'Failed to save.') }
//     finally { setSaving(false) }
//   }

//   const toggleStatus = async (p) => {
//     try {
//       await updateHundiStatus(p._id, p.status === 'active' ? 'inactive' : 'active')
//       toast.success('Status updated.'); fetch()
//     } catch (err) { toast.error(err.response?.data?.message || 'Failed.') }
//   }

//   return (
//     <div className="page">
//       <div className="page__header">
//         <div><h2 className="page__title">Hundi Packages</h2><p className="page__subtitle">Manage member-based packages</p></div>
//         <button className="btn btn--primary" onClick={openAdd}><Plus size={16} /> Add Package</button>
//       </div>

//       <div className="section-card">
//         {loading ? <div className="page-loader"><span className="spinner" /></div> : (
//           <div className="table-wrap">
//             <table className="table">
//               <thead><tr><th>Name</th><th>Members</th><th>Price</th><th>Order</th><th>Status</th><th>Actions</th></tr></thead>
//               <tbody>
//                 {list.length === 0 && <tr><td colSpan={6}><div className="empty-state">No packages found.</div></td></tr>}
//                 {list.map((p) => (
//                   <tr key={p._id}>
//                     <td><strong>{p.name}</strong></td>
//                     <td>{p.member_count} Members</td>
//                     <td>₹{p.price?.toLocaleString('en-IN')}</td>
//                     <td>{p.display_order}</td>
//                     <td><Badge value={p.status} /></td>
//                     <td>
//                       <div className="action-btns">
//                         <button className="icon-btn icon-btn--edit" onClick={() => openEdit(p)}><Pencil size={15} /></button>
//                         <button className="icon-btn icon-btn--toggle" onClick={() => toggleStatus(p)}>
//                           {p.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {modal && (
//         <Modal title={editing ? 'Edit Package' : 'Add Package'} onClose={() => setModal(false)}>
//           <form className="modal-form" onSubmit={handleSave}>
//             <div className="form-group">
//               <label className="form-label">Package Name *</label>
//               <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. 5 Members Package" />
//             </div>
//             <div className="form-row">
//               <div className="form-group">
//                 <label className="form-label">Member Count *</label>
//                 <input className="form-input" type="number" min={1} value={form.member_count} onChange={(e) => setForm({ ...form, member_count: Number(e.target.value) })} placeholder="5" />
//               </div>
//               <div className="form-group">
//                 <label className="form-label">Price (₹) *</label>
//                 <input className="form-input" type="number" min={0} step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="500" />
//               </div>
//             </div>
//             <div className="form-group">
//               <label className="form-label">Display Order</label>
//               <input className="form-input" type="number" min={0} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
//             </div>
//             <div className="modal-form__actions">
//               <button type="button" className="btn btn--outline" onClick={() => setModal(false)}>Cancel</button>
//               <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   )
// }

// import { useCallback, useEffect, useMemo, useState } from "react";

// import {
//   Plus,
//   Pencil,
//   ToggleLeft,
//   ToggleRight,
//   ChevronDown,
//   Users,
//   IndianRupee,
//   Layers,
// } from "lucide-react";

// import {
//   getHundi,
//   createHundi,
//   updateHundi,
//   updateHundiStatus,
// } from "../../services/adminService";

// import Modal from "../../components/ui/Modal";
// import Badge from "../../components/ui/Badge";
// import toast from "react-hot-toast";

// import "./Hundi.css";

// const EMPTY = {
//   name: "",
//   member_count: "",
//   price: "",
//   display_order: "0",
// };

// const INITIAL_MEMBER_COUNTS = [5, 10, 15, 25];

// const normalizeStatus = (status) =>
//   String(status ?? "").trim().toLowerCase();

// const normalizeId = (id) => String(id ?? "");

// export default function Hundi() {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modal, setModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({ ...EMPTY });
//   const [saving, setSaving] = useState(false);
//   const [togglingId, setTogglingId] = useState(null);

//   // An active package with the same member count blocks another
//   // package from becoming active.
//   const hasActivePackage = useCallback(
//     (memberCount, excludeId = null) =>
//       list.some(
//         (pkg) =>
//           normalizeId(pkg._id) !== normalizeId(excludeId) &&
//           Number(pkg.member_count) === Number(memberCount) &&
//           normalizeStatus(pkg.status) === "active"
//       ),
//     [list]
//   );

//   // Load packages from the backend.
//   const fetchPackages = useCallback(async () => {
//     setLoading(true);

//     try {
//       const response = await getHundi();
//       const body = response?.data;

//       const payload = body?.data ?? body;

//       const packages = Array.isArray(payload)
//         ? payload
//         : Array.isArray(payload?.packages)
//           ? payload.packages
//           : Array.isArray(payload?.data)
//             ? payload.data
//             : null;

//       if (!Array.isArray(packages)) {
//         throw new Error("Invalid Hundi API response.");
//       }

//       setList(packages);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to load Hundi packages."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPackages();
//   }, [fetchPackages]);

//   // Reset and open Add modal.
//   const openAdd = () => {
//     setEditing(null);
//     setForm({ ...EMPTY });
//     setModal(true);
//   };

//   // Open Edit modal.
//   const openEdit = (pkg) => {
//     setEditing(pkg);

//     setForm({
//       name: pkg.name ?? "",
//       member_count: String(pkg.member_count ?? ""),
//       price: String(pkg.price ?? ""),
//       display_order: String(pkg.display_order ?? 0),
//     });

//     setModal(true);
//   };

//   const closeModal = () => {
//     if (saving) return;

//     setModal(false);
//     setEditing(null);
//     setForm({ ...EMPTY });
//   };

//   const updateField = (field, value) => {
//     setForm((previous) => ({
//       ...previous,
//       [field]: value,
//     }));
//   };

//   // All four sizes remain visible.
//   // Only sizes used by another active package are disabled.
//   // During editing, the current package is excluded from the check.
//   const memberOptions = useMemo(
//     () =>
//       INITIAL_MEMBER_COUNTS.map((count) => ({
//         count,
//         disabled: hasActivePackage(count, editing?._id ?? null),
//       })),
//     [hasActivePackage, editing]
//   );

//   // Validate and save.
//   const handleSave = async (event) => {
//     event.preventDefault();

//     if (saving) return;

//     const name = form.name.trim();
//     const memberCount = Number(form.member_count);
//     const price = Number(form.price);
//     const displayOrder = Number(form.display_order);

//     if (!name) {
//       toast.error("Package name is required.");
//       return;
//     }

//     if (
//       form.member_count === "" ||
//       !INITIAL_MEMBER_COUNTS.includes(memberCount) ||
//       memberCount <= 0
//     ) {
//       toast.error("Select 5, 10, 15 or 25 members.");
//       return;
//     }

//     if (
//       form.price.trim() === "" ||
//       !Number.isFinite(price) ||
//       price < 0
//     ) {
//       toast.error("Price must be greater than or equal to 0.");
//       return;
//     }

//     if (
//       form.display_order.trim() === "" ||
//       !Number.isInteger(displayOrder) ||
//       displayOrder < 0
//     ) {
//       toast.error(
//         "Display order must be a non-negative whole number."
//       );
//       return;
//     }

//     // New packages are active by default.
//     // Editing an inactive package must not silently activate it.
//     const intendedStatus = editing
//       ? normalizeStatus(editing.status)
//       : "active";

//     if (
//       intendedStatus === "active" &&
//       hasActivePackage(memberCount, editing?._id ?? null)
//     ) {
//       toast.error(
//         `An active package for ${memberCount} members already exists.`
//       );
//       return;
//     }

//     const payload = {
//       name,
//       member_count: memberCount,
//       price,
//       display_order: displayOrder,
//     };

//     setSaving(true);

//     try {
//       if (editing) {
//         await updateHundi(editing._id, payload);
//         toast.success("Hundi package updated successfully.");
//       } else {
//         await createHundi({
//           ...payload,
//           status: "active",
//         });
//         toast.success("Hundi package created successfully.");
//       }

//       setModal(false);
//       setEditing(null);
//       setForm({ ...EMPTY });

//       await fetchPackages();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to save Hundi package."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Activate or deactivate a package.
//   const toggleStatus = async (pkg) => {
//     if (togglingId !== null || saving) return;

//     const currentStatus = normalizeStatus(pkg.status);

//     if (!["active", "inactive"].includes(currentStatus)) {
//       toast.error("This package has an invalid status.");
//       return;
//     }

//     const nextStatus =
//       currentStatus === "active" ? "inactive" : "active";

//     if (
//       nextStatus === "active" &&
//       hasActivePackage(pkg.member_count, pkg._id)
//     ) {
//       toast.error(
//         `Another active package already uses ${pkg.member_count} members.`
//       );
//       return;
//     }

//     setTogglingId(pkg._id);

//     try {
//       await updateHundiStatus(pkg._id, nextStatus);

//       toast.success(
//         nextStatus === "active"
//           ? "Package enabled successfully."
//           : "Package disabled successfully."
//       );

//       await fetchPackages();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to update package availability."
//       );

//       // Refresh because the backend may have rejected a stale
//       // frontend decision made using an older package list.
//       await fetchPackages();
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   const formatPrice = (price) =>
//     Number(price ?? 0).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });

//   return (
//     <div className="page hundi-page">
//       <div className="page__header">
//         <div>
//           <h2 className="page__title">Hundi Packages</h2>
//           <p className="page__subtitle">
//             Manage member-based packages, prices and availability.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="btn btn--primary hundi-add-btn"
//           onClick={openAdd}
//           disabled={loading || saving || togglingId !== null}
//         >
//           <Plus size={17} />
//           Add Package
//         </button>
//       </div>

//       <div className="section-card">
//         {loading ? (
//           <div className="page-loader">
//             <span className="spinner" />
//           </div>
//         ) : (
//           <div className="table-wrap">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Package Name</th>
//                   <th>Members</th>
//                   <th>Price</th>
//                   <th>Display Order</th>
//                   <th>Availability</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {list.length === 0 ? (
//                   <tr>
//                     <td colSpan={6}>
//                       <div className="empty-state">
//                         No Hundi packages found. Add your first package.
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   [...list]
//                     .sort(
//                       (a, b) =>
//                         Number(a.display_order ?? 0) -
//                         Number(b.display_order ?? 0)
//                     )
//                     .map((pkg) => {
//                       const active =
//                         normalizeStatus(pkg.status) === "active";

//                       return (
//                         <tr key={pkg._id}>
//                           <td>
//                             <strong>{pkg.name}</strong>
//                           </td>

//                           <td>
//                             <span className="hundi-member-badge">
//                               <Users size={14} />
//                               {pkg.member_count} Members
//                             </span>
//                           </td>

//                           <td>
//                             <span className="hundi-price">
//                               ₹{formatPrice(pkg.price)}
//                             </span>
//                           </td>

//                           <td>{pkg.display_order ?? 0}</td>

//                           <td>
//                             <Badge value={pkg.status} />
//                           </td>

//                           <td>
//                             <div className="action-btns">
//                               <button
//                                 type="button"
//                                 className="icon-btn icon-btn--edit"
//                                 title="Edit package"
//                                 aria-label={`Edit ${pkg.name}`}
//                                 disabled={
//                                   togglingId !== null || saving
//                                 }
//                                 onClick={() => openEdit(pkg)}
//                               >
//                                 <Pencil size={15} />
//                               </button>

//                               <button
//                                 type="button"
//                                 className="icon-btn icon-btn--toggle"
//                                 title={
//                                   active
//                                     ? "Disable package"
//                                     : "Enable package"
//                                 }
//                                 aria-label={
//                                   active
//                                     ? `Disable ${pkg.name}`
//                                     : `Enable ${pkg.name}`
//                                 }
//                                 disabled={
//                                   togglingId !== null || saving
//                                 }
//                                 onClick={() => toggleStatus(pkg)}
//                               >
//                                 {togglingId === pkg._id ? (
//                                   <span className="spinner" />
//                                 ) : active ? (
//                                   <ToggleRight size={18} />
//                                 ) : (
//                                   <ToggleLeft size={18} />
//                                 )}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {modal && (
//         <Modal
//           title={
//             editing ? "Edit Hundi Package" : "Add Hundi Package"
//           }
//           onClose={closeModal}
//         >
//           <form
//             className="modal-form hundi-form"
//             onSubmit={handleSave}
//           >
//             <div className="form-group">
//               <label className="form-label" htmlFor="hundi-name">
//                 Package Name *
//               </label>

//               <input
//                 id="hundi-name"
//                 className="form-input"
//                 type="text"
//                 value={form.name}
//                 maxLength={100}
//                 required
//                 disabled={saving}
//                 onChange={(event) =>
//                   updateField("name", event.target.value)
//                 }
//                 placeholder="e.g. Hundi - 5 Members"
//               />
//             </div>

//             <div className="form-group">
//               <label className="form-label" htmlFor="hundi-members">
//                 Package Members *
//               </label>

//               <div className="hundi-select-wrap">
//                 <div className="hundi-select-icon">
//                   <Users size={19} />
//                 </div>

//                 <select
//                   id="hundi-members"
//                   name="member_count"
//                   className="hundi-select"
//                   value={form.member_count}
//                   required
//                   disabled={saving}
//                   onChange={(event) =>
//                     updateField("member_count", event.target.value)
//                   }
//                 >
//                   <option value="" disabled>
//                     Choose your package size
//                   </option>

//                   {memberOptions.map(({ count, disabled }) => (
//                     <option
//                       key={count}
//                       value={String(count)}
//                       disabled={disabled}
//                     >
//                       {count} Members
//                       {disabled ? " (Already Active)" : ""}
//                     </option>
//                   ))}
//                 </select>

//                 <ChevronDown
//                   className="hundi-select-arrow"
//                   size={19}
//                   aria-hidden="true"
//                 />
//               </div>

//               <small className="hundi-help">
//                 <Layers size={13} />
//                 All four sizes are always displayed. A size used by
//                 another active package cannot be selected.
//               </small>

//               {form.member_count !== "" && (
//                 <div className="hundi-selection-preview">
//                   <span className="hundi-preview-icon">
//                     <Users size={17} />
//                   </span>

//                   <span>
//                     <strong>{form.member_count} Members</strong>
//                     <small>Selected package size</small>
//                   </span>

//                   <span className="hundi-preview-check">✓</span>
//                 </div>
//               )}
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label className="form-label" htmlFor="hundi-price">
//                   Price (₹) *
//                 </label>

//                 <div className="hundi-input-with-icon">
//                   <IndianRupee size={17} />

//                   <input
//                     id="hundi-price"
//                     className="form-input"
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     required
//                     disabled={saving}
//                     value={form.price}
//                     onChange={(event) =>
//                       updateField("price", event.target.value)
//                     }
//                     placeholder="Enter price"
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label className="form-label" htmlFor="hundi-order">
//                   Display Order *
//                 </label>

//                 <input
//                   id="hundi-order"
//                   className="form-input"
//                   type="number"
//                   min="0"
//                   step="1"
//                   required
//                   disabled={saving}
//                   value={form.display_order}
//                   onChange={(event) =>
//                     updateField("display_order", event.target.value)
//                   }
//                 />
//               </div>
//             </div>

//             {editing && (
//               <div className="form-group">
//                 <label className="form-label">Availability</label>

//                 <div className="hundi-status-preview">
//                   <Badge value={editing.status} />
//                   <span>
//                     Use the availability toggle in the table to
//                     activate or deactivate this package.
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div className="modal-form__actions">
//               <button
//                 type="button"
//                 className="btn btn--outline"
//                 disabled={saving}
//                 onClick={closeModal}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="btn btn--primary"
//                 disabled={saving}
//               >
//                 {saving ? (
//                   <>
//                     <span className="spinner" />
//                     Saving...
//                   </>
//                 ) : editing ? (
//                   "Update Package"
//                 ) : (
//                   <>
//                     <Plus size={16} />
//                     Create Package
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }
// import { useCallback, useEffect, useMemo, useState } from "react";

// import {
//   Plus,
//   Pencil,
//   ToggleLeft,
//   ToggleRight,
//   ChevronDown,
//   Users,
//   IndianRupee,
//   Layers,
//   Trash2,
//   X,
//   AlertTriangle,
// } from "lucide-react";

// import {
//   getHundi,
//   createHundi,
//   updateHundi,
//   updateHundiStatus,
//   deleteHundi,
// } from "../../services/adminService";

// import Modal from "../../components/ui/Modal";
// import Badge from "../../components/ui/Badge";
// import toast from "react-hot-toast";

// import "./Hundi.css";

// const EMPTY = {
//   name: "",
//   member_count: "",
//   price: "",
//   display_order: "0",
//   photo: null,
// };

// const INITIAL_MEMBER_COUNTS = [5, 10, 15, 25];

// const normalizeStatus = (status) =>
//   String(status ?? "").trim().toLowerCase();

// const normalizeId = (id) => String(id ?? "");

// export default function Hundi() {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [modal, setModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({ ...EMPTY });
//   const [photoPreview, setPhotoPreview] = useState("");

//   const [saving, setSaving] = useState(false);
//   const [togglingId, setTogglingId] = useState(null);

//   // Delete states
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);

//   // Check whether another active package uses this member count.
//   const hasActivePackage = useCallback(
//     (memberCount, excludeId = null) =>
//       list.some(
//         (pkg) =>
//           normalizeId(pkg._id) !== normalizeId(excludeId) &&
//           Number(pkg.member_count) === Number(memberCount) &&
//           normalizeStatus(pkg.status) === "active"
//       ),
//     [list]
//   );

//   // Load all Hundi packages.
//   const fetchPackages = useCallback(async () => {
//     setLoading(true);

//     try {
//       const response = await getHundi();
//       const body = response?.data;
//       const payload = body?.data ?? body;

//       const packages = Array.isArray(payload)
//         ? payload
//         : Array.isArray(payload?.packages)
//           ? payload.packages
//           : Array.isArray(payload?.data)
//             ? payload.data
//             : null;

//       if (!Array.isArray(packages)) {
//         throw new Error("Invalid Hundi API response.");
//       }

//       setList(packages);
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to load Hundi packages."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPackages();
//   }, [fetchPackages]);

//   // Open Add modal.
//   const openAdd = () => {
//     setEditing(null);
//     setForm({ ...EMPTY });
//     setPhotoPreview("");
//     setModal(true);
//   };

//   // Open Edit modal.
//   const openEdit = (pkg) => {
//     setEditing(pkg);

//     setForm({
//       name: pkg.name ?? "",
//       member_count: String(pkg.member_count ?? ""),
//       price: String(pkg.price ?? ""),
//       display_order: String(pkg.display_order ?? 0),
//       photo: null,
//     });
//     setPhotoPreview(pkg.image_url || "");

//     setModal(true);
//   };

//   // Close Add/Edit modal.
//   const closeModal = () => {
//     if (saving) return;

//     setModal(false);
//     setEditing(null);
//     setForm({ ...EMPTY });
//     setPhotoPreview("");
//   };

//   // Update form values.
//   const updateField = (field, value) => {
//     setForm((previous) => ({
//       ...previous,
//       [field]: value,
//     }));
//   };

//   const handlePhotoChange = (event) => {
//     const file = event.target.files?.[0] ?? null;
//     setForm((previous) => ({
//       ...previous,
//       photo: file,
//     }));

//     if (file) {
//       setPhotoPreview(URL.createObjectURL(file));
//     } else {
//       setPhotoPreview(editing?.image_url || "");
//     }
//   };

//   // Member-count dropdown.
//   const memberOptions = useMemo(
//     () =>
//       INITIAL_MEMBER_COUNTS.map((count) => ({
//         count,
//         disabled: hasActivePackage(count, editing?._id ?? null),
//       })),
//     [hasActivePackage, editing]
//   );

//   // Create or update a Hundi package.
//   const handleSave = async (event) => {
//     event.preventDefault();

//     if (saving) return;

//     const name = String(form.name ?? "").trim();
//     const memberCount = Number(form.member_count);
//     const price = Number(form.price);
//     const displayOrder = Number(form.display_order);
//     const priceText = String(form.price ?? "").trim();
//     const displayOrderText = String(form.display_order ?? "").trim();

//     if (!name) {
//       toast.error("Package name is required.");
//       return;
//     }

//     if (
//       form.member_count === "" ||
//       !INITIAL_MEMBER_COUNTS.includes(memberCount)
//     ) {
//       toast.error("Select 5, 10, 15 or 25 members.");
//       return;
//     }

//     if (
//       priceText === "" ||
//       !Number.isFinite(price) ||
//       price < 0
//     ) {
//       toast.error("Price must be greater than or equal to 0.");
//       return;
//     }

//     if (
//       displayOrderText === "" ||
//       !Number.isInteger(displayOrder) ||
//       displayOrder < 0
//     ) {
//       toast.error(
//         "Display order must be a non-negative whole number."
//       );
//       return;
//     }

//     const intendedStatus = editing
//       ? normalizeStatus(editing.status)
//       : "active";

//     if (
//       intendedStatus === "active" &&
//       hasActivePackage(memberCount, editing?._id ?? null)
//     ) {
//       toast.error(
//         `An active package for ${memberCount} members already exists.`
//       );
//       return;
//     }

//     const payload = new FormData();
//     payload.append("name", name);
//     payload.append("member_count", String(memberCount));
//     payload.append("price", String(price));
//     payload.append("display_order", String(displayOrder));

//     if (!editing && form.photo) {
//       payload.append("photo", form.photo);
//     }

//     if (editing && form.photo) {
//       payload.append("photo", form.photo);
//     }

//     if (!editing) {
//       payload.append("status", "active");
//     }

//     setSaving(true);

//     try {
//       if (editing) {
//         await updateHundi(editing._id, payload);
//         toast.success("Hundi package updated successfully.");
//       } else {
//         await createHundi(payload);
//         toast.success("Hundi package created successfully.");
//       }

//       setModal(false);
//       setEditing(null);
//       setForm({ ...EMPTY });
//       setPhotoPreview("");

//       await fetchPackages();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to save Hundi package."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Activate or deactivate a package.
//   const toggleStatus = async (pkg) => {
//     if (
//       togglingId !== null ||
//       saving ||
//       deletingId !== null
//     ) {
//       return;
//     }

//     const currentStatus = normalizeStatus(pkg.status);

//     if (!["active", "inactive"].includes(currentStatus)) {
//       toast.error("This package has an invalid status.");
//       return;
//     }

//     const nextStatus =
//       currentStatus === "active" ? "inactive" : "active";

//     if (
//       nextStatus === "active" &&
//       hasActivePackage(pkg.member_count, pkg._id)
//     ) {
//       toast.error(
//         `Another active package already uses ${pkg.member_count} members.`
//       );
//       return;
//     }

//     setTogglingId(pkg._id);

//     try {
//       await updateHundiStatus(pkg._id, nextStatus);

//       toast.success(
//         nextStatus === "active"
//           ? "Package enabled successfully."
//           : "Package disabled successfully."
//       );

//       await fetchPackages();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to update package availability."
//       );

//       await fetchPackages();
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   // Open delete confirmation modal.
//   const openDeleteConfirmation = (pkg) => {
//     if (
//       saving ||
//       togglingId !== null ||
//       deletingId !== null
//     ) {
//       return;
//     }

//     setDeleteTarget(pkg);
//   };

//   // Cancel deletion.
//   const cancelDelete = () => {
//     if (deletingId !== null) return;

//     setDeleteTarget(null);
//   };

//   // Delete the selected package.
//   const handleDelete = async () => {
//     if (!deleteTarget || deletingId !== null) return;

//     const packageId = deleteTarget._id;

//     if (!packageId) {
//       toast.error("Invalid Hundi package ID.");
//       return;
//     }

//     setDeletingId(packageId);

//     try {
//       await deleteHundi(packageId);

//       // Remove the deleted package immediately from the UI.
//       setList((previous) =>
//         previous.filter(
//           (pkg) => normalizeId(pkg._id) !== normalizeId(packageId)
//         )
//       );

//       setDeleteTarget(null);

//       toast.success(
//         `${deleteTarget.name} deleted successfully.`
//       );

//       // Refresh from the database.
//       await fetchPackages();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to delete Hundi package."
//       );
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Format price in Indian currency style.
//   const formatPrice = (price) =>
//     Number(price ?? 0).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });

//   return (
//     <div className="page hundi-page">
//       {/* Page Header */}
//       <div className="page__header">
//         <div>
//           <h2 className="page__title">Hundi Packages</h2>

//           <p className="page__subtitle">
//             Manage member-based packages, prices and availability.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="btn btn--primary hundi-add-btn"
//           onClick={openAdd}
//           disabled={
//             loading ||
//             saving ||
//             togglingId !== null ||
//             deletingId !== null
//           }
//         >
//           <Plus size={17} />
//           Add Package
//         </button>
//       </div>

//       {/* Hundi Packages Table */}
//       <div className="section-card">
//         {loading ? (
//           <div className="page-loader">
//             <span className="spinner" />
//           </div>
//         ) : (
//           <div className="table-wrap">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Package Name</th>
//                   <th>Members</th>
//                   <th>Price</th>
//                   <th>Display Order</th>
//                   <th>Availability</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {list.length === 0 ? (
//                   <tr>
//                     <td colSpan={6}>
//                       <div className="empty-state">
//                         No Hundi packages found. Add your first package.
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   [...list]
//                     .sort(
//                       (a, b) =>
//                         Number(a.display_order ?? 0) -
//                         Number(b.display_order ?? 0)
//                     )
//                     .map((pkg) => {
//                       const active =
//                         normalizeStatus(pkg.status) === "active";

//                       const deleting =
//                         normalizeId(deletingId) ===
//                         normalizeId(pkg._id);

//                       return (
//                         <tr key={pkg._id}>
//                           <td>
//                             <strong>{pkg.name}</strong>
//                           </td>

//                           <td>
//                             <span className="hundi-member-badge">
//                               <Users size={14} />
//                               {pkg.member_count} Members
//                             </span>
//                           </td>

//                           <td>
//                             <span className="hundi-price">
//                               ₹{formatPrice(pkg.price)}
//                             </span>
//                           </td>

//                           <td>{pkg.display_order ?? 0}</td>

//                           <td>
//                             <Badge value={pkg.status} />
//                           </td>

//                           <td>
//                             <div className="action-btns">
//                               {/* Edit */}
//                               <button
//                                 type="button"
//                                 className="icon-btn icon-btn--edit"
//                                 title="Edit package"
//                                 aria-label={`Edit ${pkg.name}`}
//                                 disabled={
//                                   togglingId !== null ||
//                                   saving ||
//                                   deletingId !== null
//                                 }
//                                 onClick={() => openEdit(pkg)}
//                               >
//                                 <Pencil size={15} />
//                               </button>

//                               {/* Activate / Deactivate */}
//                               <button
//                                 type="button"
//                                 className="icon-btn icon-btn--toggle"
//                                 title={
//                                   active
//                                     ? "Disable package"
//                                     : "Enable package"
//                                 }
//                                 aria-label={
//                                   active
//                                     ? `Disable ${pkg.name}`
//                                     : `Enable ${pkg.name}`
//                                 }
//                                 disabled={
//                                   togglingId !== null ||
//                                   saving ||
//                                   deletingId !== null
//                                 }
//                                 onClick={() => toggleStatus(pkg)}
//                               >
//                                 {togglingId === pkg._id ? (
//                                   <span className="spinner" />
//                                 ) : active ? (
//                                   <ToggleRight size={18} />
//                                 ) : (
//                                   <ToggleLeft size={18} />
//                                 )}
//                               </button>

//                               {/* DELETE BUTTON */}
//                               <button
//                                 type="button"
//                                 className="icon-btn hundi-delete-btn"
//                                 title="Delete package"
//                                 aria-label={`Delete ${pkg.name}`}
//                                 disabled={
//                                   deletingId !== null ||
//                                   saving ||
//                                   togglingId !== null
//                                 }
//                                 onClick={() =>
//                                   openDeleteConfirmation(pkg)
//                                 }
//                               >
//                                 {deleting ? (
//                                   <span className="spinner" />
//                                 ) : (
//                                   <Trash2 size={16} />
//                                 )}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ADD / EDIT MODAL */}
//       {modal && (
//         <Modal
//           title={
//             editing ? "Edit Hundi Package" : "Add Hundi Package"
//           }
//           onClose={closeModal}
//         >
//           <form
//             className="modal-form hundi-form"
//             onSubmit={handleSave}
//           >
//             <div className="form-group">
//               <label className="form-label" htmlFor="hundi-name">
//                 Package Name *
//               </label>

//               <input
//                 id="hundi-name"
//                 className="form-input"
//                 type="text"
//                 value={form.name}
//                 maxLength={100}
//                 required
//                 disabled={saving}
//                 onChange={(event) =>
//                   updateField("name", event.target.value)
//                 }
//                 placeholder="e.g. Hundi - 5 Members"
//               />
//             </div>

//             <div className="form-group">
//               <label
//                 className="form-label"
//                 htmlFor="hundi-members"
//               >
//                 Package Members *
//               </label>

//               <div className="hundi-select-wrap">
//                 <div className="hundi-select-icon">
//                   <Users size={19} />
//                 </div>

//                 <select
//                   id="hundi-members"
//                   name="member_count"
//                   className="hundi-select"
//                   value={form.member_count}
//                   required
//                   disabled={saving}
//                   onChange={(event) =>
//                     updateField(
//                       "member_count",
//                       event.target.value
//                     )
//                   }
//                 >
//                   <option value="" disabled>
//                     Choose your package size
//                   </option>

//                   {memberOptions.map(({ count, disabled }) => (
//                     <option
//                       key={count}
//                       value={String(count)}
//                       disabled={disabled}
//                     >
//                       {count} Members
//                       {disabled ? " (Already Active)" : ""}
//                     </option>
//                   ))}
//                 </select>

//                 <ChevronDown
//                   className="hundi-select-arrow"
//                   size={19}
//                   aria-hidden="true"
//                 />
//               </div>

//               <small className="hundi-help">
//                 <Layers size={13} />
//                 All four sizes remain visible. A size used by
//                 another active package cannot be selected.
//               </small>

//               {form.member_count !== "" && (
//                 <div className="hundi-selection-preview">
//                   <span className="hundi-preview-icon">
//                     <Users size={17} />
//                   </span>

//                   <span>
//                     <strong>
//                       {form.member_count} Members
//                     </strong>
//                     <small>Selected package size</small>
//                   </span>

//                   <span className="hundi-preview-check">✓</span>
//                 </div>
//               )}
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label
//                   className="form-label"
//                   htmlFor="hundi-price"
//                 >
//                   Price (₹) *
//                 </label>

//                 <div className="hundi-input-with-icon">
//                   <IndianRupee size={17} />

//                   <input
//                     id="hundi-price"
//                     className="form-input"
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     required
//                     disabled={saving}
//                     value={form.price}
//                     onChange={(event) =>
//                       updateField("price", event.target.value)
//                     }
//                     placeholder="Enter price"
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label
//                   className="form-label"
//                   htmlFor="hundi-order"
//                 >
//                   Display Order *
//                 </label>

//                 <input
//                   id="hundi-order"
//                   className="form-input"
//                   type="number"
//                   min="0"
//                   step="1"
//                   required
//                   disabled={saving}
//                   value={form.display_order}
//                   onChange={(event) =>
//                     updateField(
//                       "display_order",
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label className="form-label" htmlFor="hundi-photo">
//                 Package Photo
//               </label>

//               <input
//                 id="hundi-photo"
//                 className="form-input"
//                 type="file"
//                 accept="image/*"
//                 disabled={saving}
//                 onChange={handlePhotoChange}
//               />

//               {photoPreview && (
//                 <div className="hundi-photo-preview" style={{ marginTop: 12 }}>
//                   <img
//                     src={photoPreview}
//                     alt="Hundi package preview"
//                     style={{
//                       width: 120,
//                       height: 120,
//                       objectFit: "cover",
//                       borderRadius: 8,
//                       border: "1px solid #dfe3e8",
//                     }}
//                   />
//                 </div>
//               )}
//             </div>

//             {editing && (
//               <div className="form-group">
//                 <label className="form-label">
//                   Availability
//                 </label>

//                 <div className="hundi-status-preview">
//                   <Badge value={editing.status} />
//                   <span>
//                     Use the availability toggle in the table to
//                     activate or deactivate this package.
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div className="modal-form__actions">
//               <button
//                 type="button"
//                 className="btn btn--outline"
//                 disabled={saving}
//                 onClick={closeModal}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="btn btn--primary"
//                 disabled={saving}
//               >
//                 {saving ? (
//                   <>
//                     <span className="spinner" />
//                     Saving...
//                   </>
//                 ) : editing ? (
//                   "Update Package"
//                 ) : (
//                   <>
//                     <Plus size={16} />
//                     Create Package
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {deleteTarget && (
//         <Modal
//           title="Delete Hundi Package"
//           onClose={cancelDelete}
//         >
//           <div className="hundi-delete-confirm">
//             <div className="hundi-delete-warning-icon">
//               <AlertTriangle size={30} />
//             </div>

//             <h3>Are you sure you want to delete?</h3>

//             <p>
//               You are about to delete{" "}
//               <strong>{deleteTarget.name}</strong>, the package for{" "}
//               <strong>
//                 {deleteTarget.member_count} members
//               </strong>
//               .
//             </p>

//             <p className="hundi-delete-note">
//               This action permanently removes the package from
//               the database. This cannot be undone.
//             </p>

//             <div className="modal-form__actions">
//               <button
//                 type="button"
//                 className="btn btn--outline"
//                 disabled={deletingId !== null}
//                 onClick={cancelDelete}
//               >
//                 <X size={16} />
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 className="btn hundi-delete-confirm-btn"
//                 disabled={deletingId !== null}
//                 onClick={handleDelete}
//               >
//                 {deletingId !== null ? (
//                   <>
//                     <span className="spinner" />
//                     Deleting...
//                   </>
//                 ) : (
//                   <>
//                     <Trash2 size={16} />
//                     Delete Package
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }
// import { useCallback, useEffect, useMemo, useState } from "react";

// import {
//   Plus,
//   Pencil,
//   ToggleLeft,
//   ToggleRight,
//   ChevronDown,
//   Users,
//   IndianRupee,
//   Layers,
//   Trash2,
//   X,
//   AlertTriangle,
// } from "lucide-react";

// import {
//   getHundi,
//   createHundi,
//   updateHundi,
//   updateHundiStatus,
//   deleteHundi,
// } from "../../services/adminService";

// import Modal from "../../components/ui/Modal";
// import Badge from "../../components/ui/Badge";
// import toast from "react-hot-toast";

// import "./Hundi.css";

// const EMPTY = {
//   name: "",
//   member_count: "",
//   price: "",
//   display_order: "0",
//   photo: null,
// };

// const INITIAL_MEMBER_COUNTS = [5, 10, 15, 25];

// const normalizeStatus = (status) =>
//   String(status ?? "").trim().toLowerCase();

// const normalizeId = (id) => String(id ?? "");

// // Backend origin used to build full image URLs.
// // Strips a trailing /api or /api/admin and falls back to the local Express server.
// const API_ORIGIN =
//   String(
//     import.meta.env?.VITE_API_URL ||
//       import.meta.env?.VITE_BASE_URL ||
//       import.meta.env?.VITE_API_BASE_URL ||
//       ""
//   )
//     .replace(/\/api(\/admin)?\/?$/i, "")
//     .replace(/\/+$/, "") || "http://localhost:5000";

// // Read the image value from whichever field the backend uses.
// const getRawImage = (pkg) => {
//   if (!pkg) return "";

//   const value =
//     pkg.image_url ||
//     pkg.imageUrl ||
//     pkg.image ||
//     pkg.photo ||
//     pkg.photo_url ||
//     "";

//   if (Array.isArray(value)) return String(value[0] ?? "");

//   if (value && typeof value === "object") {
//     return String(value.url || value.secure_url || value.path || "");
//   }

//   return String(value ?? "");
// };

// // Convert any stored image value into a URL the browser can load.
// const resolveImageUrl = (value) => {
//   const raw = String(value ?? "").trim();

//   if (!raw) return "";

//   // Already usable: absolute URL, blob preview or base64 data.
//   if (/^(https?:)?\/\//i.test(raw) || /^(blob:|data:)/i.test(raw)) {
//     return raw;
//   }

//   // Relative path from the backend (e.g. /uploads/hundi/a.jpg).
//   const path = raw.replace(/\\/g, "/").replace(/^\/+/, "");

//   return `${API_ORIGIN}/${path}`;
// };

// export default function Hundi() {
//   const [list, setList] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [modal, setModal] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form, setForm] = useState({ ...EMPTY });
//   const [photoPreview, setPhotoPreview] = useState("");

//   const [saving, setSaving] = useState(false);
//   const [togglingId, setTogglingId] = useState(null);

//   // Delete states
//   const [deleteTarget, setDeleteTarget] = useState(null);
//   const [deletingId, setDeletingId] = useState(null);

//   // Track images that failed to load so a placeholder is shown.
//   const [brokenImages, setBrokenImages] = useState({});

//   // Release temporary blob preview URLs to avoid memory leaks.
//   useEffect(() => {
//     if (photoPreview && photoPreview.startsWith("blob:")) {
//       return () => URL.revokeObjectURL(photoPreview);
//     }
//     return undefined;
//   }, [photoPreview]);

//   // Check whether another active package uses this member count.
//   const hasActivePackage = useCallback(
//     (memberCount, excludeId = null) =>
//       list.some(
//         (pkg) =>
//           normalizeId(pkg._id) !== normalizeId(excludeId) &&
//           Number(pkg.member_count) === Number(memberCount) &&
//           normalizeStatus(pkg.status) === "active"
//       ),
//     [list]
//   );

//   // Load all Hundi packages.
//   const fetchPackages = useCallback(async () => {
//     setLoading(true);

//     try {
//       const response = await getHundi();
//       const body = response?.data;
//       const payload = body?.data ?? body;

//       const packages = Array.isArray(payload)
//         ? payload
//         : Array.isArray(payload?.packages)
//           ? payload.packages
//           : Array.isArray(payload?.data)
//             ? payload.data
//             : null;

//       if (!Array.isArray(packages)) {
//         throw new Error("Invalid Hundi API response.");
//       }

//       setList(packages);
//       setBrokenImages({});
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           error.message ||
//           "Failed to load Hundi packages."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchPackages();
//   }, [fetchPackages]);

//   // Open Add modal.
//   const openAdd = () => {
//     setEditing(null);
//     setForm({ ...EMPTY });
//     setPhotoPreview("");
//     setModal(true);
//   };

//   // Open Edit modal.
//   const openEdit = (pkg) => {
//     setEditing(pkg);

//     setForm({
//       name: pkg.name ?? "",
//       member_count: String(pkg.member_count ?? ""),
//       price: String(pkg.price ?? ""),
//       display_order: String(pkg.display_order ?? 0),
//       photo: null,
//     });
//     setPhotoPreview(resolveImageUrl(getRawImage(pkg)));

//     setModal(true);
//   };

//   // Close Add/Edit modal.
//   const closeModal = () => {
//     if (saving) return;

//     setModal(false);
//     setEditing(null);
//     setForm({ ...EMPTY });
//     setPhotoPreview("");
//   };

//   // Update form values.
//   const updateField = (field, value) => {
//     setForm((previous) => ({
//       ...previous,
//       [field]: value,
//     }));
//   };

//   const handlePhotoChange = (event) => {
//     const file = event.target.files?.[0] ?? null;

//     if (file && !file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file.");
//       event.target.value = "";
//       return;
//     }

//     setForm((previous) => ({
//       ...previous,
//       photo: file,
//     }));

//     if (file) {
//       setPhotoPreview(URL.createObjectURL(file));
//     } else {
//       setPhotoPreview(resolveImageUrl(getRawImage(editing)));
//     }
//   };

//   // Member-count dropdown.
//   const memberOptions = useMemo(
//     () =>
//       INITIAL_MEMBER_COUNTS.map((count) => ({
//         count,
//         disabled: hasActivePackage(count, editing?._id ?? null),
//       })),
//     [hasActivePackage, editing]
//   );

//   // Create or update a Hundi package.
//   const handleSave = async (event) => {
//     event.preventDefault();

//     if (saving) return;

//     const name = String(form.name ?? "").trim();
//     const memberCount = Number(form.member_count);
//     const price = Number(form.price);
//     const displayOrder = Number(form.display_order);
//     const priceText = String(form.price ?? "").trim();
//     const displayOrderText = String(form.display_order ?? "").trim();

//     if (!name) {
//       toast.error("Package name is required.");
//       return;
//     }

//     if (
//       form.member_count === "" ||
//       !INITIAL_MEMBER_COUNTS.includes(memberCount)
//     ) {
//       toast.error("Select 5, 10, 15 or 25 members.");
//       return;
//     }

//     if (
//       priceText === "" ||
//       !Number.isFinite(price) ||
//       price < 0
//     ) {
//       toast.error("Price must be greater than or equal to 0.");
//       return;
//     }

//     if (
//       displayOrderText === "" ||
//       !Number.isInteger(displayOrder) ||
//       displayOrder < 0
//     ) {
//       toast.error(
//         "Display order must be a non-negative whole number."
//       );
//       return;
//     }

//     const intendedStatus = editing
//       ? normalizeStatus(editing.status)
//       : "active";

//     if (
//       intendedStatus === "active" &&
//       hasActivePackage(memberCount, editing?._id ?? null)
//     ) {
//       toast.error(
//         `An active package for ${memberCount} members already exists.`
//       );
//       return;
//     }

//     const payload = new FormData();
//     payload.append("name", name);
//     payload.append("member_count", String(memberCount));
//     payload.append("price", String(price));
//     payload.append("display_order", String(displayOrder));

//     if (!editing && form.photo) {
//       payload.append("photo", form.photo);
//     }

//     if (editing && form.photo) {
//       payload.append("photo", form.photo);
//     }

//     if (!editing) {
//       payload.append("status", "active");
//     }

//     setSaving(true);

//     try {
//       if (editing) {
//         await updateHundi(editing._id, payload);
//         toast.success("Hundi package updated successfully.");
//       } else {
//         await createHundi(payload);
//         toast.success("Hundi package created successfully.");
//       }

//       setModal(false);
//       setEditing(null);
//       setForm({ ...EMPTY });
//       setPhotoPreview("");

//       await fetchPackages();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to save Hundi package."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   // Activate or deactivate a package.
//   const toggleStatus = async (pkg) => {
//     if (
//       togglingId !== null ||
//       saving ||
//       deletingId !== null
//     ) {
//       return;
//     }

//     const currentStatus = normalizeStatus(pkg.status);

//     if (!["active", "inactive"].includes(currentStatus)) {
//       toast.error("This package has an invalid status.");
//       return;
//     }

//     const nextStatus =
//       currentStatus === "active" ? "inactive" : "active";

//     if (
//       nextStatus === "active" &&
//       hasActivePackage(pkg.member_count, pkg._id)
//     ) {
//       toast.error(
//         `Another active package already uses ${pkg.member_count} members.`
//       );
//       return;
//     }

//     setTogglingId(pkg._id);

//     try {
//       await updateHundiStatus(pkg._id, nextStatus);

//       toast.success(
//         nextStatus === "active"
//           ? "Package enabled successfully."
//           : "Package disabled successfully."
//       );

//       await fetchPackages();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to update package availability."
//       );

//       await fetchPackages();
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   // Open delete confirmation modal.
//   const openDeleteConfirmation = (pkg) => {
//     if (
//       saving ||
//       togglingId !== null ||
//       deletingId !== null
//     ) {
//       return;
//     }

//     setDeleteTarget(pkg);
//   };

//   // Cancel deletion.
//   const cancelDelete = () => {
//     if (deletingId !== null) return;

//     setDeleteTarget(null);
//   };

//   // Delete the selected package.
//   const handleDelete = async () => {
//     if (!deleteTarget || deletingId !== null) return;

//     const packageId = deleteTarget._id;

//     if (!packageId) {
//       toast.error("Invalid Hundi package ID.");
//       return;
//     }

//     setDeletingId(packageId);

//     try {
//       await deleteHundi(packageId);

//       // Remove the deleted package immediately from the UI.
//       setList((previous) =>
//         previous.filter(
//           (pkg) => normalizeId(pkg._id) !== normalizeId(packageId)
//         )
//       );

//       setDeleteTarget(null);

//       toast.success(
//         `${deleteTarget.name} deleted successfully.`
//       );

//       // Refresh from the database.
//       await fetchPackages();
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Failed to delete Hundi package."
//       );
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // Format price in Indian currency style.
//   const formatPrice = (price) =>
//     Number(price ?? 0).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });

//   return (
//     <div className="page hundi-page">
//       {/* Page Header */}
//       <div className="page__header">
//         <div>
//           <h2 className="page__title">Hundi Packages</h2>

//           <p className="page__subtitle">
//             Manage member-based packages, prices and availability.
//           </p>
//         </div>

//         <button
//           type="button"
//           className="btn btn--primary hundi-add-btn"
//           onClick={openAdd}
//           disabled={
//             loading ||
//             saving ||
//             togglingId !== null ||
//             deletingId !== null
//           }
//         >
//           <Plus size={17} />
//           Add Package
//         </button>
//       </div>

//       {/* Hundi Packages Table */}
//       <div className="section-card">
//         {loading ? (
//           <div className="page-loader">
//             <span className="spinner" />
//           </div>
//         ) : (
//           <div className="table-wrap">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Photo</th>
//                   <th>Package Name</th>
//                   <th>Members</th>
//                   <th>Price</th>
//                   <th>Display Order</th>
//                   <th>Availability</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {list.length === 0 ? (
//                   <tr>
//                     <td colSpan={7}>
//                       <div className="empty-state">
//                         No Hundi packages found. Add your first package.
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   [...list]
//                     .sort(
//                       (a, b) =>
//                         Number(a.display_order ?? 0) -
//                         Number(b.display_order ?? 0)
//                     )
//                     .map((pkg) => {
//                       const active =
//                         normalizeStatus(pkg.status) === "active";

//                       const deleting =
//                         normalizeId(deletingId) ===
//                         normalizeId(pkg._id);

//                       const imageUrl = resolveImageUrl(
//                         getRawImage(pkg)
//                       );

//                       const imageBroken =
//                         brokenImages[normalizeId(pkg._id)];

//                       return (
//                         <tr key={pkg._id}>
//                           <td>
//                             {imageUrl && !imageBroken ? (
//                               <img
//                                 src={imageUrl}
//                                 alt={pkg.name}
//                                 loading="lazy"
//                                 style={{
//                                   width: 48,
//                                   height: 48,
//                                   objectFit: "cover",
//                                   borderRadius: 8,
//                                   border: "1px solid #dfe3e8",
//                                   display: "block",
//                                 }}
//                                 onError={() => {
//                                   console.warn(
//                                     "Hundi image failed to load:",
//                                     imageUrl
//                                   );
//                                   setBrokenImages((previous) => ({
//                                     ...previous,
//                                     [normalizeId(pkg._id)]: true,
//                                   }));
//                                 }}
//                               />
//                             ) : (
//                               <div
//                                 title={
//                                   imageUrl
//                                     ? `Image failed to load: ${imageUrl}`
//                                     : "No image saved for this package"
//                                 }
//                                 style={{
//                                   width: 48,
//                                   height: 48,
//                                   borderRadius: 8,
//                                   border: "1px dashed #c4cdd5",
//                                   background: "#f4f6f8",
//                                   color: "#919eab",
//                                   fontSize: 10,
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   textAlign: "center",
//                                 }}
//                               >
//                                 {imageUrl ? "Load failed" : "No image"}
//                               </div>
//                             )}
//                           </td>

//                           <td>
//                             <strong>{pkg.name}</strong>
//                           </td>

//                           <td>
//                             <span className="hundi-member-badge">
//                               <Users size={14} />
//                               {pkg.member_count} Members
//                             </span>
//                           </td>

//                           <td>
//                             <span className="hundi-price">
//                               ₹{formatPrice(pkg.price)}
//                             </span>
//                           </td>

//                           <td>{pkg.display_order ?? 0}</td>

//                           <td>
//                             <Badge value={pkg.status} />
//                           </td>

//                           <td>
//                             <div className="action-btns">
//                               {/* Edit */}
//                               <button
//                                 type="button"
//                                 className="icon-btn icon-btn--edit"
//                                 title="Edit package"
//                                 aria-label={`Edit ${pkg.name}`}
//                                 disabled={
//                                   togglingId !== null ||
//                                   saving ||
//                                   deletingId !== null
//                                 }
//                                 onClick={() => openEdit(pkg)}
//                               >
//                                 <Pencil size={15} />
//                               </button>

//                               {/* Activate / Deactivate */}
//                               <button
//                                 type="button"
//                                 className="icon-btn icon-btn--toggle"
//                                 title={
//                                   active
//                                     ? "Disable package"
//                                     : "Enable package"
//                                 }
//                                 aria-label={
//                                   active
//                                     ? `Disable ${pkg.name}`
//                                     : `Enable ${pkg.name}`
//                                 }
//                                 disabled={
//                                   togglingId !== null ||
//                                   saving ||
//                                   deletingId !== null
//                                 }
//                                 onClick={() => toggleStatus(pkg)}
//                               >
//                                 {togglingId === pkg._id ? (
//                                   <span className="spinner" />
//                                 ) : active ? (
//                                   <ToggleRight size={18} />
//                                 ) : (
//                                   <ToggleLeft size={18} />
//                                 )}
//                               </button>

//                               {/* DELETE BUTTON */}
//                               <button
//                                 type="button"
//                                 className="icon-btn hundi-delete-btn"
//                                 title="Delete package"
//                                 aria-label={`Delete ${pkg.name}`}
//                                 disabled={
//                                   deletingId !== null ||
//                                   saving ||
//                                   togglingId !== null
//                                 }
//                                 onClick={() =>
//                                   openDeleteConfirmation(pkg)
//                                 }
//                               >
//                                 {deleting ? (
//                                   <span className="spinner" />
//                                 ) : (
//                                   <Trash2 size={16} />
//                                 )}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ADD / EDIT MODAL */}
//       {modal && (
//         <Modal
//           title={
//             editing ? "Edit Hundi Package" : "Add Hundi Package"
//           }
//           onClose={closeModal}
//         >
//           <form
//             className="modal-form hundi-form"
//             onSubmit={handleSave}
//           >
//             <div className="form-group">
//               <label className="form-label" htmlFor="hundi-name">
//                 Package Name *
//               </label>

//               <input
//                 id="hundi-name"
//                 className="form-input"
//                 type="text"
//                 value={form.name}
//                 maxLength={100}
//                 required
//                 disabled={saving}
//                 onChange={(event) =>
//                   updateField("name", event.target.value)
//                 }
//                 placeholder="e.g. Hundi - 5 Members"
//               />
//             </div>

//             <div className="form-group">
//               <label
//                 className="form-label"
//                 htmlFor="hundi-members"
//               >
//                 Package Members *
//               </label>

//               <div className="hundi-select-wrap">
//                 <div className="hundi-select-icon">
//                   <Users size={19} />
//                 </div>

//                 <select
//                   id="hundi-members"
//                   name="member_count"
//                   className="hundi-select"
//                   value={form.member_count}
//                   required
//                   disabled={saving}
//                   onChange={(event) =>
//                     updateField(
//                       "member_count",
//                       event.target.value
//                     )
//                   }
//                 >
//                   <option value="" disabled>
//                     Choose your package size
//                   </option>

//                   {memberOptions.map(({ count, disabled }) => (
//                     <option
//                       key={count}
//                       value={String(count)}
//                       disabled={disabled}
//                     >
//                       {count} Members
//                       {disabled ? " (Already Active)" : ""}
//                     </option>
//                   ))}
//                 </select>

//                 <ChevronDown
//                   className="hundi-select-arrow"
//                   size={19}
//                   aria-hidden="true"
//                 />
//               </div>

//               <small className="hundi-help">
//                 <Layers size={13} />
//                 All four sizes remain visible. A size used by
//                 another active package cannot be selected.
//               </small>

//               {form.member_count !== "" && (
//                 <div className="hundi-selection-preview">
//                   <span className="hundi-preview-icon">
//                     <Users size={17} />
//                   </span>

//                   <span>
//                     <strong>
//                       {form.member_count} Members
//                     </strong>
//                     <small>Selected package size</small>
//                   </span>

//                   <span className="hundi-preview-check">✓</span>
//                 </div>
//               )}
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label
//                   className="form-label"
//                   htmlFor="hundi-price"
//                 >
//                   Price (₹) *
//                 </label>

//                 <div className="hundi-input-with-icon">
//                   <IndianRupee size={17} />

//                   <input
//                     id="hundi-price"
//                     className="form-input"
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     required
//                     disabled={saving}
//                     value={form.price}
//                     onChange={(event) =>
//                       updateField("price", event.target.value)
//                     }
//                     placeholder="Enter price"
//                   />
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label
//                   className="form-label"
//                   htmlFor="hundi-order"
//                 >
//                   Display Order *
//                 </label>

//                 <input
//                   id="hundi-order"
//                   className="form-input"
//                   type="number"
//                   min="0"
//                   step="1"
//                   required
//                   disabled={saving}
//                   value={form.display_order}
//                   onChange={(event) =>
//                     updateField(
//                       "display_order",
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label className="form-label" htmlFor="hundi-photo">
//                 Package Photo
//               </label>

//               <input
//                 id="hundi-photo"
//                 className="form-input"
//                 type="file"
//                 accept="image/*"
//                 disabled={saving}
//                 onChange={handlePhotoChange}
//               />

//               {photoPreview && (
//                 <div className="hundi-photo-preview" style={{ marginTop: 12 }}>
//                   <img
//                     src={photoPreview}
//                     alt="Hundi package preview"
//                     style={{
//                       width: 120,
//                       height: 120,
//                       objectFit: "cover",
//                       borderRadius: 8,
//                       border: "1px solid #dfe3e8",
//                     }}
//                     onError={() => setPhotoPreview("")}
//                   />
//                 </div>
//               )}
//             </div>

//             {editing && (
//               <div className="form-group">
//                 <label className="form-label">
//                   Availability
//                 </label>

//                 <div className="hundi-status-preview">
//                   <Badge value={editing.status} />
//                   <span>
//                     Use the availability toggle in the table to
//                     activate or deactivate this package.
//                   </span>
//                 </div>
//               </div>
//             )}

//             <div className="modal-form__actions">
//               <button
//                 type="button"
//                 className="btn btn--outline"
//                 disabled={saving}
//                 onClick={closeModal}
//               >
//                 Cancel
//               </button>

//               <button
//                 type="submit"
//                 className="btn btn--primary"
//                 disabled={saving}
//               >
//                 {saving ? (
//                   <>
//                     <span className="spinner" />
//                     Saving...
//                   </>
//                 ) : editing ? (
//                   "Update Package"
//                 ) : (
//                   <>
//                     <Plus size={16} />
//                     Create Package
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}

//       {/* DELETE CONFIRMATION MODAL */}
//       {deleteTarget && (
//         <Modal
//           title="Delete Hundi Package"
//           onClose={cancelDelete}
//         >
//           <div className="hundi-delete-confirm">
//             <div className="hundi-delete-warning-icon">
//               <AlertTriangle size={30} />
//             </div>

//             <h3>Are you sure you want to delete?</h3>

//             <p>
//               You are about to delete{" "}
//               <strong>{deleteTarget.name}</strong>, the package for{" "}
//               <strong>
//                 {deleteTarget.member_count} members
//               </strong>
//               .
//             </p>

//             <p className="hundi-delete-note">
//               This action permanently removes the package from
//               the database. This cannot be undone.
//             </p>

//             <div className="modal-form__actions">
//               <button
//                 type="button"
//                 className="btn btn--outline"
//                 disabled={deletingId !== null}
//                 onClick={cancelDelete}
//               >
//                 <X size={16} />
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 className="btn hundi-delete-confirm-btn"
//                 disabled={deletingId !== null}
//                 onClick={handleDelete}
//               >
//                 {deletingId !== null ? (
//                   <>
//                     <span className="spinner" />
//                     Deleting...
//                   </>
//                 ) : (
//                   <>
//                     <Trash2 size={16} />
//                     Delete Package
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Users,
  IndianRupee,
  Layers,
  Trash2,
  X,
  AlertTriangle,
  CalendarDays,
  Clock,
  Store,
  Truck,
} from "lucide-react";

import {
  getHundi,
  getHundiPreorder,
  createHundi,
  updateHundi,
  updateHundiStatus,
  deleteHundi,
} from "../../services/adminService";

import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import toast from "react-hot-toast";

import "./Hundi.css";

const EMPTY = {
  name: "",
  member_count: "",
  price: "",
  display_order: "0",
  photo: null,
};

const INITIAL_MEMBER_COUNTS = [5, 10, 15, 25];

const normalizeStatus = (status) =>
  String(status ?? "").trim().toLowerCase();

const normalizeId = (id) => String(id ?? "");

// Backend origin used to build full image URLs.
// Strips a trailing /api or /api/admin and falls back to the local Express server.
const API_ORIGIN =
  String(
    import.meta.env?.VITE_API_URL ||
      import.meta.env?.VITE_BASE_URL ||
      import.meta.env?.VITE_API_BASE_URL ||
      ""
  )
    .replace(/\/api(\/admin)?\/?$/i, "")
    .replace(/\/+$/, "") || "http://localhost:5000";

// Read the image value from whichever field the backend uses.
const getRawImage = (pkg) => {
  if (!pkg) return "";

  const value =
    pkg.image_url ||
    pkg.imageUrl ||
    pkg.image ||
    pkg.photo ||
    pkg.photo_url ||
    "";

  if (Array.isArray(value)) return String(value[0] ?? "");

  if (value && typeof value === "object") {
    return String(value.url || value.secure_url || value.path || "");
  }

  return String(value ?? "");
};

// Convert any stored image value into a URL the browser can load.
const resolveImageUrl = (value) => {
  const raw = String(value ?? "").trim();

  if (!raw) return "";

  // Already usable: absolute URL, blob preview or base64 data.
  if (/^(https?:)?\/\//i.test(raw) || /^(blob:|data:)/i.test(raw)) {
    return raw;
  }

  // Relative path from the backend (e.g. /uploads/hundi/a.jpg).
  const path = raw.replace(/\\/g, "/").replace(/^\/+/, "");

  return `${API_ORIGIN}/${path}`;
};

/* ------------------------------------------------------------------ */
/* PRE-ORDER SETTINGS AND HELPERS                                      */
/* Change opening/closing time, lead time and charges here.            */
/* ------------------------------------------------------------------ */

const getTomorrowIstDate = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type) => parts.find((part) => part.type === type)?.value;
  const [year, month, day] = [get("year"), get("month"), get("day")].map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1))
    .toISOString()
    .slice(0, 10);
};

// "17:00" -> "5:00 PM"
function formatTime12(value) {
  const [hours, minutes] = String(value ?? "").split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return value ?? "-";
  }

  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

const formatMoney = (value) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Inline styles for the pre-order modal (so Hundi.css is not touched).
const preorderStyles = {
  wrap: { display: "flex", flexDirection: "column", gap: 16 },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: "12px 14px",
    background: "#fafbfc",
  },
  cardTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 600,
    marginBottom: 8,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    padding: "6px 0",
    fontSize: 14,
  },
  rowLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "#6b7280",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingTop: 10,
    borderTop: "1px dashed #d1d5db",
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
  },
  note: { margin: "8px 0 0", fontSize: 12, color: "#6b7280" },
  tabs: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  tab: (activeTab) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "9px 12px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    border: activeTab ? "1px solid #4f46e5" : "1px solid #d1d5db",
    background: activeTab ? "#eef2ff" : "#fff",
    color: activeTab ? "#4338ca" : "#374151",
  }),
  badge: (open) => ({
    marginLeft: "auto",
    padding: "2px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    background: open ? "#e8f8ee" : "#fdeaea",
    color: open ? "#15803d" : "#b91c1c",
  }),
};

// Pre-order details + pricing for the selected package.
function PreorderModal({ pkg, onClose }) {
  const date = getTomorrowIstDate();
  const [fulfillment, setFulfillment] = useState("pickup");
  const [preorderData, setPreorderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPreorder = async () => {
      setLoading(true);
      try {
        const response = await getHundiPreorder(pkg._id, date);
        if (active) setPreorderData(response?.data?.data ?? null);
      } catch (error) {
        if (active) {
          toast.error(
            error.response?.data?.message ||
              "Failed to load Hundi pre-order availability."
          );
          setPreorderData(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadPreorder();
    return () => {
      active = false;
    };
  }, [pkg._id, date]);

  const info = preorderData?.preorder;
  const selected = preorderData?.[fulfillment];

  return (
    <Modal title={`Pre-order: ${pkg.name}`} onClose={onClose}>
      <div style={preorderStyles.wrap}>
        {/* Date */}
        <div className="form-group">
          <label className="form-label" htmlFor="preorder-date">
            Pre-order Date
          </label>

          <input
            id="preorder-date"
            className="form-input"
            type="date"
            value={date}
            readOnly
            disabled
          />
          <small className="hundi-help">
            Hundi pre-orders are available for tomorrow only.
          </small>
        </div>

        {/* Pre-order details */}
        {loading ? (
          <div style={preorderStyles.card}>Checking tomorrow's availability...</div>
        ) : info ? (
          <div style={preorderStyles.card}>
            <div style={preorderStyles.cardTitle}>
              <CalendarDays size={16} />
              Pre-order
              <span style={preorderStyles.badge(info.isOpen)}>
                {info.isOpen ? "Open" : "Closed"}
              </span>
            </div>

            <div style={preorderStyles.row}>
              <span style={preorderStyles.rowLabel}>Date</span>
              <strong>
                {info.date} ({info.day})
              </strong>
            </div>

            <div style={preorderStyles.row}>
              <span style={preorderStyles.rowLabel}>Is open</span>
              <strong>{info.isOpen ? "true" : "false"}</strong>
            </div>

            <div style={preorderStyles.row}>
              <span style={preorderStyles.rowLabel}>
                <Clock size={13} /> Opening time
              </span>
              <strong>{formatTime12(info.openingTime)}</strong>
            </div>

            <div style={preorderStyles.row}>
              <span style={preorderStyles.rowLabel}>
                <Clock size={13} /> Closing time
              </span>
              <strong>{formatTime12(info.closingTime)}</strong>
            </div>

            {info.message && (
              <p style={preorderStyles.note}>{info.message}</p>
            )}
          </div>
        ) : (
          <div style={preorderStyles.card}>Please select a valid date.</div>
        )}

        {/* Pickup / Delivery */}
        <div style={preorderStyles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={fulfillment === "pickup"}
            style={preorderStyles.tab(fulfillment === "pickup")}
            onClick={() => setFulfillment("pickup")}
          >
            <Store size={15} />
            Pickup
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={fulfillment === "delivery"}
            style={preorderStyles.tab(fulfillment === "delivery")}
            onClick={() => setFulfillment("delivery")}
          >
            <Truck size={15} />
            Delivery
          </button>
        </div>

        {/* Price breakdown */}
        <div style={preorderStyles.card}>
          {selected ? (
            <>
              <div style={preorderStyles.row}>
                <span style={preorderStyles.rowLabel}>
                  Subtotal ({pkg.member_count} members)
                </span>
                <strong>{formatMoney(selected.subtotal)}</strong>
              </div>

              <div style={preorderStyles.row}>
                <span style={preorderStyles.rowLabel}>Packing charge</span>
                <strong>{formatMoney(selected.packingCharge)}</strong>
              </div>

              {fulfillment === "delivery" && (
                <div style={preorderStyles.row}>
                  <span style={preorderStyles.rowLabel}>Delivery charge</span>
                  <strong>{formatMoney(selected.deliveryCharge)}</strong>
                </div>
              )}

              <div style={preorderStyles.totalRow}>
                <span>Total</span>
                <span>{formatMoney(selected.total)}</span>
              </div>
            </>
          ) : (
            <p style={preorderStyles.note}>Pricing is unavailable.</p>
          )}
        </div>

        <div className="modal-form__actions">
          <button
            type="button"
            className="btn btn--outline"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default function Hundi() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [photoPreview, setPhotoPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Pre-order modal state
  const [preorderTarget, setPreorderTarget] = useState(null);

  // Track images that failed to load so a placeholder is shown.
  const [brokenImages, setBrokenImages] = useState({});

  // Release temporary blob preview URLs to avoid memory leaks.
  useEffect(() => {
    if (photoPreview && photoPreview.startsWith("blob:")) {
      return () => URL.revokeObjectURL(photoPreview);
    }
    return undefined;
  }, [photoPreview]);

  // Check whether another active package uses this member count.
  const hasActivePackage = useCallback(
    (memberCount, excludeId = null) =>
      list.some(
        (pkg) =>
          normalizeId(pkg._id) !== normalizeId(excludeId) &&
          Number(pkg.member_count) === Number(memberCount) &&
          normalizeStatus(pkg.status) === "active"
      ),
    [list]
  );

  // Load all Hundi packages.
  const fetchPackages = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getHundi();
      const body = response?.data;
      const payload = body?.data ?? body;

      const packages = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.packages)
          ? payload.packages
          : Array.isArray(payload?.data)
            ? payload.data
            : null;

      if (!Array.isArray(packages)) {
        throw new Error("Invalid Hundi API response.");
      }

      setList(packages);
      setBrokenImages({});
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load Hundi packages."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Open Add modal.
  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY });
    setPhotoPreview("");
    setModal(true);
  };

  // Open Edit modal.
  const openEdit = (pkg) => {
    setEditing(pkg);

    setForm({
      name: pkg.name ?? "",
      member_count: String(pkg.member_count ?? ""),
      price: String(pkg.price ?? ""),
      display_order: String(pkg.display_order ?? 0),
      photo: null,
    });
    setPhotoPreview(resolveImageUrl(getRawImage(pkg)));

    setModal(true);
  };

  // Close Add/Edit modal.
  const closeModal = () => {
    if (saving) return;

    setModal(false);
    setEditing(null);
    setForm({ ...EMPTY });
    setPhotoPreview("");
  };

  // Update form values.
  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    if (file && !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    setForm((previous) => ({
      ...previous,
      photo: file,
    }));

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(resolveImageUrl(getRawImage(editing)));
    }
  };

  // Member-count dropdown.
  const memberOptions = useMemo(
    () =>
      INITIAL_MEMBER_COUNTS.map((count) => ({
        count,
        disabled: hasActivePackage(count, editing?._id ?? null),
      })),
    [hasActivePackage, editing]
  );

  // Create or update a Hundi package.
  const handleSave = async (event) => {
    event.preventDefault();

    if (saving) return;

    const name = String(form.name ?? "").trim();
    const memberCount = Number(form.member_count);
    const price = Number(form.price);
    const displayOrder = Number(form.display_order);
    const priceText = String(form.price ?? "").trim();
    const displayOrderText = String(form.display_order ?? "").trim();

    if (!name) {
      toast.error("Package name is required.");
      return;
    }

    if (
      form.member_count === "" ||
      !INITIAL_MEMBER_COUNTS.includes(memberCount)
    ) {
      toast.error("Select 5, 10, 15 or 25 members.");
      return;
    }

    if (
      priceText === "" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      toast.error("Price must be greater than or equal to 0.");
      return;
    }

    if (
      displayOrderText === "" ||
      !Number.isInteger(displayOrder) ||
      displayOrder < 0
    ) {
      toast.error(
        "Display order must be a non-negative whole number."
      );
      return;
    }

    const intendedStatus = editing
      ? normalizeStatus(editing.status)
      : "active";

    if (
      intendedStatus === "active" &&
      hasActivePackage(memberCount, editing?._id ?? null)
    ) {
      toast.error(
        `An active package for ${memberCount} members already exists.`
      );
      return;
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("member_count", String(memberCount));
    payload.append("price", String(price));
    payload.append("display_order", String(displayOrder));

    if (!editing && form.photo) {
      payload.append("photo", form.photo);
    }

    if (editing && form.photo) {
      payload.append("photo", form.photo);
    }

    if (!editing) {
      payload.append("status", "active");
    }

    setSaving(true);

    try {
      if (editing) {
        await updateHundi(editing._id, payload);
        toast.success("Hundi package updated successfully.");
      } else {
        await createHundi(payload);
        toast.success("Hundi package created successfully.");
      }

      setModal(false);
      setEditing(null);
      setForm({ ...EMPTY });
      setPhotoPreview("");

      await fetchPackages();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to save Hundi package."
      );
    } finally {
      setSaving(false);
    }
  };

  // Activate or deactivate a package.
  const toggleStatus = async (pkg) => {
    if (
      togglingId !== null ||
      saving ||
      deletingId !== null
    ) {
      return;
    }

    const currentStatus = normalizeStatus(pkg.status);

    if (!["active", "inactive"].includes(currentStatus)) {
      toast.error("This package has an invalid status.");
      return;
    }

    const nextStatus =
      currentStatus === "active" ? "inactive" : "active";

    if (
      nextStatus === "active" &&
      hasActivePackage(pkg.member_count, pkg._id)
    ) {
      toast.error(
        `Another active package already uses ${pkg.member_count} members.`
      );
      return;
    }

    setTogglingId(pkg._id);

    try {
      await updateHundiStatus(pkg._id, nextStatus);

      toast.success(
        nextStatus === "active"
          ? "Package enabled successfully."
          : "Package disabled successfully."
      );

      await fetchPackages();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update package availability."
      );

      await fetchPackages();
    } finally {
      setTogglingId(null);
    }
  };

  // Open delete confirmation modal.
  const openDeleteConfirmation = (pkg) => {
    if (
      saving ||
      togglingId !== null ||
      deletingId !== null
    ) {
      return;
    }

    setDeleteTarget(pkg);
  };

  // Cancel deletion.
  const cancelDelete = () => {
    if (deletingId !== null) return;

    setDeleteTarget(null);
  };

  // Delete the selected package.
  const handleDelete = async () => {
    if (!deleteTarget || deletingId !== null) return;

    const packageId = deleteTarget._id;

    if (!packageId) {
      toast.error("Invalid Hundi package ID.");
      return;
    }

    setDeletingId(packageId);

    try {
      await deleteHundi(packageId);

      // Remove the deleted package immediately from the UI.
      setList((previous) =>
        previous.filter(
          (pkg) => normalizeId(pkg._id) !== normalizeId(packageId)
        )
      );

      setDeleteTarget(null);

      toast.success(
        `${deleteTarget.name} deleted successfully.`
      );

      // Refresh from the database.
      await fetchPackages();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete Hundi package."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Format price in Indian currency style.
  const formatPrice = (price) =>
    Number(price ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="page hundi-page">
      {/* Page Header */}
      <div className="page__header">
        <div>
          <h2 className="page__title">Hundi Packages</h2>

          <p className="page__subtitle">
            Manage member-based packages, prices and availability.
          </p>
        </div>

        <button
          type="button"
          className="btn btn--primary hundi-add-btn"
          onClick={openAdd}
          disabled={
            loading ||
            saving ||
            togglingId !== null ||
            deletingId !== null
          }
        >
          <Plus size={17} />
          Add Package
        </button>
      </div>

      {/* Hundi Packages Table */}
      <div className="section-card">
        {loading ? (
          <div className="page-loader">
            <span className="spinner" />
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Package Name</th>
                  <th>Members</th>
                  <th>Price</th>
                  <th>Display Order</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {list.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="empty-state">
                        No Hundi packages found. Add your first package.
                      </div>
                    </td>
                  </tr>
                ) : (
                  [...list]
                    .sort(
                      (a, b) =>
                        Number(a.display_order ?? 0) -
                        Number(b.display_order ?? 0)
                    )
                    .map((pkg) => {
                      const active =
                        normalizeStatus(pkg.status) === "active";

                      const deleting =
                        normalizeId(deletingId) ===
                        normalizeId(pkg._id);

                      const imageUrl = resolveImageUrl(
                        getRawImage(pkg)
                      );

                      const imageBroken =
                        brokenImages[normalizeId(pkg._id)];

                      return (
                        <tr key={pkg._id}>
                          <td>
                            {imageUrl && !imageBroken ? (
                              <img
                                src={imageUrl}
                                alt={pkg.name}
                                loading="lazy"
                                style={{
                                  width: 48,
                                  height: 48,
                                  objectFit: "cover",
                                  borderRadius: 8,
                                  border: "1px solid #dfe3e8",
                                  display: "block",
                                }}
                                onError={() => {
                                  console.warn(
                                    "Hundi image failed to load:",
                                    imageUrl
                                  );
                                  setBrokenImages((previous) => ({
                                    ...previous,
                                    [normalizeId(pkg._id)]: true,
                                  }));
                                }}
                              />
                            ) : (
                              <div
                                title={
                                  imageUrl
                                    ? `Image failed to load: ${imageUrl}`
                                    : "No image saved for this package"
                                }
                                style={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: 8,
                                  border: "1px dashed #c4cdd5",
                                  background: "#f4f6f8",
                                  color: "#919eab",
                                  fontSize: 10,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  textAlign: "center",
                                }}
                              >
                                {imageUrl ? "Load failed" : "No image"}
                              </div>
                            )}
                          </td>

                          <td>
                            <strong>{pkg.name}</strong>
                          </td>

                          <td>
                            <span className="hundi-member-badge">
                              <Users size={14} />
                              {pkg.member_count} Members
                            </span>
                          </td>

                          <td>
                            <span className="hundi-price">
                              ₹{formatPrice(pkg.price)}
                            </span>
                          </td>

                          <td>{pkg.display_order ?? 0}</td>

                          <td>
                            <Badge value={pkg.status} />
                          </td>

                          <td>
                            <div className="action-btns">
                              {/* Pre-order details + pricing */}
                              <button
                                type="button"
                                className="icon-btn"
                                title="Pre-order details"
                                aria-label={`Pre-order details for ${pkg.name}`}
                                disabled={
                                  togglingId !== null ||
                                  saving ||
                                  deletingId !== null
                                }
                                onClick={() => setPreorderTarget(pkg)}
                              >
                                <CalendarDays size={15} />
                              </button>

                              {/* Edit */}
                              <button
                                type="button"
                                className="icon-btn icon-btn--edit"
                                title="Edit package"
                                aria-label={`Edit ${pkg.name}`}
                                disabled={
                                  togglingId !== null ||
                                  saving ||
                                  deletingId !== null
                                }
                                onClick={() => openEdit(pkg)}
                              >
                                <Pencil size={15} />
                              </button>

                              {/* Activate / Deactivate */}
                              <button
                                type="button"
                                className="icon-btn icon-btn--toggle"
                                title={
                                  active
                                    ? "Disable package"
                                    : "Enable package"
                                }
                                aria-label={
                                  active
                                    ? `Disable ${pkg.name}`
                                    : `Enable ${pkg.name}`
                                }
                                disabled={
                                  togglingId !== null ||
                                  saving ||
                                  deletingId !== null
                                }
                                onClick={() => toggleStatus(pkg)}
                              >
                                {togglingId === pkg._id ? (
                                  <span className="spinner" />
                                ) : active ? (
                                  <ToggleRight size={18} />
                                ) : (
                                  <ToggleLeft size={18} />
                                )}
                              </button>

                              {/* DELETE BUTTON */}
                              <button
                                type="button"
                                className="icon-btn hundi-delete-btn"
                                title="Delete package"
                                aria-label={`Delete ${pkg.name}`}
                                disabled={
                                  deletingId !== null ||
                                  saving ||
                                  togglingId !== null
                                }
                                onClick={() =>
                                  openDeleteConfirmation(pkg)
                                }
                              >
                                {deleting ? (
                                  <span className="spinner" />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {modal && (
        <Modal
          title={
            editing ? "Edit Hundi Package" : "Add Hundi Package"
          }
          onClose={closeModal}
        >
          <form
            className="modal-form hundi-form"
            onSubmit={handleSave}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="hundi-name">
                Package Name *
              </label>

              <input
                id="hundi-name"
                className="form-input"
                type="text"
                value={form.name}
                maxLength={100}
                required
                disabled={saving}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                placeholder="e.g. Hundi - 5 Members"
              />
            </div>

            <div className="form-group">
              <label
                className="form-label"
                htmlFor="hundi-members"
              >
                Package Members *
              </label>

              <div className="hundi-select-wrap">
                <div className="hundi-select-icon">
                  <Users size={19} />
                </div>

                <select
                  id="hundi-members"
                  name="member_count"
                  className="hundi-select"
                  value={form.member_count}
                  required
                  disabled={saving}
                  onChange={(event) =>
                    updateField(
                      "member_count",
                      event.target.value
                    )
                  }
                >
                  <option value="" disabled>
                    Choose your package size
                  </option>

                  {memberOptions.map(({ count, disabled }) => (
                    <option
                      key={count}
                      value={String(count)}
                      disabled={disabled}
                    >
                      {count} Members
                      {disabled ? " (Already Active)" : ""}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  className="hundi-select-arrow"
                  size={19}
                  aria-hidden="true"
                />
              </div>

              <small className="hundi-help">
                <Layers size={13} />
                All four sizes remain visible. A size used by
                another active package cannot be selected.
              </small>

              {form.member_count !== "" && (
                <div className="hundi-selection-preview">
                  <span className="hundi-preview-icon">
                    <Users size={17} />
                  </span>

                  <span>
                    <strong>
                      {form.member_count} Members
                    </strong>
                    <small>Selected package size</small>
                  </span>

                  <span className="hundi-preview-check">✓</span>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="hundi-price"
                >
                  Price (₹) *
                </label>

                <div className="hundi-input-with-icon">
                  <IndianRupee size={17} />

                  <input
                    id="hundi-price"
                    className="form-input"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    disabled={saving}
                    value={form.price}
                    onChange={(event) =>
                      updateField("price", event.target.value)
                    }
                    placeholder="Enter price"
                  />
                </div>
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="hundi-order"
                >
                  Display Order *
                </label>

                <input
                  id="hundi-order"
                  className="form-input"
                  type="number"
                  min="0"
                  step="1"
                  required
                  disabled={saving}
                  value={form.display_order}
                  onChange={(event) =>
                    updateField(
                      "display_order",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="hundi-photo">
                Package Photo
              </label>

              <input
                id="hundi-photo"
                className="form-input"
                type="file"
                accept="image/*"
                disabled={saving}
                onChange={handlePhotoChange}
              />

              {photoPreview && (
                <div className="hundi-photo-preview" style={{ marginTop: 12 }}>
                  <img
                    src={photoPreview}
                    alt="Hundi package preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                      border: "1px solid #dfe3e8",
                    }}
                    onError={() => setPhotoPreview("")}
                  />
                </div>
              )}
            </div>

            {editing && (
              <div className="form-group">
                <label className="form-label">
                  Availability
                </label>

                <div className="hundi-status-preview">
                  <Badge value={editing.status} />
                  <span>
                    Use the availability toggle in the table to
                    activate or deactivate this package.
                  </span>
                </div>
              </div>
            )}

            <div className="modal-form__actions">
              <button
                type="button"
                className="btn btn--outline"
                disabled={saving}
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn--primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="spinner" />
                    Saving...
                  </>
                ) : editing ? (
                  "Update Package"
                ) : (
                  <>
                    <Plus size={16} />
                    Create Package
                  </>
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* PRE-ORDER DETAILS MODAL */}
      {preorderTarget && (
        <PreorderModal
          pkg={preorderTarget}
          onClose={() => setPreorderTarget(null)}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <Modal
          title="Delete Hundi Package"
          onClose={cancelDelete}
        >
          <div className="hundi-delete-confirm">
            <div className="hundi-delete-warning-icon">
              <AlertTriangle size={30} />
            </div>

            <h3>Are you sure you want to delete?</h3>

            <p>
              You are about to delete{" "}
              <strong>{deleteTarget.name}</strong>, the package for{" "}
              <strong>
                {deleteTarget.member_count} members
              </strong>
              .
            </p>

            <p className="hundi-delete-note">
              This action permanently removes the package from
              the database. This cannot be undone.
            </p>

            <div className="modal-form__actions">
              <button
                type="button"
                className="btn btn--outline"
                disabled={deletingId !== null}
                onClick={cancelDelete}
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="button"
                className="btn hundi-delete-confirm-btn"
                disabled={deletingId !== null}
                onClick={handleDelete}
              >
                {deletingId !== null ? (
                  <>
                    <span className="spinner" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Package
                  </>
                )}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}