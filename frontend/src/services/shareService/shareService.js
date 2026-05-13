import httpService from "../httpService/httpService";
import urlService from "../urlService/urlService";
import ShareLink, { ShareAccessType } from "../../models/ShareLink";
import TravelPlan from "../../models/TravelPlan";

function accessTypeToInt(type) {
    if (type === ShareAccessType.View || type === 1) return 1;
    if (type === ShareAccessType.Edit || type === 2) return 2;
    return 1;
}

function intToAccessType(value) {
    return value === 2 ? ShareAccessType.Edit : ShareAccessType.View;
}

function mapShareLink(dto) {
    if (!dto) return null;
    const link = ShareLink.fromDto(dto);
    if (link) link.accessType = intToAccessType(dto.accessType);
    return link;
}

const shareService = {
    async getForPlan(travelPlanId) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, `travel-plans/${travelPlanId}/shares`);
        if (!result.ok) return [];
        return (result.data || []).map(mapShareLink);
    },

    async create(travelPlanId, accessType) {
        const api = urlService.getTravelApiUrl();
        const dto = {
            travelPlanId,
            accessType: accessTypeToInt(accessType)
        };
        const result = await httpService.post(api, `travel-plans/${travelPlanId}/shares`, dto);
        if (!result.ok) return { success: false, error: result.error };
        return { success: true, link: mapShareLink(result.data) };
    },

    async revoke(travelPlanId, shareId) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.del(api, `travel-plans/${travelPlanId}/shares/${shareId}`);
        return { success: result.ok, error: result.error };
    },

    async openShared(token) {
        const api = urlService.getTravelApiUrl();
        const result = await httpService.get(api, `shared-plans/${token}`, false);
        if (!result.ok) return { success: false, error: result.error };
        return {
            success: true,
            plan: TravelPlan.fromDto(result.data?.plan),
            accessType: intToAccessType(result.data?.accessType)
        };
    },

    buildShareUrl(token) {
        return `${window.location.origin}/shared/${token}`;
    }
};

export default shareService;