import store, {updateState} from "./store";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

const origin = "http://localhost:24770/";

export async function request(url, method = "GET", body = null) {
    let headers = {'Content-Type': 'application/json;charset=utf-8'};
    let token = store.getState().token;
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let raw = await fetch(origin + url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!raw.ok) {
        console.log(raw);
        const errorText = await raw.json();
        throw new Error(errorText.message);
    }


    const contentType = raw.headers.get("Content-Type");
    let res;
    if (contentType && contentType.includes("application/json")) {
        res = await raw.json();
    } else {
        res = { success: true, message: await raw.text() };
    }

    if (!res.success) {
        console.log(res.message);
    }


    return res;
}

export function useRequest() {
    const dispatch = useDispatch();
    return async (...args) => {
        try {
            let res = await request(...args);
            if(res.message)
                dispatch(updateState({notification: {success: true, message: res.message}}));
            return res;
        } catch (err) {
            dispatch(updateState({notification: {success: false, message: err.message}}));
            throw err;
        }
    }
}

export function useAuthorizationCheck() {
    const logged_as = useSelector(state => state.logged_as);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return () => {
        if (!logged_as) {
            dispatch(updateState({notification:
                    {success: false, message: "You need to authorise!!"}
            }));
            navigate("/");
        }
    };
}

export async function silentRequest(...args) {
    try {
        return await request(...args);
    } catch (err) {}
}

export function updateMovies(dispatch) {
    silentRequest("api/movie/all_movies")
        .then(r => r && dispatch(updateState({movies: r})));
}
