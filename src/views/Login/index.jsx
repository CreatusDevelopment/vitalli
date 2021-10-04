import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../functions";
import { logIn, _setUserEmail, _setUserName } from "../../redux/actions";
import Collapse from "@material-ui/core/Collapse";

import "./styles.scss";

export default function Login() {
	const history = useHistory();
	const [Email, setEmail] = useState("");
	const [Password, setPassword] = useState("");
	const [Show, setShow] = useState(false);
	const [Err, setErr] = useState("");
	const dispatch = useDispatch();

	function handleSubmit(e) {
		e.preventDefault();
		login(
			(e) => {
				if (e?.data) {
					console.log(e);
					dispatch(logIn());
					dispatch(_setUserName(e.data.message.name));
					dispatch(_setUserEmail(e.data.message.email));
					localStorage.setItem("isLogged", true);

					const now = new Date();
					const item = {
						value: e.data.message.token,
						expiry: now.getTime() + 86400 * 1000,
					};
					localStorage.setItem("token", JSON.stringify(item));
					localStorage.setItem("use_type", e.data.message.type);
					localStorage.setItem("user_name", e.data.message.name);
					localStorage.setItem("user_email", e.data.message.email);
					window.location.reload();
				} else {
					setShow(true);
					setErr(e.response.data.message);
					console.log(e);
				}
			},
			{ user: Email, pass: Password }
		);

		history.push("/calendario");
	}
	return (
		<div className="login-view">
			<Collapse className="alert" in={Show}>
				<Alert
					severity="error"
					onClose={(e) => {
						setShow(false);
					}}
				>
					{Err}
				</Alert>
			</Collapse>
			<div className="logo-container">
				<img className="logo" src="/logo.png" alt="Vitalli Psicologia" />
				{/* <h1>Clinica de Psicologia</h1> */}
			</div>
			<form className="form-container" onSubmit={handleSubmit}>
				<TextField
					autoComplete="username"
					className="input"
					id="email"
					label="Email"
					variant="outlined"
					type="email"
					required
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<TextField
					autoComplete="current-password"
					className="input"
					id="senha"
					label="Senha"
					variant="outlined"
					type="password"
					required
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<Button className="input button" variant="contained" type="submit">
					Entrar
				</Button>
				<Button
					className="input forgot-password"
					onClick={() => {
						history.push("/esqueci_a_senha");
					}}
				>
					Esqueceu sua senha?
				</Button>
			</form>
		</div>
	);
}
