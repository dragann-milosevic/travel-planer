class LoginModel {
    constructor({ emailOrUserName = "", password = "" } = {}) {
        this.emailOrUserName = emailOrUserName;
        this.password = password;
    }

    static empty() {
        return new LoginModel();
    }

    validate() {
        const errors = {};
        if (!this.emailOrUserName || this.emailOrUserName.trim().length === 0)
            errors.emailOrUserName = "Email ili korisničko ime je obavezno.";
        if (!this.password || this.password.length === 0)
            errors.password = "Lozinka je obavezna.";
        return errors;
    }
}

export default LoginModel;