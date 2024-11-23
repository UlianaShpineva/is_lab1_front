import {useEffect, useState} from "react";
import {silentRequest, useRequest} from "../Util";
import Table from "./Table";

function ApplicationAction({application, onAction}) {
    const request = useRequest();

    const handleAccept = e => {
        request(`api/admin/approve-admin-role/${application.id}`, "POST", application)
            .then(r => onAction(application)).catch(console.error);
    };

    return <div className="">
        <button className="rounded full" onClick={handleAccept}>Approve</button>
    </div>;
}

export default function AdminApplicationTable() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        silentRequest("api/admin/admin-role-requests")
            .then(r => r && setApplications(r));
    }, []);

    const removeApplication = application => {
      setApplications(applications.filter(x => x !== application));
    };

    const columns = [
        {name: 'User Name', selector: row => row.username, width: '160px'},
        {cell: row => <ApplicationAction application={row} onAction={removeApplication} />},
    ];

    return <Table
        columns={columns}
        data={applications}
    />;
}
