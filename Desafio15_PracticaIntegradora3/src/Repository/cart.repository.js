class CartRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getItems() {
        return this.dao.getAll();
    }

    getItem(id) {
        return this.dao.get(id);
    }

    createItem(cart) {
        return this.dao.create(cart);
    }

    deleteItem(id) {
        return this.dao.delete(id);
    }

}

export default CartRepository;
