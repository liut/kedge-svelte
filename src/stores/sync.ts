
import utils from '$lib/util';
import velox from 'veloxjs/js/client/velox.js';
import { writable } from 'svelte/store';

const syncData = writable({});

const syncObj = {};

let v: { onupdate?: any; };

function formatStatus(state: number) : string {
  switch (state) {
    case 0:
      return 'waiting'
    case 1:
    case 7:
      return 'checking';
    case 6:
      return 'allocating';
    case 2:
    case 3:
      return 'downloading';
    case 4:
      return 'finished';
    case 5:
      return 'uploading';
    default:
      return '(' + state + ')';
  }
}

function formatTasks(tasks) : void {
  if (!tasks) return;
  tasks.map((t : unknown) : void => {
    t.prettyTotal = utils.formatBytes(t.total_wanted);
    t.prettyCompleted = utils.formatBytes(t.total_done);
    t.prettyRateRecv = utils.formatBytes(t.rates);
    t.syncStatus = formatStatus(t.state);
  });
}

function formatStats(sess) : void {
  sess.prettyRates = utils.formatBytes(sess.rates || 0);
  sess.prettyActives = sess.uptime ? utils.formatSeconds(sess.uptime) : '';
}

// function formatSys(sys) : void {
//   sys.prettyMemory = utils.formatBytes(sys.appMemory || 0);
//   sys.cpuRound = utils.roundNum(sys.cpu || 0);
//   sys.memoryRound = utils.roundNum((100 * sys.memUsed) / sys.memSize);
//   sys.diskRound = utils.roundNum((100 * sys.diskUsed) / sys.diskSize);
// }

function vInstance() : void {
  if (typeof window !== 'undefined') {
    if (v && Object.keys(v).length) return;
    v = velox.ws(`/api/sync`, syncObj);
    v.onupdate = () => {
      formatTasks(syncObj.torrents);
      formatStats(syncObj.stats);
      // formatSys(syncObj.sys);
      syncData.set(syncObj);
    };
  }
}

export default {
  v: vInstance,
  subscribe: syncData.subscribe
};
