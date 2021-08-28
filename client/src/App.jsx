import {Route, BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';

import store from './store';
import {
    ProductDetails,Cart, Order, OrderHistory, PaymentMethod,
    PlaceOrder,ShippingAddress, SigninTest, Signin,Signin1, Signup,
    UserProfile, PrivateRoute, Products, Navbar1,UserEdit,AdminRoute,
    OrderList, ProductList, ProductEdit, Dashboard, Signup1, UserProfile1
} from './components'
import UserList from './components/User/UserList';

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className="grid-container">
                    <Navbar1/>            
                    <main>
                        <Route exact path="/" component={Products} />
                        <Route exact path="/product/:id" component={ProductDetails} />
                        <Route exact path="/signin" component={Signin1} />
                        <Route exact path="/signup" component={Signup1} />
                        <Route exact path="/cart/:id?" component={Cart} />
                        <Route exact path="/shipping" component={ShippingAddress} />
                        <Route exact path="/payment" component={PaymentMethod} />
                        <Route exact path="/placeorder" component={PlaceOrder} />
                        <Route exact path="/order/:id" component={Order} />
                        <Route exact path="/orderhistory" component={OrderHistory} />
                        <PrivateRoute exact path="/profile" component={UserProfile1} />
                        <PrivateRoute exact path="/user/:id/edit"component={UserEdit}/>
                        <AdminRoute exact path="/userlist" component={UserList}/>
                        <AdminRoute exact path="/orderlist"component={OrderList}/>
                        <Route exact path="/product/:id/edit" component={ProductEdit}/>
                        <AdminRoute exact path="/productlist" component={ProductList}/>
                        <AdminRoute exact path="/dashboard" component={Dashboard}/>
                    </main>
                    <footer className="row center">
                        All right reserved
                    </footer>
                </div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
