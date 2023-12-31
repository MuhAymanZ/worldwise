import { useReducer } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { useContext } from "react";
import { createContext, useEffect } from "react";

const CitiesContext = createContext();

const BASE_URL = "https://world-wise-db.vercel.app";

const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {},
};

function reducer(state, action) {
	switch (action.type) {
		case "loading":
			return {
				...state,
				isLoading: true,
			};
		case "cities/loaded":
			return {
				...state,
				isLoading: false,
				cities: action.payload,
			};

		case "city/loaded":
			return { ...state, isLoading: false, currentCity: action.payload };
		case "city/created":
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};
		case "city/deleted":
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter((city) => city.id !== action.payload),
				currentCity: {},
			};
		case "rejected":
			return { ...state, isLoading: false, error: action.payload };
		default:
			throw new Error("unknown action type");
	}
}

function CitiesProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { cities, isLoading, currentCity } = state;
	// const [cities, setCities] = useState([]);
	// const [isLoading, setIsLoading] = useState(false);
	// const [currentCity, setCurrentCity] = useState({});

	useEffect(() => {
		dispatch({ type: "loading" });
		fetch(`${BASE_URL}/cities`)
			.then((res) => res.json())
			.then((data) => dispatch({ type: "cities/loaded", payload: data }))
			.catch(() =>
				dispatch({
					type: "rejected",
					payload: "there is an error loading cities...",
				})
			);
	}, []);

	const getCity = useCallback(
		async function getCity(id) {
			if (Number(id) === currentCity.id) return;

			dispatch({ type: "loading" });
			try {
				const res = await fetch(`${BASE_URL}/cities/${id}`);
				const data = await res.json();
				dispatch({ type: "city/loaded", payload: data });
			} catch {
				dispatch({
					type: "rejected",
					payload: "there is an error loading city",
				});
			}
		},
		[currentCity.id]
	);
	async function createCity(newCity) {
		dispatch({ type: "loading" });
		try {
			const res = await fetch(`${BASE_URL}/cities/`, {
				method: "POST",
				body: JSON.stringify(newCity),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
			console.log(data);

			dispatch({ type: "city/created", payload: data });
		} catch (err) {
			dispatch({
				type: "rejected",
				payload: "there is an error creating city",
			});
		}
	}
	async function deleteCity(id) {
		dispatch({ type: "loading" });

		try {
			await fetch(`${BASE_URL}/cities/${id}`, {
				method: "DELETE",
			});

			dispatch({ type: "city/deleted", payload: id });
		} catch {
			dispatch({
				type: "rejected",
				payload: "there is an error deleting city",
			});
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				getCity,
				currentCity,
				createCity,
				deleteCity,
			}}
		>
			{children}
		</CitiesContext.Provider>
	);
}

function useCities() {
	const value = useContext(CitiesContext);
	if (value === undefined)
		throw new Error("Cities Context was used outside CitiesProvider");
	return value;
}

export { CitiesProvider, useCities };
