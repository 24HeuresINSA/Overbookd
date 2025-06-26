<template>
  <v-card rounded="0" class="mx-0 my-0 px-0 py-0">
    <v-toolbar color="background">
      <v-btn
        icon="mdi-close"
        aria-label="Fermer"
        title="Fermer"
        @click="close"
      />
      <v-toolbar-title>Conditions Générales d'Utilisation</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <p class="subtitle">En vigueur au 29/07/2024</p>
      <p>
        Les présentes conditions générales d'utilisation (dites «
        <strong>CGU</strong> ») ont pour objet l'encadrement juridique des
        modalités de mise à disposition du site et des services par Club des 24
        heures de l'INSA et de définir les conditions d’accès et d’utilisation
        des services par « <strong>l'Utilisateur</strong> ».
      </p>
      <p>
        Toute inscription ou utilisation du site implique l'acceptation sans
        aucune réserve ni restriction des présentes CGU par l’utilisateur. Lors
        de l'inscription sur le site via le Formulaire d’inscription, chaque
        utilisateur accepte expressément les présentes CGU en cochant la case
        précédant le texte suivant : « Je reconnais avoir lu et compris les CGU
        et je les accepte ».
        <br />
        En cas de non-acceptation des CGU stipulées dans le présent contrat,
        l'Utilisateur se doit de renoncer à l'accès des services proposés par le
        site.
        <br />
        {{ LINK }} se réserve le droit de modifier unilatéralement et à tout
        moment le contenu des présentes CGU.
      </p>

      <h2>Article 1 : Les mentions légales</h2>
      <p>
        L'édition du site {{ LINK }} est assurée par l’association du Club des
        24 heures de l'INSA, régie par la loi du 1er juillet 1901, immatriculée
        au RCS de Villeurbanne sous le numéro 32292767400018, dont le siège
        social est situé au 20 avenue Albert Einstein 69100 Villeurbanne.
        <br />
        Numéro de téléphone : <a href="tel:+33472437000">+33 4 72 43 70 00</a>
        <br />
        Adresse e-mail :
        <a :href="`mailto:${BUREAU_EMAIL}`">{{ BUREAU_EMAIL }}</a>
      </p>
      <p>
        L'hébergeur du site {{ LINK }} est la société OVH, dont le siège social
        est situé au 2 rue Kellermann, 59100 Roubaix, avec le numéro de
        téléphone : 1007.
      </p>

      <h2>ARTICLE 2 : Accès au site</h2>
      <p>
        Le site {{ LINK }} permet à l'Utilisateur un accès gratuit aux services
        suivants :
      </p>
      <ul>
        <li>
          la gestion des activités et tâches indispensable au bon déroulement du
          festival
        </li>
        <li>
          l'inscription de bénévoles pouvant proposer des plages horaires de
          disponibilités
        </li>
        <li>
          de proposer aux bénévoles d'aider sur les activités et tâches
          nécessaires au bon déroulement du festival en cohérence avec leurs
          disponibilités
        </li>
        <li>le suivi logistique du matériel</li>
        <li>la gestion des dépenses internes de l'association</li>
      </ul>
      <p>
        Le site est accessible gratuitement en tout lieu à tout Utilisateur
        ayant un accès à Internet. Tous les frais supportés par l'Utilisateur
        pour accéder au service (matériel informatique, logiciels, connexion
        Internet, etc.) sont à sa charge.
      </p>
      <p>
        L’Utilisateur non membre n'a pas accès aux services réservés. Pour cela,
        il doit s’inscrire en remplissant le formulaire. En acceptant de
        s’inscrire aux services réservés, l’Utilisateur membre s’engage à
        fournir des informations sincères et exactes concernant son état civil
        et ses coordonnées, notamment son adresse email.
        <br />
        Pour accéder aux services, l’Utilisateur doit ensuite s'identifier à
        l'aide de son email et de son mot de passe renseignés lors de son
        inscription.
        <br />
        Tout événement dû à un cas de force majeure ayant pour conséquence un
        dysfonctionnement du site ou serveur et sous réserve de toute
        interruption ou modification en cas de maintenance, n'engage pas la
        responsabilité de {{ LINK }}. Dans ces cas, l’Utilisateur accepte ainsi
        ne pas tenir rigueur à l’éditeur de toute interruption ou suspension de
        service, même sans préavis.
        <br />
        L'Utilisateur a la possibilité de contacter le site par messagerie
        électronique à l’adresse email de l’éditeur communiqué à l’ARTICLE 1.
      </p>

      <h2>ARTICLE 3 : Collecte des données</h2>
      <p>
        Le site assure à l'Utilisateur une collecte et un traitement
        d'informations personnelles dans le respect de la vie privée
        conformément à la loi n°78-17 du 6 janvier 1978 relative à
        l'informatique, aux fichiers et aux libertés.
      </p>
      <p>
        En vertu de la loi Informatique et Libertés, en date du 6 janvier 1978,
        l'Utilisateur dispose d'un droit d'accès, de rectification, de
        suppression et d'opposition de ses données personnelles. L'Utilisateur
        exerce ce droit :
      </p>
      <ul>
        <li>
          par mail à l'adresse email
          <a :href="`mailto:${DSI_EMAIL}`">{{ DSI_EMAIL }}</a>
        </li>
      </ul>

      <h2>ARTICLE 4 : Propriété intellectuelle</h2>
      <p>
        Les marques, logos, signes ainsi que tous les contenus du site (textes,
        images, son…) sont protégés par le Code de la propriété intellectuelle,
        en particulier par le droit d'auteur.
      </p>
      <p>
        Sous la licence Apache, l'Utilisateur est autorisé à reproduire,
        distribuer et créer des œuvres dérivées à partir de ce contenu, à
        condition de respecter les termes de la licence Apache. L'Utilisateur
        doit notamment inclure un avis de copyright et une copie de la licence
        avec toute distribution ou reproduction de ce contenu, ainsi qu'une
        mention des modifications apportées.
      </p>
      <p>
        L'Utilisateur peut utiliser les contenus du site pour des usages privés,
        commerciaux ou publicitaires, dans le respect des conditions définies
        par la licence Apache. Toute utilisation des contenus du site en dehors
        de ce cadre nécessite une autorisation préalable expresse de
        l'exploitant du site Internet.
      </p>
      <p>
        Conformément à l’article L122-5 du Code de propriété intellectuelle,
        l’Utilisateur qui reproduit, copie ou publie le contenu protégé doit
        citer l’auteur et sa source, et indiquer si des modifications ont été
        effectuées.
      </p>

      <h2>ARTICLE 5 : Responsabilité</h2>
      <p>
        Les sources des informations diffusées sur le site {{ LINK }} sont
        réputées fiables mais le site ne garantit pas qu’il soit exempt de
        défauts, d’erreurs ou d’omissions.
      </p>
      <p>
        Les informations communiquées sont présentées à titre indicatif et
        général sans valeur contractuelle. Malgré des mises à jour régulières,
        le site {{ LINK }} ne peut être tenu responsable de la modification des
        dispositions administratives et juridiques survenant après la
        publication. De même, le site ne peut être tenu responsable de
        l’utilisation et de l’interprétation de l’information contenue dans ce
        site.
        <br />
        L'Utilisateur s'assure de garder son mot de passe secret. Toute
        divulgation du mot de passe, quelle que soit sa forme, est interdite. Il
        assume les risques liés à l'utilisation de son identifiant et mot de
        passe. Le site décline toute responsabilité.
        <br />
        Le site {{ LINK }} ne peut être tenu pour responsable d’éventuels virus
        qui pourraient infecter l’ordinateur ou tout matériel informatique de
        l’Utilisateur, suite à une utilisation, à l’accès, ou au téléchargement
        provenant de ce site.
      </p>
      <p>
        La responsabilité du site ne peut être engagée en cas de force majeure
        ou du fait imprévisible et insurmontable d'un tiers.
      </p>

      <h2>ARTICLE 6 : Lien hypertexte</h2>
      <p>
        Des liens hypertextes peuvent être présents sur le site. L’Utilisateur
        est informé qu’en cliquant sur ces liens, il sortira du site {{ LINK }}.
        Ce dernier n’a pas de contrôle sur les pages web sur lesquelles
        aboutissent ces liens et ne saurait, en aucun cas, être responsable de
        leur contenu.
      </p>

      <h2>ARTICLE 7 : Cookies</h2>
      <p>
        Lors des visites sur le site, un cookie de session s’installe
        automatiquement sur le logiciel de navigation de l'Utilisateur.
      </p>
      <p>
        Les cookies sont de petits fichiers stockés temporairement sur le disque
        dur de l’ordinateur de l’Utilisateur par votre navigateur et qui sont
        nécessaires à l’utilisation du site {{ LINK }}.
        <br />
        Les cookies contiennent un identifiant unique généré aléatoirement et
        aucune information personnelle.
      </p>
      <p>
        L’information contenue dans les cookies est utilisée pour permettre une
        authentification au site {{ LINK }}.
      </p>
      <p>En naviguant sur le site, L’Utilisateur les accepte.</p>

      <h2>ARTICLE 8 : Publication par l’Utilisateur</h2>
      <p>
        Le site permet aux membres de publier les contenus suivants :
        <br />
        Création de fiches de planification de tâches.
      </p>
      <p>
        Dans ses publications, le membre s’engage à respecter les règles de la
        Netiquette (règles de bonne conduite de l’internet) et les règles de
        droit en vigueur.
      </p>
      <p>
        Le membre reste titulaire de l’intégralité de ses droits de propriété
        intellectuelle. Mais en publiant une publication sur le site, il cède à
        la société éditrice le droit non exclusif et gratuit de représenter,
        reproduire, adapter, modifier, diffuser et distribuer sa publication,
        directement ou par un tiers autorisé, dans le monde entier, sur tout
        support (numérique ou physique), pour la durée de la propriété
        intellectuelle. Le Membre cède notamment le droit d'utiliser sa
        publication sur internet et sur les réseaux de téléphonie mobile.
      </p>
      <p>
        La société éditrice s'engage à faire figurer le nom du membre à
        proximité de chaque utilisation de sa publication.
      </p>
      <p>
        Tout contenu mis en ligne par l'Utilisateur est de sa seule
        responsabilité. L'Utilisateur s'engage à ne pas mettre en ligne de
        contenus pouvant porter atteinte aux intérêts de tierces personnes. Tout
        recours en justice engagé par un tiers lésé contre le site sera pris en
        charge par l'Utilisateur
      </p>

      <h2>ARTICLE 9 : Droit applicable et juridiction compétente</h2>
      <p>
        La législation française s'applique au présent contrat. En cas d'absence
        de résolution amiable d'un litige né entre les parties, les tribunaux de
        Lyon seront seuls compétents pour en connaître.
        <br />
        Pour toute question relative à l’application des présentes CGU, vous
        pouvez joindre l’éditeur aux coordonnées inscrites à l’ARTICLE 1.
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { BUREAU_EMAIL, DSI_EMAIL } from "~/utils/mail/mail.constant";

const LINK = "overbookd.24heures.org";

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style scoped>
h2 {
  margin-top: 30px;
  margin-bottom: 10px;
}

.subtitle {
  font-style: italic;
  font-size: 0.9rem;
}

p {
  margin-bottom: 10px;
}

ul {
  margin-left: 50px;
  margin-bottom: 10px;
}
</style>
