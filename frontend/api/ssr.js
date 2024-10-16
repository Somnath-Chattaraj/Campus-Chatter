const fs = require("fs");
const path = require("path");
const { renderToString } = require("react-dom/server");

// Read the client-side HTML template
const template = fs.readFileSync(
  path.resolve(__dirname, "../dist/index.html"),
  "utf-8"
);

// Import the SSR bundle after build
const { render } = require("../dist-ssr/entry-server.js"); // Import SSR bundle

module.exports = async function handler(req, res) {
  try {
    const appHtml = render(); // Render the app to a string
    const html = template.replace(`<!--ssr-outlet-->`, appHtml); // Inject the rendered HTML
    res.status(200).send(html); // Send the rendered HTML to the client
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
