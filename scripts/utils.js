export const capitalize = (text) => {
    return text[0].toUpperCase() + text.substring(1, text.length);
}

export const degToRad = (deg) => {
    return deg * (Math.PI / 180);
}