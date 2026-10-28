let _io = null;

const init = (io) => {
  _io = io;
  io.on("connection", (socket) => {
    // Admin joins their room on connect with token
    socket.on("join_admin", () => socket.join("admins"));
    socket.on("disconnect", () => {});
  });
};

const getIO = () => _io;

// Emit to all connected admins
const emitToAdmins = (event, data) => {
  if (_io) _io.to("admins").emit(event, data);
};

module.exports = { init, getIO, emitToAdmins };
