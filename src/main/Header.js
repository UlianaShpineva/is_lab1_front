import {Link, Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchLoggedAs} from "../login/LoginMain";
import {updateState} from "../store";
import Notification from "../component/Notification";
import {updateMovies} from "../Util";

function Header() {
    const dispatch = useDispatch();
    const logged_as = useSelector(state => state.logged_as);

    useEffect(() => {
        fetchLoggedAs().then(logged_as => dispatch(updateState({logged_as})));
        updateMovies(dispatch);
    }, [dispatch]);

    const logout = () => dispatch({type: "CLEAR_AUTH"});

    return (<>
        <Notification />
        <header className="container" id="header">
            <Link to="/">
                <div>
                    <p>is lab1</p>
                    <p>Shpineva Uliana P3316</p>
                    <button className="rounded">Home</button>
                </div>
            </Link>
            <Link to="/admin">
                <button className="rounded">Admin panel</button>
            </Link>
            <div>
                {logged_as ? <>
                    <p>you: {logged_as}</p>
                    <button className="rounded full" onClick={logout}>Logout</button>
                </> : <>
                    <p>You need authorize</p>
                    <Link to="/login">
                        <button className="rounded full">Login</button>
                    </Link>
                </>}
            </div>
        </header>
        <div className="content">
            <Outlet/>
        </div>
    </>);
}

export default Header;