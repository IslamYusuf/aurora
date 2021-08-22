import {Route, Redirect} from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({component: Component, ...rest}) => {
    const {userInfo} = useSelector(state => state.user);

    return (
        <Route 
            {...rest}
            render={props => 
                userInfo 
                ? ( <Component {...props} /> )
                : ( <Redirect to='/signin' /> ) 
            }
        />
    )
}

export default PrivateRoute;
