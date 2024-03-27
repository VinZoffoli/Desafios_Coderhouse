import { faker } from '@faker-js/faker';

const generateProducts = numProducts => {
    const products = [];

    for (let i = 0; i < numProducts; i++) {
        products.push(generateProduct());
    }

    return products;
};

const generateProduct = () => {
    return {
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.lorem.sentence(),
    };
};

export default generateProducts;