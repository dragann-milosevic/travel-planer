function appendSlash(url) {
    if (!url) return "";
    return url.endsWith("/") ? url : url + "/";
}

const urlService = {
    getAuthBaseUrl() {
        const base = process.env.REACT_APP_AUTH_BASE_URL;
        if (!base) {
            console.error("REACT_APP_AUTH_BASE_URL nije definisan u .env fajlu.");
            return "";
        }
        return appendSlash(base);
    },
    getTravelBaseUrl() {
        const base = process.env.REACT_APP_TRAVEL_BASE_URL;
        if (!base) {
            console.error("REACT_APP_TRAVEL_BASE_URL nije definisan u .env fajlu.");
            return "";
        }
        return appendSlash(base);
    },
    getAuthApiUrl() {
        const prefix = process.env.REACT_APP_API_PREFIX || "api/";
        return this.getAuthBaseUrl() + appendSlash(prefix);
    },
    getTravelApiUrl() {
        const prefix = process.env.REACT_APP_API_PREFIX || "api/";
        return this.getTravelBaseUrl() + appendSlash(prefix);
    }
};

export default urlService;