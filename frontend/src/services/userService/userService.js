import httpService from "../httpService/httpService";
import urlService from "../urlService/urlService";
import User from "../../models/User";

const userService = {
    async getAll() {
        const api = urlService.getAuthApiUrl();
        const result = await httpService.get(api, "users");
        if (!result.ok) return [];
        return (result.data || []).map(User.fromDto);
    },

    async getById(id) {
        const api = urlService.getAuthApiUrl();
        const result = await httpService.get(api, `users/${id}`);
        if (!result.ok) return null;
        return User.fromDto(result.data);
    },

    async getMe() {
        const api = urlService.getAuthApiUrl();
        const result = await httpService.get(api, "users/me");
        if (!result.ok) return null;
        return User.fromDto(result.data);
    },

    async updateRole(id, role) {
        const api = urlService.getAuthApiUrl();
        const body = { role: role === "Admin" ? 2 : 1 };
        const result = await httpService.put(api, `users/${id}/role`, body);
        return { success: result.ok, error: result.error };
    },

    async remove(id) {
        const api = urlService.getAuthApiUrl();
        const result = await httpService.del(api, `users/${id}`);
        return { success: result.ok, error: result.error };
    }
};

export default userService;