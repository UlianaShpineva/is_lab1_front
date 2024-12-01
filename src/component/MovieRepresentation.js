
function MovieAttribute({name, keys = [], object}) {
    if (!object) return null;
    return <div className="container">
        <p><b>{name}</b></p>
        {keys.map((key, i) =>
            object[key] !== undefined &&
            <p key={i}>{key}: {object[key]}</p>
        )}
    </div>
}

export default function MovieRepresentation({movie, includeMain = true}) {
    if (!movie) return null;
    return <div className="box">
        <div className="flex">
            {includeMain && <MovieAttribute
                name="Movie" keys={["id", "name", "oscarsCount", "budget", "totalBoxOffice", "mpaaRating", "length", "goldenPalmCount", "usaBoxOffice", "tagline", "genre"]} object={movie}/>}
            <MovieAttribute name="Coordinates" keys={["id", "x", "y"]} object={movie.coordinates}/>
            <MovieAttribute name="Director" keys={["id", "name", "eyeColor", "hairColor", "weight", "nationality"]} object={movie.director}/>
            <MovieAttribute name="Director Location" keys={["id", "name", "x", "y", "z"]} object={movie.director.location ?? {id: "null"}}/>
            <MovieAttribute name="Screenwriter" keys={["id", "name", "eyeColor", "hairColor", "weight", "nationality"]} object={movie.screenwriter ?? {id: "null"}}/>
            <MovieAttribute name="ScreenWriter Location" keys={["id", "name", "x", "y", "z"]} object={movie.screenwriter != null ? (movie.screenwriter.location ?? {id: "null"}) : { id: "null" }}/>
            <MovieAttribute name="Operator" keys={["id", "name", "eyeColor", "hairColor", "weight", "nationality"]} object={movie.operator ?? {id: "null"}}/>
            <MovieAttribute name="Operator Location" keys={["id", "name", "x", "y", "z"]} object={movie.operator != null ? (movie.operator.location ?? {id: "null"}) : {id: "null"}}/>
        </div>
    </div>
}
