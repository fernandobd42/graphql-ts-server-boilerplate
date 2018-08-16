require("ts-node/register");

// If you want to reference other typescript modules, do it via require:
const { setup } = require('./setup')

module.exports = async () => {
  // Call your initialization methods here.
  await setup()
  return null;
};