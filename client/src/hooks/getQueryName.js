

export function setQueryName(name) {
    localStorage.setItem("queryName", name);
}

export function getQueryName() {
    return localStorage.getItem("queryName");
}
