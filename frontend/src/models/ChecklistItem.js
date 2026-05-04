class ChecklistItem {
    constructor({
        id = 0,
        travelPlanId = 0,
        text = "",
        completed = false
    } = {}) {
        this.id = id;
        this.travelPlanId = travelPlanId;
        this.text = text;
        this.completed = completed;
    }

    static empty(travelPlanId = 0) {
        return new ChecklistItem({ travelPlanId });
    }

    static fromDto(dto) {
        if (!dto) return null;
        return new ChecklistItem({
            id: dto.id,
            travelPlanId: dto.travelPlanId,
            text: dto.text,
            completed: dto.completed
        });
    }

    validate() {
        const errors = {};
        if (!this.text || this.text.trim().length === 0)
            errors.text = "Tekst stavke je obavezan.";
        return errors;
    }
}

export default ChecklistItem;