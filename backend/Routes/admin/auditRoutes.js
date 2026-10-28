const router = require("express").Router();
const { getAuditLogs } = require("../../controllers/auditController");
const auth = require("../../Middleware/authMiddleware");

router.get("/", auth, getAuditLogs);

module.exports = router;
