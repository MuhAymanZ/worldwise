import styles from "./Login.module.css";
import { useState } from "react";
import PageNav from "../components/PageNav";
import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Login() {
	const navigate = useNavigate();
	const { isAuthenticated, login } = useAuth();
	const [email, setEmail] = useState("ayman@example.com");
	const [password, setPassword] = useState("qwerty");

	function handleSubmitLogin(e) {
		e.preventDefault();
		login(email, password);
	}

	useEffect(() => {
		if (isAuthenticated === true) navigate("/app", { replace: true });
	}, [isAuthenticated, navigate]);

	return (
		<main className={styles.login}>
			<PageNav />
			<form className={styles.form} onSubmit={handleSubmitLogin}>
				<div className={styles.row}>
					<label htmlFor="email">Email address</label>
					<input
						type="email"
						id="email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</div>

				<div className={styles.row}>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						onChange={(e) => setPassword(e.target.value)}
						value={password}
					/>
				</div>

				<div>
					<Button type="primary">Login</Button>
				</div>
			</form>
		</main>
	);
}
