/*
  Warnings:

  - Made the column `screenShot` on table `Process` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Process" ALTER COLUMN "bpmnXml" SET DEFAULT '',
ALTER COLUMN "screenShot" SET NOT NULL,
ALTER COLUMN "screenShot" SET DEFAULT '';
