"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Import the CommonJS module for __dirname and rename it
const currentDir = require("./dirNameHelper");
// Function to check if an email has a valid college domain
function checkCollegeEmail(email) {
    const filePath = path_1.default.join(currentDir, "emails.json");
    const domains = JSON.parse(fs_1.default.readFileSync(filePath, "utf8"));
    // Extract the domain from the email
    const emailDomain = email.split("@")[1];
    // Perform binary search
    return binarySearch(domains, emailDomain);
}
// Function to perform binary search on a sorted array
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midVal = arr[mid];
        if (midVal === target) {
            return true;
        }
        else if (midVal < target) {
            left = mid + 1;
        }
        else {
            right = mid - 1;
        }
    }
    return false;
}
exports.default = checkCollegeEmail;
