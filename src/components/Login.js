function Login() {
    return (
        <div className="auth">
            <h2 className="auth__title">Вход</h2>
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
            <button type="submit" className="auth__submit-button">Войти</button>
        </div>
    )
}

export default Login;