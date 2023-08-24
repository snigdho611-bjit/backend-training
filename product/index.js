const fs = require("fs");
const fsPromise = require("fs").promises;
const path = require("path");
const { success, failure } = require("../util/common");

class Product {
  async getAll() {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "products.json"), { encoding: "utf-8" })
      .then((data) => {
        return { success: true, data: data };
      })
      .catch((error) => {
        console.log(error);
        return { success: false };
      });
  }

  async getOneById(id) {
    // const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "products.json"), { encoding: "utf-8" })
      .then((data) => {
        const findData = JSON.parse(data).filter((element) => element.id === Number(id))[0];
        if (findData) {
          return { success: true, data: findData };
        } else {
          return { success: false };
        }
      });
  }

  async add(product) {
    const { title, description, price, rating, stock } = JSON.parse(product);
    const errors = {};
    if (!title || title === "") {
      errors.title = "Title was not provided";
    }
    if (!description || description === "" || description.length <= 10) {
      errors.description =
        "Description should be provided, and it should be at least 15 characters long";
    }
    if (!price || price <= 100) {
      errors.price = "Price should be provided, and it should be at least 100";
    }
    if (!rating || rating > 5 || rating < 0) {
      errors.rating = "Rating should be provided between 0 and 5";
    }
    if (!stock || stock === 0) {
      errors.stock = "Stock should be provided greater than 0";
    }
    if (Object.keys(errors).length > 0) {
      return { success: false, errors: errors };
    }
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "products.json"), { encoding: "utf-8" })
      .then((data) => {
        const jsonData = JSON.parse(data);
        jsonData.push(JSON.parse(product));
        return fsPromise
          .writeFile(path.join(__dirname, "..", "data", "products.json"), JSON.stringify(jsonData))
          .then((data) => {
            return { success: true };
          })
          .catch((err) => {
            return { success: false, errors: "Could not add to file" };
          });
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  }

  updateById(id, product) {
    const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
    let flag = false;
    const updatedData = data.map((element) => {
      if (element.id === id) {
        flag = true;
        if (product.id) {
          return { ...element, ...product, id: element.id };
        }
        return { ...element, ...product };
      }
      return element;
    });

    if (flag) {
      fs.writeFileSync("./data/manga.json", JSON.stringify(updatedData));
      return "Product successfully updated!", updatedData.filter((element) => element.id === id)[0];
    }
    return "ID was not a valid one";
  }

  deletetById(id) {
    const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
    const updatedData = data.filter((element) => element.id !== id);
    if (updatedData) {
      fs.writeFileSync("./data/manga.json", JSON.stringify(updatedData));
      return "Product successfully deletd!";
    }
    return "ID was not a valid one";
  }
}

module.exports = new Product();
