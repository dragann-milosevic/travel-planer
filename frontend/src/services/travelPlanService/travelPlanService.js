import httpService from "../httpService/httpService";
import urlService from "../urlService/urlService";
import TravelPlan from "../../models/TravelPlan";

const travelPlanService = {
    async getAll() {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, "travel-plans");
        if (!result.ok) return [];
        return (result.data || []).map(TravelPlan.fromDto);
    },

    async getById(id) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, `travel-plans/${id}`);
        if (!result.ok) return null;
        return TravelPlan.fromDto(result.data);
    },

    async create(plan) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            name: plan.name,
            description: plan.description,
            startDate: plan.startDate,
            endDate: plan.endDate,
            budget: Number(plan.budget),
            notes: plan.notes
        };
        const result = await httpService.post(api, "travel-plans", dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, plan: TravelPlan.fromDto(result.data) };
    },

    async update(plan) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            id: plan.id,
            name: plan.name,
            description: plan.description,
            startDate: plan.startDate,
            endDate: plan.endDate,
            budget: Number(plan.budget),
            notes: plan.notes
        };
        const result = await httpService.put(api, `travel-plans/${plan.id}`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, plan: TravelPlan.fromDto(result.data) };
    },

    async remove(id) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.del(api, `travel-plans/${id}`);
        return { success: result.ok, error: result.error };
    }
};

export default travelPlanService;