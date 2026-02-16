import {integer, pgTable, timestamp, varchar} from "drizzle-orm/pg-core";
import {relations} from "drizzle-orm";

const timestamps = {
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull(),
}

export const departments = pgTable('departments' , {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('code' , {length: 50}).notNull().unique(),
    code: varchar('name' , {length: 255}).notNull().unique(),
    description: varchar('description' , {length: 255}),
    ...timestamps,
});
export const subjects = pgTable('subjects' , {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    departmentId: integer('department_id' ).notNull().references(() => departments.id , {onDelete: 'restrict'}),
    name: varchar('code' , {length: 50}).notNull().unique(),
    code: varchar('name' , {length: 255}).notNull().unique(),
    description: varchar('description' , {length: 255}),
    ...timestamps,
});

export const departmentRelations = relations(departments , ({many}) => ({subjects: many(subjects)}));
export const subjectsRelations = relations(subjects , ({one , many}) => ({
    department: one(departments , {
        fields: [subjects.departmentId] ,
        references: [departments.id],
    })
}));

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Subjects = typeof subjects.$inferSelect;
export type NewSubjects = typeof subjects.$inferInsert;