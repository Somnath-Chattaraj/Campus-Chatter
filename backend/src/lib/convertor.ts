import * as fs from "fs";

function sortWordsInJson() {
  // Read the content of the wordlist.json file
  fs.readFile(
    "wordlist.json",
    "utf-8",
    (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }

      // Parse the JSON content to get the array of words
      let wordsArray: string[] = JSON.parse(data).words;

      // Sort the array of words
      wordsArray.sort();

      // Prepare the JSON object with the sorted words
      const sortedWordsObject: object = {
        words: wordsArray,
      };

      // Stringify the JSON object
      const sortedWordsString: string = JSON.stringify(
        sortedWordsObject,
        null,
        2
      );

      // Write the sorted array back to the wordlist.json file
      fs.writeFile(
        "wordlist.json",
        sortedWordsString,
        (err: NodeJS.ErrnoException | null) => {
          if (err) {
            console.error("Error writing file:", err);
            return;
          }
          console.log("Word list sorted and saved successfully.");
        }
      );
    }
  );
}

sortWordsInJson();
