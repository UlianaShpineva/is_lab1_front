import Table from "./Table";
import {useDispatch, useSelector} from "react-redux";
import {Link} from 'react-router-dom';
import {useRequest} from "../Util";
import store, {updateState} from "../store";
import {useEffect, useState} from "react";
import {silentRequest} from "../Util";
import MovieRepresentation from "./MovieRepresentation";

export default function HistoryTable({data = []}) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        silentRequest("api/movie/history")
            .then(r => setHistory(r));
    }, []);

    const columns = [
        {name: 'Movie ID', selector: row => row.movieId, id: 'id', width: '120px'},
        {name: 'Operation', selector: row => row.operationType, width: '150px'},
        {name: 'Date', selector: row => row.timeOp, width: '300px'},
        {name: 'User ID', selector: row => row.userId, width: '150px'},
    ];
    columns.forEach(col => {
        col.sortable = true;
        col.width = col.width || '115px';
    });


    return <>
        <Table
            columns={columns}
            data={history}
            defaultSortFieldId={'id'}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 20, 30]}
            responsive
            // expandableRows
            // expandableRowsComponent={expandable}
        />
    </>;
}
