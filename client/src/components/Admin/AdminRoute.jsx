import {Route, Redirect} from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({component: Component, ...rest}) => {
    const {userInfo} = useSelector(state => state.user);

    return (
        <Route 
            {...rest}
            render={props => 
                userInfo && userInfo.isAdmin 
                ? ( <Component {...props} /> )
                : ( <Redirect to='/signin' /> ) 
            }
        />
    )
}

export default AdminRoute;
