import { useEffect } from "react";
import Navbar from "./components/Navbar/index";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
	Home,
	Financeiro,
	Calendario,
	Pacientes,
	Locatarios,
	Login,
	Esqueci_a_senha,
	Redefinir,
} from "./views";
import { useSelector, useDispatch } from "react-redux";
import { logIn, logOut } from "./redux/actions";

function App() {
	const isLogged = useSelector((state) => state.isLogged);
	const dispatch = useDispatch();
	useEffect(() => {
		if (localStorage.getItem("isLogged") === "true") {
			dispatch(logIn());
		} else {
			dispatch(logOut());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (isLogged) {
		return (
			<Router>
				<div className="App">
					<Navbar />
					<Switch>
						<Route path="/home" component={Home} exact />
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
