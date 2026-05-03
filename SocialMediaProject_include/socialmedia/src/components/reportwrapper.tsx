import React from "react";
import AnalyticsReport from "./reportdata";

export async function renderTemplate(data: any) {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const html = renderToStaticMarkup(React.createElement(AnalyticsReport, data));

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;
}