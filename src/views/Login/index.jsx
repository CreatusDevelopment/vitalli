import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../functions";
import {
	logIn,
	_setToken,
	_setUserEmail,
	_setUserName,
} from "../../redux/actions";

import "./styles.scss";

export default function Login() {
	const history = useHistory();
	const [Email, setEmail] = useState("");
	const [Password, setPassword] = useState("");
	const dispatch = useDispatch();

	function handleSubmit(e) {
		e.preventDefault();
		login(
			(e) => {
				if (e?.data) {
					dispatch(logIn());
					dispatch(_setToken(e.data.message.token));
					dispatch(_setUserName(e.data.message.name));
					dispatch(_setUserEmail(e.data.message.email));
					localStorage.setItem("isLogged", true);
					localStorage.setItem("token", e.data.message.token);
					localStorage.setItem("user_name", e.data.message.name);
					localStorage.setItem("user_email", e.data.message.email);
				} else {
					console.log(e);
				}
			},
			{ user: Email, pass: Password }
		);

		history.push("/calendario");
	}
	return (
		<div className="login-view">
			<div className="logo-container">
				<img className="logo" src="/logo.png" alt="Vitalli Psicologia" />
			</div>
			<form className="form-container" onSubmit={handleSubmit}>
				<TextField
					autoComplete="username"
					className="input"
					id="email"
					label="Email"
					variant="outlined"
					type="text"
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
