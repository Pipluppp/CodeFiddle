const express = require("express");
const path = require("path");
const morgan = require("morgan");
const https = require("https");
const fs = require("fs");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.type("html");
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Express Template</title>
        <style>
          body {
            margin: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: linear-gradient(135deg, #e0f2fe, #f8fafc);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          main {
            max-width: 540px;
            text-align: center;
            padding: 3rem 2.5rem;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.85);
            box-shadow: 0 24px 60px rgba(37, 99, 235, 0.15);
          }
          h1 {
            font-size: 2.6rem;
            margin-bottom: 1rem;
            color: #0f172a;
          }
          p {
            margin: 0 auto 1.25rem;
            font-size: 1.05rem;
            line-height: 1.6;
            color: #334155;
          }
          code {
            background: rgba(15, 23, 42, 0.08);
            padding: 0.25rem 0.5rem;
            border-radius: 0.5rem;
            font-family: "JetBrains Mono", "Fira Code", monospace;
          }
          .actions {
            margin-top: 2rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }
          .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            border-radius: 0.75rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          .btn-primary {
            background: #2563eb;
            color: white;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
          }
          .btn-primary:hover {
            background: #1d4ed8;
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
          }
          .btn-secondary {
            background: rgba(15, 23, 42, 0.05);
            color: #334155;
          }
          .btn-secondary:hover {
            background: rgba(15, 23, 42, 0.1);
            color: #0f172a;
          }
          .font-mono {
            font-family: "JetBrains Mono", "Fira Code", monospace;
          }
        </style>
      </head>
      <body>
        <main>
          <h1>Express is running 🚀</h1>
          <p>
            This server is served from <code>src/index.js</code>. Modify the route
            handlers and save to see the server reload automatically via nodemon.
          </p>
          <p>
            The terminal panel shows the server logs. Try hitting
            <code>/api/time</code> to see a JSON response.
          </p>
          <div class="actions">
            <a href="/api/time" target="_blank" class="btn btn-primary font-mono">/api/time</a>
            <a href="https://expressjs.com/" target="_blank" class="btn btn-secondary">Express Docs</a>
          </div>
        </main>
      </body>
    </html>
  `);
});

app.get("/api/time", (req, res) => {
  res.json({ now: new Date().toISOString() });
});

const options = {
  key: fs.readFileSync("/certs/privkey.pem"),
  cert: fs.readFileSync("/certs/fullchain.pem"),
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`✅ Secure Express server listening on https://localhost:${PORT}`);
});
