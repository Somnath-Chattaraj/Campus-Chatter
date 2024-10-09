"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortEmailDomains = sortEmailDomains;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Path to the emails.json file
const filePath = path_1.default.join(__dirname, "emails.json");
// Function to read, sort, and write the emails.json file
function sortEmailDomains() {
    // Read the file
    fs_1.default.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }
        // Parse the JSON data
        let domains;
        try {
            domains = JSON.parse(data);
        }
        catch (err) {
            console.error("Error parsing JSON:", err);
            return;
        }
        // Sort the array in place
        domains.sort();
        // Convert the array back to JSON
        const sortedData = JSON.stringify(domains, null, 2);
        // Write the sorted array back to the file
        fs_1.default.writeFile(filePath, sortedData, "utf8", (err) => {
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
