import { head, requestId, reportingEndpoints, reportTo } from "./shared.js";

export const config = {
  runtime: "edge",
};

export async function GET(request, ctx) {
  const prefix = `[req_id ${requestId()}]`;
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
  const coop = "same-origin";

  const title = `COOP: ${coop}`;
  const description = `Demo of Cross-Origin-Opener-Policy: ${coop}`;

  // If a cross-origin document with COOP is opened in a new window,
  // the opening document will not have a reference to it, and the window.opener
  // property of the new window will be null.

  const script = `
  <script>
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed")
    const div = document.getElementById("cross-origin-isolated-check")
    console.log("is this page crossOriginIsolated?", self.crossOriginIsolated)
    if (self.crossOriginIsolated) {
      div.innerHTML = '<p>This website is cross-origin isolated.</p>'
    } else {
      div.innerHTML = '<p>This website is <strong>not</strong> cross-origin isolated.</p>'
    }
  });
  </script>`;

  // <p>Vercel region <code>${process.env.VERCEL_REGION}</code></p>

  const body = `
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/api/coop">/api/coop</a></li>
        <li><a href="/api/coep">/api/coep</a></li>
        <li><a href="/api/coop-coep">/api/coop-coep</a></li>
      </ul>
    </nav>
    <h1>${title}</h1>
  </header>
  <main>
    <p>${description}</p>
    <p>COOP reports will be sent to Report URI</p>
    <div id="cross-origin-isolated-check"></div>
  </main>
  ${script}`;

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
      "Cross-Origin-Opener-Policy": `same-origin; report-to="coop_report"`,
      "Reporting-Endpoints": reporting_endpoints.join(", "),
      "Report-To": reportTo({ report_uri_subdomain }),
    },
  });
}
