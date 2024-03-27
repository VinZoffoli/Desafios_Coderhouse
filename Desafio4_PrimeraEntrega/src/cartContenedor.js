const fs = require("fs");

class CartContenedor {
    constructor(fileName) {
        this._filename = fileName;
        this._readFileOrCreateNewOne();
    }

    async _readFileOrCreateNewOne() {
        try {
            await fs.promises.readFile(this._filename, "utf-8");
        } catch (error) {
            error.code === "ENOENT"
                ? this._createEmptyFile()
                : console.log(
                    `Error Code: ${error.code} | There was an unexpected error when trying to read ${this._filename}`
                );
        }
    }

    async _createEmptyFile() {
        fs.writeFile(this._filename, "[]", (error) => {
            error
                ? console.log(error)
                : console.log(`File ${this._filename} was created since it didn't exist in the system`);
        });
    }

    async getById(id) {
        id = Number(id);
        try {
            const data = await this.getData();
            const parsedData = JSON.parse(data);

            return parsedData.find((cart) => cart.cartId === id);
        } catch (error) {
            console.log(
                `Error Code: ${error.code} | There was an error when trying to get a cart by its ID (${id})`
            );
        }
    }

    async deleteById(id) {
        try {
            id = Number(id);
            const data = await this.getData();
            const parsedData = JSON.parse(data);
            const cartToBeRemoved = parsedData.find(
                (cart) => cart.cartId === id
            );

            if (cartToBeRemoved) {
                const index = parsedData.indexOf(cartToBeRemoved);
                parsedData.splice(index, 1);
                await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
                return true;
            } else {
                console.log(`Cart ID ${id} does not exist in the file`);
                return null;
            }
        } catch (error) {
            console.log(
                `Error Code: ${error.code} | There was an error when trying to delete a cart by its ID (${id})`
            );
        }
    }

    async updateById(id, newData) {
        try {
            id = Number(id);
            const data = await this.getData();
            const parsedData = JSON.parse(data);
            const cartToBeUpdated = parsedData.find(
                (cart) => cart.cartId === id
            );
            if (cartToBeUpdated) {
                const index = parsedData.indexOf(cartToBeUpdated);
                Object.assign(cartToBeUpdated, newData);
                await fs.promises.writeFile(this._filename, JSON.stringify(parsedData));
                return true;
            } else {
                console.log(`Cart ID ${id} does not exist in the file`);
                return null;
            }

        } catch (error) {
            console.log(
                `Error Code: ${error.code} | There was an error when trying to update a cart by its ID (${id})`
            );
        }
    }

    async save(cart) {
        try {
            const allData = await this.getData();
            const parsedData = JSON.parse(allData);
            cart.cartId = Math.random().toString(36).substring(7);
            parsedData.push(cart);
            await fs.promises.writeFile(this._filename, JSON.stringify(parsedData, null, 2));
            return cart.cartId;
        } catch (error) {
            console.log(`Error Code: ${error.code} | There was an error when trying to save a cart`);
        }
    }

    async deleteAll() {
        try {
            await this._createEmptyFile();
        } catch (error) {
            console.log(
                `There was an error (${error.code}) when trying to delete all the carts`
            );
        }
    }

    async getData() {
        const data = await fs.promises.readFile(this._filename, "utf-8");
        return data;
    }

    async getAll() {
        const data = await this.getData();
        return JSON.parse(data);
    }
}

module.exports = CartContenedor;
