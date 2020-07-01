set schema 'ers';

insert into roles ("role")
	values ('Admin'),
		   ('Finance Manager'),
		   ('User');

insert into users ("username", "password", "first_name", "last_name", "email", "role")
	values ('cityHallLeslieKnope', 'waffleQueen', 'Leslie', 'Knope', 'leslieknope@pawneeparks.gov', 1),
		   ('ron', 'ron', 'REDACTED', 'REDACTED', 'REDACTED', 1),
		   ('maverick', 'conesOfDunshire', 'Ben', 'Wyatt', 'benwyatt@pawneeparks.gov', 2),
		   ('literallyTheBestJob', 'positivity', 'Chris', 'Traeger', 'christraeger@pawneeparks.gov', 3),
		   ('tommyFresh', 'swag', 'Tom', 'Haverford', 'tomhaverford@pawneeparks.gov', 3),
		   ('donnaBenz', 'treatYoSelf', 'Donna', 'Meagle', 'donnameagle@pawneeparks.gov', 3),
		   ('janetSnakehole', 'thisIsPointless', 'April', 'Ludgate', 'aprilludgate@pawneeparks.gov', 3),
		   ('johnnyKarate', 'mouseRat', 'Andy', 'Dwyer', 'andydwyer@pawneeparks.gov', 3),
		   ('computerpleasesaveusername', 'password', 'Jerry', 'Gergich', 'larrygergich@pawneeparks.gov', 3),
		   ('craig', 'wineClub', 'Craig', 'Middlebrooks', 'craigmiddlebrooks@pawneeparks.gov', 3);

insert into reimbursement_statuses ("status")
	values ('Pending'),
		   ('Approved'),
		   ('Denied');

insert into reimbursement_types ("type")
	values ('Lodging'),
		   ('Travel'),
		   ('Food'),
		   ('Other');

insert into reimbursements ("author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type")
	values (3, 700.00, '2020-01-19 02:30:00', '2020-01-19 02:35:00', 'had to log trip to D.C. with Leslie', 3, 2, 2),
		   (1, 700.00, '2020-01-19 08:00:00', '2020-01-19 02:35:00', 'Trip to D.C. with Ben woooo!!', 3, 2, 2),
		   (4, 500.00, '2020-02-05 12:20:00', '2020-02-05 03:56:00', 'FunRun Fundraiser metal', 3, 2, 4),
		   (2, 700.00, '2020-02-11 11:40:00', '2020-02-11 11:48:00', 'unlimited breakfast foods', 1, 2, 3),
		   (5, 50.00, '2020-02-21 03:15:00', '2020-02-21 03:27:00', 'laser show presentation', 1, 2, 4),
		   (7, 900.00, '2020-04-30 04:50:00', '2020-05-01 08:15:00', 'for making me play assistant for Chris all day', 3, 3, 4),
		   (7, 900.00, '2020-05-01 08:30:00', '2020-05-01 09:35:00', 'stop denying my request', 3, 3, 4),
		   (6, 60.00, '2020-05-10 02:03:00', '2020-05-10 04:24:00', 'giving you all a ride in my Benz', 1, 2, 2),
		   (5, 45.00, '2020-05-23 09:32:00', '2020-05-23 012:05:00', 'chicky chicky parm parm', 3, 2, 3),
		   (10, 200.00, '2020-06-18 01:46:00', '2020-06-18 04:45:00', 'emotional distress', 3, 1, 4);

--Check table contents
select * from reimbursements;
select * from reimbursement_types;
select * from reimbursement_statuses;
select * from roles;
select * from users;

--Find roleId for role name
select r."role_id" from ers.roles r where r."role" = $1;

--Get all users
select u."user_id", 
	   u."username", 
	   u."password", 
	   u."first_name", 
	   u."last_name", 
	   u."email", 
	   r."role_id", 
	   r."role" from ers.users u
	   left join ers.roles r 
	   on u."role" = r."role_id"
	  order by u.user_id;

--Get user with username and password
select u."user_id", 
	   u."username", 
	   u."password", 
	   u."first_name", 
	   u."last_name", 
	   u."email", 
	   r."role_id", 
	   r."role" from ers.users u
	   left join ers.roles r 
	   on u."role" = r."role_id"
	   where u."username" = $1 and u."password" = $2;	

--Get user by userId
select u."user_id", 
       u."username", 
       u."password",
       u."first_name", 
	   u."last_name",
       u."email",
       r."role_id", 
       r."role" 
	from ers.users u 
left join ers.roles r 
	on u."role" = r."role_id" 
		where u."user_id" = $1;

--Get all Reimbursements
select r."reimbursement_id", 
	   r."author", 
	   r."amount", 
	   r."date_submitted", 
	   r."date_resolved", 
	   r."description", 
	   r."resolver", 
	   rs."status",
	   rs."status_id",
	   rt."type",
	   rt."type_id" from ers.reimbursements r
	   left join ers.reimbursement_statuses rs
	   on r."status" = rs."status_id"
	   left join ers.reimbursement_types rt
	   on r."type" = rt."type_id"
	  order by r.date_submitted;

--find reimbursement by status
select r."reimbursement_id", 
       r."author", 
       r."amount",
       r."date_submitted",
       r."date_resolved",
       r."description",
       r."resolver",
       rs."status_id", 
       rs."status",
       rt."type_id",
       rt."type"
		from ers.reimbursements r 
	left join ers.reimbursement_statuses rs
       on r."status" = rs."status_id" 
    left join ers.reimbursement_types rt
       on r."type" = rt."type_id"
          where r."status" = $1
    order by r."date_submitted";

--find reimbursement by user id
select r."reimbursement_id",
	   r."author",
	   r."amount",
	   r."date_submitted",
	   r."date_resolved",
	   r."description",
	   r."resolver",
	   rs."status_id",
	   rs."status",
	   rt."type_id",
	   rt."type"
		from ers.reimbursements r 
	left join ers.reimbursement_statuses rs
		on r."status" = rs."status_id" 
	left join ers.reimbursement_types rt
		on r."type" = rt."type_id"
	left join ers.users u 
		on r."author" = u."user_id"
			where u."user_id" = $1
	order by r."date_submitted";

--find typeId for submit reimbursement 
select t."type_id" from ers.reimbursement_types t where t."type" = $1;

--submit reimbursement
insert into ers.reimbursements ("author", "amount", 
                                "date_submitted", "description", "type")
                                   values($1,$2,$3,$4,$5) 
                                   returning "reimbursement_id";

--Update User Info
update ers.users set "username" = $1 where "user_id" = $2;
update ers.users set "password" = $1 where "user_id" = $2;
update ers.users set "first_name" = $1 where "user_id" = $2;
update ers.users set "last_name" = $1 where "user_id" = $2;
update ers.users set "email" = $1 where "user_id" = $2;
update ers.users set "role" = $1 where "user_id" = $2;

--Update Reimbursement Info
update ers.reimbursements set "author" = $1 where "reimbursement_id" = $2;
update ers.reimbursements set "amount" = $1 where "reimbursement_id" = $2;
update ers.reimbursements set "date_submitted" = $1 where "reimbursement_id" = $2;
update ers.reimbursements set "date_resolved" = $1 where "reimbursement_id" = $2;
update ers.reimbursements set "description" = $1 where "reimbursement_id" = $2;
update ers.reimbursements set "resolver" = $1 where "reimbursement_id" = $2;
update ers.reimbursements set "status" = $1 where "reimbursement_id" = $2;
update ers.reimbursements set "type" = $1 where "reimbursement_id" = $2;

--get type_id from type
select rt."type_id" from ers.reimbursement_types rt where rt."type" = $1;

--get status_id from status
select rs."status_id" from ers.reimbursement_statuses rs where rs."status" = $1;


