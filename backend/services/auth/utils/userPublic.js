export const toPublicUser = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? "",
    credits: user.credits,
});
