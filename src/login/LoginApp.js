export default function LoginApp(props) {
    const fetcher = props.fetcher;
    return (
        <div className="container">
            <table>
                <tbody>
                <tr>
                    <td colSpan="3" className="input-cell-l">Login or register</td>
                </tr>

                <tr>
                    <td className="input-cell-l">login:</td>
                    <td>
                        <input className="input-select rounded box" name="login" placeholder="Enter login"
                               required type="text" onChange={fetcher.loginChangeHandle}/>
                    </td>
                </tr>
                <tr>
                    <td className="input-cell-l">password:</td>
                    <td>
                        <input className="input-select rounded box" name="password" placeholder="Enter password"
                               required type="password" onChange={fetcher.passwordChangeHandle}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button className="box rounded redirect"
                                onClick={fetcher.loginHandle}>Login</button>
                    </td>
                    <td>
                        <button className="box rounded redirect"
                                onClick={fetcher.registerHandle}>Register</button>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
