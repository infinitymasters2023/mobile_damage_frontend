
const next = require("next");

const port = process.env.PORT || 5082;
const dev = false; // <--- force production mode
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  require("http")
    .createServer((req, res) => {
      handle(req, res);
    })
    .listen(port, () => {
      console.log(`🚀 Next.js running in production on http://localhost:${port}`);
    });
});



