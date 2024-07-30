const fs = require("fs");
const path = require("path");

// Path to the emails.json file
const filePath = path.join(__dirname, "emails.json");

// Function to read, sort, and write the emails.json file
function sortEmailDomains() {
  // Read the file
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Parse the JSON data
    let domains;
    try {
      domains = JSON.parse(data);
    } catch (err) {
      console.error("Error parsing JSON:", err);
      return;
    }

    // Sort the array
    domains.sort();

    // Convert the array back to JSON
    const sortedData = JSON.stringify(domains, null, 2);

    // Write the sorted array back to the file
    fs.writeFile(filePath, sortedData, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("File sorted successfully.");
    });
  });
}

// Call the function to sort the email domains
sortEmailDomains();
