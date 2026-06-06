const http = require('http');

const endpoints = [
  '/',
  '/health',
  '/test-log?level=info&message=Periodic+check',
  '/test-log?level=info&message=User+login+successful',
  '/test-log?level=info&message=Payment+processed',
  '/test-log?level=warn&message=Potential+issue+detected',
  '/test-log?level=warn&message=High+memory+usage+warning',
  '/test-log?level=error&message=Critical+failure+simulated',
  '/test-log?level=error&message=Database+connection+timeout',
  '/error',
  '/test/error-rate?rate=0.1',
  '/test/error-rate?rate=0.5',
  '/test/error-rate?rate=0.9',
  '/test/not-found',
  '/test/unauthorized',
  '/test/heavy?size=100',
  '/test/heavy?size=500',
  '/test/heavy?size=2000',
  '/users',
  '/users/1',
  '/users/2',
  '/users/3',
  '/users/99',
  '/products',
  '/products/101',
  '/products/102',
  '/products/103',
  '/products/999',
  '/delay?ms=500',
  '/delay?ms=2000',
  '/random-delay?min=100&max=1000',
  '/random-delay?min=500&max=5000',
  '/test/latency?dist=normal',
  '/test/latency?dist=slow',
  '/test/latency?dist=flaky'
];

function hitEndpoint() {
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: endpoint,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Requested ${endpoint}: ${res.statusCode}`);
  });

  req.on('error', (e) => {
    console.error(`Problem with request to ${endpoint}: ${e.message}`);
  });

  req.end();
}

// Hit an endpoint every 2 seconds
setInterval(hitEndpoint, 2000);

// Also hit some endpoints in bursts
setInterval(() => {
  for (let i = 0; i < 5; i++) {
    hitEndpoint();
  }
}, 10000);

console.log('Traffic generator started. Hitting http://localhost:3000...');
