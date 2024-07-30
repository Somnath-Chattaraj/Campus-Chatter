"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkModerationForString = checkModerationForString;
exports.checkModeration = checkModeration;
const promises_1 = __importDefault(require("fs/promises"));
function binarySearch(items, value) {
    var startIndex = 0, stopIndex = items.length - 1, middle = Math.floor((stopIndex + startIndex) / 2);
    while (items[middle] != value && startIndex < stopIndex) {
        //adjust search area
        if (value < items[middle]) {
            stopIndex = middle - 1;
        }
        else if (value > items[middle]) {
            startIndex = middle + 1;
        }
        //recalculate middle
        middle = Math.floor((stopIndex + startIndex) / 2);
    }
    //make sure it's the right value
    return items[middle] != value ? 0 : 1;
}
function checkModerationForString(content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield promises_1.default.readFile("./src/lib/wordlist.json", "utf8");
            const wordList = JSON.parse(data).words;
            const words = content.split(/\s+/);
            let isClean = true;
            for (let word of words) {
                if (binarySearch(wordList.map((w) => w.toUpperCase()), word.toUpperCase())) {
                    isClean = false;
                    break;
                }
            }
            return isClean;
        }
        catch (err) {
            console.error("Error processing the word list:", err);
            throw err;
        }
    });
}
function checkModeration(req, res, next) {
    const fs = require("fs");
    //for some reason it is taking backend folder as the root folder
    fs.readFile("./src/lib/wordlist.json", (err, data) => {
        if (!err) {
            data = JSON.parse(data);
            let contents = req.body.content;
            let content = contents.split(" ");
            var flag = true;
            for (let i = 0; i < content.length; i++) {
                //  performing the binary searcing
                if (binarySearch(data.words, content[i].toUpperCase())) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                res.status(200);
                res.send("1");
            }
            else {
                res.status(401);
                res.send("0");
            }
        }
    });
}
