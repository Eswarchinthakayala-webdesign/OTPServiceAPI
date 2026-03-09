"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = void 0;
const isValidEmail = (email) => {
    if (!email)
        return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        return false;
    const [localPart, domain] = email.split("@");
    const allowedDomains = process.env.ALLOWED_DOMAINS
        ? process.env.ALLOWED_DOMAINS.split(",")
        : [];
    const minLocalPartLength = 5;
    const maxLocalPartLength = 64;
    return ((allowedDomains.length === 0 || allowedDomains.includes(domain)) &&
        localPart.length >= minLocalPartLength &&
        localPart.length <= maxLocalPartLength);
};
exports.isValidEmail = isValidEmail;
