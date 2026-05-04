import httpService from "../httpService/httpService";
import Expense from "../../models/Expense";

const expenseService = {
    async getForPlan(travelPlanId) {
        const result = await httpService.get(`travel-plans/${travelPlanId}/expenses`);
        if (!result.ok) return [];
        return (result.data || []).map(Expense.fromDto);
    },

    async getById(travelPlanId, id) {
        const result = await httpService.get(`travel-plans/${travelPlanId}/expenses/${id}`);
        if (!result.ok) return null;
        return Expense.fromDto(result.data);
    },

    async create(travelPlanId, expense) {
        const dto = {
            travelPlanId,
            name: expense.name,
            category: Number(expense.category),
            amount: Number(expense.amount),
            date: expense.date,
            description: expense.description
        };
        const result = await httpService.post(`travel-plans/${travelPlanId}/expenses`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, expense: Expense.fromDto(result.data) };
    },

    async update(expense) {
        const dto = {
            id: expense.id,
            travelPlanId: expense.travelPlanId,
            name: expense.name,
            category: Number(expense.category),
            amount: Number(expense.amount),
            date: expense.date,
            description: expense.description
        };
        const result = await httpService.put(
            `travel-plans/${expense.travelPlanId}/expenses/${expense.id}`,
            dto
        );
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, expense: Expense.fromDto(result.data) };
    },

    async remove(travelPlanId, id) {
        const result = await httpService.del(`travel-plans/${travelPlanId}/expenses/${id}`);
        return { success: result.ok, error: result.error };
    },

    async getSummary(travelPlanId) {
        const result = await httpService.get(`travel-plans/${travelPlanId}/expenses/summary`);
        if (!result.ok) return null;
        return result.data;
    }
};

export default expenseService;