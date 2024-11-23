import MovieForm from "../component/MovieForm";
import {useEffect, useState} from "react";
import {useAuthorizationCheck, useRequest} from "../Util";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import store, {updateState} from "../store";

export default function CreationPage() {
    const authorizationCheck = useAuthorizationCheck();
    useEffect(authorizationCheck, [authorizationCheck]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [movie, setMovie] = useState({
        id: null,
        name: null,
        coordinates: { id: null, x: null, y: null },
        coordinatesId: null,
        oscarsCount: null,
        budget: null,
        totalBoxOffice: null,
        mpaaRating: null,
        length: null,
        goldenPalmCount: null,
        usaBoxOffice: null,
        tagline: null,
        genre: null,
        directorId: null,
        screenwriterId: null,
        operatorId: null,
        director: {
            id: null,
            name: null,
            eyeColor: null,
            hairColor: null,
            locationId: null,
            weight: null,
            nationality: null,
            location: { id: null, x: null, y: null, z: null, name: null },
        },
        screenwriter: {
            id: null,
            name: null,
            eyeColor: null,
            hairColor: null,
            locationId: null,
            weight: null,
            nationality: null,
            location: { id: null, x: null, y: null, z: null, name: null },
        },
        operator: {
            id: null,
            name: null,
            eyeColor: null,
            hairColor: null,
            locationId: null,
            weight: null,
            nationality: null,
            location: { id: null, x: null, y: null, z: null, name: null },
        }
    });

    const request = useRequest();
    const onSubmit = (e, updMovie) => {
        request("api/movie/create", "POST", updMovie)
            .then(r => {
                let data = [...store.getState().movies, r];
                dispatch(updateState({movies: data}));
                navigate("/");
            }).catch(console.error);
    }

    return <MovieForm movie={movie} setMovie={setMovie} onSubmit={onSubmit} />
}
