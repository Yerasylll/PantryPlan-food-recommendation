"""Loopback-only prototype server, not a production backend.
GET /api/catalog and POST /api/recommend expose the Python reference engine.
The browser prototype currently runs the equivalent JS engine; see architecture.
"""
import json
import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from recommender import recommend

ROOT = Path(__file__).resolve().parents[1]


class Handler(SimpleHTTPRequestHandler):
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def reply(self, status, data):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/catalog":
            return self.reply(200, json.loads((ROOT / "catalog.json").read_text()))
        super().do_GET()

    def do_POST(self):
        if self.path != "/api/recommend":
            return self.reply(404, {"error": "Unknown endpoint"})
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if not 0 < size <= 65536:
                return self.reply(400, {"error": "Request body must be 1–65536 bytes"})
            data = json.loads(self.rfile.read(size))
            if not isinstance(data, dict) or not isinstance(
                data.get("profile", {}), dict
            ):
                raise ValueError("Expected an object with a profile object")
            result = recommend(
                json.loads((ROOT / "catalog.json").read_text()),
                data.get("profile", {}),
                data.get("mode", "tfidf"),
                data.get("meal"),
            )
            self.reply(
                200,
                {
                    "method": "tfidf-reference"
                    if data.get("mode", "tfidf") == "tfidf"
                    else "time-baseline",
                    "results": result,
                },
            )
        except (ValueError, TypeError, KeyError, AttributeError) as exc:
            self.reply(400, {"error": str(exc)})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "8091"))
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"PantryPlan: http://127.0.0.1:{port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
