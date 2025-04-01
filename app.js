const http = require('http');
const httpProxy = require('http-proxy');

// Lista de servicios a balancear
const targets = [
    { host: 'http://localhost:3001' },
    { host: 'http://localhost:3002' },
    { host: 'http://localhost:3003' }
];

let currentTarget = 0;
const proxy = httpProxy.createProxyServer({});

// Servidor Load Balancer
const server = http.createServer((req, res) => {
    const target = targets[currentTarget];
    currentTarget = (currentTarget + 1) % targets.length; // Round-robin
    console.log(`Routing request to: ${target.host}`);
    proxy.web(req, res, { target: target.host }, (err) => {
        console.error(`Error proxying request to ${target.host}:`, err.message);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end('Bad Gateway');
    });
});

server.listen(8080, () => {
    console.log('Load balancer running on http://localhost:8080');
});
