class TravelPlan {
    constructor({
        id = 0,
        name = "",
        description = "",
        startDate = "",
        endDate = "",
        budget = 0,
        notes = "",
        ownerId = 0,
        destinations = [],
        activities = [],
        expenses = [],
        checklistItems = []
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.budget = budget;
        this.notes = notes;
        this.ownerId = ownerId;
        this.destinations = destinations;
        this.activities = activities;
        this.expenses = expenses;
        this.checklistItems = checklistItems;
    }

    static empty() {
        return new TravelPlan();
    }

    static fromDto(dto) {
        if (!dto) return null;
        return new TravelPlan({
            id: dto.id,
            name: dto.name,
            description: dto.description,
            startDate: dto.startDate,
            endDate: dto.endDate,
            budget: dto.budget,
            notes: dto.notes,
            ownerId: dto.ownerId,
            destinations: dto.destinations || [],
            activities: dto.activities || [],
            expenses: dto.expenses || [],
            checklistItems: dto.checklistItems || []
        });
    }

    validate() {
        const errors = {};
        if (!this.name || this.name.trim().length === 0)
            errors.name = "Naziv putovanja je obavezan.";
        if (this.name && this.name.length > 100)
            errors.name = "Naziv mora imati najviše 100 karaktera.";
        if (!this.startDate)
            errors.startDate = "Početni datum je obavezan.";
        if (!this.endDate)
            errors.endDate = "Krajnji datum je obavezan.";
        if (this.startDate && this.endDate &&
            new Date(this.endDate) < new Date(this.startDate))
            errors.endDate = "Krajnji datum ne može biti prije početnog datuma.";
        if (this.budget === null || this.budget === undefined || isNaN(this.budget))
            errors.budget = "Budžet je obavezan.";
        else if (Number(this.budget) < 0)
            errors.budget = "Budžet ne može biti negativan.";
        return errors;
    }
}

export default TravelPlan;