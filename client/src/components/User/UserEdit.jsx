import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { userDetails, updateUser } from '../../actions/userActions';
import Loading from '../Loading';
import Message from '../Message';
import { USER_UPDATE_RESET } from '../../constants/userConstants';

const UserEdit = (props) => {
    const userId = props.match.params.id;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const user_details = useSelector((state) => state.userDetails);
    const { loading, error, user } = user_details;

    const userUpdate = useSelector((state) => state.userUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = userUpdate;

    const dispatch = useDispatch();
    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET });
            props.history.push('/userlist');
        }
        if (!user) {
            dispatch(userDetails(userId));
        } else {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [dispatch, props.history, successUpdate, user, userId]);

    const submitHandler = (e) => {
        e.preventDefault();
        // dispatch update user
        dispatch(updateUser({ _id: userId, name, email, isAdmin }));
    };
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Edit User {name}</h1>
                    {loadingUpdate && <Loading></Loading>}
                    {errorUpdate && (<Message variant="danger">{errorUpdate}</Message>)}
                </div>
                {loading ? (<Loading />)
                : error ? (<Message variant="danger">{error}</Message>) : (
                <>
                    <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                    <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    ></input>
                    </div>
                    <div>
                    <label htmlFor="isAdmin">Is Admin</label>
                    <input
                        id="isAdmin"
                        type="checkbox"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                    ></input>
                    </div>
                    <div>
                    <button type="submit" className="primary">
                        Update
                    </button>
                    </div>
                </>
                )}
            </form>
        </div>
    );
}

export default UserEdit
