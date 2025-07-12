export async function onRequest(context) {
  return new Response("Xin chào từ Cloudflare Pages Functions!", {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
} 