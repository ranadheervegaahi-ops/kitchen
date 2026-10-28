import { useEffect, useRef, useState } from 'react'
import { Plus, Search, Pencil, ToggleLeft, ToggleRight, ImagePlus, X, Trash2 } from 'lucide-react'
import { getCategories, createCategory, updateCategory, updateCategoryStatus, deleteCategory } from '../../services/adminService'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'

const EMPTY = { name: '', description: '', display_order: 0 }

export default function Categories() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const fileRef = useRef()

  const loadList = async () => {
    setLoading(true)
    try {
      const { data } = await getCategories({ search, status: statusFilter })
      setList(data.data)
    } catch {
      toast.error('Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadList() }, [search, statusFilter])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY)
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
    setModal(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setForm({ name: cat.name, description: cat.description || '', display_order: cat.display_order })
    setImageFile(null)
    setImagePreview(cat.image_url ? `http://localhost:5000${cat.image_url}` : null)
    if (fileRef.current) fileRef.current.value = ''
    setModal(true)
  }

  const closeModal = () => {
    if (saving) return
    setModal(false)
    setImageFile(null)
    setImagePreview(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { toast.error('Only JPG, PNG, WEBP allowed.'); e.target.value = ''; return }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB.'); e.target.value = ''; return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return toast.error('Name is required.')
    setSaving(true)
    try {
      const payload = { ...form, ...(imageFile ? { image: imageFile } : {}) }
      if (editing) {
        await updateCategory(editing._id, payload)
        toast.success('Category updated.')
      } else {
        await createCategory(payload)
        toast.success('Category created.')
      }
      setModal(false)
      setImageFile(null)
      setImagePreview(null)
      loadList()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category.')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (cat) => {
    const next = cat.status === 'active' ? 'inactive' : 'active'
    try {
      await updateCategoryStatus(cat._id, next)
      toast.success(`Category ${next}.`)
      loadList()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status.')
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete || deleting) return
    setDeleting(true)
    try {
      await deleteCategory(confirmDelete._id)
      toast.success('Category deleted.')
      setConfirmDelete(null)
      loadList()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h2 className="page__title">Categories</h2>
          <p className="page__subtitle">Manage food categories</p>
        </div>
        <button className="btn btn--primary" onClick={openAdd}>
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="section-card">
        <div className="section-card__header">
          <div className="filters">
            <div className="search-box">
              <Search size={15} />
              <input placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="page-loader"><span className="spinner" /></div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.length === 0 && (
                  <tr><td colSpan={7}><div className="empty-state">No categories found.</div></td></tr>
                )}
                {list.map((cat, i) => (
                  <tr key={cat._id}>
                    <td>{i + 1}</td>
                    <td>
                      {cat.image_url
                        ? <img src={`http://localhost:5000${cat.image_url}`} alt={cat.name} className="cat-thumb" />
                        : <div className="cat-thumb cat-thumb--empty"><ImagePlus size={16} /></div>}
                    </td>
                    <td><strong>{cat.name}</strong></td>
                    <td>{cat.description || '—'}</td>
                    <td>{cat.display_order}</td>
                    <td><Badge value={cat.status} /></td>
                    <td>
                      <div className="action-btns">
                        <button className="icon-btn icon-btn--edit" title="Edit" onClick={() => openEdit(cat)}>
                          <Pencil size={15} />
                        </button>
                        <button className="icon-btn icon-btn--toggle" title="Toggle Status" onClick={() => toggleStatus(cat)}>
                          {cat.status === 'active' ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                        <button className="icon-btn icon-btn--delete" title="Delete" onClick={() => setConfirmDelete(cat)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <Modal title={editing ? 'Edit Category' : 'Add Category'} onClose={closeModal}>
          <form className="modal-form" onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
            </div>
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input className="form-input" type="number" min={0} value={form.display_order} onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">Image <span className="form-optional">(JPG, PNG, WEBP · max 5MB)</span></label>
              {imagePreview ? (
                <div className="img-preview-wrap">
                  <img src={imagePreview} alt="preview" className="img-preview" />
                  <button type="button" className="img-preview__remove" onClick={removeImage}><X size={14} /></button>
                </div>
              ) : (
                <div className="img-upload-box" onClick={() => fileRef.current?.click()}>
                  <ImagePlus size={24} />
                  <span>Click to upload image</span>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: 'none' }} onChange={handleImageChange} />
            </div>
            <div className="modal-form__actions">
              <button type="button" className="btn btn--outline" onClick={closeModal} disabled={saving}>Cancel</button>
              <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <Modal title="Delete Category" onClose={() => { if (!deleting) setConfirmDelete(null) }}>
          <div className="modal-form">
            <p>Are you sure you want to delete <strong>{confirmDelete.name}</strong>?</p>
            <p className="page__subtitle" style={{ marginTop: 6 }}>This action cannot be undone.</p>
            <div className="modal-form__actions">
              <button type="button" className="btn btn--outline" onClick={() => setConfirmDelete(null)} disabled={deleting}>Cancel</button>
              <button type="button" className="btn btn--danger" onClick={handleDelete} disabled={deleting}>
                <Trash2 size={15} /> {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
