import {serial, varchar, timestamp, uniqueIndex, text, boolean, integer, pgTable} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const usersTable = pgTable("users", {
    id: serial().primaryKey(),
    name: varchar({length: 30}).notNull(),
    password: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const shortLink = pgTable("short_link", {
    id: serial().primaryKey(),
    url: varchar({length: 255}).notNull(),
    short_url: varchar("short_code", {length: 20}).notNull(),
    userID: integer().notNull().references(() => usersTable.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
    return {
        uniqueShortUrlPerUser: uniqueIndex('unique_short_url_per_user').on(table.short_url, table.userID),
    };
});

export const sessionsTable = pgTable("session", {
    id: serial().primaryKey(),
    userID: integer().notNull().references(() => usersTable.id, {onDelete: "cascade"}),
    valid: boolean().default(true).notNull(),
    userAgent: text("user_Agent"),
    ip: varchar({length: 255}),
    createdAt: timestamp("Created_At").defaultNow().notNull(),
    updatedAt: timestamp("updated_At").defaultNow(),
});

// Relationships
export const usersRelation = relations(usersTable, ({many}) => ({
    shortLinks: many(shortLink),
    session: many(sessionsTable)
}));

export const shortLinkRelation = relations(shortLink, ({one}) => ({
    user: one(usersTable, {
        fields: [shortLink.userID],
        references: [usersTable.id]
    })
}));

export const sessionRelation = relations(sessionsTable, ({one}) => ({
    user: one(usersTable, {
        fields: [sessionsTable.userID],
        references: [usersTable.id]
    })
}));