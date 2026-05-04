import httpService from "../httpService/httpService";
import ShareLink from "../../models/ShareLink";
import TravelPlan from "../../models/TravelPlan";

const shareService = {
    async getForPlan(travelPlanId) {
        const result = await httpService.get(`travel-plans/${travelPlanId}/shares`);
        if (!result.ok) return [];
        return (result.data || []).map(ShareLink.fromDto);
    },

    async create(travelPlanId, accessType) {
        const dto = { travelPlanId, accessType };
        const result = await httpService.post(`travel-plans/${travelPlanId}/shares`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, link: ShareLink.fromDto(result.data) };
    },

    async revoke(travelPlanId, shareId) {
        const result = await httpService.del(`travel-plans/${travelPlanId}/shares/${shareId}`);
        return { success: result.ok, error: result.error };
    },

    async openShared(token) {
        const result = await httpService.get(`shared-plans/${token}`, false);
        if (!result.ok) return { success: false, error: result.error };
        return {
            success: true,
            plan: TravelPlan.fromDto(result.data?.plan),
            accessType: result.data?.accessType
        };
    },

    buildShareUrl(token) {
        return `${window.location.origin}/shared/${token}`;
    }
};

export default shareService;