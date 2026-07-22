import fs from 'node:fs/promises';
import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import type { ViteDevServer } from 'vite';

import type { SsrRenderResult } from './src/entry-server.types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3000;

const rootDir = __dirname;
const clientOutDir = path.resolve(rootDir, 'dist/client');
const serverOutDir = path.resolve(rootDir, 'dist/server');

const MIME_TYPES: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript',
    '.mjs': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.webmanifest': 'application/manifest+json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain',
};

function requestOrigin(req: IncomingMessage): string {
    const protoHeader = req.headers['x-forwarded-proto'];
    const proto = (Array.isArray(protoHeader) ? protoHeader[0] : protoHeader) ?? 'http';
    return `${proto}://${req.headers.host}`;
}

function injectRender(template: string, result: SsrRenderResult): string {
    return template
        .replace(/<title>[^<]*<\/title>/, `<title>${result.title}</title>`)
        .replace('<!--app-head-->', result.headExtra)
        .replace('<!--app-html-->', result.html);
}

async function serveStaticFile(filePath: string, res: ServerResponse): Promise<boolean> {
    try {
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) {
            return false;
        }

        const contentType = MIME_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream';
        const body = await fs.readFile(filePath);
        res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': body.length });
        res.end(body);
        return true;
    } catch {
        return false;
    }
}

/** Resolves `pathname` inside `baseDir`, refusing to escape it via `..` traversal. */
function resolveWithinDir(baseDir: string, pathname: string): string | null {
    const decoded = decodeURIComponent(pathname.split('?')[0] ?? '/');
    const resolved = path.resolve(baseDir, `.${decoded}`);
    if (resolved !== baseDir && !resolved.startsWith(baseDir + path.sep)) {
        return null;
    }
    return resolved;
}

async function createDevServer() {
    const { createServer: createViteServer } = await import('vite');
    const vite: ViteDevServer = await createViteServer({
        root: rootDir,
        server: { middlewareMode: true },
        appType: 'custom',
    });

    vite.middlewares.use(async (req, res, next) => {
        const url = req.originalUrl ?? req.url ?? '/';

        try {
            const templateRaw = await fs.readFile(path.join(rootDir, 'index.html'), 'utf-8');
            let template = await vite.transformIndexHtml(url, templateRaw);

            if (url === '/') {
                const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');
                const result: SsrRenderResult = await render(url, requestOrigin(req));
                template = injectRender(template, result);
            } else {
                template = template.replace('<!--app-head-->', '').replace('<!--app-html-->', '');
            }

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(template);
        } catch (error) {
            vite.ssrFixStacktrace(error as Error);
            next(error);
        }
    });

    return http.createServer(vite.middlewares);
}

async function createProdServer() {
    const templateHtml = await fs.readFile(path.join(clientOutDir, 'index.html'), 'utf-8');

    const serverEntryFiles = await fs.readdir(serverOutDir);
    const serverEntryFile = serverEntryFiles.find(file => /^entry-server.*\.m?js$/.test(file));
    if (!serverEntryFile) {
        throw new Error(`Could not find the built SSR entry in ${serverOutDir}. Run \`bun run build:ssr\` first.`);
    }

    const { render } = (await import(pathToFileURL(path.join(serverOutDir, serverEntryFile)).href)) as {
        render: (url: string, origin: string) => Promise<SsrRenderResult>;
    };

    return http.createServer(async (req, res) => {
        try {
            const url = req.url ?? '/';
            const pathname = url.split('?')[0] ?? '/';

            if (pathname === '/') {
                const result = await render(pathname, requestOrigin(req));
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(injectRender(templateHtml, result));
                return;
            }

            const assetPath = resolveWithinDir(clientOutDir, pathname);
            if (assetPath && (await serveStaticFile(assetPath, res))) {
                return;
            }

            // SPA fallback — every non-landing route (dashboard, authenticated views, …)
            // stays CSR, served as the plain static shell just like the S3 deploy today.
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(templateHtml);
        } catch (error) {
            console.error(error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    });
}

async function main() {
    const server = isProduction ? await createProdServer() : await createDevServer();

    server.listen(port, () => {
        console.log(
            `SSR server listening on http://localhost:${port} (${isProduction ? 'production' : 'development'})`
        );
    });
}

main();
