CREATE TABLE Advertisement (
  AdvertisementID                int(10) NOT NULL AUTO_INCREMENT, 
  Title                          varchar(30) NOT NULL, 
  AnimalType                     ENUM('Kot', 'Pies') NOT NULL, 
  Sex                            ENUM('Male', 'Female') NOT NULL, 
  `Size`                         ENUM('Duży', 'Średni', 'Mały'), 
  AgeInDays                      int(11), 
  Color                          varchar(255), 
  Breed                          varchar(255), 
  CostOfLiving                   varchar(255), 
  `Description`                  varchar(1000) NOT NULL, 
  Vaccines                       varchar(255), 
  Allergies                      varchar(255), 
  Parasites                      varchar(255), 
  HealthStatus                   ENUM('Zdrowy', 'Chory'), 
  IllnessDescription             varchar(1000), 
  BehavioralDisorders            tinyint,
  BehavioralDisordersDescription varchar(255), 
  CityID                         int(10) NOT NULL, 
  PublisherID                    int(10) NOT NULL, 
  ModifiedDate                   int(11) NOT NULL, 
  DueDate                        int(11) NOT NULL, 
  ActiveStatus                   tinyint NOT NULL, 
  PRIMARY KEY (AdvertisementID), 
  UNIQUE INDEX (AdvertisementID));

CREATE TABLE AdvertismentPhoto (
  AdvertismentPhotoID int(10) NOT NULL AUTO_INCREMENT, 
  AdvertisementID     int(10) NOT NULL, 
  Photo               varchar(255) NOT NULL, 
  ModifiedDate        timestamp NOT NULL, 
  PRIMARY KEY (AdvertismentPhotoID), 
  UNIQUE INDEX (AdvertismentPhotoID));

CREATE TABLE Bookmark (
  UserID          int(10) NOT NULL, 
  AdvertisementID int(10) NOT NULL, 
  PRIMARY KEY (UserID, 
  AdvertisementID));

CREATE TABLE City (
  CityID    int(10) NOT NULL AUTO_INCREMENT, 
  CountryID int(10) NOT NULL, 
  CityName  varchar(100) NOT NULL, 
  PRIMARY KEY (CityID), 
  UNIQUE INDEX (CityID));

CREATE TABLE `User` (
  UserID      int(10) NOT NULL AUTO_INCREMENT, 
  Email       varchar(255) NOT NULL, 
  `Password`    varchar(255) NOT NULL, 
  Salt        varchar(255) NOT NULL, 
  `Name`        varchar(255) NOT NULL, 
  Photo       varchar(255), 
  About       varchar(255), 
  PhoneNumber varchar(255), 
  Facebook    varchar(255), 
  Instagram   varchar(255), 
  Telegram    varchar(255), 
  CityID      int(10), 
  `Address`     varchar(255), 
  PRIMARY KEY (UserID), 
  UNIQUE INDEX (UserID));

CREATE TABLE ViolationReport (
  ViolationReportID int(10) NOT NULL AUTO_INCREMENT, 
  UserID            int(10) NOT NULL, 
  AdvertisementID   int(10) NOT NULL, 
  Reason            varchar(255) NOT NULL, 
  Comment           varchar(255), 
  CaseStatus        tinyint NOT NULL, 
  PRIMARY KEY (ViolationReportID), 
  UNIQUE INDEX (ViolationReportID));
  
ALTER TABLE AdvertismentPhoto ADD CONSTRAINT FKAdvertisme848757 FOREIGN KEY (AdvertisementID) REFERENCES Advertisement (AdvertisementID);
ALTER TABLE Advertisement ADD CONSTRAINT FKAdvertisem420635 FOREIGN KEY (CityID) REFERENCES City (CityID);
ALTER TABLE Advertisement ADD CONSTRAINT FKAdvertisem887307 FOREIGN KEY (PublisherID) REFERENCES `User` (UserID);
ALTER TABLE `User` ADD CONSTRAINT FKUser826554 FOREIGN KEY (CityID) REFERENCES City (CityID);
ALTER TABLE Bookmark ADD CONSTRAINT FKBookmark660490 FOREIGN KEY (UserID) REFERENCES `User` (UserID);
ALTER TABLE Bookmark ADD CONSTRAINT FKBookmark819345 FOREIGN KEY (AdvertisementID) REFERENCES Advertisement (AdvertisementID);
ALTER TABLE ViolationReport ADD CONSTRAINT FKViolationR878332 FOREIGN KEY (UserID) REFERENCES `User` (UserID);
ALTER TABLE ViolationReport ADD CONSTRAINT FKViolationR962811 FOREIGN KEY (AdvertisementID) REFERENCES Advertisement (AdvertisementID);
