import React, { useState } from "react";
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

const theme = createTheme(
	{
		palette: {
			primary: { main: "#1976d2" },
		},
	},
	ptBR
);

const columns = [
	{ field: "name", headerName: "Nome", width: 150 },
	{
		field: "start",
		headerName: "Inicio",
		width: 130,
		editable: true,
	},
	{
		field: "end",
		headerName: "Fim",
		width: 130,
		editable: true,
	},
	{
		field: "convenio",
		headerName: "Convenio",
		width: 150,
		editable: true,
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

const rows = [
	{ id: 1, name: "Snow", start: "12:30", end: "13:30", convenio: "Unimed" },
	{
		id: 2,
		name: "Lannister",
		start: "12:30",
		end: "13:30",
		convenio: "Unimed",
	},
	{
		id: 3,
		name: "Lannister",
		start: "12:30",
		end: "13:30",
		convenio: "Unimed",
	},
	{
		id: 4,
		name: "Targaryen",
		start: "12:30",
		end: "13:30",
		convenio: "Unimed",
	},
	{
		id: 6,
		name: "Melisandre",
		start: "12:30",
		end: "13:30",
		convenio: "Unimed",
	},
	{ id: 7, name: "Clifford", start: "12:30", end: "13:30", convenio: "Unimed" },
	{ id: 8, name: "Frances", start: "12:30", end: "13:30", convenio: "Unimed" },
	{ id: 9, name: "Roxie", start: "12:30", end: "13:30", convenio: "Unimed" },
];

function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridToolbarExport
				csvOptions={{
					fields: ["name", "start", "end"],
					delimiter: ";",
				}}
			/>
		</GridToolbarContainer>
	);
}

export default function Calendario() {
	const [value, onChange] = useState(new Date());

	return (
		<div className="calendar-container">
			<div className="calendar-inner">
				<Calendar className="calendar" onChange={onChange} value={value} />
			</div>
			<div className="datagrid-inner">
				<ThemeProvider theme={theme}>
					<DataGrid
						components={{
							Toolbar: CustomToolbar,
						}}
						rows={rows}
						columns={columns}
						pageSize={10}
						rowsPerPageOptions={[10]}
						checkboxSelection
						disableSelectionOnClick
					/>
				</ThemeProvider>
			</div>
		</div>
	);
}
