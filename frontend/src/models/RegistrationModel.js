class RegistrationModel {
    constructor({
        firstName = "",
        lastName = "",
        userName = "",
        email = "",
        password = "",
        confirmPassword = ""
    } = {}) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    static empty() {
        return new RegistrationModel();
    }

    validate() {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!this.firstName || this.firstName.trim().length === 0)
            errors.firstName = "Ime je obavezno.";
        if (!this.lastName || this.lastName.trim().length === 0)
            errors.lastName = "Prezime je obavezno.";
        if (!this.userName || this.userName.trim().length === 0)
            errors.userName = "Korisničko ime je obavezno.";
        else if (this.userName.length < 3)
            errors.userName = "Korisničko ime mora imati najmanje 3 karaktera.";
        if (!this.email || this.email.trim().length === 0)
            errors.email = "Email je obavezan.";
        else if (!emailRegex.test(this.email))
            errors.email = "Email format nije validan.";
        if (!this.password || this.password.length === 0)
            errors.password = "Lozinka je obavezna.";
        else if (this.password.length < 6)
            errors.password = "Lozinka mora imati najmanje 6 karaktera.";
        if (this.password !== this.confirmPassword)
            errors.confirmPassword = "Lozinke se ne poklapaju.";
        return errors;
    }
}

export default RegistrationModel;