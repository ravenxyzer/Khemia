/**
 * @description Language Schema interface
 */
export interface LanguageInterface {
    guildId?: string;
    userId?: string;
    language?: string;
}

/**
 * @description Register Schema interface
 */
export interface RegisterInterface {
    userId?: string;
    uid?: string;
    cookie?: string;
}
