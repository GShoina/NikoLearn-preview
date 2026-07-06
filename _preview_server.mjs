import http from 'http'; import fs from 'fs'; import path from 'path';
const root=process.cwd();
const MIME={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json','.woff2':'font/woff2','.ttf':'font/ttf','.ico':'image/x-icon'};
http.createServer((rq,rs)=>{let f=decodeURIComponent(rq.url.split('?')[0]);if(f==='/')f='/index.html';const fp=path.join(root,f);
 try{const b=fs.readFileSync(fp);rs.writeHead(200,{'Content-Type':MIME[path.extname(fp).toLowerCase()]||'application/octet-stream'});rs.end(b);}catch(e){rs.writeHead(404);rs.end('404');}
}).listen(8099,'127.0.0.1',()=>console.log('PREVIEW LIVE → http://localhost:8099/'));
