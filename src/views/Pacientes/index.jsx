import React, { useEffect, useState } from "react";
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
import { getPatient } from "../../functions";

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
		field: "guideId",
		headerName: "Nº Guia",
		width: 150,
		editable: true,
		valueGetter: (params) => {
			return params.row.guide.id;
		},
	},
	{
		field: "guideValue",
		headerName: "Saldo",
		width: 150,
		editable: true,
		valueGetter: (params) => {
			return params.row.guide.value;
		},
	},
];

export default function Pacientes() {
	const [Rows, setRows] = useState([]);
	const [Loading, setLoading] = useState(false);

	useEffect(() => {
		setRows([]);
		setLoading(true);
		getPatient((e) => {
			setRows(e);
			setLoading(false);
		});
	}, []);
	return (
		<div className="pacientes-container">
			<ThemeProvider theme={theme}>
				<DataGrid
					loading={Loading}
					components={{
						Toolbar: CustomToolbar,
					}}
					rows={Rows}
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
