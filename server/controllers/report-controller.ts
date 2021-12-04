import { User, Pet, Report } from "../models/index";

type reportInfo = {
  description: string;
  reporterEmail: string;
  reporterPhone: number;
};

async function createReport(
  petId: number,
  userId: number,
  info: reportInfo
): Promise<Report> {
  try {
    const { description, reporterEmail, reporterPhone } = info;
    const report = await Report.create(
      {
        petId,
        userId,
        description,
        reporterEmail,
        reporterPhone,
      },
      { include: [User, Pet] }
    );
    return report;
  } catch (error) {
    console.log(error, "error en el report controller");
  }
}

export { createReport };
