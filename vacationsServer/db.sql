CREATE DATABASE  IF NOT EXISTS `vacations` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `vacations`;
-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: vacations
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `followed_vacations`
--

DROP TABLE IF EXISTS `followed_vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `followed_vacations` (
  `User_Id` int DEFAULT NULL,
  `Vacation_Id` int DEFAULT NULL,
  KEY `User_Id_idx` (`User_Id`),
  KEY `Vacation_Id_idx` (`Vacation_Id`),
  CONSTRAINT `User_Id` FOREIGN KEY (`User_Id`) REFERENCES `users` (`User_Id`),
  CONSTRAINT `Vacation_Id` FOREIGN KEY (`Vacation_Id`) REFERENCES `vacations` (`Vacation_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followed_vacations`
--

LOCK TABLES `followed_vacations` WRITE;
/*!40000 ALTER TABLE `followed_vacations` DISABLE KEYS */;
INSERT INTO `followed_vacations` VALUES (2,1),(2,95),(2,5),(2,7),(3,3),(3,1),(3,2),(3,137),(4,3),(4,4),(4,7),(4,5),(4,41),(5,1),(5,2),(5,3),(5,4),(6,2),(6,1),(6,113),(6,112),(6,110),(6,137),(6,72),(4,160),(4,2),(4,162),(4,159),(2,47),(2,41),(3,47),(3,161),(3,160),(2,162),(2,4),(192,2),(192,1),(192,161);
/*!40000 ALTER TABLE `followed_vacations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `User_Id` int NOT NULL AUTO_INCREMENT,
  `User_Name` varchar(60) NOT NULL,
  `User_Password` varchar(60) NOT NULL,
  `User_First_Name` varchar(60) NOT NULL,
  `User_Last_Name` varchar(60) NOT NULL,
  `User_Type` varchar(10) NOT NULL DEFAULT 'USER',
  PRIMARY KEY (`User_Id`),
  UNIQUE KEY `userName_UNIQUE` (`User_Name`)
) ENGINE=InnoDB AUTO_INCREMENT=193 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'adar','68261d6dcf17be7b67f1ba5f36781afa','Adar','Abadian','ADMIN'),(2,'AviEdri','68261d6dcf17be7b67f1ba5f36781afa','Avi','Edri','USER'),(3,'BenAshkenazi','68261d6dcf17be7b67f1ba5f36781afa','Ben','Ashkenazi','USER'),(4,'Bibi','68261d6dcf17be7b67f1ba5f36781afa','Bibi','Netanyahu','USER'),(5,'Yesh','68261d6dcf17be7b67f1ba5f36781afa','Yesh','Tziunim','USER'),(6,'AdMatay','68261d6dcf17be7b67f1ba5f36781afa','July','Fifteen','USER'),(192,'test','68261d6dcf17be7b67f1ba5f36781afa','adar','adar','USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacations`
--

DROP TABLE IF EXISTS `vacations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacations` (
  `Vacation_ID` int NOT NULL AUTO_INCREMENT,
  `Vacation_Desc` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Vacation_Destination` varchar(45) NOT NULL,
  `Vacation_Picture` varchar(2000) DEFAULT NULL,
  `Vacation_From_Date` varchar(45) DEFAULT NULL,
  `Vacation_To_Date` varchar(45) DEFAULT NULL,
  `Vacation_Price` int DEFAULT NULL,
  PRIMARY KEY (`Vacation_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=163 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacations`
--

LOCK TABLES `vacations` WRITE;
/*!40000 ALTER TABLE `vacations` DISABLE KEYS */;
INSERT INTO `vacations` VALUES (1,'Tokyo is Japan\'s capital and the world\'s most populous metropolis. It is also one of Japan\'s 47 prefectures, consisting of 23 central city wards and multiple cities.   Tokyo offers a seemingly unlimited choice of shopping, entertainment, culture and dining to its visitors. The city\'s history can be appreciated in districts such as Asakusa and in many excellent museums, historic temples and gardens. Contrary to common perception, Tokyo also offers a number of attractive green spaces in the city center and within relatively short train rides at its outskirts.','Tokyo, Japan','1606821251505-tokyo.jpg','2021-01-01','2021-02-03',2550),(2,'At more than 468 square miles, Los Angeles defies easy exploration. Even those who dream of touring the city\'s top attractions in a sporty convertible may be discouraged by the city\'s notorious traffic congestion and tough parking rules. To enjoy that stress-free, laid-back vacation California is famous for, choose an easy, efficient guided tour. Using both traveler sentiment and expert opinion, U.S. News selected 15 of the top tours in Los Angeles whose entertaining introduction to the city will engage intrepid explorers, first-time visitors and local residents alike.','Los-Angeles, USA','1606821304844-LA_Shutterstock.29.jpg','2021-02-05','2021-04-01',2900),(3,'Glitzy Dubai is the United Arab Emirates\' holiday hot spot. This city of high-rises and shopping malls has transformed itself from a desert outpost to a destination du-jour, where tourists flock for sales bargains, sunshine, and family fun. Dubai is famous for sightseeing attractions such as the Burj Khalifa (the world\'s tallest building) and shopping malls that come complete with mammoth aquariums and indoor ski slopes.','Dubai, UAE','1606820927380-Dubai.jpg','2021-02-07','2021-02-22',1780),(4,'Thailand is the number one tourist location in South East Asia, and it is easy to see why. Best known for its breath-taking beaches, its stunning temples and the modern urban sprawl that is Bangkok, it is a country where getting bored is just not an option.','Bangkok, Thailand','1606821362052-large_bangkok_lead.jpg','2021-01-09','2021-02-02',1600),(5,'Sydney is Australia’s answer to New York: a cosmopolitan a hive of activity, which never sleeps, but also boasts gorgeous beaches, fantastic weather and mild winters. Sydney has over 4 million residents, making it Australia’s largest city, and is also the most touristed destination in the country, attracting over 32 million visitors per year.The city is very multicultural, so the food on offer is delicious, and it’s also a fantastic shopping destination. The various suburbs have very different atmospheres, so you’ll find something for everyone in this tourist paradise.','Sidney, Australia','1606822034488-Sydney-1921x1282-c-default.jpg','2021-01-01','2021-02-01',1500),(7,'Germany is a country that evolves several cultures in it. Recommended for shorter The capital city of Germany is rich with history and culture. Badly fractured during World War II and the cold war, Berlin has recreated itself into an international city with diverse cultures and architecture. Explore the top tourist attraction in Berlin that still bears the scars of the recent past.','Berlin, Germany','1606822070931-berlin.jpg','2020-12-10','2020-12-14',650),(41,'It opened July 17, 1955, launching a theme park industry that is emulated around the world. Within two years, more than 4.5 million people were visiting Disneyland, cementing Walt and Roy Disney’s model of building a fairy-tale place to please guests who were a happy audience for story-based thrill rides, expensive food and themed souvenirs. Today, with new Pixar character theming and the movie-themed Cars Land, it remains the second most attended theme park in the Disney empire.','Disneyland Resort, California','1606823215637-h_2000-crm-la-disneyland0-6a3322105056a36_6a3323af-5056-a36f-23e7498faf405903.jpg','2021-04-15','2021-05-20',1250),(47,'Jerusalem is the religious and historical epicenter of the world. A surreal and vibrant city, holy to Jews, Muslims, and Christians – over one-third of all the people on earth. Jerusalem is as unique as she is special. Beyond her religious and historic significance, Jerusalem is the capital of modern-day Israel and an advanced, dynamic city. Jerusalem has to be seen to be believed. Exploring Jerusalem solo is fantastic, and if it is your first time visiting this glorious place, a tour is simply a must. With so much to see and know, having an experienced guide with you is indispensable and worth every penny.','Jerusalem','1606821216685-file-20171206-917-6y7v5b.jpg','2020-12-20','2020-12-30',250),(72,'Travel by car or train to see glaciers and coastal scenery in Kenai Fjords, mountains and wildlife in Denali. Experience small town Alaska in Talkeetna.\n','Alaska’s National Park','1606822130387-28597576.jpg','2021-05-01','2021-06-01',2000),(95,'New York City (NYC), often called simply New York, is the most populous city in the United States. With an estimated 2019 population of 8,336,817 distributed over about 302.6 square miles (784 km2), New York City is also the most densely populated major city in the United States.[11] Located at the southern tip of the U.S. state of New York, the city is the center of the New York metropolitan area, the largest metropolitan area in the world by urban landmass.[12] With almost 20 million people in its metropolitan statistical area and approximately 23 million in its combined statistical area, it is one of the world\'s most populous megacities. New York City has been described as the cultural, financial, and media capital of the world, significantly influencing commerce,[13] entertainment, research, technology, education, politics, tourism, art, fashion, and sports. Home to the headquarters of the United Nations,[14] New York is an important center for international diplomacy.[15][16]','New york','1606822442108-5512.jpg','2021-03-03','2021-05-05',250),(110,'Anyone who enjoys traveling and discovering a new place with an organized tour will find several offers for visiting Tuscany on short, one day tours as well as through longer tours, such as as weekly tour of Tuscany.\nTours in Tuscany can be of several types, from the more classic ones that visit the most beautiful cities in Tuscany to the popular food and wine tours and shopping tours.','Toscana, Italy','1606822633868-Image960x640.jpg','2021-02-06','2021-02-14',1650),(111,'Located in the best place to visit in France, the Eiffel Tower sells about 7 million tickets annually and is appreciated at a distance by all Paris visitors. Completed for the 1889 Exposition Universelle after two years of construction, it has 1,665 steps to the top and elevators to two observation levels. Computer programmed beacons, which are seen up to 50 miles away, complement the tower\'s 20,000 lightbulbs as part of a thrilling, hourly night show designed to celebrate the millennium.\nThe Hollywood Sign in Los Angeles is a top tourist attraction in the world\n CREDIT\nHollywood Sign, Los Angeles\n\nThe Hollywood sign, which debuted as Hollywoodland in 1923 to advertise a real estate development, was rebuilt in 1978 to mark the iconic industry that makes Los Angeles a company town, even today. For the best selfies, park along North Beachwood Drive off Franklin Avenue and look up Beachwood Canyon, or get nostalgic at Griffith Park Observatory, where “La La Land” was filmed.\nThe Great Pyramids of Giza is a top tourist attraction in the world\n CREDIT\nGreat Pyramid of Giza, Egypt\n\nThe last of the Seven Wonders of the Ancient World standing, and more than 3,000 years old, the Great Pyramid rises 479 feet from a 754-feet square base. Scientists still don’t understand how the ancient Egyptians were able to move, carve and erect more than 2 million stone blocks, each weighing from 2 to 60 tons. It is one of three pyramids to tour on the Giza Plateau; get there early to purchase entry tickets or work with a local tour operator.','Eiffel Tower, Paris','1606822678790-eiffel.jpg','2021-01-06','2021-02-02',600),(112,'The Hollywood sign, which debuted as Hollywoodland in 1923 to advertise a real estate development, was rebuilt in 1978 to mark the iconic industry that makes Los Angeles a company town, even today. For the best selfies, park along North Beachwood Drive off Franklin Avenue and look up Beachwood Canyon, or get nostalgic at Griffith Park Observatory, where “La La Land” was filmed.','Hollywood Sign, Los Angeles','1606822796515-הורדה.jpg','2021-03-06','2021-05-26',800),(113,'The last of the Seven Wonders of the Ancient World standing, and more than 3,000 years old, the Great Pyramid rises 479 feet from a 754-feet square base. Scientists still don’t understand how the ancient Egyptians were able to move, carve and erect more than 2 million stone blocks, each weighing from 2 to 60 tons. It is one of three pyramids to tour on the Giza Plateau; get there early to purchase entry tickets or work with a local tour operator.','Great Pyramid of Giza, Egypt','1606822970730-הורדה (1).jpg','2020-12-20','2020-12-30',750),(137,'One of the world’s most famous cathedrals, La Sagrada Familia features undulating lines, abstract stained glass and dripping stone towers. This masterpiece is the work of visionary architect Antoni Gaudí, whose ornate private commissions and playful Parc Güell are also top attractions in Barcelona. Construction on La Sagrada Familia began in the late 1870s and was supervised by Gaudi for 43 years until his death (he is buried in the crypt). It is expected to be completed in 2026.','La Sagrada Familia, Barcelona','1606823046765-הורדה (2).jpg','2021-04-09','2021-04-18',500),(158,'The 1,000-year-old Tower of London fortress has served as a royal palace, prison, armory, execution chamber and treasury, safeguarding the 24,000 gems that make up the famous Crown Jewels, still worn by the Queen on special occasions. Tours are led by the colorfully costumed Beefeaters who thrill kids. Buy tickets online to avoid long waits; save with a three-palace Royal Pass if you’re into nobility.','Tower of London, London','1606823095999-הורדה (3).jpg','2021-03-01','2021-03-31',600),(159,'Opened in 1994, Shanghai’s favorite vintage tower design – 11 red and gold spheres pierced by a silver column supporting a glass elevator – was inspired by a Chinese poem describing “large and small pearls dropping on a plate of jade.” Located in Pudong, the top sphere holds the tallest observation deck with a glass overlook; other spheres have views over the Huangpu River toward the classic Bund, a revolving restaurant and the interesting Shanghai Municipal History Museum at its base.','Oriental Pearl Tower, Shanghai','1606839121786-הורדה (5).jpg','2021-03-01','2021-04-01',780),(160,'Now the remains of an enormous, carved marble ellipse, the Colosseum was commissioned in A.D. 72 by Emperor Vespasian as an amphitheater to entertain the masses. Using four levels pierced by 80 arched entrances, 55,000 spectators could quickly take seats to watch all-day games between wild animals, slaves and criminals. The local guides in gladiator costumes hanging around today will tell you how the ground was once soaked in blood and that Christians, indeed, were thrown to lions here.','Colosseum, Rome','1606839182960-הורדה (6).jpg','2021-06-01','2021-06-07',300),(161,'Hong Kong may be most famous for the busy waterway separating the island’s glittering skyscrapers from the commercial mainland at Kowloon. The most spectacular views of the city are from the water, whether seen on a cheap Star Ferry connecting Wan Chai to Tsim Sha Tsui, a traditional Chinese junk or a guided cruise. Set sail after sunset for the world’s largest light and sound show at 8 p.m. nightly, when the city’s skyscrapers erupt into seasonally themed lighting effects synchronized to music.','Victoria Harbour, Hong Kong','1606839232489-הורדה (7).jpg','2021-07-01','2021-07-30',2100),(162,'Reaching an estimated 22 million annual visitors, the 6 million cubic feet of water per second tumbling over the rocky U.S.-Canada border gets everyone wet. While Canada’s thundering Horseshoe Falls is the widest, New York\'s stunning American Falls and Bridal Veil Falls are seen from a more natural environment. Bring passports to cross the Rainbow Bridge and see both, and don’t miss any under-the-falls experiences on land or by boat.','Niagara Falls, Canada','1606839347904-הורדה (8).jpg','2021-06-06','2021-06-18',2000);
/*!40000 ALTER TABLE `vacations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-25 12:08:20
