import { head, requestId } from "./shared.js";

export const config = {
  runtime: "edge",
};

export async function GET(request, ctx) {
  const prefix = `[req_id ${requestId()}]`;

  const title = `Permissions-Policy autoplay`;
  const description = `Demo of the autoplay feature of the Permissions-Policy header.`;

  const video_src = "https://woolyss.com/f/vp9-vorbis-spring.webm";
  const video_width = 320;
  const video_height = 240;
  // const video_attrs = "autoplay loop";
  const video_attrs = "autoplay loop muted";

  const body = `
  <header>
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
      </ul>
    </nav>
    <h1>${title}</h1>
  </header>
  <main>
    <p>${description}</p>
    <p>The HTTP Permissions-Policy header's <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy/autoplay">autoplay</a> directive is used to control which domains, if any, can be used to autoplay media. By default, the autoplay Permissions Policy is set to self, indicating that autoplay is permitted as they're hosted on the same domain as the document.</p>

    <p>Video in a <code>video</code> element.</p>
    <video width=${video_width} height=${video_height} ${video_attrs}>
      <source src="${video_src}" type="video/webm" />
        Video not supported.
    </video>

    <p>Video in an <code>iframe</code>.</p>
    <iframe width="420" height="345" src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1">
    </iframe>
  </main>`;

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  ${head({ title, description })}
  <body>${body}</body>`;

  const reporting_endpoints = [
    `default="https://giacomodebidda.uriports.com/reports"`,
    `csp="https://giacomodebidda.uriports.com/reports"`,
  ].join(", ");

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy/autoplay
  // https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
  const permissions_policy = `autoplay=(), camera=(self), fullscreen=*; report-to="default"`;

  console.info(`${prefix} serving HTML`);
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Permissions-Policy": permissions_policy,
      "Reporting-Endpoints": reporting_endpoints,
    },
  });
}
