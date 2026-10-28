const mongoose = require('mongoose')

const weeklySchema = new mongoose.Schema(
  {
    day: { type: Number, min: 0, max: 6, required: true }, // 0 = Sunday
    open: { type: Boolean, default: true },
    openTime: { type: String, default: '11:00' },
    closeTime: { type: String, default: '22:00' },
  },
  { _id: false }
)

const overrideSchema = new mongoose.Schema(
  { date: { type: String, required: true }, closed: { type: Boolean, required: true } },
  { _id: false }
)

const blockedSchema = new mongoose.Schema(
  { date: { type: String, required: true }, start: { type: String, required: true } },
  { _id: false }
)

const preorderSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'preorder', unique: true },
    leadTimeMinutes: { type: Number, default: 120 },
    slotMinutes: { type: Number, default: 60 },
    capacityPerSlot: { type: Number, default: 2 },
    hundiCapacityPerDay: { type: Number, default: 3 },
    weekly: {
      type: [weeklySchema],
      default: () => [0, 1, 2, 3, 4, 5, 6].map((day) => ({ day, open: day !== 1 })), // Monday closed
    },
    dayOverrides: { type: [overrideSchema], default: [] },
    blockedSlots: { type: [blockedSchema], default: [] },
  },
  { timestamps: true }
)

preorderSettingsSchema.statics.get = async function () {
  const existing = await this.findOne({ key: 'preorder' })
  if (existing) return existing
  try {
    return await this.create({ key: 'preorder' })
  } catch {
    return this.findOne({ key: 'preorder' })
  }
}

module.exports = mongoose.model('PreorderSettings', preorderSettingsSchema)