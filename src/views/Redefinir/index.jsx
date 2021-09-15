import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import { newPassowrd } from "../../functions";

import "./styles.scss";

export default function Redefinir(props) {
	const history = useHistory();
	const [Password, setPassword] = useState("");
	const [ConfirmPassword, setConfirmPassword] = useState("");
	const [Show, setShow] = useState(false);
	const [Error, setError] = useState(false);

	function handleSubmit(e) {
		e.preventDefault();

		console.log(props.match.params.id);
		console.log(Password);
		console.log(ConfirmPassword);
		if (Password === ConfirmPassword) {
			setError(false);
			newPassowrd(
				(e) => {
					if (e?.data) {
						console.log(e.data);
						setShow(true);
					} else {
						console.log(e);
					}
				},
				{ pass: Password },
				props.match.params.id
			);
		} else {
			setError(true);
		}
	}

	return (
		<div className="redefinir-view">
			<Collapse className="alert" in={Show}>
				<Alert
					onClose={(e) => {
						console.log(e);
						setShow(false);
					}}
				>
					Sucesso - sua nova senha foi definida!
				</Alert>
			</Collapse>
			<h1>Quase lá!</h1>
			<p>Agora basta preencher com a sua nova senha</p>
			<form className="form-container" onSubmit={handleSubmit}>
				<TextField
					className="input "
					id="senha"
					label="Senha"
					variant="outlined"
					type="password"
					required
					onChange={(e) => {
						setPassword(e.target.value);
					}}
				/>
				<TextField
					className="input "
					id="confirmar_senha"
					label="Confirmar senha"
					variant="outlined"
					type="password"
					required
					onChange={(e) => {
						setConfirmPassword(e.target.value);
					}}
					error={false || Error}
					helperText={Error && "As senhas não são iguais."}
				/>
				<Button className="input button" variant="contained" type="submit">
					Enviar
				</Button>
				<Button
					className="input"
					onClick={() => {
						history.push("/");
					}}
				>
					Ir para login
				</Button>
			</form>
		</div>
	);
}
