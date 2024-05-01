class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getItems() {
        return this.dao.getAll();
    }

    getItem(id) {
        return this.dao.get(id);
    }

    createItem(user) {
        return this.dao.create(user);
    }

    deleteItem(id) {
        return this.dao.delete(id);
    }
}

export default UserRepository;
