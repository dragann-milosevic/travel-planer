export const ActivityStatus = {
    Planned: 1,
    Booked: 2,
    Completed: 3,
    Cancelled: 4
};

export const ActivityStatusLabel = {
    1: "Planirano",
    2: "Rezervisano",
    3: "Završeno",
    4: "Otkazano"
};

class Activity {
    constructor({
        id = 0,
        travelPlanId = 0,
        destinationId = null,
        name = "",
        date = "",
        time = "",
        location = "",
        description = "",
        estimatedCost = 0,
        status = ActivityStatus.Planned
    } = {}) {
        this.id = id;
        this.travelPlanId = travelPlanId;
        this.destinationId = destinationId;
        this.name = name;
        this.date = date;
        this.time = time;
        this.location = location;
        this.description = description;
        this.estimatedCost = estimatedCost;
        this.status = status;
    }

    static empty(travelPlanId = 0) {
        return new Activity({ travelPlanId });
    }

    static fromDto(dto) {
        if (!dto) return null;
        return new Activity({
            id: dto.id,
            travelPlanId: dto.travelPlanId,
            destinationId: dto.destinationId,
            name: dto.name,
            date: dto.date,
            time: dto.time,
            location: dto.location,
            description: dto.description,
            estimatedCost: dto.estimatedCost,
            status: dto.status
        });
    }

    validate(planStartDate = null, planEndDate = null) {
        const errors = {};
        if (!this.name || this.name.trim().length === 0)
            errors.name = "Naziv aktivnosti je obavezan.";
        if (!this.date)
            errors.date = "Datum aktivnosti je obavezan.";
        if (planStartDate && this.date &&
            new Date(this.date) < new Date(planStartDate))
            errors.date = "Datum aktivnosti je prije početka putovanja.";
        if (planEndDate && this.date &&
            new Date(this.date) > new Date(planEndDate))
            errors.date = "Datum aktivnosti je nakon kraja putovanja.";
        if (this.estimatedCost !== null && this.estimatedCost !== undefined &&
            !isNaN(this.estimatedCost) && Number(this.estimatedCost) < 0)
            errors.estimatedCost = "Trošak ne može biti negativan.";
        if (![ActivityStatus.Planned, ActivityStatus.Booked,
              ActivityStatus.Completed, ActivityStatus.Cancelled].includes(Number(this.status)))
            errors.status = "Nevažeći status.";
        return errors;
    }
}

export default Activity;