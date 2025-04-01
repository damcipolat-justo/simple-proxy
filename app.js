const express = require('express');
const httpProxy = require('http-proxy');
const cors = require('cors');

const app = express();
const router = express.Router();
const proxy = httpProxy.createProxyServer();

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
app.use(cors());
app.use(router);

app.listen(5000, () => {
  console.log('Reverse-proxy server is running on port 5000');
});
