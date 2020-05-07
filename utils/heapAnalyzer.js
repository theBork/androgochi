const heapdump = require('heapdump');

let nextNotificationSize = 50;

module.exports.analyze = () => {
  return heapDump();
}

function heapDump() {
  const memMB = process.memoryUsage().rss / 1048576;

  if (memMB > nextNotificationSize) {
    nextNotificationSize += 50;
    heapdump.writeSnapshot('public/heap-snapshots/' + Date.now() + '.heapsnapshot');
    return `Memory in increased. Created a new one heap snapshot.`;
  } else {
    return `Memory size are almost equal`;
  }
}
