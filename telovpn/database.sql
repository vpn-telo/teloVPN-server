create TABLE servers(
    server VARCHAR (50) PRIMARY KEY,
    url VARCHAR (50),
    cnt_users INTEGER,
    max_users INTEGER NOT NULL
);

create TABLE users(
    user_id INTEGER PRIMARY KEY,
    start_date TIMESTAMP NOT NULL,
    role VARCHAR(10) CHECK (role IN ('user', 'client', 'admin')),
    server VARCHAR (50),
    expiration_time TIMESTAMP,
    subId varchar (50) UNIQUE,
    uuid UUID UNIQUE,
    username VARCHAR (50),
    refer INTEGER,
    promocode VARCHAR (50),
    FOREIGN KEY (server) REFERENCES servers
);

create TABLE prices(
    promocode VARCHAR (50) PRIMARY KEY,
    1month INTEGER NOT NULL,
    2month INTEGER NOT NULL,
    3month INTEGER NOT NULL,
    6month INTEGER NOT NULL,
    12month INTEGER NOT NULL,
    end_date TIMESTAMP
);

create TABLE admins(
    admin_id INTEGER
);

CREATE OR REPLACE FUNCTION update_cnt_users()
RETURNS TRIGGER AS $update_cnt_users$
BEGIN
    UPDATE servers AS s
        SET cnt_users = (
            SELECT COUNT(user_id)
            FROM users AS u
            WHERE u.server = s.server AND expiration_time > NOW() + INTERVAL '1 DAY'
        );
    RETURN NEW;
END;
$update_cnt_users$ LANGUAGE plpgsql;

CREATE TRIGGER update_cnt_users
AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION update_cnt_users();

SET TIME ZONE 'Europe/Moscow';


--INSERT INTO servers (server, url, cnt_users, max_users) VALUES ('NL01', 'http://213.183.61.244:34172', 0, 40);
--INSERT INTO prices (promocode, 1month, 2month, 3month, 6month, 12month) VALUES ('base', 200, 400, 550, 900, 1800);
--INSERT INTO admins (admin_id) VALUES (203024910), (104115547);
