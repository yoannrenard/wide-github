// Import the page-mod API
var pageMod = require("sdk/page-mod");

// Create a page mod
// It will run a script whenever a ".org" URL is loaded
// The script replaces the page contents with a message
pageMod.PageMod({
    include: [
        /https:\/\/github.com.*\/compare\/.*/,
        /https:\/\/github.com.*\/commit\/.*/,
        /https:\/\/github.com.*\/pull\/[0-9]*\/files/,
        /https:\/\/github.com.*\/blob\/.*/
    ],
    contentStyleFile: "./css/main.css"
});
