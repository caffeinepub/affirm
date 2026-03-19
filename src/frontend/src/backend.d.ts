import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Affirmation {
    id: bigint;
    createdAt: Time;
    text: string;
    isCustom: boolean;
    category: Category;
    authorPrincipal: Principal;
}
export interface AffirmationWithFavorite {
    affirmation: Affirmation;
    isFavorite: boolean;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export enum Category {
    gratitude = "gratitude",
    love = "love",
    mindfulness = "mindfulness",
    success = "success",
    confidence = "confidence",
    health = "health"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    create(text: string, category: Category): Promise<bigint>;
    delete_(affirmationId: bigint): Promise<void>;
    getAllByCategory(category: Category): Promise<Array<AffirmationWithFavorite>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCustomAffirmations(): Promise<Array<AffirmationWithFavorite>>;
    getDailyAffirmation(): Promise<AffirmationWithFavorite>;
    getFavorites(): Promise<Array<AffirmationWithFavorite>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    toggleFavorite(affirmationId: bigint): Promise<void>;
    update(affirmationId: bigint, newText: string): Promise<void>;
}
