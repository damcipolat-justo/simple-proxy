const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');

const app = express();
const router = express.Router();
const proxy = httpProxy.createProxyServer();

proxy.on('error', (err, req, res) => {
  console.error('❌ Error en el proxy:', err.message);

  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'application/json' });
  }

  res.end(JSON.stringify({
    error: 'Bad Gateway',
    message: 'El servicio de destino no está disponible.'
  }));
});

const searchService = (req, res) => {
  const target = 'https://stag.justo.cloud';
  const newPath = req.originalUrl.replace(/^\/search-service/, ''); // Quitar el prefijo

  console.log(`🔄 Redirigiendo a: ${target}${newPath}`);

  proxy.web(req, res, {
    target,
    changeOrigin: true,
    secure: true,
    xfwd: true,
    headers: {
      'X-Real-IP': req.ip,
      'X-Forwarded-For': req.ip,
      'X-Forwarded-Host': req.hostname,
    },
    selfHandleResponse: false, // Permitir que el proxy maneje la respuesta
  });
};

const cartService = (req, res) => {
  const target = 'https://stag.justo.cloud';
  const newPath = req.originalUrl.replace(/^\/cart-service/, ''); // Quitar el prefijo

  console.log(`🔄 Redirigiendo a: ${target}${newPath}`);

  proxy.web(req, res, {
    target,
    changeOrigin: true,
    secure: true,
    xfwd: true,
    headers: {
      'X-Real-IP': req.ip,
      'X-Forwarded-For': req.ip,
      'X-Forwarded-Host': req.hostname,
    },
    selfHandleResponse: false, // Permitir que el proxy maneje la respuesta
  });
};

const orderStatusBFF = (req, res) => {
  const target = 'http://127.0.0.1:8080';
  const newPath = req.originalUrl.replace(/^\/order-status-bff/, ''); // Quitar el prefijo

  console.log(`🔄 Redirigiendo a: ${target}${newPath}`);

  proxy.web(req, res, {
    target,
    changeOrigin: true,
    secure: true,
    xfwd: true,
    headers: {
      'X-Real-IP': req.ip,
      'X-Forwarded-For': req.ip,
      'X-Forwarded-Host': req.hostname,
    },
    selfHandleResponse: false, // Permitir que el proxy maneje la respuesta
  });
};
  
const myAccountHelpCenter = (req, res) => {
  const target = 'http://127.0.0.1:8081';
  const newPath = req.originalUrl.replace(/^\/myaccount-help-center/, ''); // Ojo con el typo: "myaccont"

  console.log(`🔄 Redirigiendo a: ${target}${newPath}`);

  proxy.web(req, res, {
    target,
    changeOrigin: true,
    secure: true,
    xfwd: true,
    headers: {
      'X-Real-IP': req.ip,
      'X-Forwarded-For': req.ip,
      'X-Forwarded-Host': req.hostname,
    },
    selfHandleResponse: false, // Permitir que el proxy maneje la respuesta
  });
};

router.use('/order-status-bff/', orderStatusBFF);
router.use('/myaccount-help-center/', myAccountHelpCenter);
router.use('/search-service/', searchService);
router.use('/cart-service/', cartService);
app.use(cors());
app.use(router);

app.listen(5000, () => {
  console.log('Reverse-proxy server is running on port 5000');
});

