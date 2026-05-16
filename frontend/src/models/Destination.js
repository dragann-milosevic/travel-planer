function toDateInputValue(value) {
    if (!value) return "";
    return String(value).substring(0, 10);
}

class Destination {
    constructor({
        id = 0,
        travelPlanId = 0,
        name = "",
        location = "",
        arrivalDate = "",
        departureDate = "",
        description = ""
    } = {}) {
        this.id = id;
        this.travelPlanId = travelPlanId;
        this.name = name;
        this.location = location;
        this.arrivalDate = toDateInputValue(arrivalDate);
        this.departureDate = toDateInputValue(departureDate);
        this.description = description;
    }

    static empty(travelPlanId = 0) {
        return new Destination({ travelPlanId });
    }

    static fromDto(dto) {
        if (!dto) return null;
        return new Destination({
            id: dto.id,
            travelPlanId: dto.travelPlanId,
            name: dto.name,
            location: dto.location,
            arrivalDate: dto.arrivalDate,
            departureDate: dto.departureDate,
            description: dto.description
        });
    }

    validate(planStartDate = null, planEndDate = null) {
        const errors = {};
        if (!this.name || this.name.trim().length === 0)
            errors.name = "Naziv destinacije je obavezan.";
        if (!this.location || this.location.trim().length === 0)
            errors.location = "Lokacija je obavezna.";
        if (!this.arrivalDate)
            errors.arrivalDate = "Datum dolaska je obavezan.";
        if (!this.departureDate)
            errors.departureDate = "Datum odlaska je obavezan.";
        if (this.arrivalDate && this.departureDate &&
            new Date(this.departureDate) < new Date(this.arrivalDate))
            errors.departureDate = "Datum odlaska ne može biti prije datuma dolaska.";
        if (planStartDate && this.arrivalDate &&
            new Date(this.arrivalDate) < new Date(toDateInputValue(planStartDate)))
            errors.arrivalDate = "Datum dolaska je prije početka putovanja.";
        if (planEndDate && this.departureDate &&
            new Date(this.departureDate) > new Date(toDateInputValue(planEndDate)))
            errors.departureDate = "Datum odlaska je nakon kraja putovanja.";
        return errors;
    }
}

export default Destination;