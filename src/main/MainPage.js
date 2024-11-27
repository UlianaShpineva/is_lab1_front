// import {updateMovies} from "../Util";
// import MovieTable from "../component/MovieTable";
// import {useEffect} from "react";
// import {useDispatch, useSelector} from "react-redux";
// import {Link} from "react-router-dom";
// import {fetchLoggedAs} from "../login/LoginMain";
// import {updateState} from "../store";
//
// export default function MainPage() {
//     const dispatch = useDispatch();
//     const data = useSelector(state => state.movies);
//     useEffect(() => {
//         const inter = setInterval(updateMovies, 5000, dispatch);
//         return () => clearInterval(inter);
//     }, []);
//
//     const logged_as = useSelector(state => state.logged_as);
//
//     useEffect(() => {
//         fetchLoggedAs().then(logged_as => dispatch(updateState({logged_as})));
//         updateMovies(dispatch);
//     }, [dispatch]);
//
//     if (logged_as) {
//         return <div className="container">
//             <MovieTable data={data}/>
//             <Link to="/new">
//                 <button className="rounded">Create new</button>
//             </Link>
//             <Link to="/special">
//                 <button className="rounded margin">Commands</button>
//             </Link>
//         </div>;
//     } else {
//         return null;
//     }
//
//
// }

// import {updateMovies} from "../Util";
// import MovieTable from "../component/MovieTable";
// import {useEffect, useState} from "react";
// import {useDispatch, useSelector} from "react-redux";
// import {Link} from "react-router-dom";
// import {fetchLoggedAs} from "../login/LoginMain";
// import {updateState} from "../store";
// import { Scatter } from 'react-chartjs-2';
// import Modal from "../component/Modal";
// import {Chart as ChartJS, Legend, LinearScale, PointElement, Tooltip} from "chart.js";
//
// ChartJS.register(LinearScale, PointElement, Tooltip, Legend);
//
// export default function MainPage() {
//     const dispatch = useDispatch();
//     const data = useSelector(state => state.movies);
//     const [selectedMovie, setSelectedMovie] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//
//     useEffect(() => {
//         const inter = setInterval(updateMovies, 5000, dispatch);
//         return () => clearInterval(inter);
//     }, []);
//
//     const logged_as = useSelector(state => state.logged_as);
//
//     useEffect(() => {
//         fetchLoggedAs().then(logged_as => dispatch(updateState({logged_as})));
//         updateMovies(dispatch);
//     }, [dispatch]);
//
//     const handlePointClick = (movie) => {
//         setSelectedMovie(movie);
//         setShowModal(true);
//     };
//
//     const coordinatesData = {
//         datasets: [{
//             label: 'Movies',
//             data: data.filter(movie => movie.coordinates)
//                 .map(movie => ({
//                     x: movie.coordinates.x,
//                     y: movie.coordinates.y,
//                     movie
//                 })),
//             backgroundColor: 'rgba(75, 192, 192, 0.6)',
//             pointRadius: 5
//         }]
//     };
//
//     const options = {
//         plugins: {
//             tooltip: {
//                 callbacks: {
//                     label: function(tooltipItem) {
//                         return `ID: ${tooltipItem.raw.movie.id}`;
//                     }
//                 }
//             }
//         },
//         onClick: (e, elements) => {
//             if (elements.length > 0) {
//                 const index = elements[0].index;
//                 handlePointClick(data[index]);
//             }
//         },
//         scales: {
//             x: {
//                 type: 'linear',
//                 position: 'bottom'
//             }
//         }
//     };
//
//     if (logged_as) {
//         return <div className="container">
//             <MovieTable data={data}/>
//             <Scatter data={coordinatesData} options={options} />
//             {showModal && selectedMovie && (
//                 <Modal onClose={() => setShowModal(false)}>
//                     <h2>Детали фильма</h2>
//                     <pre>{JSON.stringify(selectedMovie, null, 2)}</pre>
//                 </Modal>
//             )}
//             <Link to="/new">
//                 <button className="rounded">Создать новый</button>
//             </Link>
//             <Link to="/special">
//                 <button className="rounded margin">Команды</button>
//             </Link>
//         </div>;
//     } else {
//         return null;
//     }
// }

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { updateMovies } from "../Util";
import { fetchLoggedAs } from "../login/LoginMain";
import { updateState } from "../store";
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from 'chart.js';
import Modal from "../component/Modal";
import MovieTable from "../component/MovieTable";
import MovieRepresentation from "../component/MovieRepresentation";

// Регистрация компонентов Chart.js
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

export default function MainPage() {
    // const dispatch = useDispatch();
    // const data = useSelector(state => state.movies);
    // const logged_as = useSelector(state => state.logged_as);
    //
    // const [selectedMovie, setSelectedMovie] = useState(null);
    // const [showModal, setShowModal] = useState(false);
    //
    // useEffect(() => {
    //     const inter = setInterval(updateMovies, 5000, dispatch);
    //     return () => clearInterval(inter);
    // }, [dispatch]);
    //
    // useEffect(() => {
    //     fetchLoggedAs().then(logged_as => dispatch(updateState({ logged_as })));
    //     updateMovies(dispatch);
    // }, [dispatch]);
    //
    // const handlePointClick = (movie) => {
    //     setSelectedMovie(movie);
    //     setShowModal(true);
    // };

    const dispatch = useDispatch();
    const data = useSelector(state => state.movies);
    const logged_as = useSelector(state => state.logged_as);

    const [selectedMovies, setSelectedMovies] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const inter = setInterval(updateMovies, 5000, dispatch);
        return () => clearInterval(inter);
    }, [dispatch]);

    useEffect(() => {
        fetchLoggedAs().then(logged_as => dispatch(updateState({ logged_as })));
        updateMovies(dispatch);
    }, [dispatch]);

    const handlePointClick = (clickedMovie) => {
        const moviesWithSameCoordinates = data.filter(movie =>
            movie.coordinates &&
            movie.coordinates.x === clickedMovie.coordinates.x &&
            movie.coordinates.y === clickedMovie.coordinates.y
        );
        setSelectedMovies(moviesWithSameCoordinates);
        setShowModal(true);
    };


    const coordinatesData = {
        datasets: [{
            label: 'Movies',
            data: data.filter(movie => movie.coordinates)
                .map(movie => ({
                    x: movie.coordinates.x,
                    y: movie.coordinates.y,
                    movie
                })),
            backgroundColor: 'rgba(75, 192, 192, 0.6)', //'rgba(240, 246, 252, 0.1)',//'#21262d',//
            pointRadius: 5
        }]
    };

    const options = {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `ID: ${tooltipItem.raw.movie.id}`;
                    }
                }
            }
        },
        onClick: (e, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                handlePointClick(data[index]);
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom'
            }
        }
    };

    if (!logged_as) return null;

    return (
        <div className="container">
            <MovieTable data={data} />
            <Link to="/new">
                <button className="rounded">Create new</button>
            </Link>
            <Link to="/special">
                <button className="rounded margin">Commands</button>
            </Link>
            <div className="chart-container">
                <Scatter data={coordinatesData} options={options} className="chart-container rounded margin"/>
                {showModal && selectedMovies.length > 0 && (
                    <Modal onClose={() => setShowModal(false)}>
                        <h2>Films</h2>
                        <ul>
                            {selectedMovies.map((movie) => (
                                <li key={movie.id}>
                                    <MovieRepresentation movie={movie} includeMain={false}/>
                                </li>
                            ))}
                        </ul>
                    </Modal>
                )}
            </div>
        </div>
    );
}

