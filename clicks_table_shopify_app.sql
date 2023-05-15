CREATE TABLE clicks (
	id bigserial primary key not null,
	campaign_id int not null,
	shop varchar(255) not null,
	created_at DATE default current_date,
	foreign key(campaign_id) references campaign_settings(campaign_id) on delete cascade
);