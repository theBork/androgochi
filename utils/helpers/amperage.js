const _ = require(`lodash`);

const { getProcessorAmperageById } = require(`../../models/processor.model`);
const { getSystemVersionAmperageById } = require(`../../models/system.model`);

module.exports = {
  getAmperage: (player) => {
    let amperage;
    amperage = getProcessorAmperageById(player.processorId);
    amperage += getSystemVersionAmperageById(player.systemId, player.systemVersionId);
    return amperage;
  }
}
