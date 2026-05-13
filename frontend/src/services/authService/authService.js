import httpService from "../httpService/httpService";
import urlService from "../urlService/urlService";

const authService = {
    async login(loginModel) {
        const api = urlService.getAuthApiUrl();
        const body = {
            userName: loginModel.emailOrUserName,
            email: loginModel.emailOrUserName,
            password: loginModel.password
        };
        return await httpService.post(api, "auth/login", body, false);
    },

    async register(registrationModel) {
        const api = urlService.getAuthApiUrl();
        const body = {
            firstName: registrationModel.firstName,
            lastName: registrationModel.lastName,
            userName: registrationModel.userName,
            email: registrationModel.email,
            password: registrationModel.password
        };
        return await httpService.post(api, "auth/register", body, false);
    }
};

export default authService;