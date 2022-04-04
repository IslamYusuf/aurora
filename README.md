# Aurora ECommerce Website

An e-commerce application with product search, shopping cart, order and user management, payment processing with Stripe and Mpesa,  - developed using React, Redux, Material-UI, Node, Express, Ngrok, Mongoose and MongoDB.

![aurora](/template/images/Aurora.png)

#### What you need to run this code
1. Node and NPM 
2. MongoDB
3. Safaricom Developer Account to interact with Mpesa APIs. [here] (https://developer.safaricom.co.ke/)
4. Once you have logged in to your Safaricom Developer Account you need to create an App that will be used when making Mpesa APIs calls(Mpesa Express Simulate APIs).
4. Stripe account.
5. Ngrok Account.

####  How to run this code
NOTE: this project is divided into two parts, the frontend code is in the client directory and the backend code is in the server directory.

1. Ensure MongoDB is installed and running on your system.
2. Clone this repository
3. Add a .env file in the client directory and then add the following environment variable,
   - REACT_APP_STRIPE_PUBLIC_KEY='You should add your stripe public key'
4. Also Add .env file to the server directory to hold the following enviroment variables,
   - OAUTH_TOKEN_URL='Add the URL of Mpesa Authorization Endpoint'
   - OAUTH_TOKEN='Add your Basic Authorization token of your Mpesa app which is obtained from your Safaricom Developer portal in the Authorization section'[here] (https://developer.safaricom.co.ke/APIs/Authorization)
   - SHORT_CODE='Business Short code of the app you created obtained from the MpesaExpressSimulate APIs section'
   - PASS_KEY='This key is also obtained from the MpesaExpressSimulate APIs section of the App you created for this project'
   - STKPUSH_URL='Add the URL of the Mpesa Express Simulate Endpoint'
   - NGROK_AUTH_TOKEN='Add your ngrok auth token'
   - STRIPE_SECRET_KEY='Add your stripe secret key'
5. Run Backend.
```
$ cd server
$ npm install
$ npm start
```
6. Run Frontend.
```
# open new terminal
$ cd client
$ npm install
$ npm start
```
7. Seed Users and Products
- Run this on browser: http://localhost:5000/api/users/seed
  - It returns a list of users which have been addded in the database.(The users are hard coded in the data.js file in the server directory)
- Run this on browser: http://localhost:5000/api/products/seed
  - It creates 20 sample products (The products are also hard coded in the data.js file in the server directory)
8. Open [localhost:3000](http://localhost:3000/) in the browser to run the Application
