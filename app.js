const Product = require("./product");

const main = () => {
  // Get all data
  const getAllData = Product.getAll();
  console.log(getAllData);

  // Add new data
  const addData = Product.add({
    name: "My Hero Academia, Vol. 1",
    price: 9.99,
    stock: 42,
    author: "John Doe",
  });
  console.log("Adding data", addData);

  // Get one data by ID
  const getOneByIdData = Product.getOneById(11);
  console.log("Getting data with specific ID", getOneByIdData);
};

main();
