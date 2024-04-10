// Vercel logs include a request ID. But this Request object has no ID. Why?
export const requestId = () => {
  return Math.random().toString(36).substring(7);
};

export const head = ({
  title = "No title",
  description = "No description",
}) => {
  return `
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/mvp.css">`;
};

export const reportingEndpoints = ({
  report_uri_subdomain = "giacomodebidda",
}) => {
  return [
    `coep_report=https://${report_uri_subdomain}.report-uri.com/a/d/g`,
    `coop_report=https://${report_uri_subdomain}.report-uri.com/a/d/g`,
    `default=https://${report_uri_subdomain}.report-uri.com/a/d/g`,
  ];
};

export const reportTo = ({ report_uri_subdomain = "giacomodebidda" }) => {
  return `{"group":"default","max_age":31536000,"endpoints":[{"url":"https://${report_uri_subdomain}.report-uri.com/a/d/g"}],"include_subdomains":true}`;
};
