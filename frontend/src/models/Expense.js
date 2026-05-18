export const ExpenseCategory = {
    Transport: 1,
    Accommodation: 2,
    Food: 3,
    Tickets: 4,
    Shopping: 5,
    Other: 6
};

export const ExpenseCategoryLabel = {
    1: "Prevoz",
    2: "Smeštaj",
    3: "Hrana",
    4: "Ulaznice",
    5: "Kupovina",
    6: "Ostalo"
};

function toDateInputValue(value) {
    if (!value) return "";
    return String(value).substring(0, 10);
}

class Expense {
    constructor({
        id = 0,
        travelPlanId = 0,
        name = "",
        category = ExpenseCategory.Other,
        amount = 0,
        date = "",
        description = ""
    } = {}) {
        this.id = id;
        this.travelPlanId = travelPlanId;
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.date = toDateInputValue(date);
        this.description = description;
    }

    static empty(travelPlanId = 0) {
        return new Expense({ travelPlanId });
    }

    static fromDto(dto) {
        if (!dto) return null;
        return new Expense({
            id: dto.id,
            travelPlanId: dto.travelPlanId,
            name: dto.name,
            category: dto.category,
            amount: dto.amount,
            date: dto.date,
            description: dto.description
        });
    }

    validate() {
        const errors = {};
        if (!this.name || this.name.trim().length === 0)
            errors.name = "Naziv troška je obavezan.";
        const amountStr = this.amount === null || this.amount === undefined ? "" : String(this.amount).trim();
        if (amountStr === "" || isNaN(Number(amountStr)))
            errors.amount = "Iznos je obavezan i mora biti broj.";
        else if (Number(amountStr) < 0)
            errors.amount = "Iznos ne može biti negativan.";
        if (!this.date)
            errors.date = "Datum je obavezan.";
        if (!Object.values(ExpenseCategory).includes(Number(this.category)))
            errors.category = "Nevažeća kategorija.";
        return errors;
    }
}

export default Expense;