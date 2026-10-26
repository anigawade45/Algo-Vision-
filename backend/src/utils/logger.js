/**
 * Minimal structured JSON logger (one line per event, easy to ship to
 * CloudWatch / Datadog / Loki). Replace the internals with pino later
 * without touching call sites.
 *
 * Reads process.env lazily on every call so it works no matter whether it
 * is required before or after dotenv has loaded the .env file.
 * It deliberately does NOT import config/env.js to avoid a circular import.
 */

const LEVELS = { debug: 10, info: 20, warn: 30, error: 40 };

const isEnabled = (level) => {
    if (process.env.NODE_ENV === 'test' && !process.env.LOG_IN_TEST) return false;
    const fallback = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
    const configured = String(process.env.LOG_LEVEL || fallback).toLowerCase();
    const threshold = LEVELS[configured] ?? LEVELS.info;
    return LEVELS[level] >= threshold;
};

const serializeError = (err) => {
    if (err instanceof Error) {
        return {
            name: err.name,
            message: err.message,
            ...(err.code !== undefined ? { code: err.code } : {}),
            stack: err.stack,
        };
    }
    return { message: String(err) };
};

const write = (level, message, extra = {}) => {
    if (!isEnabled(level)) return;

    let line;
    try {
        line = JSON.stringify({ level, time: new Date().toISOString(), message, ...extra });
    } catch (_) {
        // Circular structures etc.: never let logging throw
        line = JSON.stringify({ level, time: new Date().toISOString(), message, logError: 'unserializable extra' });
    }

    (level === 'error' || level === 'warn' ? console.error : console.log)(line);
};

const logger = {
    debug: (message, extra) => write('debug', message, extra),
    info: (message, extra) => write('info', message, extra),
    warn: (message, extra) => write('warn', message, extra),
    error: (message, extra) => write('error', message, extra),
};

module.exports = { logger, log: write, serializeError };