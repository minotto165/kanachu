import { serve } from "bun";
import app from "./index";

const port = Number(process.env.PORT ?? 8080);

serve({ fetch: app.fetch, port });
console.log(`kanachu API listening on http://localhost:${port}`);
