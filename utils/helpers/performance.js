const _ = require(`lodash`);

const { getProcessorPerformanceById } = require(`../../models/processor.model`);

module.exports = {
  getPerformance: async (player) => {
    let performance;
    performance = getProcessorPerformanceById(player.processorId);
    return performance;
  }
}
