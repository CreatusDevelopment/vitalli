import Navbar from "./components/Navbar/index";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
	Financeiro,
	Calendario,
	Pacientes,
	Locatarios,
	Login,
	Esqueci_a_senha,
	Redefinir,
} from "./views";
import { useSelector } from "react-redux";

function App() {
	const isLogged = useSelector((state) => state.isLogged);

	if (isLogged) {
		return (
			<Router>
				<div className="App">
					<Navbar />
					<Switch>
						<Route path="/calendario" component={Calendario} exact />
						<Route path="/pacientes" component={Pacientes} exact />
						<Route path="/locatarios" component={Locatarios} exact />
						<Route path="/financeiro" component={Financeiro} exact />
					</Switch>
				</div>
			</Router>
		);
	} else {
		return (
			<Router className="App">
				<div>
					<Switch>
						<Route path="/esqueci_a_senha" component={Esqueci_a_senha} exact />
						<Route path="/redefinir/:id" component={Redefinir} exact />
						<Route path="/" component={Login} />
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
