import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logIn } from "../../redux/actions";

import "./styles.scss";

export default function Login() {
	const history = useHistory();
	const [Email, setEmail] = useState("");
	const [Password, setPassword] = useState("");
	const dispatch = useDispatch();

	function handleSubmit(e) {
		e.preventDefault();
		dispatch(logIn());
		localStorage.setItem("isLogged", true);
		console.log(Email);
		console.log(Password);

		history.push("/home");
	}
	return (
		<div className="login-view">
			<div className="logo-container">
				<img className="logo" src="/logo.png" alt="Vitalli Psicologia" />
			</div>
			<form className="form-container" onSubmit={handleSubmit}>
				<TextField
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
				<Button className="input">Esqueceu sua senha?</Button>
			</form>
		</div>
	);
}
