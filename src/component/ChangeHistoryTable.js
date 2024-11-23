import {useEffect, useState} from "react";
import {silentRequest} from "../Util";
import Table from "./Table";
import MovieRepresentation from "./MovieRepresentation";

export default function ChangeHistoryTable() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        silentRequest("api/admin/get-history?limit=20")
            .then(r => r && setHistory(r.data));
    }, []);

    const columns = [
        {name: 'Object Type', selector: row => row.entityName, width: '120px'},
        {name: 'Object ID', selector: row => row.entityId, width: '120px'},
        {name: 'Action', selector: row => row.action, width: '120px'},
        {name: 'Changed At', selector: row => new Date(row.changedAt).toLocaleString(), width: '160px'},
        {name: 'Changed By', selector: row => row.changedBy.login, width: '160px'},
    ];

    const expandable = ({data}) => {
        const movie = JSON.parse(data.entity);
        switch (data.entityName) {
            case 'Movie':
                return <MovieRepresentation movie={movie}/>;
            case 'Person':
                return <MovieRepresentation movie={{director: movie}} includeMain={false}/>;
            default:
                movie[data.entityName.toLowerCase()] = movie;
                return <MovieRepresentation movie={movie} includeMain={false}/>;
        }
    };

    return <Table
        columns={columns}
        data={history}
        expandableRows
        expandableRowsComponent={expandable}
    />;
}
