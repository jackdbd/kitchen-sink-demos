export const config = {
  runtime: "edge",
};

export async function GET(request, ctx) {
  // Vercel logs include a request ID. But this Request object has no ID. Why?
  const req_id = Math.random().toString(36).substring(7);
  const prefix = `[req_id ${req_id}]`;

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
  const coep = "require-corp";

  const report_uri_subdomain = `giacomodebidda`;
  const report_to = {
    endpoint_name: "coep_report",
    endpoint_url: `https://${report_uri_subdomain}.report-uri.com/a/d/g`,
  };

  const title = `COEP: ${coep}`;
  const description = `Demo of Cross-Origin-Embedder-Policy: ${coep}`;

  const head = `
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/mvp.css">`;
  // console.debug(`${prefix} <head> prepared`, head);

  const img_src = `https://kitchen-sink-demos.vercel.app/api/corp?image_url=https://www.w3schools.com/images/w3schools_green.jpg`;
  const img_alt = `w3schools test image`;

  const video_width = 320;
  const video_height = 240;
  // https://tools.woolyss.com/html5-audio-video-tester/
  const video_src = "https://woolyss.com/f/vp9-vorbis-spring.webm";

  const body = `
  <h1>${title}</h1>
  <p>Cross-origin embedding (image)</p>
  <p>COEP reports will be sent to the <code>${report_to.endpoint_name}</code> endpoint hosted at <code>${report_to.endpoint_url}</code></p>
  <img src="${img_src}" alt="${img_alt}">
  <p>Cross-origin embedding (video)</p>
  <video width=${video_width} height=${video_height} autoplay loop muted>
    <source src="${video_src}" type="video/webm" />
    Video not supported.
  </video>`;
  // console.debug(`${prefix} <body> prepared`, body);

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>${head}</head>
  <body>${body}</body>`;

  const reporting_endpoints = [
    `${report_to.endpoint_name}="${report_to.endpoint_url}"`,
    `default="https://${report_uri_subdomain}.report-uri.com/a/d/g"`,
  ];
  console.debug(`${prefix} Reporting-Endpoints`, reporting_endpoints);
  const report_to_header = `{"group":"default","max_age":31536000,"endpoints":[{"url":"https://${report_uri_subdomain}.report-uri.com/a/d/g"}],"include_subdomains":true}`;
  console.debug(`${prefix} Report-To`, report_to_header);

  console.info(`${prefix} serving HTML`);
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cross-Origin-Embedder-Policy": `${coep}; report-to="${report_to.endpoint_name}"`,
      "Reporting-Endpoints": reporting_endpoints.join(", "),
      "Report-To": report_to_header,
    },
  });
}
