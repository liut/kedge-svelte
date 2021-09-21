export async function callApi(uri: string, opt?: any = {}): Promise<any> {
  const res = await fetch(uri, opt);
  if (res.ok) {
    const obj = await res.json();
    console.log(obj);
    return obj;
  }
  const text = await res.text();
  throw new Error(text);
}

export async function getSess(): Promise<any> {
  return await callApi('/api/sess');
}

export async function getStats(): Promise<any> {
  return await callApi('/api/stats');
}

export async function getTasks(): Promise<any> {
  return await callApi('/api/torrents');
}

export async function uploadFile(uri: string, file:File, opt?: any = {}): Promise<boolean> {
  const headers = {};
  if (opt.savePath) {
    headers['x-save-path'] = opt.savePath;
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
