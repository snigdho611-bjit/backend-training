const events = require("events");

const emitter = new events();

emitter.on("backup", () => {
  console.log(
    `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
  );
});

setInterval(() => {
  emitter.emit("backup");
}, 2000);

// Last updated on: 2023-08-21 09:47:50
