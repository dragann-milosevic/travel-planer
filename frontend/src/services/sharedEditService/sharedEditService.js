import httpService from "../httpService/httpService";
import urlService from "../urlService/urlService";
import Destination from "../../models/Destination";
import Activity from "../../models/Activity";
import Expense from "../../models/Expense";
import ChecklistItem from "../../models/ChecklistItem";

const sharedEditService = {
    async updateDestination(token, destination) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            id: destination.id,
            travelPlanId: destination.travelPlanId,
            name: destination.name,
            location: destination.location,
            arrivalDate: destination.arrivalDate,
            departureDate: destination.departureDate,
            description: destination.description
        };
        const result = await httpService.put(api,
            `shared-plans/${encodeURIComponent(token)}/destinations/${destination.id}`,
            dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, destination: Destination.fromDto(result.data) };
    },

    async updateActivity(token, activity) {
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
            `shared-plans/${encodeURIComponent(token)}/activities/${activity.id}`,
            dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, activity: Activity.fromDto(result.data) };
    },

    async updateExpense(token, expense) {
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
            `shared-plans/${encodeURIComponent(token)}/expenses/${expense.id}`,
            dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, expense: Expense.fromDto(result.data) };
    },

    async updateChecklistItem(token, item) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            id: item.id,
            travelPlanId: item.travelPlanId,
            text: item.text,
            completed: !!item.completed
        };
        const result = await httpService.put(api,
            `shared-plans/${encodeURIComponent(token)}/checklist-items/${item.id}`,
            dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, item: ChecklistItem.fromDto(result.data) };
    },

    async toggleChecklistItem(token, item) {
        return this.updateChecklistItem(token, { ...item, completed: !item.completed });
    }
};

export default sharedEditService;