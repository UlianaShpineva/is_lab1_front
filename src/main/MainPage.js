import {updateMovies} from "../Util";
import MovieTable from "../component/MovieTable";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {fetchLoggedAs} from "../login/LoginMain";
import {updateState} from "../store";

export default function MainPage() {
    const dispatch = useDispatch();
    const data = useSelector(state => state.movies);
    useEffect(() => {
        const inter = setInterval(updateMovies, 5000, dispatch);
        return () => clearInterval(inter);
    }, []);

    const logged_as = useSelector(state => state.logged_as);

    useEffect(() => {
        fetchLoggedAs().then(logged_as => dispatch(updateState({logged_as})));
        updateMovies(dispatch);
    }, [dispatch]);

    if (logged_as) {
        return <div className="container">
            <MovieTable data={data}/>
            <Link to="/new">
                <button className="rounded">Create new</button>
            </Link>
            <Link to="/special">
                <button className="rounded margin">Commands</button>
            </Link>
        </div>;
    } else {
        return null;
    }


}
