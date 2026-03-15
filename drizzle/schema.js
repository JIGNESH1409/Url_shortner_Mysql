import {int ,mysqlTable, varchar, serial,timestamp, uniqueIndex,text,boolean} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
export const  shortLink = mysqlTable("short_link",{
    id : serial().primaryKey(),
    url: varchar({length: 255}).notNull(),
    short_url: varchar("short_code",{length : 20}).notNull(),
    userID: int().notNull().references(()=> usersTable.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => {
    return {
        uniqueShortUrlPerUser: uniqueIndex('unique_short_url_per_user').on(table.short_url, table.userID),
    }
})

export const  usersTable = mysqlTable("users",{
    id : int().autoincrement().primaryKey(),
    name:varchar({length:30}).notNull(),
    password: varchar({length:255}).notNull(),
    email: varchar({length:255}).notNull().unique(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),

})

export const sessionsTable = mysqlTable("session",{
    id:int().autoincrement().primaryKey(),
    userID: int().notNull().references(()=>usersTable.id,{onDelete:"cascade"}),
    valid: boolean().default(true).notNull(),
    userAgent:text("user_Agent"),
    ip:varchar({length:255}),
    createdAt:timestamp("Created_At").defaultNow().notNull(),
    updatedAt:timestamp("updated_At").defaultNow().onUpdateNow().notNull(),
})

// realtionship of  usersTable and shortLink is one to many relationship because one user can create multiple short links but one short link can only belong to one user. so we have added userID in shortLink which is foreign key that reference to id of usersTable.

export const usersRelation= relations(usersTable,({many})=>({
    shortLinks:many(shortLink),
    session:many(sessionsTable)
}))

// relationship of shortLink table with userstable

export const shortLinkRelation=relations(shortLink,({one})=>({
    user:one(usersTable,{
        fields:[shortLink.userID],
        references:[usersTable.id]
    })

}))

export const sessionRelation=relations(sessionsTable,({one})=>({
    user:one(usersTable,{
        fields:[sessionsTable.userID],
        references:[usersTable.id]
    })
}))