create schema ERS;
set schema 'ers';

drop table roles cascade;
drop table users cascade;
drop table reimbursement_statuses cascade; 
drop table reimbursement_types cascade;
drop table reimbursements cascade;

create table roles (
	"role_id" serial primary key,
	"role" text
);
create table users (
	"user_id" serial primary key,
	"username" text not null unique,
	"password" text not null,
	"first_name" text not null,
	"last_name" text not null,
	"email" text not null,
	"role" int references roles ("role_id") --foreign key to roles table
);
create table reimbursement_statuses (
	"status_id" serial primary key,
	"status" text not null unique
);
create table reimbursement_types (
	"type_id" serial primary key,
	"type" text not null unique
);
create table reimbursements (
	"reimbursement_id" serial primary key,
	"author" int not null references users ("user_id"),
	"amount" numeric(6,2) not null,
	"date_submitted" timestamp not null,
	"date_resolved" timestamp, --not null,
	"description" text not null,
	"resolver" int references users ("user_id"),
	"status" int references reimbursement_statuses ("status_id") not null,  --foreign key to reimbursement_statuses table
	"type" int references reimbursement_types ("type_id") --foreign key to reimbursement_types table
);

