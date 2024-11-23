import MovieForm from "../component/MovieForm";
import {useEffect, useState} from "react";
import store, {updateState} from "../store";
import {useNavigate} from "react-router-dom";
import {useAuthorizationCheck, useRequest} from "../Util";
import {useDispatch, useSelector} from "react-redux";

export default function EditionPage() {
    const authorizationCheck = useAuthorizationCheck();
    useEffect(authorizationCheck, [authorizationCheck]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const current_movie = useSelector(state => state.current_movie);
    const [movie, setMovie] = useState(JSON.parse(JSON.stringify(current_movie)));
    const request = useRequest();

    useEffect(() => {
        if (!current_movie) navigate("/");
    }, [current_movie]);
    if (!current_movie) return null;

    const onSubmit = (e, updMovie) => {
        request("api/movie/update", "PUT", updMovie)
            .then(r => {
                let data = store.getState().movies
                    .map(d => d.id === r.id ? r : d);
                dispatch(updateState({current_movie: null, movies: data}));
            }).catch(console.error);
    }

    return <MovieForm movie={movie} setMovie={setMovie} onSubmit={onSubmit} subSelected />
}
