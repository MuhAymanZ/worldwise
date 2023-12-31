import { Link } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import styles from "./CityItem.module.css";

const flagemojiToPNG = (flag) => {
	let countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
		.map((char) => String.fromCharCode(char - 127397).toLowerCase())
		.join("");
	return (
		<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt="flag" />
	);
};

const formatDate = (date) =>
	new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "long",
		year: "numeric",
		weekday: "long",
	}).format(new Date(date));

function CityItem({ city }) {
	const {
		cityName,
		emoji,
		date,
		id,
		position: { lat, lng },
	} = city;
	const { currentCity, deleteCity } = useCities();

	function handleDeleteCity(e) {
		e.preventDefault();
		deleteCity(id);
	}
	return (
		<li>
			<Link
				to={`${id}?lat=${lat}&lng=${lng}`}
				className={`${styles.cityItem} ${
					id === currentCity.id ? styles["cityItem--active"] : ""
				}
`}
			>
				<span className={styles.emoji}>{flagemojiToPNG(emoji)}</span>
				<h3 className={styles.name}>{cityName}</h3>
				<time className={styles.date}>{formatDate(date)}</time>
				<button className={styles.deleteBtn} onClick={handleDeleteCity}>
					&times;
				</button>
			</Link>
		</li>
	);
}

export default CityItem;
