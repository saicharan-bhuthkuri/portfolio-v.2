import { serve, file } from "bun";
import { turso } from "./src/lib/db";

const PORT = 3000;

console.log(`Server listening on http://localhost:${PORT}`);

serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url);

        // API Route: Handle Contact Form Submission
        if (url.pathname === "/api/contact" && req.method === "POST") {
            try {
                const body = await req.json() as any;
                const { name, email, message } = body;

                if (!name || !email || !message) {
                    return new Response(JSON.stringify({ error: "Missing fields" }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" },
                    });
                }

                await turso.execute({
                    sql: "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
                    args: [name, email, message],
                });

                return new Response(JSON.stringify({ success: true }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                console.error("Error submitting contact form:", error);
                return new Response(JSON.stringify({ error: "Internal Server Error" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        // Static File Serving
        let filePath = url.pathname;
        if (filePath === "/") filePath = "/index.html";

        const publicDir = process.cwd() + "/public";
        const srcFile = file(publicDir + filePath);

        if (await srcFile.exists()) {
            return new Response(srcFile);
        }

        return new Response("Not Found", { status: 404 });
    },
});
