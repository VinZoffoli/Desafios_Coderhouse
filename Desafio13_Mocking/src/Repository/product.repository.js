class ProductRepository {
    constructor(dao)    {
        this.dao = dao
    }

    getItems() {
        return this.dao.getAll()
    }

    getItem(id) {
        return this.dao.get(id)
    }

    createItem(product) {
        return this.dao.create(product)
    }

    deleteItem(id) {
        return this.dao.delete(id)
    }

}

export default ProductRepository

