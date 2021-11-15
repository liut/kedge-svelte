
import velox from '$lib/velox/velox.js';
import { writable } from 'svelte/store';

const syncData = writable({});

const syncObj = {};

let v: { onupdate?: any; };

function vInstance() : void {
  if (typeof window !== 'undefined') {
    if (v && Object.keys(v).length) return;
    v = velox.ws(`/api/sync`, syncObj);
    v.onupdate = () => {
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
