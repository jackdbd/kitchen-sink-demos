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

  const handleClick = `function onClick(event) {
    console.group("onClick handler");
    console.log("event", event);
    
    let win = window.open("https://http-response-headers-for-web-security.vercel.app/", "Test Window", "width=640,height=480");
    console.log("attach new window to global object");
    window.other = win;
    console.log("window.other", window.other);

    console.log("window.opener", window.opener);
    console.log("window.other.opener", window.other.opener);

    console.log("window.document", window.document);
    console.log("window.other.document", window.other.document);
    console.groupEnd();
  }`;

  const script = `
  <script>
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed")
    const btn = document.getElementById("btn")
    btn.addEventListener('click', ${handleClick})
    console.log("click handler attached to button")
    console.log("is this page crossOriginIsolated?", self.crossOriginIsolated)
  });
  </script>`;

  const body = `
  <h1>${title}</h1>
  <p>${description}</p>
  <p>Vercel region <code>${process.env.VERCEL_REGION}</code></p>
  <p>COOP reports will be sent to Report URI</p>
  <button id="btn" type="button">Click to call <code>window.open</code></button>
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
      "Cross-Origin-Embedder-Policy": `require-corp; report-to="coep_report"`,
      "Cross-Origin-Opener-Policy": `same-origin; report-to="coop_report"`,
      "Reporting-Endpoints": reporting_endpoints.join(", "),
      "Report-To": reportTo({ report_uri_subdomain }),
    },
  });
}
