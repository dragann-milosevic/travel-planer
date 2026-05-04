import httpService from "../httpService/httpService";
import Activity from "../../models/Activity";

const activityService = {
    async getForPlan(travelPlanId) {
        const result = await httpService.get(`travel-plans/${travelPlanId}/activities`);
        if (!result.ok) return [];
        return (result.data || []).map(Activity.fromDto);
    },

    async getById(travelPlanId, id) {
        const result = await httpService.get(`travel-plans/${travelPlanId}/activities/${id}`);
        if (!result.ok) return null;
        return Activity.fromDto(result.data);
    },

    async create(travelPlanId, activity) {
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
        const result = await httpService.post(`travel-plans/${travelPlanId}/activities`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, activity: Activity.fromDto(result.data) };
    },

    async update(activity) {
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
        const result = await httpService.put(
            `travel-plans/${activity.travelPlanId}/activities/${activity.id}`,
            dto
        );
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, activity: Activity.fromDto(result.data) };
    },

    async remove(travelPlanId, id) {
        const result = await httpService.del(`travel-plans/${travelPlanId}/activities/${id}`);
        return { success: result.ok, error: result.error };
    }
};

export default activityService;