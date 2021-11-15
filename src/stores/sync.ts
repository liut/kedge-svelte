
import utils from '$lib/util';
import velox from '$lib/velox/velox.js';
import { writable } from 'svelte/store';

const syncData = writable({});

const syncObj = {};

let v: { onupdate?: any; };

function formatTasks(tasks) : void {
  if (!tasks) return;
  tasks.map((t : unknown) : void => {
    t.prettyTotal = utils.formatBytes(t.total_wanted);
    t.prettyCompleted = utils.formatBytes(t.total_done);
    t.prettyRateRecv = utils.formatBytes(t.rates);
    t.syncStatus = utils.formatStatus(t.state);
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
    v.onerror = (e, err) => {
      console.log('velox error', e, err)
    }
  }
}

export default {
  v: vInstance,
  subscribe: syncData.subscribe
};
