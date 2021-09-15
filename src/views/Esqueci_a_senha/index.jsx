import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import Collapse from "@material-ui/core/Collapse";
import TextField from "@material-ui/core/TextField";
import { useHistory } from "react-router-dom";
import { forgotPassword } from "../../functions";

import "./styles.scss";

export default function Esqueci_a_senha() {
	const history = useHistory();
	const [Email, setEmail] = useState("");
	const [Show, setShow] = useState(false);
	function handleSubmit(e) {
		e.preventDefault();
		forgotPassword(
			(e) => {
				if (e?.data) setShow(true);
				else console.log(e.message.data);
			},
			{
				email: Email,
			}
		);
	}
	return (
		<div className="forgot-view" onSubmit={handleSubmit}>
			<Collapse className="alert" in={Show}>
				<Alert
					onClose={(e) => {
						console.log(e);
						setShow(false);
					}}
				>
					Sucesso - enviamos um email para <b>{Email}</b> com sua nova senha!
				</Alert>
			</Collapse>
			<h1>Esqueceu sua senha?</h1>
			<p>Preencha os campos e fique atento no seu email</p>
			<form className="form-container">
				<TextField
					className="input "
					id="email"
					label="Email"
					variant="outlined"
					type="email"
					required
					onChange={(e) => {
						setEmail(e.target.value);
					}}
				/>
				<Button className="input button" variant="contained" type="submit">
					Enviar
				</Button>
				<Button
					className="input"
					onClick={() => {
						history.goBack();
					}}
				>
					Voltar
				</Button>
			</form>
		</div>
	);
}
