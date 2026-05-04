import httpService from "../httpService/httpService";
import TravelPlan from "../../models/TravelPlan";

const travelPlanService = {
    async getAll() {
        const result = await httpService.get("travel-plans");
        if (!result.ok) return [];
        return (result.data || []).map(TravelPlan.fromDto);
    },

    async getById(id) {
        const result = await httpService.get(`travel-plans/${id}`);
        if (!result.ok) return null;
        return TravelPlan.fromDto(result.data);
    },

    async create(plan) {
        const dto = {
            name: plan.name,
            description: plan.description,
            startDate: plan.startDate,
            endDate: plan.endDate,
            budget: Number(plan.budget),
            notes: plan.notes
        };
        const result = await httpService.post("travel-plans", dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, plan: TravelPlan.fromDto(result.data) };
    },

    async update(plan) {
        const dto = {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            startDate: plan.startDate,
            endDate: plan.endDate,
            budget: Number(plan.budget),
            notes: plan.notes
        };
        const result = await httpService.put(`travel-plans/${plan.id}`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, plan: TravelPlan.fromDto(result.data) };
    },

    async remove(id) {
        const result = await httpService.del(`travel-plans/${id}`);
        return { success: result.ok, error: result.error };
    }
};

export default travelPlanService;