import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { deleteUser, listUsers } from '../../actions/userActions';
import Loading from '../Loading';
import Message from '../Message';
import { USER_DETAILS_RESET } from '../../constants/userConstants';

const UserList = (props) => {
    const userList = useSelector((state) => state.userList);
    const { loading, error, users } = userList;

    const userDelete = useSelector((state) => state.userDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = userDelete;

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(listUsers());
        dispatch({type: USER_DETAILS_RESET,});
    }, [dispatch, successDelete]);
    const deleteHandler = (user) => {
        if (window.confirm('Are you sure?')) {
            dispatch(deleteUser(user._id));
        }
    };

    return (
        <div>
            <h1>Users</h1>
            {loadingDelete && <Loading></Loading>}
            {errorDelete && <Message variant="danger">{errorDelete}</Message>}
            {successDelete && (
                <Message variant="success">User Deleted Successfully</Message>
            )}
            {loading ? (<Loading></Loading>)
            : error ? (<Message variant="danger">{error}</Message>)
            : (
                <table className="table">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>IS ADMIN</th>
                    <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                    <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                        <td>
                        <button
                            type="button"
                            className="small"
                            onClick={() => props.history.push(`/user/${user._id}/edit`)}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="small"
                            onClick={() => deleteHandler(user)}
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div>
    )
}

export default UserList
