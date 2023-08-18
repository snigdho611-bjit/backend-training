const Product = require("./product");

// const allProducts = ;

const main = () => {
  //   const productObj = new Product(allProducts);
  //   productObj.deleteProductById(8);
  const data = Product.addProduct({
    name: "My Hero Academia, Vol. 1",
    price: 9.99,
    stock: 310,
    author: "Kohei Horikoshi",
  });
  console.log(data);
};

main();
