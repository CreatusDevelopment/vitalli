import React from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarExport,
	ptBR,
} from "@mui/x-data-grid";
import Button from "@material-ui/core/Button";
import "./styles.scss";

const theme = createTheme(
	{
		palette: {
			primary: { main: "#1976d2" },
		},
	},
	ptBR
);
function CustomToolbar() {
	return (
		<GridToolbarContainer>
			<GridToolbarExport
				csvOptions={{
					fields: ["name", "start", "end"],
					delimiter: ";",
				}}
			/>

			<Button
				className="confirm-button datagrid-button"
				size="small"
				color="primary"
				startIcon={<AddIcon />}
			>
				Adicionar
			</Button>

			<Button
				className="delete-button datagrid-button"
				size="small"
				color="primary"
				startIcon={<DeleteIcon />}
			>
				Deletar
			</Button>
		</GridToolbarContainer>
	);
}

const columns = [
	{ field: "name", headerName: "Nome", width: 250, editable: true },
	{
		field: "birthday",
		headerName: "Nascimento",
		width: 160,
		editable: true,
	},
	{
		field: "contact",
		headerName: "Contato",
		width: 150,
		editable: true,
	},
	{
		field: "address",
		headerName: "Endereço",
		width: 150,
		editable: true,
	},
	{ field: "cep", headerName: "CEP", width: 150, editable: true },
	{
		field: "rg",
		headerName: "RG",
		width: 150,
		editable: true,
	},
	{
		field: "gn",
		headerName: "Nº Guia",
		width: 150,
		editable: true,
	},
	{
		field: "saldo",
		headerName: "Saldo",
		width: 150,
		editable: true,
	},
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
	{
		id: 7,
		name: "Clifford",
		start: "12:30",
		end: "13:30",
		convenio: "Unimed",
	},
	{
		id: 8,
		name: "Frances",
		start: "12:30",
		end: "13:30",
		convenio: "Unimed",
	},
	{ id: 9, name: "Roxie", start: "12:30", end: "13:30", convenio: "Unimed" },
];

export default function Pacientes() {
	return (
		<div className="pacientes-container">
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
					onSelectionModelChange={(e) => {
						console.log(e);
					}}
					onCellEditCommit={(e) => {
						console.log(e);
					}}
				/>
			</ThemeProvider>
		</div>
	);
}
