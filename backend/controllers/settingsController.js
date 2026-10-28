const BusinessSetting = require("../models/BusinessSetting");
const BusinessHours = require("../models/BusinessHours");
const { success, error } = require("../utils/response");
const { createAudit } = require("../utils/auditHelper");
const { AUDIT_ACTIONS } = require("../utils/constants");

const BUSINESS_KEYS = ["business_name", "mobile", "email", "address", "whatsapp_number"];
const ORDER_KEYS = ["min_preorder_hours", "timezone", "currency", "order_prefix"];

const getSettingsMap = async (keys) => {
  const settings = await BusinessSetting.find({ key: { $in: keys } });
  const map = {};
  settings.forEach((s) => (map[s.key] = s.value));
  return map;
};

const upsertSettings = async (keys, body) => {
  const ops = keys.filter((k) => body[k] !== undefined).map((k) => ({
    updateOne: { filter: { key: k }, update: { $set: { value: body[k] } }, upsert: true },
  }));
  if (ops.length) await BusinessSetting.bulkWrite(ops);
};

// GET /api/admin/settings/business
const getBusinessSettings = async (req, res) => {
  return success(res, await getSettingsMap(BUSINESS_KEYS));
};

// PUT /api/admin/settings/business
const updateBusinessSettings = async (req, res) => {
  const old_value = await getSettingsMap(BUSINESS_KEYS);
  await upsertSettings(BUSINESS_KEYS, req.body);
  const new_value = await getSettingsMap(BUSINESS_KEYS);
  await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.SETTINGS_CHANGED, entity_type: "BusinessSettings", old_value, new_value, ip_address: req.ip });
  return success(res, new_value, "Business settings updated.");
};

// GET /api/admin/settings/order
const getOrderSettings = async (req, res) => {
  return success(res, await getSettingsMap(ORDER_KEYS));
};

// PUT /api/admin/settings/order
const updateOrderSettings = async (req, res) => {
  const old_value = await getSettingsMap(ORDER_KEYS);
  await upsertSettings(ORDER_KEYS, req.body);
  const new_value = await getSettingsMap(ORDER_KEYS);
  await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.SETTINGS_CHANGED, entity_type: "OrderSettings", old_value, new_value, ip_address: req.ip });
  return success(res, new_value, "Order settings updated.");
};

// GET /api/admin/settings/hours
const getBusinessHours = async (req, res) => {
  const hours = await BusinessHours.find().sort({ _id: 1 });
  return success(res, hours);
};

// PUT /api/admin/settings/hours
const updateBusinessHours = async (req, res) => {
  const { hours } = req.body;
  const ops = hours.map((h) => ({
    updateOne: {
      filter: { day: h.day },
      update: { $set: { is_open: h.is_open, open_time: h.open_time, close_time: h.close_time } },
      upsert: true,
    },
  }));
  await BusinessHours.bulkWrite(ops);
  const updated = await BusinessHours.find().sort({ _id: 1 });
  await createAudit({ admin_id: req.admin._id, action: AUDIT_ACTIONS.SETTINGS_CHANGED, entity_type: "BusinessHours", new_value: hours, ip_address: req.ip });
  return success(res, updated, "Business hours updated.");
};

module.exports = { getBusinessSettings, updateBusinessSettings, getOrderSettings, updateOrderSettings, getBusinessHours, updateBusinessHours };
