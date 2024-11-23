import {useAuthorizationCheck, useRequest} from "../Util";
import React, {useEffect, useState} from "react";
import MovieRepresentation from "../component/MovieRepresentation";
import DirectorForm from "../component/PersonForm";
import PersonForm from "../component/PersonForm";
import InputField, {Type} from "../component/InputField";
import {MOVIE_GENRE_VALUES} from "../component/MovieForm";

export default function SpecialPage() {
    const authorizationCheck = useAuthorizationCheck();
    useEffect(authorizationCheck, [authorizationCheck]);
    const request = useRequest();

    const [aveUsa, setAveUsa] = useState('-');
    const getAveUsa = () => request('api/movie/average')
        .then(r => setAveUsa(r)).catch(console.error);

    const [taglinePrefix, setTaglinePrefix] = useState("");
    const [moviesByTagline, setMoviesByTagline] = useState([]);
    const getMoviesByTaglinePrefix = () => request(`api/movie/tagline/${taglinePrefix}`)
        .then(r => setMoviesByTagline(r));

    const [sourceGenre, setSourceGenre] = useState("");
    const [targetGenre, setTargetGenre] = useState("");


    const redistributeOscars = () => request(`api/movie/redistribute-oscars/${sourceGenre}/${targetGenre}`);


    const [length, setLength] = useState(0);
    const addOscarsToLongMovies = () => request(`api/movie/add-oscars/${length}`);

    const [maxDirector, setMaxDirector] = useState();
    const getMaxDirector = () => request('api/movie/max-director')
        .then(r => setMaxDirector(r)).catch(console.error);

    return <div className="">
        <div className="container">
            <p>Average UsaBoxOffice: {aveUsa}</p>
            <button className="rounded margin" onClick={getAveUsa}>Count</button>
        </div>
        <div className="container">
            <p>Movie with max Director Id</p>
            <MovieRepresentation movie={maxDirector}/>
            <button className="rounded margin" onClick={getMaxDirector}>Search</button>
        </div>
        <div className="container">
            <p>Tagline prefix</p>
            <input className="input box rounded" placeholder="prefix" type="text" value={taglinePrefix} onChange={(e) => setTaglinePrefix(e.target.value)}/>
            <button className="rounded margin" onClick={getMoviesByTaglinePrefix}>Search</button>
            <ul>
                {moviesByTagline.map((movie) => (
                    <li key={movie.id}>{movie.name}</li>
                ))}
            </ul>
        </div>
        <div className="container">
            <p>Redistribute Oscars from Source Genre to Target Genre</p>
            <select className="input box rounded" name="sourceGenre" value={sourceGenre || ''} onChange={(e) => setSourceGenre(e.target.value)}>
                <option value={''} key={-1}>Select option</option>
                {MOVIE_GENRE_VALUES.map((item, i) => <option value={item} key={i}>{item}</option>)}
            </select>
            <select className="input box rounded" name="targetGenre" value={targetGenre || ''} onChange={(e) => setTargetGenre(e.target.value)}>
                <option value={''} key={-1}>Select option</option>
                {MOVIE_GENRE_VALUES.map((item, i) => <option value={item} key={i}>{item}</option>)}
            </select>
            <button className="rounded margin" onClick={redistributeOscars}>Redistribute</button>
        </div>

        <div className="container">
            <p>Add Oscars to Movies Longer Than:</p>
            <input className="input box rounded" type="number" value={length} onChange={(e) => setLength(Number(e.target.value))}
            />
            <button className="rounded margin" onClick={addOscarsToLongMovies}>Add Oscars</button>
        </div>
    </div>;
}
