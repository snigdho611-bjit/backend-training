const events = require("events");

const emitter = new events();

emitter.on("test", (data) => {
  console.log(data);
});

emitter.emit("test", { message: "Trigger" });
