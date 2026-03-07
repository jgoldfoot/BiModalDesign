/**
 * BiModal Design Framework
 * A design framework for building dual-mode interfaces
 * that work optimally for both humans and AI agents.
 *
 * @see https://github.com/jgoldfoot/BiModalDesign
 */

const { FR1Checker, checkFR1Compliance } = require('./tools/validators/fr1-checker');
const FR1Validator = require('./tools/validators/fr1-validator');
const AgentSimulator = require('./tools/agent-simulator');
const BiModalDesignCLI = require('./tools/bimodal-design-cli');

module.exports = {
  FR1Checker,
  checkFR1Compliance,
  FR1Validator,
  AgentSimulator,
  BiModalDesignCLI,
};
