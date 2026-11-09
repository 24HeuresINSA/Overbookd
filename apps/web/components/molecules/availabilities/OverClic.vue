<template>
  <span class="overclic">
    <span v-if="isGameStarted" class="text-primary">
      Voyons voir jusqu'où tu peux aller...
      <v-btn
        size="small"
        text="Ok je m'arrête là"
        color="primary"
        class="ml-3"
        :loading="isSaving"
        @click="stopPlaying"
      />
    </span>
    <span v-else-if="isCheating" class="text-warning">
      Bah alors on triche ?
    </span>

    <v-dialog v-model="isHighScoresDialogOpen" max-width="600">
      <DialogCard @close="closeHighScores">
        <template #title>OverClic</template>

        <template #subtitle>Meilleurs scores 🏆</template>

        <template #content>
          <ol v-if="highScores.length > 0" class="highscores">
            <li v-for="(highScore, index) in highScores" :key="highScore.id">
              <span class="highscores__rank">#{{ index + 1 }}</span>
              <UserAvatar
                :picture="highScore.user.profilePicture ?? undefined"
              />
              <span class="highscores__user">
                {{ buildUserNameWithNickname(highScore.user) }}
              </span>
              <span class="highscores__score">{{ highScore.score }} pts</span>
              <span class="highscores__date">
                {{ formatDateWithMinutes(highScore.createdAt) }}
              </span>
            </li>
          </ol>
          <p v-else>Aucun score pour le moment. À toi de jouer !</p>
        </template>

        <template #actions>
          <v-btn
            color="primary"
            text="Fermer"
            size="large"
            @click="closeHighScores"
          />
        </template>
      </DialogCard>
    </v-dialog>
  </span>
</template>

<script lang="ts" setup>
import { formatDateWithMinutes } from "@overbookd/time";
import { buildUserNameWithNickname } from "@overbookd/user";
import type { OverClicScore } from "@overbookd/http";

const WARN_THRESHOLD = 5;
const PLAY_THRESHOLD = 10;

const props = defineProps({
  charisma: {
    type: Number,
    required: true,
  },
});

const availabilityStore = useVolunteerAvailabilityStore();

const overClics = computed<number>(() => availabilityStore.overClics);
const isCheating = computed<boolean>(() => overClics.value >= WARN_THRESHOLD);
const isGameStarted = computed<boolean>(
  () => overClics.value >= PLAY_THRESHOLD,
);

const isHighScoresDialogOpen = ref<boolean>(false);
const isSaving = ref<boolean>(false);
const highScores = computed<OverClicScore[]>(
  () => availabilityStore.overClicHighScores,
);

const stopPlaying = async () => {
  isSaving.value = true;
  await availabilityStore.saveOverClicScore(props.charisma);
  isSaving.value = false;
  isHighScoresDialogOpen.value = true;
};
const closeHighScores = () => (isHighScoresDialogOpen.value = false);

const formatHighScore = (
  { user, score, createdAt }: OverClicScore,
  index: number,
): string =>
  `#${index + 1} ${buildUserNameWithNickname(user)} - ${score} pts - ${formatDateWithMinutes(createdAt)}`;

availabilityStore
  .fetchOverClicHighScores()
  .then((scores) =>
    console.log(
      ["Classement OverClic :", ...scores.map(formatHighScore)].join("\n"),
    ),
  );
</script>

<style lang="scss" scoped>
.overclic {
  font-size: 1rem;
  font-weight: normal;
}

.highscores {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
  li {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  &__rank {
    font-weight: bold;
    min-width: 2.5rem;
  }
  &__user {
    flex: 1;
  }
  &__score {
    font-weight: bold;
  }
  &__date {
    color: rgba(var(--v-theme-on-surface), 0.6);
    font-size: 0.85rem;
  }
}
</style>
