//rfc
import React, { useEffect, useState } from "react";
import {
	faHome,
	faCalendar,
	faBook,
	faUser,
	faWallet,
	faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import "./style.scss";
import Item from "./NavItem";
import { useDispatch } from "react-redux";
import { logOut } from "../../redux/actions";

export default function Navbar(props) {
	const pathName = useLocation().pathname;
	const [Active, setActive] = useState("");
	useEffect(() => {
		setActive(window.location.pathname);
	}, [pathName]);
	const dispatch = useDispatch();

	return (
		<nav className="sidebar-nav">
			<div className="logo-picture-container">
				<div className="logo-container">
					<h1 className="logo">VP</h1>
				</div>
				<div className="person-container">
					<h3 className="person-name">Guilherme Carvalho Silva</h3>
					<p className="person-username">guilherme@creatus.net.br</p>
					<img className="person-picture" alt="sua foto aqui" src="/eu.jpg" />
				</div>
			</div>
			<ul className="itens-list">
				<Item title="Home" link="/home" icon={faHome} linkref={Active} />
				<Item
					title="Calendário"
					link="/calendario"
					icon={faCalendar}
					linkref={Active}
				/>
				<Item
					title="Pacientes"
					link="/pacientes"
					icon={faBook}
					linkref={Active}
				/>
				<Item
					title="Locatários"
					link="/locatarios"
					icon={faUser}
					linkref={Active}
				/>
				<Item
					title="Financeiro"
					link="/financeiro"
					icon={faWallet}
					linkref={Active}
				/>
				<div className="options">
					<Item
						title="Sair"
						link="/"
						icon={faSignOutAlt}
						onClick={() => {
							localStorage.setItem("isLogged", false);
							dispatch(logOut());
						}}
					/>
				</div>
			</ul>
		</nav>
	);
}
