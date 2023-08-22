const events = require("events");
<<<<<<< HEAD
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
=======

const emitter = new events();

emitter.on("backup", () => {
  console.log(
    `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  );
>>>>>>> 6-http-modules
});

setInterval(() => {
  emitter.emit("backup");
<<<<<<< HEAD
}, 5000);
=======
}, 2000);

// Last updated on: 2023-08-21 09:47:50
>>>>>>> 6-http-modules
