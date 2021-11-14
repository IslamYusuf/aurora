import {Route, BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import { MuiThemeProvider} from '@material-ui/core/styles';

import store from './store';
import {
    ProductDetails,Cart, Order, OrderHistory,
    PlaceOrder,ShippingAddress, Signin, Signup,
    UserProfile, PrivateRoute, Products, Navbar,
    OrderList, ProductList, ProductEdit, Dashboard,
    UserList, UserEdit, AdminRoute,Search,Map,
} from './components'
import theme from './theme';

const App = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <MuiThemeProvider theme={theme}>
                    <div className="grid-container">
                        <Navbar/>
                        <main>
                            <Route exact path="/" component={Products} />
                            <Route exact path="/signup" component={Signup} />
                            <Route exact path="/signin" component={Signin} />
                            <Route exact path="/product/:id" component={ProductDetails} />
                            <Route exact path="/product/:id/edit" component={ProductEdit}/>
                            <Route exact path="/cart/:id?" component={Cart} />
                            <Route exact path="/shipping" component={ShippingAddress} />
                            <Route exact path="/placeorder" component={PlaceOrder} />
                            <Route exact path="/order/:id" component={Order} />
                            <Route exact path="/orderhistory" component={OrderHistory} />
                            <PrivateRoute exact path="/profile" component={UserProfile} />
                            <PrivateRoute path="/map" component={Map}></PrivateRoute>
                            <AdminRoute exact path="/user/:id/edit"component={UserEdit}/>
                            <AdminRoute exact path="/userlist" component={UserList}/>
                            <AdminRoute exact path="/orderlist"component={OrderList}/>
                            <AdminRoute exact path="/productlist" component={ProductList}/>
                            <AdminRoute exact path="/dashboard" component={Dashboard}/>
                            <Route exact path="/search/name/:name?" component={Search}/>
                            <Route exact path="/search/category/:category" component={Search} />
                            <Route exact path="/search/category/:category/name/:name" component={Search}/>
                            <Route exact path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber"
                                component={Search}/>
                        </main>
                        <footer className="row center">                            
                            <div>All right reserved &copy;</div>{' '}
                        </footer>
                    </div>
                </MuiThemeProvider>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
