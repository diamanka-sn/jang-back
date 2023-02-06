const app = require('./app')
const http = require('http')
const server = http.createServer(app);

const ipAdress = '127.0.0.1';
const port = 3000;

app.set('port', process.env.PORT || 3000, ipAdress)

server.listen(process.env.PORT || 3000, ipAdress)

server.listen(port, ipAdress, () => {
  console.log(`Server running at http://${ipAdress}:${port}/`);
});