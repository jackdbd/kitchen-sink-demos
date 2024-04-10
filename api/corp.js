export const config = {
  runtime: "edge",
};

// If you copy and paste this URL in the browser you will see the image. If you
// try to use this URL as the `src` attribute of an `<img>`, it will be blocked by CORP.
// https://kitchen-sink-demos.vercel.app/api/corp?image_url=https://www.w3schools.com/images/w3schools_green.jpg

/**
 * /api/corp
 * Fetch an image, then serve it with `Cross-Origin-Resource-Policy: same-site`.
 */
export async function GET(request, ctx) {
  // Vercel logs include a request ID. But this Request object has no ID. Why?
  const req_id = Math.random().toString(36).substring(7);
  const prefix = `[req_id ${req_id}]`;
  const [_, qs] = request.url.split("?");
  // console.debug(`${prefix} query string`, qs);
  if (!qs) {
    return new Response(`query string not specified`, {
      status: 400,
    });
  }

  // TODO: add query string parser, so I can process a query string like this:
  // image_url=<url>&corp=<same-origin|same-site|cross-origin>
  const [key, value] = qs.split("=");
  if (key !== "image_url") {
    return new Response(`image_url not specified in query string`, {
      status: 400,
    });
  }
  if (!value) {
    return new Response(`image_url not specified`, {
      status: 400,
    });
  }

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Cross-Origin_Resource_Policy
  const corp = "same-site";

  // const image_url_test = `https://corsproxy.io/?https://www.w3schools.com/images/w3schools_green.jpg`;
  // console.debug(`${prefix} URL from w3schools`, image_url_test);
  const image_url = decodeURIComponent(value);
  console.debug(`${prefix} fetching ${image_url} and adding CORP: ${corp}`);

  // TODO: set Content-Type according to the fetched image

  let res;
  try {
    res = await fetch(image_url, { mode: "cors" });
  } catch (err) {
    console.error(`${prefix} could not fetch ${image_url}`, err);
    return new Response(`Could not fetch ${image_url}`, { status: 500 });
  }

  let blob;
  try {
    blob = await res.blob();
    // console.debug(`${prefix} blob.size`, blob.size);
    if (blob.size === 0) {
      return new Response(`blob.size is 0`, { status: 500 });
    }
  } catch (err) {
    console.error(`${prefix} could not read blob`, err);
    return new Response(`Could not read blob`, { status: 500 });
  }

  console.info(`${prefix} serving image`);
  // https://developer.mozilla.org/en-US/docs/Web/API/Response/blob
  return new Response(blob, {
    status: 200,
    headers: {
      // "Content-Length": `${blob.size}`,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "image/jpeg",
      "Cross-Origin-Resource-Policy": `${corp}`,
    },
  });
}
