import { Link } from "react-router-dom";

function Register() {
    return (
        <div className="auth">
            <h2 className="auth__title">Регистрация</h2>
            <form className="auth__form">
                <input 
                    name="email"
                    id="email-input"
                    type="email"
                    required
                    placeholder="Email" 
                    className="auth__input auth__input_type_email"
                />
                <span id="email-error" className="email-input-error auth__input-error"></span>
                <input 
                    name="password"
                    id="password-input" 
                    type="password" 
                    required
                    minLength="8"
                    maxLength="30"
                    placeholder="Пароль" 
                    className="auth__input auth__input_type_password"
                />
                <span id="password-error" className="password-input-error auth__input-error"></span>
            </form>
            <button type="submit" className="auth__submit-button">Зарегистрироваться</button>
            <Link to="/sign-in" className="auth__login-link">Уже зарегистрировались? Войти</Link>

        </div>
    )
}

export default Register;