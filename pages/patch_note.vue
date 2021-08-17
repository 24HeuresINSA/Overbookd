<template>
  <v-container>
    <h1>Patch notes 📝</h1>

    <h2>Patch note 0.10</h2>
      <h3>Corrections de quelques bugs signaler sur la page d'inscription et systeme de demande d'amis (Merci MAAF ❤️)</h3>
      <ul>
        <li>📝 l'appli check si tu as bien mis le meme mdp a l'inscription</li>
        <li>🤪 l'appli explique comment se co apres avoir creer un compte</li>
        <li>🔒 les champs avec un * sont obligatoirs</li>
        <li>😏 les mdp ne sont plus stocke dans la base de donnee</li>
        <li>❤️ quand qqun nous accepte en ami il se rajoute dans la liste d'ami (il faut refresh quand meme)</li>
        <li>🧹 nettoyage du code de la backend (mais personne ne peux remaque la diff)</li>
        <li>👀 preparation pour le magnifique webservice de Tit pour la prochaine MaJ</li>
      </ul>

    <h2>Patch note 0.9</h2>
      <h3>ajout d'une idee conne d'Adele </h3>
      <ul>
        <li>❤️ ajout de OverTinder 🔥</li>
        <li>📸 possibilite d'ajouter une PP</li>
      </ul>

    <h2>Patch note 0.8</h2>
      <h3>ajout de filtrage pour les FA et fix des FA</h3>
      <ul>
        <li>📝 filtrage des FA par team et par status</li>
        <li>🔎 ajout des recherche de FA</li>
        <li>📆 on peut restreindre a qui s'affiche les dispo (hard only, bureau only ...)</li>
        <li>🔨 correction de bug</li>
      </ul>

    <h2>Patch note 0.7</h2>
    <h3>les fix apres les retours de Stoph et Tit, Début de la LOG (marche pas encore)️</h3>
    <ul>
      <li>🚚 interface de la log pour user.log (selectionner un outil demande en FT puis valider les FT)</li>
      <li>🗑 delete les FT (mercu stoph)</li>
      <li>👀 les icons sont un peu plus propre</li>
      <li>🗑 supp du code inutile (ca charge 0.002s plus rapidement)</li>
      <li>📝 un remercimenet au auteure </li>
      <li>🤯 fix buf des date de naissance qui s'affiche pas </li>
      <li>🤪 les humains ne peuvent plus se donner le role admin ou bureau</li>
      <li>📝 corrige un bug causant les FA a ne pas se sauvgarder (merci stoph ❤️)</li>
      <li>⏰ on ne peut mettre que des multiple de 15 en minute (fix du format 24h )</li>
    </ul>

    <h2>Patch note 0.6</h2>
      <h3>les fix apres les retours de Stoph et Paul ❤️</h3>
      <ul>
        <li>🔨 ajout des dispo que par les admin humain bureau (modifiable depuis l'interface admin)</li>
        <li>📆 fix de la page calendrier qui affiche les creneau ou le pelo est assigné</li>
        <li>⚙️ ajout de la page de config (work still in progress)</li>
        <li>👀 le champs ou il faut mettre le nom de la FT s'affiche mieux (merci stoph)</li>
        <li>📈 FIX DU CHARISME s'update apres refresh</li>
      </ul>

      <h2>Patch note 0.5</h2>
      <h3>les fix apres les retours de Tit ❤️</h3>
      <ul>
        <li>🔨 ajout de page de config pour les admins</li>
        <li>🌙 mode sombre reste meme apres refresh </li>
        <li>🐞 interface du bug report depuis overbookd</li>
        <li>🥳 quality of life changes</li>
      </ul>

    <h2>Patch note 0.4</h2>
    <p>les fix apres les retours de Paul et Tit, Merci ❤️</p>
    <ul>
      <li>💰 fix des transactions dans les compte perso (pour de vrai cette fois ci)</li>
      <li>📆 possibilite d'ajout de dispo par les admin et bureau (et ajouter des creneaux)</li>
      <li>🔨 fix du systeme de broadcast (Merci Paul)</li>
      <li>🗑 possibilite de supp les notifications</li>
      <li>😱 l'ajout d'une page de patch note </li>
      <li>🥳 quality of life changes</li>
    </ul>

    <h2>Patch note 0.3</h2>
    <p>les fix apres les retours de Paul, Merci</p>
    <ul>
      <li>💰 fix des transactions dans les compte perso</li>
      <li>🎨 admin et bureau peuvent ajouter des roles au gens depuis la page humain</li>
      <li>😎 n'affiche plus les mdp en claire</li>
      <li>🔖 affiche les champs requis</li>
    </ul>

    <h2>Patch note 0.2</h2>
    <ul>
      <li>📈 ajout de la page stats, mais pour l'instant c'est juste un meme</li>
      <li>🤷‍♂️ l'affect marche des fois peut etre selon le mood d'overbookd</li>
      <li>🐞 ajout des instructions pour signaler les bug</li>
      <li>🟨 ajout d'un logo de ricard cache</li>
      <li>🔨 fix le logo blanc qui s'affiche pas des fois</li>
      <li>🔨 fix d'un bug ou le compte perso comptait 10 + 10 = 1010</li>
      <li>😎 fix d'un bug ou tous le monde avait 15 charisme</li>

    </ul>
  </v-container>
</template>

<script>
export default {
  name: "patch_note"
}
</script>

<style scoped>

</style>