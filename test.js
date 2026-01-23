// test.js - Fichier de test simple
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h1>Serveur Node.js fonctionne!</h1><p>Allez sur <a href="/">OrdoPass</a></p>');
});

server.listen(3000, () => {
  console.log('Test server sur http://localhost:3000');
});