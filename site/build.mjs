/* Earthed — ساخت نسخه‌ی میزبانی: کپی صفحه در dist/ */
import { cp, rm, mkdir } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist");
await cp("index.html", "dist/index.html");
await cp("assets", "dist/assets", { recursive: true });
console.log("ساخته شد در dist/");
