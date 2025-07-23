CREATE TABLE "studentID" (
  "id" bigserial PRIMARY KEY NOT NULL,
  "name" varchar(255)    NOT NULL
);

CREATE TABLE "student" (
  "id"        bigserial PRIMARY KEY NOT NULL,
  "name"      varchar(255) NOT NULL,
  "surname"   varchar(255) NOT NULL,
  "birthdayAt"  timestamp    NOT NULL,
  "studentId"   bigint , 
  "gender"    varchar(255) NOT NULL,
);


ALTER TABLE "student" ADD CONSTRAINT "student_genre_id_genres_id_fk" FOREIGN KEY ("studentId") REFERENCES "studentID"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
