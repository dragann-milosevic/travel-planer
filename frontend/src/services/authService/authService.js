import httpService from "../httpService/httpService";

const authService = {
    async login(loginModel) {
        const body = {
            userName: loginModel.emailOrUserName,
            email: loginModel.emailOrUserName,
            password: loginModel.password
        };
        const result = await httpService.post("auth/login", body, false);
        return result;
    },

    async register(registrationModel) {
        const body = {
            firstName: registrationModel.firstName,
            lastName: registrationModel.lastName,
            userName: registrationModel.userName,
            email: registrationModel.email,
            password: registrationModel.password
        };
        const result = await httpService.post("auth/register", body, false);
        return result;
    }
};

export default authService;