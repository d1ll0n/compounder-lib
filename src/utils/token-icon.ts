import http from 'http';
import URL from 'url';

export function getTokenIconUrl(address: string): string {
  return `https://raw.githubusercontent.com/trustwallet/tokens/master/tokens/${address}.png`;
}

export function checkValidUrl(url: string): Promise<boolean> {
  const options = {
    method: 'HEAD',
    host: URL.parse(url).host,
    port: 80,
    path: URL.parse(url).pathname
  };

  return new Promise((resolve) => {
    const req = http.request(options, (r) => resolve(r.statusCode== 200));
    req.end();
  });
}