/*
  Warnings:

  - Added the required column `clouds` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feels_like` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pressure` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sunrise` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sunset` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temp_max` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temp_min` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timezone` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wind_deg` to the `Weather` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wind_speed` to the `Weather` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Weather" ADD COLUMN     "clouds" INTEGER NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "feels_like" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "grnd_level" INTEGER,
ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "pressure" INTEGER NOT NULL,
ADD COLUMN     "sea_level" INTEGER,
ADD COLUMN     "sunrise" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sunset" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "temp_max" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "temp_min" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "timezone" INTEGER NOT NULL,
ADD COLUMN     "visibility" INTEGER NOT NULL,
ADD COLUMN     "wind_deg" INTEGER NOT NULL,
ADD COLUMN     "wind_gust" DOUBLE PRECISION,
ADD COLUMN     "wind_speed" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "WeatherHistory" (
    "id" SERIAL NOT NULL,
    "weatherId" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "temp" DOUBLE PRECISION NOT NULL,
    "feels_like" DOUBLE PRECISION NOT NULL,
    "temp_min" DOUBLE PRECISION NOT NULL,
    "temp_max" DOUBLE PRECISION NOT NULL,
    "pressure" INTEGER NOT NULL,
    "sea_level" INTEGER,
    "grnd_level" INTEGER,
    "humidity" INTEGER NOT NULL,
    "visibility" INTEGER NOT NULL,
    "wind_speed" DOUBLE PRECISION NOT NULL,
    "wind_deg" INTEGER NOT NULL,
    "wind_gust" DOUBLE PRECISION,
    "clouds" INTEGER NOT NULL,
    "rain" DOUBLE PRECISION,
    "condition" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "timezone" INTEGER NOT NULL,
    "sunrise" TIMESTAMP(3) NOT NULL,
    "sunset" TIMESTAMP(3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WeatherHistory" ADD CONSTRAINT "WeatherHistory_weatherId_fkey" FOREIGN KEY ("weatherId") REFERENCES "Weather"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
