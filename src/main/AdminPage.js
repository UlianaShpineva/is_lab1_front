import {useDispatch, useSelector} from "react-redux";
import AdminApplicationTable from "../component/AdminApplicationTable";
import HistoryTable from "../component/HistoryTable";
import {useAuthorizationCheck, useRequest} from "../Util";
import {useEffect} from "react";
import {updateState} from "../store";

export default function AdminPage() {
    const authorizationCheck = useAuthorizationCheck();
    useEffect(authorizationCheck, [authorizationCheck]);
    const logged_as = useSelector(state => state.role);
    const request = useRequest();

    const dispatch = useDispatch();
    const handleApply = () => {
        request("api/user/request-admin-role", "POST")
            .then(res => {
                const responseJson = {
                    success: true,
                    message: res.message,
                };
                dispatch(updateState({notification:
                responseJson
                }))
            }).catch(console.error);
    };

    if (logged_as !== 'ADMIN') {
        return <div className="container">
            <p>you are not ADMIN</p>
            <button className="rounded full padding" onClick={handleApply}>Request admin role</button>
        </div>;
    }

    return <div>
        <div className="container">
            <p>Requests:</p>
            <AdminApplicationTable/>
        </div>
        <div className="container">
            <p>History:</p>
            <HistoryTable/>
        </div>
    </div>;
}
