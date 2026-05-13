import httpService from "../httpService/httpService";
import urlService from "../urlService/urlService";
import Destination from "../../models/Destination";

const destinationService = {
    async getForPlan(travelPlanId) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, `travel-plans/${travelPlanId}/destinations`);
        if (!result.ok) return [];
        return (result.data || []).map(Destination.fromDto);
    },

    async getById(travelPlanId, id) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, `travel-plans/${travelPlanId}/destinations/${id}`);
        if (!result.ok) return null;
        return Destination.fromDto(result.data);
    },

    async create(travelPlanId, destination) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            travelPlanId,
            name: destination.name,
            location: destination.location,
            arrivalDate: destination.arrivalDate,
            departureDate: destination.departureDate,
            description: destination.description
        };
        const result = await httpService.post(api, `travel-plans/${travelPlanId}/destinations`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, destination: Destination.fromDto(result.data) };
    },

    async update(destination) {
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
            `travel-plans/${destination.travelPlanId}/destinations/${destination.id}`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, destination: Destination.fromDto(result.data) };
    },

    async remove(travelPlanId, id) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.del(api, `travel-plans/${travelPlanId}/destinations/${id}`);
        return { success: result.ok, error: result.error };
    }
};

export default destinationService;