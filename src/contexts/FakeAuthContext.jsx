import { useContext, useReducer } from "react";
import { createContext } from "react";

const AuthContext = createContext({
	user: {},
	isAuthenticated: false,
	login: () => {},
	logout: () => {},
});

const initialState = {
	user: null,
	isAuthenticated: false,
};

const FAKE_USER = {
	name: "Ayman",
	email: "ayman@example.com",
	password: "qwerty",
	avatar: "https://i.pravatar.cc/100?u=zz",
};

function reducer(state, action) {
	switch (action.type) {
		case "login":
			return { ...state, user: action.payload, isAuthenticated: true };
		case "logout":
			return { ...initialState };
		default:
			throw new Error("Unknown");
	}
}

function AuthProvider({ children }) {
	const [{ user, isAuthenticated }, dispatch] = useReducer(
		reducer,
		initialState
	);

	function login(email, password) {
		if (email === FAKE_USER.email && password === FAKE_USER.password)
			dispatch({ type: "login", payload: FAKE_USER });
	}
	function logout() {
		dispatch({ type: "logout" });
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

function useAuth() {
	const context = useContext(AuthContext);

	if (context === undefined)
		throw new Error("AuthContext was used outside AuthProvider");
	return context;
}

export { AuthProvider, useAuth };
