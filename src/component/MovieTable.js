import Table from "./Table";
import {useDispatch} from "react-redux";
import {Link} from 'react-router-dom';
import {useRequest} from "../Util";
import store, {updateState} from "../store";
import {useState} from "react";
import MovieRepresentation from "./MovieRepresentation";

function MovieAction({movie}) {
    const dispatch = useDispatch();
    const request = useRequest();

    const handleEdit = e => {
        dispatch(updateState({current_movie: movie}));
    };

    const handleRemove = e => {
        request(`api/movie/delete/${movie.id}`, "POST", movie.id)
            .then(r => {
                let data = store.getState().movies
                    .filter(d => d.id !== movie.id);
                dispatch(updateState({data}));
            }).catch(console.error);
    };

    return <div className="">
        <Link to="/edit">
            <button className="rounded full" onClick={handleEdit}>Update</button>
        </Link>
        <button className="rounded full" onClick={handleRemove}>Delete</button>
    </div>;
}

export default function MovieTable({data = []}) {
    const columns = [
        {name: 'ID', selector: row => row.id, id: 'id', width: '70px'},
        {name: 'Name', selector: row => row.name, width: '100px'},
        {name: 'Creation Date', selector: row => new Date(row.creationDate).toLocaleString(), width: '160px'},
        {name: 'OscarsCount', selector: row => row.oscarsCount, width: '90px'},
        {name: 'Budget', selector: row => row.budget, width: '90px'},
        {name: 'TotalBoxOffice', selector: row => row.totalBoxOffice, width: '90px'},
        {name: 'MpaaRating', selector: row => row.mpaaRating, width: '100px'},
        {name: 'Length', selector: row => row.length, width: '90px'},
        {name: 'GoldenPalmCount', selector: row => row.goldenPalmCount, width: '95px'},
        {name: 'UsaBoxOffice', selector: row => row.usaBoxOffice, width: '100px'},
        {name: 'Tagline', selector: row => row.tagline, width: '100px'},
        {name: 'Genre', selector: row => row.genre, width: '100px'},
        {name: 'Owner', selector: row => row.user?.username, width: '100px'},
        {cell: row => <MovieAction movie={row}/>},
    ];
    columns.forEach(col => {
        col.sortable = true;
        col.width = col.width || '115px';
    });

    const [filterText, setFilterText] = useState('');
    const [filterBy, setFilterBy] = useState(columns[0]);

    data = data.filter(d => String(filterBy.selector(d)).toLowerCase()
        .includes(filterText.toLowerCase()));

    const expandable = ({data}) => <MovieRepresentation movie={data} includeMain={false} />;

    return <>
        <label>Filter by {filterBy.name}: </label>
        <input className="input box rounded" type="text"
               value={filterText} onChange={e => setFilterText(e.target.value)} />
        <Table
            columns={columns}
            data={data}
            defaultSortFieldId={'id'}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 20, 30]}
            responsive
            onSort={setFilterBy}
            expandableRows
            expandableRowsComponent={expandable}
        />
    </>;
}
