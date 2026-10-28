const mongoose = require('mongoose')

const slotLockSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  token: { type: String },
  expiresAt: { type: Date, required: true },
})

// Cleans up locks left behind by a crash
slotLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 60 })

module.exports = mongoose.model('SlotLock', slotLockSchema)