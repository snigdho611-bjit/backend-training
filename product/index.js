const fs = require("fs");

class Product {
  getAll() {
    const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
    return data;
  }

  getOneById(id) {
    const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
    const findData = data.filter((element) => element.id === id)[0];
    if (findData) {
      // If data is found with the corresponding ID, then only that data will be returned
      return findData;
    }

    // If no data is found with the corresponding ID, then this message will be returned instead
    return "The data does not exist";
  }

  add(product) {
    const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
    const newData = { ...product, id: data[data.length - 1].id + 1 };
    data.push(newData);
    fs.writeFileSync("./data/manga.json", JSON.stringify(data));
    console.log("Object has been successfully added");
    return newData;
  }

  updateById(id, product) {
    const data = JSON.parse(fs.readFileSync("./data/manga.json", "utf-8"));
    // Keeping a flag
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
      return (
        "Product successfully updated!",
        updatedData.filter((element) => element.id === id)[0]
      );
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
