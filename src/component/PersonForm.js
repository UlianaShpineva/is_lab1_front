import InputField, {Type} from "./InputField";
import OptionalComponent from "./OptionalForm";
import React, {useEffect, useState} from "react";
import {COLOR_VALUES, COUNTRY_VALUES} from "./MovieForm";
import {useSelector} from "react-redux";
import {silentRequest} from "../Util";

export default function PersonForm({object, onChange, subSelected, personType}) {
    const data = useSelector(state => state.locations) || [];
    const [locations, setLocations] = useState(data.map(d => d.location));
    useEffect(() => {
        silentRequest("api/location/get_all_locations")
            .then(r => r && setLocations(r));
    }, []);
    return <div>
        <InputField type={Type.String} name={`${personType}.name`} object={object} onChange={onChange}
                    check={e => e && e.length > 0}/>
        <InputField type={Type.Enum} name={`${personType}.eyeColor`} object={object} onChange={onChange}
                    values={COLOR_VALUES} check={e => Boolean(e)}/>
        <InputField type={Type.Enum} name={`${personType}.hairColor`} object={object} onChange={onChange}
                    values={COLOR_VALUES}/>
        <InputField type={Type.Number} name={`${personType}.weight`} object={object} onChange={onChange}
                    check={e => e > 0 && e != null}/>
        <InputField type={Type.Enum} name={`${personType}.nationality`} object={object} onChange={onChange}
                    values={COUNTRY_VALUES}  check={e => e != null}/>
        <OptionalComponent name={`${personType}.location`} initial={object[personType].location} subSelected={subSelected} nullable
                           values={locations} onChange={value => onChange({target: {name: `${personType}.location`, value}})}>
            <InputField type={Type.Number} name={`${personType}.location.x`} object={object} onChange={onChange} check={e => e != null}/>
            <InputField type={Type.Number} name={`${personType}.location.y`} object={object} onChange={onChange}/>
            <InputField type={Type.Number} name={`${personType}.location.x`} object={object} onChange={onChange} check={e => e != null}/>
            <InputField type={Type.String} name={`${personType}.location.name`} object={object} onChange={onChange}
                        check={e => e != null && e.length <= 392}/>
        </OptionalComponent>
    </div>
}
