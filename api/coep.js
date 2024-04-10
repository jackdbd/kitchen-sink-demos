export const config = {
  runtime: "edge",
};

const errorPage = (err) => {
  const head = ```
  <meta charset="UTF-8">
  <title>COEP demo error</title>
  <meta name="description" content="COEP demo">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/mvp.css">
  ```;

  const body = ```
  <h1>COEP demo error</h1>
  <p>${err.message || "Error"}</p>
  ```;

  const html = ```
  <!DOCTYPE html>
  <html lang="en">
  <head>${head}</head>
  <body>${body}</body>
  ```;

  return html;
};

export async function GET(request, ctx) {
  // Vercel logs include a request ID. But this Request object has no ID. Why?
  const req_id = Math.random().toString(36).substring(7);
  const prefix = `[req_id ${req_id}]`;
  // const [_, qs] = request.url.split("?");
  // console.debug(`${prefix} query string`, qs);

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
  const coep = "require-corp";
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

  // let res;
  // try {
  //   res = await fetch(image_url);
  //   body_elems.push(
  //     `<li><p style="color: green;">image fetched successfully</p></li>`
  //   );
  // } catch (err) {
  //   console.error(`${prefix} could not fetch ${image_url}`);
  //   body_elems.push(`<li><p style="color: red;">${err.message}</p></li>`);
  //   // return new Response(errorPage(err), {
  //   //   status: 400,
  //   // });
  // }

  // let blob;
  // try {
  //   blob = await res.blob();
  //   console.debug(`${prefix} blob.size`, blob.size);
  //   if (blob.size === 0) {
  //     throw new Error("blob.size is 0");
  //   }
  //   body_elems.push(
  //     `<li><p style="color: green;">image data accessed successfully</p></li>`
  //   );

  //   // const img = document.createElement("img");
  //   // img.src = URL.createObjectURL(blob);
  //   // container.value.appendChild(img);
  //   // ol.classList.add("success");
  // } catch (err) {
  //   body_elems.push(`<li><p style="color: red;">${err.message}</p></li>`);
  // }

  // body_elems.push("</ol>");

  const body = `
  <h1>${title}</h1>
  <p>Cross-origin embedding (image)</p>
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

  console.info(`${prefix} serving HTML`);
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // "Access-Control-Allow-Origin": "*",
      "Cross-Origin-Embedder-Policy": `${coep}`,
    },
  });
}
