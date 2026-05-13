import httpService from "../httpService/httpService";
import urlService from "../urlService/urlService";
import ChecklistItem from "../../models/ChecklistItem";

const checklistService = {
    async getForPlan(travelPlanId) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, `travel-plans/${travelPlanId}/checklist-items`);
        if (!result.ok) return [];
        return (result.data || []).map(ChecklistItem.fromDto);
    },

    async create(travelPlanId, item) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            travelPlanId,
            text: item.text,
            completed: !!item.completed
        };
        const result = await httpService.post(api, `travel-plans/${travelPlanId}/checklist-items`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, item: ChecklistItem.fromDto(result.data) };
    },

    async update(item) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            id: item.id,
            travelPlanId: item.travelPlanId,
            text: item.text,
            completed: !!item.completed
        };
        const result = await httpService.put(api,
            `travel-plans/${item.travelPlanId}/checklist-items/${item.id}`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, item: ChecklistItem.fromDto(result.data) };
    },

    async toggle(item) {
        return this.update({ ...item, completed: !item.completed });
    },

    async remove(travelPlanId, id) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.del(api, `travel-plans/${travelPlanId}/checklist-items/${id}`);
        return { success: result.ok, error: result.error };
    }
};

export default checklistService;