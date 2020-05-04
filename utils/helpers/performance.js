const _ = require(`lodash`);

const { getProcessorPerformanceById } = require(`../../models/processor.model`);
const { getRamPerformanceById } = require(`../../models/ram.model`);
const { getVideoCardPerformanceById } = require(`../../models/videoCard.model`);

module.exports = {
  getPerformance: (player) => {
    let performance;
    performance = getProcessorPerformanceById(player.processorId);
    performance += getRamPerformanceById(player.ramId);
    performance += getVideoCardPerformanceById(player.videocardId);
    return performance;
  }
}
