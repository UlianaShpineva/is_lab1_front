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
        //credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!raw.ok) {
        // Можно вывести сообщение для диагностики
        const errorText = await raw.text(); // Получаем текст ошибки
        throw new Error(`HTTP error! Status: ${raw.status}. ${errorText}`);
    }

    // let res = await raw.json();
    // if (!res.success) console.log(res.message);//throw new Error(res.message);

    // Проверка типа контента, если это не JSON, то не пытаться его парсить
    const contentType = raw.headers.get("Content-Type");
    let res;
    if (contentType && contentType.includes("application/json")) {
        res = await raw.json(); // Если ответ JSON, парсим как JSON
    } else {
        res = { success: true, message: await raw.text() }; // Если строка, обрабатываем как текст
    }

    if (!res.success) {
        console.log(res.message); // Логируем сообщение об ошибке
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

export function useRequestText() {
    const dispatch = useDispatch();
    return async (...args) => {
        try {
            let res = await request(...args);
            console.log(res);
            if(res.data)
                dispatch(updateState({notification: {success: true, message: res.data}}));
            return res;
        } catch (err) {
            console.log("here")
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
