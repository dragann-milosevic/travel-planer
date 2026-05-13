import httpService from "../httpService/httpService";
import urlService from "../urlService/urlService";
import Expense from "../../models/Expense";

const expenseService = {
    async getForPlan(travelPlanId) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, `travel-plans/${travelPlanId}/expenses`);
        if (!result.ok) return [];
        return (result.data || []).map(Expense.fromDto);
    },

    async getById(travelPlanId, id) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, `travel-plans/${travelPlanId}/expenses/${id}`);
        if (!result.ok) return null;
        return Expense.fromDto(result.data);
    },

    async create(travelPlanId, expense) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            travelPlanId,
            name: expense.name,
            category: Number(expense.category),
            amount: Number(expense.amount),
            date: expense.date,
            description: expense.description
        };
        const result = await httpService.post(api, `travel-plans/${travelPlanId}/expenses`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, expense: Expense.fromDto(result.data) };
    },

    async update(expense) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            id: expense.id,
            travelPlanId: expense.travelPlanId,
            name: expense.name,
            category: Number(expense.category),
            amount: Number(expense.amount),
            date: expense.date,
            description: expense.description
        };
        const result = await httpService.put(api,
            `travel-plans/${expense.travelPlanId}/expenses/${expense.id}`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, expense: Expense.fromDto(result.data) };
    },

    async remove(travelPlanId, id) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.del(api, `travel-plans/${travelPlanId}/expenses/${id}`);
        return { success: result.ok, error: result.error };
    }
};

export default expenseService;