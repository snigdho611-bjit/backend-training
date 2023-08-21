const events = require("events");
const emitter = new events();
const path = require("path");
const fs = require("fs");

emitter.on("backup", () => {
  const data =  // Read the main file
  const backup = // Read the backup file
  console.log(data.length, backup.length);
  if (JSON.stringify(data) === JSON.stringify(backup)) {
    // Write your code here...
  }
});

setInterval(() => {
  emitter.emit("backup");
}, 5000);
