export const ShareAccessType = {
    View: "VIEW",
    Edit: "EDIT"
};

export const ShareAccessTypeLabel = {
    VIEW: "Pregled",
    EDIT: "Uređivanje"
};

class ShareLink {
    constructor({
        id = 0,
        travelPlanId = 0,
        token = "",
        accessType = ShareAccessType.View,
        createdAt = "",
        expiresAt = ""
    } = {}) {
        this.id = id;
        this.travelPlanId = travelPlanId;
        this.token = token;
        this.accessType = accessType;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
    }

    static fromDto(dto) {
        if (!dto) return null;
        return new ShareLink({
            id: dto.id,
            travelPlanId: dto.travelPlanId,
            token: dto.token,
            accessType: dto.accessType,
            createdAt: dto.createdAt,
            expiresAt: dto.expiresAt
        });
    }
}

export default ShareLink;