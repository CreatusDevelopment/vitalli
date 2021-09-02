import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Item(props) {
	return (
		<Link to={props.link} onClick={props.onClick}>
			<li className={props.linkref === props.link ? "item selected" : "item"}>
				<span className="item-text">
					<FontAwesomeIcon className="text-icon" icon={props.icon} />{" "}
					{props.title}
				</span>
			</li>
		</Link>
	);
}
