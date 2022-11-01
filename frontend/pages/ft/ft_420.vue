<template>
  <div>
    <h1>Fiche Tâche</h1>

    <v-container
      style="
        display: flex;
        align-content: baseline;
        justify-content: space-between;
      "
    >
      <h2>FT: 420</h2>
      <h2>Validé et prêt a affectation</h2>
      <v-icon v-for="(validator, i) of teams" :key="i" color="green">
        {{ validator.icon }}
      </v-icon>
    </v-container>

    <v-row>
      <v-col md="6">
        <FormCard
          title="Général"
          topic="general"
          form-key="ft_general_form"
          :form="FT"
          :is-disabled="true"
        ></FormCard>
      </v-col>

      <v-col md="6">
        <FTInfoCard></FTInfoCard>
      </v-col>
    </v-row>

    <v-img src="/img/croutard.jpg"></v-img>

    <h3>BONSOIR, cher.e orga</h3>
    <p>
      Quel plaisir de te retrouver ici ! Je t’écris depuis un passé que j’espère
      lointain, et j’aime imaginer ton excitation à la lecture de ce modeste
      pavé. Alors, ça dit quoi ? Est-ce que dans le futur la France est devenue
      une dictature et a été ravagée par le covid-23, les milices zemmouriennes
      et une explosion nucléaire ? Est-ce qu’on dit toujours que c’était mieux
      avant ? Est-ce qu’on dort toujours moins de 2h par jour en hard ? Arrête
      de dire « oui », j’entends pas tes réponses. Tu es bien sûr ici pour
      réaliser le plus monstrueux space cake de ta vie (un brownie, en
      l’occurence) et satelliser toute une tripotée d’orgas et de témoins
      innocents. Comme il n’y a qu’un seul numéro 420 pour la FT, je vais te
      mettre toutes les étapes ici, mais cela devrait t’occuper à différents
      créneaux sur plusieurs jours. Dans un monde fabuleux, tu te débrouillerais
      pour te mettre ça sur ton programme de manif’, des créneaux à 4h20 en
      plein milieu du QG orga ou de la cuisine catering, mais comme je te
      connais (déjà, et ui ça va vite), tu vas probablement violer cette recette
      avec des potes pour vous éclater à la fin de je-ne-sais-quelle réu,
      semaine orga ou sortie de team building. De vos jours, les jeunes ne
      respectent plus rien. Au moins, essayez de lire la recette à l’avance pour
      le matériel et le planning, et de suivre les consignes de sécurité :p
    </p>
    <br />
    <p>Enfin bref, passons aux choses sérieuses.</p>
    <p>
      0 - En premier lieu, il te faudra acheter la merveilleuse substance
      galactique. D’après la littérature de la street et mon immense expérience,
      il faut en gros 7-8g de beuh pour 25 orgas fatigués. A part bien sûr si
      dans le futur vous avez des plantes transgéniques de ouf (chui parti du
      principe que t’allais en trouver à 20% comme moi, corrige les maths si
      nécessaire). Quand tu l’as, rentre dans un supermarché avec toute ta
      marchandise odorante dans ton sac à dos pour plus de swag, et achète
      également 2 tablettes de chocolat noir, un plaquette de 250g de beurre
      doux (sorry Bretagne) et une de beurre demi-sel, un paquet de farine sans
      gluten parce que t’as forcément une baltringue intolérante dans ton
      public, du sucre si t’en as pas (de la cassonade non-traitée de baboss, si
      t’es riche et que tu veux prendre soin de toi), et 6 oeufs de poulets
      exploités par le capitalisme. Si tu veux mettre de l’arôme de vanille, des
      noix, des raisins secs ou de la fleur d’orangers, qu’en-sais-je, prends
      garde à vérifier les allergies. y’a rien de plus badant qu’un choc
      anaphylactique sous THC.
    </p>
    <p>
      1- On commence par s’occuper des substances actives, ça prend beaucoup de
      temps. Grind finement tes petites têtes avec beaucoup d’amour. Va pas
      croire que c’est inutile, ça augmente drastiquement la surface de contact
      et donc le rendement d’extraction ! Et vas pas non plus faire ça après les
      autres étapes, moi j’ai essayé après le passage à l’eau, bah ça collait
      dans le grinder ^^’
    </p>
    <p>
      2- ensuite laisse tremper ta poudre dans une casserole avec un peu d’eau
      bouillante. 80°-100°, 5-10minutes. C’est pour virer la chlorophylle qui
      donne mauvais goût, et puis surtout les pesticides que ton cultivateur ou
      ton dealer ou les deux ont mis sur les têtes pour tuer les bestioles et
      toi.
    </p>
    <p>
      3- Prends un chinois, (l’ustensile de cuisine pas ton colloc
      casse-couilles) que tu appelles peut-être aussi une étamine ou une putain
      de passoire en maille de fer, genre ce truc là quoi. Etale dedans un
      torchon propre et avec lequel t’as pas fait la poussière fdp. Verse le
      contenu de la casserole dans cet incroyable système de filtration pour
      recueillir ta poudre, replie le torchon sur lui-même et presse contre les
      mailles du chinois pour virer toute l’eau. Retiens-bien cette manip, tu
      vas la refaire plus tard et il faudra pas la rater.
    </p>
    <p>
      4- Récupère la poudre en grattant ton torchon au-dessus d’un récipient qui
      tient la chaleur. Pro-tip : comme t’es évidemment pas assez équipé.e, tu
      peux fabriquer une petite barquette en pliant du papier alu, c’est stylé
      et pratique. Par contre faut pas éternuer, sinon tu vas la péter. Étape
      importante right here : fous ton récipient et son contenu à 145°C pendant
      7 minutes. Tu m’as bien lu, les chiffres sont précis donc c’est pas pour
      que t’ailles faire autre chose. Autant en cuisine les chiffres on s’en
      fout, autant là faut ni en faire trop ni pas assez. Cela dit, je te vois
      venir. Si tu peux faire que plus chaud, genre 180, met pour 4 minutes ; si
      tu peux que genre 120 degrés, c’est 24 minutes. Pour info, cette étape
      c’est la fameuse décarboxylation, celle qui fait que tu bouffes un truc
      qui défonce et pas le gateau au matcha de ta tante babacool.
    </p>
    <p>
      5- fais chauffer un peu d'eau dans une sauteuse, une poêle à bords très
      hauts quoi, la plus grande possible (pour une belle surface d’échange).
      Assez d’eau pour la remplir sur quelques centimètres de hauteur.
      Attention, si le liquide monte trop près du haut des bords, c'est brûlure
      garantie au moindre mouvement. Quand l'eau commence à frémir, ajoute 150g
      de beurre doux et laisse le fondre. Tu te retrouves avec un mélange chaud
      à deux phases. Ne couvre pas la poêle !
    </p>
    <p>
      6 - Dépose ta poudre magique dans le plat et touille doucement, avec
      amour. La température est maintenant l'élément crucial. Ton objectif est
      de voir frémir le mélange. A sa surface doivent apparaitre continuellement
      des petites bulles brunes qui ne sont pas sans rappeler la gueule d'une
      ambrée servie avec trop de pression. C'est sensé arriver à une température
      un peu inférieure aux 100°C (enfin jcrois, chai plus en vrai). Si le
      mélange est plus froid que ça, il va te falloir 100 millions d'années pour
      faire passer les substances dans le gras. Si c'est plus chaud, de grosses
      vilaines bulles d'eau peuvent apparaitre et perturber l'interface, tu peux
      abîmer ton herbe, voir cramer ton gras si t'es vraiment un branquignole.
      Quand les bulles sont obtenues et la température stabilisée, tu peux te
      reposer.
    </p>
    <p>
      7 - Te voilà parti.e pour 5 heures minimum, huit si t'es du genre
      performance sportive. Surveille toujours la température et les bubulles.
      Ne couvre jamais le mélange ! Laisse l'eau s'évaporer, quitte à en
      remettre doucement toutes les demis-heures ou toutes les heures (déjà
      chaude de préférence). Et puis fuck it pour l'économie d'énergie. Tu
      préfères ça à voir de la vapeur d'eau se condenser et perturber ta belle
      interface liquide-liquide. Pour faire passer le temps, tu peux essayer de
      lire l'avenir dans les remous aqueux de tes feuilles de thé, touiller le
      mélange, mais pas trop souvent, baiser sauvagement (sans arrêter de
      surveiller la casserole bien sûr) l'un.e des fans innombrables qui se
      pressent pour te voir à l'ouvrage, dire des bêtises à tes voisins ou bien
      te rappeler à quel point c'était mieux avant.
    </p>
    <p>
      8 - Re ! Ca va, c'était bien ? Quand ta patience arrive à son terme ou que
      tu crains d'avoir vidé une bouteille de gaz, coupe le feu et laisse
      refroidir un petit peu le mélange. Pas trop non plus hein, c'est juste
      histoire de. Ensuite vient le retour du duo terrible chinois+torchon.
      Attention nouvelle règle ! Cette fois-ci tu récupères la totalité du
      liquide qui s'écoule au travers, dans un récipient résistant à la chaleur.
      Pense bien à mettre des gants de cuisine et des fringes couvrantes pour
      cette opération. Une fois le mélange filtré, ferme le torchon sur ce qui
      se trouve dans le chinois et presse bien pour en extraire chaque goutte de
      liquide (attention c'est toujours chaud). A la fin, jette la salade terne
      et vaincue au compost, comme il se doit. Le liquide doit ensuite être
      transvasé dans un récipient de petite dimension et haut, comme un gros
      tuperware. Laisse-le 24h au frigo pour que le beurre clarifié et chargé se
      reforme.
    </p>
    <p>
      9- Re Re ! Maintenant qu’une journée est passée, va chercher ton récipient
      au frigo et récupère la partie qui ressemble à du beurre plus ou moins
      verdâtre. Ya 120g, si j’ai pas chié mes maths ni toi la recette. La partie
      qui ressemble à de l’eau c’est… de l’eau quoi. Chargée en acides aminées,
      caséine et lactose, probablement. Enfin bref. Jette-là. C’est l’heure de
      la COOOOOOUIIIIIIISIIIINNNNEEEE.
    </p>
    <p>
      10 - La recette est pour deux brownies. (Tu peux séparer ton space beurre
      en deux, genre 70-30 si t’as envie d’en charger un plus que l’autre, dans
      ce cas il faut que tu fasses deux fois la suite de la recette avec la
      moitié des quantités écrites.) Complètes tes 120g de space beurre avec le
      beurre demi-sel pour arriver à 300g. Ajoute tes 400g de chocolat et fais
      nous fondre ça au bain-marie ou au fond d’une casserole avec un peu d’eau
      si t’es cheap. Attention température ! C’est pas l’heure de tout faire
      cramer.
    </p>
    <p>
      11- Casse six oeufs dans un saladier et ajoute 24*10g de sucre, puis
      bat-moi ça jusqu’à ce que ça ressemble à un vomi d’oeufs brouillés (que ça
      blanchisse quoi). Ajoute ensuite 120g de farine et tous tes ingrédients à
      la con qui font la déco. Termine avec le mélange chocolat-gras.
    </p>
    <p>
      12- Beurre deux plats et verse une moitié de préparation dans chaque. Pour
      un brownie, préférer un plat petit mais haut, c’est toujours mieux quand
      c’est épais que quand c’est long. Je sais de quoi je parle. 180°C, quinze
      minute. Coupe chaque gateau en douze-quinze parts à la fin.
    </p>
    <p>
      420 - Quand on consomme, ne pas faire de bêtises. On ne prend qu’une seule
      part, et ON NE SE RESSERT PAS. On fait des trucs marrants pendant deux
      heures plutôt que d’attendre en se regardant dans le blanc des yeux que ça
      monte, c’est pas bon esprit. On reste ensemble longtemps pour prendre soin
      les un.e.s des autres. On garde des gens pas défoncés sous la main. On
      étiquette les restes. Voilà pour moi ! J’ai l’impression d’avoir abusé sur
      la longueur, comme d’hab, mais ça me fait plaisir. J’espère qu’à toi aussi
      :) Je t’embrasse fort depuis les abîmes du passé et te souhaite de
      brillants voyages dans les étoiles. Ton dévoué,
    </p>
    <h3>Croutard"</h3>
  </div>
</template>

<script>
import FormCard from "~/components/organisms/form/FormCard";

export default {
  name: "Ft420",
  components: { FormCard },
  data() {
    return {
      FT: {
        general: {
          name: "La FT 420",
        },
        detail: {
          locations: ["Lokal"],
        },
      },
    };
  },
  computed: {
    teams: function () {
      return this.$accessor.team.getAllTeams;
    },
  },
  async beforeCreate() {
    if (!this.$accessor.user.hasRole("hard")) {
      alert("vous avez pas le role 'hard' pour acceder a cette page");
      await this.$router.push({
        path: "/",
      });
    }
  },
};
</script>

<style scoped></style>
