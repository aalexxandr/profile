import { createServer } from "node:http";

import { handleRequest } from "./handler";

// Stands in for the backend where it is not reachable (CI, E2E).
const { port } = new URL(process.env.API_URL ?? "http://localhost:3000");

createServer(async (incoming, outgoing) => {
  const request = new Request(`http://localhost${incoming.url ?? "/"}`, {
    method: incoming.method,
  });
  const response = handleRequest(request);

  outgoing.writeHead(response.status, { "content-type": "application/json" });
  outgoing.end(await response.text());
}).listen(Number(port), () => {
  process.stdout.write(`Stub API listening on port ${port}\n`);
});
