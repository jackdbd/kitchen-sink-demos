import { head, requestId, reportingEndpoints, reportTo } from "./shared.js";

export const config = {
  runtime: "edge",
};

export async function GET(request, ctx) {
  const prefix = `[req_id ${requestId()}]`;

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
  const coep = "require-corp";

  const title = `COEP: ${coep}`;
  const description = `Demo of Cross-Origin-Embedder-Policy: ${coep}`;

  const img_src = `https://kitchen-sink-demos.vercel.app/api/corp?image_url=https://www.w3schools.com/images/w3schools_green.jpg`;
  const img_alt = `w3schools test image`;

  const video_width = 320;
  const video_height = 240;
  // https://tools.woolyss.com/html5-audio-video-tester/
  const video_src = "https://woolyss.com/f/vp9-vorbis-spring.webm";

  const body = `
  <h1>${title}</h1>
  <p>Cross-origin embedding (image)</p>
  <p>COEP reports will be sent to Report URI</p>
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
  ${head({ title, description })}
  <body>${body}</body>`;

  const report_uri_subdomain = `giacomodebidda`;
  const reporting_endpoints = reportingEndpoints({ report_uri_subdomain });
  // console.debug(`${prefix} Reporting-Endpoints`, reporting_endpoints);

  console.info(`${prefix} serving HTML`);
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cross-Origin-Embedder-Policy": `${coep}; report-to="coep_report"`,
      "Reporting-Endpoints": reporting_endpoints.join(", "),
      "Report-To": reportTo({ report_uri_subdomain }),
    },
  });
}
