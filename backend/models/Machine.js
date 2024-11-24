const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, required: true },
  lastReport: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Machine", MachineSchema);
