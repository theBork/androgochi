const _ = require(`lodash`);

const { getMotherboardAmperageById } = require(`../../models/motherboard.model`);
const { getProcessorAmperageById } = require(`../../models/processor.model`);
const { getRamAmperageById } = require(`../../models/ram.model`);
const { getDiskAmperageById } = require(`../../models/disk.model`);
const { getVideoCardAmperageById } = require(`../../models/videoCard.model`);
const { getSystemVersionAmperageById } = require(`../../models/system.model`);

module.exports = {
  getAmperage: (player) => {
    let amperage;
    amperage = getMotherboardAmperageById(player.motherboardId);
    amperage += getProcessorAmperageById(player.processorId);
    amperage += getRamAmperageById(player.ramId);
    amperage += getDiskAmperageById(player.diskId);
    amperage += getVideoCardAmperageById(player.videocardId);
    // amperage += getSystemVersionAmperageById(player.systemId, player.systemVersionId);
    return amperage;
  }
}
