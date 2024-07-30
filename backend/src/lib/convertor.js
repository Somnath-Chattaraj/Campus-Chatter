"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
function sortWordsInJson() {
    // Read the content of the wordlist.json file
    fs.readFile("wordlist.json", "utf-8", function (err, data) {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }
        // Parse the JSON content to get the array of words
        var wordsArray = JSON.parse(data).words;
        // Sort the array of words
        wordsArray.sort();
        // Prepare the JSON object with the sorted words
        var sortedWordsObject = {
            words: wordsArray,
        };
        // Stringify the JSON object
        var sortedWordsString = JSON.stringify(sortedWordsObject, null, 2);
        // Write the sorted array back to the wordlist.json file
        fs.writeFile("wordlist.json", sortedWordsString, function (err) {
            if (err) {
                console.error("Error writing file:", err);
                return;
            }
            console.log("Word list sorted and saved successfully.");
        });
    });
}
sortWordsInJson();
