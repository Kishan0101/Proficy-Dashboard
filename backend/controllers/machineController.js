const Machine = require("../models/Machine");

const getMachines = async (req, res) => {
  const machines = await Machine.find();
  res.json(machines);
};

const addMachine = async (req, res) => {
  const { name, status } = req.body;
  const machine = new Machine({ name, status });
  await machine.save();
  res.json(machine);
};

const deleteMachine = async (req, res) => {
  await Machine.findByIdAndDelete(req.params.id);
  res.json({ message: "Machine deleted" });
};

module.exports = { getMachines, addMachine, deleteMachine };
