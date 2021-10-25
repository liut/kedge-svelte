export async function callApi(uri: string, opt?: any = {}): Promise<any> {
  const res = await fetch(uri, opt);
  if (res.ok) {
    if (res.status === 204) {
      return true
    }
    const obj = await res.json();
    console.log(obj);
    return obj;
  }
  const text = await res.text();
  throw new Error(text);
}

export async function getSessionInfo(): Promise<any> {
  return await callApi('/api/session/info');
}

export async function getSessionStats(): Promise<any> {
  return await callApi('/api/session/stats');
}

export async function getTasks(): Promise<any> {
  return await callApi('/api/torrents');
}

export async function deleteTask(hash:string, withData: false): Promise<any> {
  let uri = '/api/torrent/'+hash
  if (withData) uri += "/with_data"
  return await callApi(uri, {
    method: 'DELETE'
  });
}

export async function getTaskFiles(hash:string): Promise<any> {
  const uri = '/api/torrent/'+hash+'/files'
  return await callApi(uri)
}

export async function getTaskPeers(hash:string): Promise<any> {
  const uri = '/api/torrent/'+hash+'/peers'
  return await callApi(uri)
}

export async function uploadFile(uri: string, file:File, opt?: any = {}): Promise<boolean> {
  const headers = new Headers;
  if (opt.savePath) {
    headers.append('x-save-path', opt.savePath)
  }
  const request = new Request(uri, {
    method: "POST",
    headers: headers,
    body: file,
    cache: "no-store"
  });

  const upload = settings => fetch(settings);

  // TODO: progress

  const res = await upload(request);

  if (res.ok) {
    return true;
  }
  const text = await res.text();
  throw new Error(text);
}

export async function uploadTorrent(file:File, opt?: any): Promise<boolean> {
  return uploadFile('/api/torrents', file, opt)
}

export async function uploadMagnet(uri:string, opt?: any): Promise<any> {
  const headers = new Headers;
  if (opt.savePath) {
    headers.append('x-save-path', opt.savePath)
  }
  headers.append('x-magnet-link', 'yes')

  return callApi('/api/torrents',{
    method: 'POST',
    headers,
    body: new Blob([uri], {type: 'binary/octet-stream'}),
    cache: "no-store"
  })
}
