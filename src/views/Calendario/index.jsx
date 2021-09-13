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

	function deleteSchedule() {
		axios({
			method: "delete",
			url: "/schedule/delete",
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
							copy[i].state = "deleted";
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
					onClick={deleteSchedule}
				>
					Deletar
				</Button>
			</GridToolbarContainer>
		);
	}

	useEffect(() => {
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
				console.log(error);
			});
	}

	return (
		<div className="calendar-container">
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
