import httpService from "../httpService/httpService";
import urlService from "../urlService/urlService";
import Activity from "../../models/Activity";

const activityService = {
    async getForPlan(travelPlanId) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, `travel-plans/${travelPlanId}/activities`);
        if (!result.ok) return [];
        return (result.data || []).map(Activity.fromDto);
    },

    async getById(travelPlanId, id) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, `travel-plans/${travelPlanId}/activities/${id}`);
        if (!result.ok) return null;
        return Activity.fromDto(result.data);
    },

    async create(travelPlanId, activity) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            travelPlanId,
            destinationId: activity.destinationId || null,
            name: activity.name,
            date: activity.date,
            time: activity.time,
            location: activity.location,
            description: activity.description,
            estimatedCost: Number(activity.estimatedCost) || 0,
            status: Number(activity.status)
        };
        const result = await httpService.post(api, `travel-plans/${travelPlanId}/activities`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, activity: Activity.fromDto(result.data) };
    },

    async update(activity) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            id: activity.id,
            travelPlanId: activity.travelPlanId,
            destinationId: activity.destinationId || null,
            name: activity.name,
            date: activity.date,
            time: activity.time,
            location: activity.location,
            description: activity.description,
            estimatedCost: Number(activity.estimatedCost) || 0,
            status: Number(activity.status)
        };
        const result = await httpService.put(api,
            `travel-plans/${activity.travelPlanId}/activities/${activity.id}`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, activity: Activity.fromDto(result.data) };
    },

    async remove(travelPlanId, id) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.del(api, `travel-plans/${travelPlanId}/activities/${id}`);
        return { success: result.ok, error: result.error };
    }
};

export default activityService;