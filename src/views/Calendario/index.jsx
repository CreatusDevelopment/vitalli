import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarExport,
	ptBR,
} from "@mui/x-data-grid";
import "react-calendar/dist/Calendar.css";
import "./styles.scss";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneOutlinedIcon from "@material-ui/icons/DoneOutlined";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Alert from "@material-ui/lab/Alert";

const theme = createTheme(
	{
		palette: {
			primary: { main: "#1976d2" },
		},
	},
	ptBR
);

const columns = [
	{
		field: "patient",
		headerName: "Nome",
		width: 150,
	},
	{
		field: "start",
		headerName: "Inicio",
		width: 130,
	},
	{
		field: "end",
		headerName: "Fim",
		width: 130,
	},
	{
		field: "healthplan",
		headerName: "Convenio",
		width: 150,
	},
	{
		field: "guide",
		headerName: "Guia",
		width: 150,
	},
	/*{
		field: "fullName",
		headerName: "Full name",
		description: "This column has a value getter and is not sortable.",
		sortable: false,
		width: 160,
		valueGetter: (params) => `${params.getValue(params.id, "firstName") || ""}`,
	},*/
];

const repeatWeek = [
	{ nome: "Segunda-Feira" },
	{ nome: "Terça-Feira" },
	{ nome: "Quarta-Feira" },
	{ nome: "Quinta-Feira" },
	{ nome: "Sexta-Feira" },
	{ nome: "Sábado" },
	{ nome: "Domingo" },
];

const timeSlots = Array.from(new Array(24 * 2)).map(
	(_, index) =>
		`${index < 20 ? "0" : ""}${Math.floor(index / 2)}:${
			index % 2 === 0 ? "00" : "30"
		}`
);

const useStyles = makeStyles({
	root: {
		"& .confirmed": {
			backgroundColor: "rgba(157, 255, 118, 0.49)",
			color: "#1a3e72",
		},
		"& .deleted": {
			backgroundColor: "#d47483",
			color: "#1a3e72",
		},
		"& .disabled": {
			color: "rgba(0,0,0,0.5)",
			cursor: "not-allowed",
		},
	},
});

export default function Calendario() {
	const classes = useStyles();

	const [value, onChange] = useState(new Date());
	const [Recorrente, setRecorrente] = useState(false);
	const [Consulta, setConsulta] = useState(false);
	const [DayInfo, setDayInfo] = useState([]);
	const [ScheduleId, setScheduleId] = useState([]);
	const [Patinet, setPatinet] = useState([]);
	const [HealthPlan, setHealthPlan] = useState([]);
	const [Hour, setHour] = useState("");
	const [SendHealth, setSendHealth] = useState("");
	const [SendPatient, setSendPatient] = useState("");
	const [RecorrentData, setRecorrentData] = useState("");
	const [SnackUndo, setSnackUndo] = useState(false);
	const [SnackErr1, setSnackErr1] = useState(false);
	const [SnackErr2, setSnackErr2] = useState(false);
	const [SnackErr3, setSnackErr3] = useState(false);
	const [SnackErr3Message, setSnackErr3Message] = useState("");

	function preDeleteSchedule() {
		for (let i = 0; i < DayInfo.length; i++) {
			for (let j = 0; j < ScheduleId.length; j++) {
				if (DayInfo[i].id === ScheduleId[j]) {
					if (DayInfo[i].state === "confirmed") {
						setSnackErr1(true);
						setScheduleId([]);
						return;
					}
				}
			}
		}

		for (let i = 0; i < DayInfo.length; i++) {
			for (let j = 0; j < ScheduleId.length; j++) {
				if (DayInfo[i].id === ScheduleId[j]) {
					let copy = DayInfo.slice();
					copy[i].state = "deleted";
					setDayInfo(copy);
				}
			}
		}
		if (JSON.parse(localStorage.getItem("toDelete") === null)) {
			localStorage.setItem("toDelete", JSON.stringify(ScheduleId));
		} else {
			let temp = JSON.parse(localStorage.getItem("toDelete"));
			temp = [...temp, ...ScheduleId];
			localStorage.setItem("toDelete", JSON.stringify(temp));
		}
		setScheduleId([]);
		setSnackUndo(true);
	}
	function deleteSchedule() {
		for (let i = 0; i < DayInfo.length; i++) {
			for (let j = 0; j < ScheduleId.length; j++) {
				if (DayInfo[i].id === ScheduleId[j]) {
					if (DayInfo[i].state === "confirmed") {
						alert("voce nao pode deletar uma agenda confirmada!");
						return;
					}
				}
			}
		}
		axios({
			method: "delete",
			url: "/schedule/delete",
			data: {
				ids: JSON.parse(localStorage.getItem("toDelete")),
			},
		})
			.then(async (response) => {
				let temp = JSON.parse(localStorage.getItem("toDelete"));
				let copy = null;
				for (let i = 0; i < DayInfo.length; i++) {
					for (let j = 0; j < temp.length; j++) {
						if (DayInfo[i].id === temp[j]) {
							if (copy === null) copy = DayInfo.slice();
							copy.pop(i);
						}
					}
				}
				setDayInfo(copy);
				localStorage.removeItem("toDelete");
			})
			.catch(function (error) {
				setSnackErr2(true);
				localStorage.removeItem("toDelete");
			});
	}

	function confirmSchedule() {
		axios({
			method: "post",
			url: "/schedule/confirm",
			data: {
				ids: ScheduleId,
			},
		})
			.then(async (response) => {
				// console.log(response);
				for (let i = 0; i < DayInfo.length; i++) {
					for (let j = 0; j < ScheduleId.length; j++) {
						if (DayInfo[i].id === ScheduleId[j]) {
							//TODO: change DayInfo[i].state = 'confirmed'
							let copy = DayInfo.slice();
							copy[i].state = "confirmed";
							setDayInfo(copy);
						}
					}
				}
				setScheduleId([]);
			})
			.catch(function (error) {
				// console.log(error);
			});
	}

	function CustomToolbar() {
		return (
			<GridToolbarContainer>
				<GridToolbarExport
					csvOptions={{
						delimiter: ";",
					}}
				/>

				<Button
					className="confirm-button"
					size="small"
					color="primary"
					startIcon={<DoneOutlinedIcon />}
					onClick={confirmSchedule}
				>
					Confirmar
				</Button>

				<Button
					className="delete-button"
					size="small"
					color="primary"
					startIcon={<DeleteIcon />}
					onClick={preDeleteSchedule}
				>
					Deletar
				</Button>
			</GridToolbarContainer>
		);
	}

	useEffect(() => {
		if (JSON.parse(localStorage.getItem("toDelete") !== null)) {
			axios({
				method: "delete",
				url: "/schedule/delete",
				data: {
					ids: JSON.parse(localStorage.getItem("toDelete")),
				},
			})
				.then(async (response) => {
					localStorage.removeItem("toDelete");
				})
				.catch(function (error) {
					setSnackErr2(true);
					localStorage.removeItem("toDelete");
				});
		}

		axios({
			method: "get",
			url: "/patient/find",
		})
			.then(async (response) => {
				setPatinet(response.data);
			})
			.catch(function (error) {
				// console.log(error);
			});

		axios({
			method: "get",
			url: "/healthplan/find",
		})
			.then(async (response) => {
				// console.log(response.data);

				setHealthPlan(response.data);
			})
			.catch(function (error) {
				// console.log(error);
			});
	}, []);

	useEffect(() => {
		setScheduleId([]);
		axios({
			method: "get",
			url: "/schedule/get",
			params: {
				date: value,
			},
		})
			.then(async (response) => {
				setDayInfo(response.data);
				// console.log(DayInfo);
			})
			.catch(function (error) {
				// console.log(error);
			});
	}, [value]);

	function handleSubmit(e) {
		e.preventDefault();
		console.log(ScheduleId);
		axios({
			method: "post",
			url: "/schedule/create",
			data: {
				initial: value,
				start: Hour,
				healthplan: SendHealth,
				patient: SendPatient,
				tenant: "612fe01ed0039d1ad6c82a3d",
				type: Consulta ? "consultation" : "session",
				day: Recorrente ? RecorrentData : null,
			},
		})
			.then(async (response) => {
				console.log(response);
				axios({
					method: "get",
					url: "/schedule/get",
					params: {
						date: value,
					},
				})
					.then(async (response) => {
						setDayInfo(response.data);
						// console.log(DayInfo);
					})
					.catch(function (error) {
						console.log(error);
					});
			})
			.catch(function (error) {
				setSnackErr3Message(error.response.data.message);
				setSnackErr3(true);
			});
	}

	return (
		<div className="calendar-container">
			<div>
				<Snackbar
					open={SnackUndo}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setSnackUndo(false);
						deleteSchedule();
					}}
					message="Agenda deletada"
					action={
						<>
							<Button
								color="secondary"
								size="small"
								onClick={(e, r) => {
									if (r === "clickaway") return;
									setSnackUndo(false);
									let temp = JSON.parse(localStorage.getItem("toDelete"));
									localStorage.removeItem("toDelete");

									for (let i = 0; i < DayInfo.length; i++) {
										for (let j = 0; j < temp.length; j++) {
											if (DayInfo[i].id === temp[j]) {
												let copy = DayInfo.slice();
												copy[i].state = " ";
												setDayInfo(copy);
											}
										}
									}
								}}
							>
								DESFAZER
							</Button>
							<IconButton
								size="small"
								aria-label="close"
								color="inherit"
								onClick={(e, r) => {
									if (r === "clickaway") return;
									setSnackUndo(false);
									deleteSchedule();
								}}
							>
								<CloseIcon fontSize="small" />
							</IconButton>
						</>
					}
				/>
				<Snackbar
					open={SnackErr1}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setSnackErr1(false);
					}}
				>
					<Alert variant="filled" severity="error">
						ERRO: Você não pode deletar uma agenda já confirmada!
					</Alert>
				</Snackbar>
				<Snackbar
					open={SnackErr2}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setSnackErr2(false);
					}}
				>
					<Alert variant="filled" severity="error">
						ERRO: Algo de errado aconteceu ao deletar sua agenda. Tente
						recarregar a página.
					</Alert>
				</Snackbar>
				<Snackbar
					open={SnackErr3}
					autoHideDuration={6000}
					onClose={(e, r) => {
						if (r === "clickaway") return;
						setSnackErr3(false);
					}}
				>
					<Alert variant="filled" severity="error">
						{SnackErr3Message}
					</Alert>
				</Snackbar>
			</div>
			<div className="calendar-inner">
				<div className="new-apoint">
					<form
						className="outter-form"
						onSubmit={(e) => {
							handleSubmit(e);
						}}
					>
						<p className="title">Nova {Consulta ? "Consulta" : "Sessão"}</p>
						<div>
							<FormControlLabel
								control={
									<Switch
										checked={Recorrente}
										color="primary"
										onChange={() => {
											setRecorrente((prev) => !prev);
										}}
										disabled={Consulta}
									/>
								}
								label="Evento Recorrente"
							/>
							<FormControlLabel
								control={
									<Checkbox
										checked={Consulta}
										onChange={(event) => {
											setConsulta(event.target.checked);
										}}
										name="sessao"
										color="primary"
									/>
								}
								label="Consulta"
							/>
						</div>
						{Recorrente && (
							<div className="recorrente-div">
								<Autocomplete
									className="input"
									onChange={(event, value) => setRecorrentData(value?.nome)}
									id="semana-de-repeticao"
									options={repeatWeek}
									getOptionLabel={(option) => option.nome}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Repetir todo(a)..."
											variant="outlined"
										/>
									)}
								/>
							</div>
						)}

						<Autocomplete
							className="input"
							onChange={(event, value) => setSendPatient(value?._id)}
							id="nome-paciente"
							options={Patinet}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => (
								<TextField {...params} label="Paciente" variant="outlined" />
							)}
						/>

						<Autocomplete
							className="input"
							id="disabled-options-demo"
							onChange={(event, value) => setHour(value)}
							options={timeSlots}
							getOptionDisabled={(option) => {
								for (let i = 0; i < DayInfo.length; i++) {
									if (option === DayInfo[i].start) {
										return true;
									}
								}
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Horário de inicio"
									variant="outlined"
								/>
							)}
						/>

						<Autocomplete
							className="input"
							onChange={(event, value) => setSendHealth(value?._id)}
							id="convenio"
							options={HealthPlan}
							getOptionLabel={(option) => option.name}
							renderInput={(params) => (
								<TextField {...params} label="Convenios" variant="outlined" />
							)}
						/>

						<Button className="input button" variant="contained" type="submit">
							Enviar
						</Button>
					</form>
				</div>
				<div className="calendar">
					<Calendar
						onChange={(e) => {
							// console.log(e);
							onChange(e);
						}}
						value={value}
					/>
				</div>
			</div>
			<div className={"datagrid-inner " + classes.root}>
				<ThemeProvider theme={theme}>
					<DataGrid
						components={{
							Toolbar: CustomToolbar,
						}}
						rows={DayInfo}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[10]}
						checkboxSelection
						disableSelectionOnClick
						selectionModel={ScheduleId}
						onSelectionModelChange={(e) => {
							setScheduleId(e);
						}}
						isRowSelectable={(params) => params.row.state !== "deleted"}
						getRowClassName={(e) => {
							if (e.row.state === "confirmed") {
								return "confirmed";
							}
							if (e.row.state === "deleted") {
								return "disabled";
							}
							return " ";
						}}
					/>
				</ThemeProvider>
			</div>
		</div>
	);
}
