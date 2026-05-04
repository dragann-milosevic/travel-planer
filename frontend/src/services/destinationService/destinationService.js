import httpService from "../httpService/httpService";
import Destination from "../../models/Destination";

const destinationService = {
    async getForPlan(travelPlanId) {
        const result = await httpService.get(`travel-plans/${travelPlanId}/destinations`);
        if (!result.ok) return [];
        return (result.data || []).map(Destination.fromDto);
    },

    async getById(travelPlanId, id) {
        const result = await httpService.get(`travel-plans/${travelPlanId}/destinations/${id}`);
        if (!result.ok) return null;
        return Destination.fromDto(result.data);
    },

    async create(travelPlanId, destination) {
        const dto = {
            travelPlanId,
            name: destination.name,
            location: destination.location,
            arrivalDate: destination.arrivalDate,
            departureDate: destination.departureDate,
            description: destination.description
        };
        const result = await httpService.post(`travel-plans/${travelPlanId}/destinations`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, destination: Destination.fromDto(result.data) };
    },

    async update(destination) {
        const dto = {
            id: destination.id,
            travelPlanId: destination.travelPlanId,
            name: destination.name,
            location: destination.location,
            arrivalDate: destination.arrivalDate,
            departureDate: destination.departureDate,
            description: destination.description
        };
        const result = await httpService.put(
            `travel-plans/${destination.travelPlanId}/destinations/${destination.id}`,
            dto
        );
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, destination: Destination.fromDto(result.data) };
    },

    async remove(travelPlanId, id) {
        const result = await httpService.del(`travel-plans/${travelPlanId}/destinations/${id}`);
        return { success: result.ok, error: result.error };
    }
};

export default destinationService;