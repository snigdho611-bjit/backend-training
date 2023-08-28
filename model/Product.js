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
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "products.json"), { encoding: "utf-8" })
      .then((data) => {
        const findData = JSON.parse(data).filter((element) => {
          console.log(id);
          return element.id === Number(id);
        })[0];
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
      errors.description = "Description should be provided, and it should be at least 15 characters long";
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
        const newProduct = JSON.parse(product);
        newProduct.id = jsonData[jsonData.length - 1].id + 1;
        jsonData.push(newProduct);
        return fsPromise
          .writeFile(path.join(__dirname, "..", "data", "products.json"), JSON.stringify(jsonData))
          .then(() => {
            return { success: true };
          })
          .catch((err) => {
            return { success: false, errors: "Could not add to file" };
          });
      })
      .catch((error) => {
        console.log(error);
        return { success: false };
      });
  }

  updateById(id, product) {
    // const data = JSON.parse(fs.readFileSync("./data/products.json", "utf-8"));
    const { title, description, price, rating, stock } = JSON.parse(product);
    let flag = false;
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "products.json"), { encoding: "utf-8" })
      .then((data) => {
        const jsonData = JSON.parse(data);
        const errors = {};
        if (!title || title === "") {
          errors.title = "Title was not provided";
        }
        if (!description || description === "" || description.length <= 10) {
          errors.description = "Description should be provided, and it should be at least 15 characters long";
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

        let flag = false;
        const updatedData = jsonData.map((element) => {
          if (element.id === Number(id)) {
            flag = true;
            return { ...element, title, description, price, rating, stock };
          }
          return { ...element };
        });
        if (!flag) {
          errors.id = "Product ID does not exist";
          return { success: false, errors: errors };
        }
        // return { success: true };

        return fsPromise
          .writeFile(path.join(__dirname, "..", "data", "products.json"), JSON.stringify(updatedData))
          .then(() => {
            console.log("first");
            return { success: true };
          })
          .catch((err) => {
            return { success: false, errors: "Could not add to file" };
          });
      })
      .catch((error) => {
        console.log(error);
        return { success: false };
      });
  }

  async deletetById(id) {
    return fsPromise
      .readFile(path.join(__dirname, "..", "data", "products.json"), { encoding: "utf-8" })
      .then((data) => {
        const findData = JSON.parse(data).filter((element) => element.id !== Number(id));
        if (findData) {
          return fsPromise
            .writeFile("./data/products.json", JSON.stringify(findData))
            .then((data) => {
              return { success: true, data: findData };
            })
            .catch((error) => {
              return { success: false };
            });
        } else {
          return { success: false };
        }
      });
  }
}

module.exports = new Product();
