export const config = {
  runtime: "edge",
};

export async function GET(request, ctx) {
  return new Response(
    `Hello from /api/coop and Vercel region ${process.env.VERCEL_REGION}`,
    {
      status: 200,
      headers: {
        // "Content-Length": `${blob.size}`,
        // "Access-Control-Allow-Origin": "*",
        // "Content-Type": "image/jpeg",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    }
  );
}
