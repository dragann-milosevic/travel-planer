export const UserRole = {
    User: "User",
    Admin: "Admin"
};

class User {
    constructor({
        id = 0,
        firstName = "",
        lastName = "",
        email = "",
        userName = "",
        role = UserRole.User
    } = {}) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userName = userName;
        this.role = role;
    }

    static empty() {
        return new User();
    }

    static fromDto(dto) {
        if (!dto) return null;
        return new User({
            id: dto.id,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            userName: dto.userName,
            role: dto.role
        });
    }
}

export default User;