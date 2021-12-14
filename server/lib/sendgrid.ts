import * as sgMail from "@sendgrid/mail";

type mailInfo = {
  name: string;
  email: string;
  description: string;
  phone: string;
  ownerMail: string;
};

async function sendEmail({
  name,
  email,
  description,
  phone,
  ownerMail,
}: mailInfo): Promise<void> {
  sgMail.setApiKey(process.env.MAIL_API_KEY);
  const msg = {
    to: ownerMail,
    from: "wasd12.ns@gmail.com",
    subject: "Info sobre tu mascota perdida",
    text: `Hola soy ${name}. ${description}, comunicate con migo para tener mas info: email:${email}, telefono: ${phone}`,
    html: `<h2> Hola soy ${name}. ${description}, comunicate con migo para tener mas info: email: ${email}, telefono: ${phone}</h2>`,
  };
  await sgMail.send(msg);
}

export { sendEmail };
