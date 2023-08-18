const fs = require("fs");

class Product {
  getAllData() {
    const stream = fs.readFileSync("./data/manga.json", "utf-8");
    return stream;
  }

  addProduct(product) {
    const stream = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
    // stream.push({ ...product, id: stream[stream.length - 1].id + 1 });
    stream.push({
      id: stream[stream.length - 1].id + 1,
      name: product.name,
      price: product.price,
      stock: product.stock,
      author: product.author,
    });
    fs.writeFileSync("./data/manga.json", JSON.stringify(stream), "utf-8");
    return stream[stream.length - 1];
  }

  deleteProductById(id) {
    console.log("Deleting product by ID...");
    this.data = this.data.filter((element) => element.id !== id);
  }
}

module.exports = new Product();
