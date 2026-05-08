export const levelFromXp = (xp: number) => Math.max(1, Math.floor(xp / 500) + 1);

export const xpToNextLevel = (xp: number) => {
    const level = levelFromXp(xp);
    const nextLevelXp = level * 500;
    return Math.max(0, nextLevelXp - xp);
};
