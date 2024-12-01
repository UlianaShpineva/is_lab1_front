import React, {useEffect, useState} from 'react';
import InputField, {Type} from "./InputField";
import OptionalComponent from "./OptionalForm";
import {useDispatch, useSelector} from "react-redux";
import {silentRequest, useRequest} from "../Util";
import PersonForm from "./PersonForm";
import {updateState} from "../store";

export const COLOR_VALUES = ["GREEN", "BLACK", "BLUE", "YELLOW", "BROWN"];
export const COUNTRY_VALUES = ["RUSSIA", "UNITED_KINGDOM", "GERMANY", "NORTH_KOREA", "JAPAN"];
export const MOVIE_GENRE_VALUES = ["DRAMA", "HORROR", "SCIENCE_FICTION"];

export const MPA_RATING_VALUES = ["G", "PG", "R"]

export default function MovieForm({movie, setMovie, onSubmit, subSelected}) {
    const data = useSelector(state => state.persons) || [];
    const [persons, setPersons] = useState(data.map(d => d.person));
    useEffect(() => {
        silentRequest("api/person/get_all_persons")
            .then(r => r && setPersons(r));
    }, []);

    const data_c = useSelector(state => state.coordinatess) || [];
    const [coordinatess, setCoordinatess] = useState(data_c.map(d => d.coordinates));
    useEffect(() => {
        silentRequest("api/coordinates/get_all_coordinates")
            .then(r => r && setCoordinatess(r));
    }, []);
    const handleChange = (e) => {
        let {name, value} = e.target;

        const keys = name.split('.');
        setMovie(prevMovie => {
            let updatedMovie = {...prevMovie};
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    updatedMovie[key] = value;
                } else {
                    updatedMovie = updatedMovie[key] || {};
                }
            });
            return keys.length > 1 ? {...prevMovie} : updatedMovie;
        });
    };
    const getHandler = name => {
        return value => handleChange({target: {name, value}})
    }

    const onGenerate = e => {
        setMovie({...movie, ...getTestMovie()});
    }

    const validateForm = (movie) => {
        const validations = [
            movie.name != null && movie.name.length > 0,
            movie.coordinates?.x != null && movie.coordinates.x <= 953,
            movie.coordinates?.y == null || movie.coordinates.y >= -955,
            movie.oscarsCount != null && movie.oscarsCount > 0,
            movie.budget > 0,
            movie.totalBoxOffice > 0,
            movie.genre == null || MOVIE_GENRE_VALUES.includes(movie.genre),
            movie.mpaaRating == null || MPA_RATING_VALUES.includes(movie.mpaaRating),
            movie.tagline && movie.tagline.length <= 143,
            movie.length > 0,
            movie.goldenPalmCount == null || movie.goldenPalmCount > 0,
            movie.usaBoxOffice != null && movie.usaBoxOffice > 0,
        ];

        validations.push(validatePerson(movie.director));
        if (movie.screenwriter != null) validations.push(validatePerson(movie.screenwriter));
        if (movie.operator != null) validations.push(validatePerson(movie.operator));

        return validations.every(Boolean);
    };

    const validatePerson = (person) => {
        if (!person) return false;

        const validations = [
            person.name && person.name.length > 0,
            COLOR_VALUES.includes(person.eyeColor),
            person.hairColor == null || COLOR_VALUES.includes(person.hairColor),
            person.weight != null && person.weight > 0,
            COUNTRY_VALUES.includes(person.nationality),
        ];

        if (person.location) {
            validations.push(
                person.location.x != null,
                person.location.y != null,
                person.location.name != null && person.location.name.length <= 392
            );
        }

        return validations.every(Boolean);
    };

    const dispatch = useDispatch();
    const handleSubmit = (e) => {

        e.preventDefault();
        if (!validateForm(movie)) {
            dispatch(updateState({notification: {success: false, message: "Fill in all required fields!"}}));
            return;
        }
        beforeMovie();
    };

    const request = useRequest();
    const beforeMovie = async e => {
        const coordinatesResponse = await request("api/coordinates/create", "POST", movie.coordinates);

        let updatedMovie = { ...movie, coordinatesId: coordinatesResponse.id };

        if (movie.director.location !== null) {
            const locationResponse1 = await request("api/location/create", "POST", updatedMovie.director.location);
            updatedMovie = {
                ...updatedMovie,
                director: {
                    ...movie.director,
                    locationId: locationResponse1.id,
                },
            };
        }

        if (movie.screenwriter !== null && movie.screenwriter.location !== null) {
            const locationResponse2 = await request("api/location/create", "POST", updatedMovie.screenwriter.location);
            updatedMovie = {
                ...updatedMovie,
                screenwriter: {
                    ...movie.screenwriter,
                    locationId: locationResponse2.id,
                },
            };
        }

        if (movie.operator !== null && movie.operator.location !== null) {
            const locationResponse3 = await request("api/location/create", "POST", updatedMovie.operator.location);
            updatedMovie = {
                ...updatedMovie,
                operator: {
                    ...movie.operator,
                    locationId: locationResponse3.id,
                },
            };
        }

        const directorResponse = await request("api/person/create", "POST", updatedMovie.director); //await
        updatedMovie = { ...updatedMovie, directorId: directorResponse.id };

        if (movie.screenwriter !== null) {
            const screenwriterResponse = await request("api/person/create", "POST", updatedMovie.screenwriter);
            updatedMovie = { ...updatedMovie, screenwriterId: screenwriterResponse.id };
        }

        if (movie.operator !== null) {
            const operatorResponse = await request("api/person/create", "POST", updatedMovie.operator);
            updatedMovie = { ...updatedMovie, operatorId: operatorResponse.id };
        }

        onSubmit(e, updatedMovie);
    };


    return (
        <div className="container">
            <div className="form">
                <InputField type={Type.String} name="name" object={movie} onChange={handleChange}
                            check={e => e != null && e.length > 0}/>
                <OptionalComponent name="coordinates" initial={movie.coordinates ||  { id: null, x: null, y: null }} subSelected={subSelected}
                                   values={coordinatess} onChange={getHandler("coordinates")}>
                    <InputField type={Type.Number} name="coordinates.x" object={movie} onChange={handleChange}
                                check={e => e != null && e <= 953}/>
                    <InputField type={Type.Number} name="coordinates.y" object={movie} onChange={handleChange}
                                check={e => e == null || e >= -955}/>
                </OptionalComponent>
                <InputField type={Type.Number} name="oscarsCount" object={movie} onChange={handleChange}
                        check={e => e != null && e > 0}/>
                <InputField type={Type.Number} name="budget" object={movie} onChange={handleChange}
                            check={e => e > 0}/>
                <InputField type={Type.Integer} name="totalBoxOffice" object={movie} onChange={handleChange}
                            check={e => e > 0}/>
                <InputField type={Type.Enum} name="mpaaRating" object={movie} onChange={handleChange}
                            values={MPA_RATING_VALUES}/>
                <OptionalComponent name="director" initial={movie.director} subSelected={subSelected}
                    values={persons} onChange={getHandler("director")}>
                    <PersonForm object={movie} onChange={handleChange} subSelected={subSelected} personType={"director"}/>
                </OptionalComponent>
                <OptionalComponent name="screenwriter" initial={movie.screenwriter} subSelected={subSelected} nullable
                                   values={persons} onChange={getHandler("screenwriter")}>
                    <PersonForm object={movie} onChange={handleChange} subSelected={subSelected} personType={"screenwriter"}/>
                </OptionalComponent>
                <OptionalComponent name="operator" initial={movie.operator} subSelected={subSelected} nullable
                                   values={persons} onChange={getHandler("operator")}>
                    <PersonForm object={movie} onChange={handleChange} subSelected={subSelected} personType={"operator"}/>
                </OptionalComponent>
                <InputField type={Type.Integer} name="length" object={movie} onChange={handleChange}
                            check={e => e > 0}/>
                <InputField type={Type.Number} name="goldenPalmCount" object={movie} onChange={handleChange}
                            check={e => e == null || e > 0}/>
                <InputField type={Type.Number} name="usaBoxOffice" object={movie} onChange={handleChange}
                            check={e => e != null && e > 0}/>
                <InputField type={Type.String} name="tagline" object={movie} onChange={handleChange}
                            check={e => e && e.length <= 143}/>
                <InputField type={Type.Enum} name="genre" object={movie} onChange={handleChange}
                            values={MOVIE_GENRE_VALUES}/>
                <div className="justify">
                    <button onClick={handleSubmit} className="rounded full">Create</button>
                    {/*<button onClick={onGenerate} className="rounded margin">G</button>*/}
                </div>
            </div>
        </div>
    );
};

function getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function getTestMovie() {
    return {
        name: "wwwww",
        oscarsCount: 1,
        budget: 1,
        totalBoxOffice: 1,
        mpaaRating: "G",
        length: 1,
        goldenPalmCount: 1,
        usaBoxOffice: 1,
        tagline: "aaa",
        genre: "HORROR",
        director: {
            name: "aa",
            eyeColor: "GREEN",
            hairColor: "GREEN",
            location: { x: 1, y: 1, z: 1, name: "aaaaaaa" },
            weight: 1,
            nationality: "RUSSIA"
        },
        screenwriter: {
            name: "aa",
            eyeColor: "GREEN",
            hairColor: "GREEN",
            location: { x: 1, y: 1, z: 1, name: "aaaaaaa" },
            weight: 1,
            nationality: "RUSSIA"
        },
        operator: {
            name: "aa",
            eyeColor: "GREEN",
            hairColor: "GREEN",
            location: { x: 1, y: 1, z: 1, name: "aaaaaaa" },
            weight: 1,
            nationality: "RUSSIA"
        },
        coordinates: {
            x: 3,
            y: 3
        }
    };
}

