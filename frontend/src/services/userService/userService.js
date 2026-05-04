import httpService from "../httpService/httpService";
import User from "../../models/User";

const userService = {
    async getAll() {
        const result = await httpService.get("users");
        if (!result.ok) return [];
        return (result.data || []).map(User.fromDto);
    },

    async getById(id) {
        const result = await httpService.get(`users/${id}`);
        if (!result.ok) return null;
        return User.fromDto(result.data);
    },

    async getMe() {
        const result = await httpService.get("users/me");
        if (!result.ok) return null;
        return User.fromDto(result.data);
    },

    async updateRole(id, role) {
        const result = await httpService.put(`users/${id}/role`, { role });
        return { success: result.ok, error: result.error };
    },

    async remove(id) {
        const result = await httpService.del(`users/${id}`);
        return { success: result.ok, error: result.error };
    }
};

export default userService;