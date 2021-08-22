import bcrypt from 'bcryptjs';
const data = {
    users: [{
        name: 'Islam',
        email: 'admin@example.com',
        password: bcrypt.hashSync('1234', 8),
        isAdmin: true,
        cartItems: {}
    },
    {
        name: 'John',
        email: 'user@example.com',
        password: bcrypt.hashSync('1234', 8),
        isAdmin: false,
        cartItmes: {}
    },
    {
        name: 'Jane',
        email: 'jane@example.com',
        password: bcrypt.hashSync('1234', 8),
        isAdmin: false,
        cartItmes: {}
    },],
    products:[
        {
            name: "Blouse",
            category:"Shirts",
            image: "/images/p1.jpg",
            price: 100,
            countInStock: 10,
            brand: "H&M",
            rating: 4.5,
            numReviews: 10,
            description: "High quality product",
        },
        {
            name: "Dress",
            category:"Shirts",
            image: "/images/p1.jpg",
            price: 107,
            countInStock: 20,
            brand: "H&M",
            rating: 4.6,
            numReviews: 9,
            description: "High quality product",
        },
        {
            name: "Trouser",
            category:"Shirts",
            image: "/images/p1.jpg",
            price: 100,
            countInStock: 0,
            brand: "H&M",
            rating: 4.5,
            numReviews: 10,
            description: "High quality product",
        },
        {
            name: "Shirt",
            category:"Shirts",
            image: "/images/p1.jpg",
            price: 500,
            countInStock: 15,
            brand: "Lacoste",
            rating: 3.8,
            numReviews: 2,
            description: "High quality product",
        },
        {
            name: "Sweat pant",
            category:"Shirts",
            image: "/images/p1.jpg",
            price: 200,
            countInStock: 12,
            brand: "H&M",
            rating: 5.0,
            numReviews: 7,
            description: "High quality product",
        },
        {
            name: "Pants",
            category:"Shirts",
            image: "/images/p1.jpg",
            price: 100,
            countInStock: 10,
            brand: "Puma",
            rating: 3.2,
            numReviews: 5,
            description: "High quality product",
        },
    ]
}

export default data;