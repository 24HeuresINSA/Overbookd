import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendResetMail = async function (
  token: string,
  to: string
): Promise<unknown | undefined> {
  const html = `
  <table style="text-align: center;">
  <p>Alors comme ça tu as perdu ton mot de passe...</p>
  <p>
    Fais gaffe quand meme, la prochine fois met en un tout simple genre ta date
    de naissance ou bien ecrit le sur un post it que tu colles sur ton pc
  </p>
  <a
    id="link-button"
    href="overbookd.${process.env.DOMAIN}/reset/${token}"
    style="
      background-color: green;
      padding: 1rem 1rem 1rem 1rem;
      border-radius: 0.5rem;
      color: white;
      text-decoration: none;
      display: inline-block;
      margin: 1rem;
    "
    >Réinitiliser</a
  >
  <p>
    Si le lien ne marche pas, va a cette adresse :
    overbookd.${process.env.DOMAIN}/reset/${token}
  </p>

  <p>
    Bisous <br />
    La Team OB
  </p>
</table>`;

  const mailOptions = {
    from: "tom26.sampic@gmail.com",
    to,
    subject: "Tu as perdu ton mot de passe. LOL",
    html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      }
      resolve(info);
    });
  });
};

export const sendValidationMail = async function (
  to: string
): Promise<unknown | undefined> {
  const html = `
  <table style="text-align: center;">
  <h1>Validation Overbookd</h1>
  <p>
    Félicitation ton inscription sur Overbookd est dorénavant complète ! <br/>
  </p>
  <h2>    
    Tu peux maintenant te connecter pour pouvoir renseigner tes dispos. <br/>
    <span style="color:red">N'oublie pas que plus de dispo = plus rapidement validé !!</span>
  </h2>
  <a
    id="link-button"
    href="overbookd.${process.env.DOMAIN}/login"
    style="
      background-color: green;
      padding: 1rem 1rem 1rem 1rem;
      border-radius: 0.5rem;
      color: white;
      text-decoration: none;
      display: inline-block;
      margin: 1rem;
    "
    >Connexion à Overbookd</a
  >
  <p>
    Si le lien ne marche pas, va a cette adresse :
    overbookd.${process.env.DOMAIN}/login
  </p>

  <p>
    Merci de ton investissement ! <br />
    La Team OB
  </p>
</table>`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: "Validation Overbookd",
    html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      }
      resolve(info);
    });
  });
};
