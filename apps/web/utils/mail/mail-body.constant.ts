import type { UserPersonalData } from "@overbookd/user";
import { SG_EMAIL } from "./mail.constant";

const LINE_BREAK = "%0D%0A";

type Signer = Pick<UserPersonalData, "firstName" | "lastName" | "phoneNumber">;

export const negativeCpBody = ({
  firstName,
  lastName,
  phoneNumber,
}: Signer) => `Bonsoir !${LINE_BREAK}
Le solde actuel de ton compte perso est négatif.${LINE_BREAK}
Il va falloir remédier à ce déficit dans les plus brefs délais.${LINE_BREAK}
Que tu sois fossile ou non, la règle est la même !${LINE_BREAK}
Souviens-toi, une conso = un bâton !${LINE_BREAK}
${LINE_BREAK}
UN COMPTE PERSO C'EST PAS ON DESCEND DANS LE NÉGATIF ET ON REMET DE L'ARGENT POUR REVENIR À 0€, SINON LE SYSTÈME NE FONCTIONNE PLUS${LINE_BREAK}
${LINE_BREAK}
Si tu es trop très vieux, et qu'il est difficile pour toi de passer au lokal, je te laisse m'envoyer un petit message, on trouvera une solution !!${LINE_BREAK}
Je sais que les comptes persos peuvent compter sur vous alors à très vite !${LINE_BREAK}
${LINE_BREAK}
Des bisous,${LINE_BREAK}
${firstName} ${lastName}${LINE_BREAK}
Secrétaire Général·e${LINE_BREAK}
Club des 24 heures de l'INSA${LINE_BREAK}
${SG_EMAIL}${LINE_BREAK}
${phoneNumber}${LINE_BREAK}
20, avenue Albert Einstein${LINE_BREAK}
69621 Villeurbanne Cedex${LINE_BREAK}
04 72 43 70 00${LINE_BREAK}
www.24heures.org${LINE_BREAK}
`;
