import {Route, Redirect} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {useHistory} from 'react-router-dom';
import { listUsers, signout, userDetails } from '../../actions/userActions';
import { USER_DETAILS_RESET, USER_LIST_REQUEST } from '../../constants/userConstants';

const AdminRoute = ({component: Component, ...rest}) => {
    const dispatch = useDispatch()
    //const history = useHistory()
    const {userInfo} = useSelector(state => state.user);
    const { users } = useSelector(state => state.userList);

    /* useEffect(() =>{
        const validateAdmin = () =>{
            if(!users) dispatch(listUsers());
            else{
                if(users && userInfo && userInfo.isAdmin){
                    const admin = users.find((user) => user.email === userInfo.email);
                    if(!admin.isAdmin){
                        dispatch(signout());
                        console.log(`User is logged out`);
                    }
                }
            }
        }
        validateAdmin();
    }, [dispatch, userInfo, users, Component]) */

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
