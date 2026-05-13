function buildHeaders(includeAuth = true, contentType = "application/json") {
    const headers = {};
    if (contentType) headers["Content-Type"] = contentType;
    if (includeAuth) {
        const token = sessionStorage.getItem("token");
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
}

async function parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
        try { return await response.json(); }
        catch { return null; }
    }
    try { return await response.text(); }
    catch { return null; }
}

async function request(method, baseApiUrl, path, body = null, includeAuth = true) {
    const url = path.startsWith("http") ? path : `${baseApiUrl}${path}`;

    const options = {
        method,
        headers: buildHeaders(includeAuth)
    };
    if (body !== null && body !== undefined) {
        options.body = JSON.stringify(body);
    }

    let response;
    try {
        response = await fetch(url, options);
    } catch (err) {
        return {
            ok: false,
            status: 0,
            data: null,
            error: "Greška u komunikaciji sa serverom."
        };
    }

    const data = await parseResponse(response);
    return {
        ok: response.ok,
        status: response.status,
        data: response.ok ? data : null,
        error: response.ok ? null : (typeof data === "string" ? data : (data?.message || `HTTP ${response.status}`))
    };
}

const httpService = {
    get: (baseApiUrl, path, includeAuth = true) => request("GET", baseApiUrl, path, null, includeAuth),
    post: (baseApiUrl, path, body, includeAuth = true) => request("POST", baseApiUrl, path, body, includeAuth),
    put: (baseApiUrl, path, body, includeAuth = true) => request("PUT", baseApiUrl, path, body, includeAuth),
    del: (baseApiUrl, path, includeAuth = true) => request("DELETE", baseApiUrl, path, null, includeAuth)
};

export default httpService;