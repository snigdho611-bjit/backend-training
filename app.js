const Math = require("./math");
const Math2 = require("./math/index2");
const ObjectA = require("./objectA");
const { str, str2 } = require("./fileA");

const classSum = Math.add(12, 10);
const objectSum = ObjectA.add(5, 10);

console.log(str);
console.log(str2);
console.log("Sum of class method:", classSum);
console.log("Sum of object method:", objectSum);
Math2.myFunc();
