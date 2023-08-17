const myObj = {
  methodA: () => {
    console.log("Calling method A from inside Object");
  },
  add: (a, b) => {
    // Return the sum
    return a + b;
  },
  valueB: 5,
};

module.exports = myObj;
