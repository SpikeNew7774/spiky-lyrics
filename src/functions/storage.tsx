const prefix = "SpicyLyrics-";

function set(key: string, value: any) {
    Spicetify.LocalStorage.set(`${prefix}${key}`, value);
}

function get(key: string) {
    const data = Spicetify.LocalStorage.get(`${prefix}${key}`);
    return data
}

export default {
    set,
    get
}