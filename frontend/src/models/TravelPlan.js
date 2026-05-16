function toDateInputValue(value) {
    if (!value) return "";
    return String(value).substring(0, 10);
}

function isToday(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
}

function isPast(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const d = new Date(dateStr);
    d.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
}

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
        this.startDate = toDateInputValue(startDate);
        this.endDate = toDateInputValue(endDate);
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
        else if (this.id === 0 && isPast(this.startDate) && !isToday(this.startDate))
            errors.startDate = "Početni datum ne može biti u prošlosti.";
        if (!this.endDate)
            errors.endDate = "Krajnji datum je obavezan.";
        if (this.startDate && this.endDate &&
            new Date(this.endDate) < new Date(this.startDate))
            errors.endDate = "Krajnji datum ne može biti prije početnog datuma.";

        const budgetStr = this.budget === null || this.budget === undefined ? "" : String(this.budget).trim();
        if (budgetStr === "" || isNaN(Number(budgetStr)))
            errors.budget = "Budžet je obavezan i mora biti broj.";
        else if (Number(budgetStr) < 0)
            errors.budget = "Budžet ne može biti negativan.";
        return errors;
    }
}

export default TravelPlan;