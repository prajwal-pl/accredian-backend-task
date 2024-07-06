import nodemailer from "nodemailer";
import { google } from "googleapis";
import { RequestHandler } from "express";
import { PrismaClient } from "@prisma/client";

const oAuthClient = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const prisma = new PrismaClient();

oAuthClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export const sendMail: RequestHandler = async (req, res) => {
  const { toMail, toName, fromMail, fromName, body } = req.body;
  try {
    if (!toMail || !toName || !fromMail || !fromName || !body) {
      res.status(400).json({
        message: "Please Provide All the Required Fields",
      });
      return;
    }
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: "prajwalpl096@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
        expires: 3599,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: fromMail,
      to: toMail,
      subject: "Regarding Referal Program from Accredian",
      text: body,
    };

    const result = await transport.sendMail(mailOptions);
    const mail = await prisma.mail.create({
      data: {
        fromName: fromName,
        fromMail: fromMail,
        toName: toName,
        toMail: toMail,
        body: body,
      },
    });
    if (result.accepted.length > 0) {
      await prisma.mail.update({
        where: {
          id: mail.id,
        },
        data: {
          status: "APPROVED",
        },
      });
    }
    if (mail) {
      res.status(200).json({
        message: "Mail Sent Successfully",
      });
    }
    console.log(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
