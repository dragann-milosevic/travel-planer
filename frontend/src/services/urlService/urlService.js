const urlService = {
    getBaseUrl() {
        const base = process.env.REACT_APP_API_BASE_URL;
        if (!base) {
            console.error("REACT_APP_API_BASE_URL nije definisan u .env fajlu.");
            return "";
        }
        return base.endsWith("/") ? base : base + "/";
    },
    getApiUrl() {
        const prefix = process.env.REACT_APP_API_PREFIX || "api/";
        const cleanPrefix = prefix.endsWith("/") ? prefix : prefix + "/";
        return this.getBaseUrl() + cleanPrefix;
    },
    getUploadsUrl() {
        return this.getBaseUrl() + "uploads/";
    }
};

export default urlService;