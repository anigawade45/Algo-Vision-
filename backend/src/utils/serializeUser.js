/**
 * Single place that decides which user fields leave the API.
 *
 * Works with Mongoose documents and plain objects. The User model's toJSON
 * transform renames `_id` to `id`, so both spellings are handled.
 */
const serializeUser = (user) => {
    const data = typeof user.toJSON === 'function' ? user.toJSON() : { ...user };

    return {
        id: (data.id ?? data._id)?.toString(),
        name: data.name,
        email: data.email,
        avatar: data.avatar ?? null,
        isVerified: data.isVerified ?? false,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
};

module.exports = serializeUser;