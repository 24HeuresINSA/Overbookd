<template>
  <v-card class="home-card">
    <v-card-title class="home-card__title">
      <v-icon icon="mdi-link" />
      <span> Liens Utiles </span>
    </v-card-title>
    <v-card-text class="home-card__text">
      <div v-for="link in links" :key="link.emoji" class="useful-link">
        <span class="useful-link__emoji" aria-hidden="true">
          {{ link.emoji }}
        </span>
        <div class="useful-link__content">
          <div class="useful-link__actions">
            <template v-for="(action, index) in link.actions" :key="index">
              <span v-if="index > 0" class="useful-link__separator">•</span>
              <a
                v-if="action.href"
                :href="action.href"
                target="_blank"
                class="useful-link__title"
              >
                {{ action.label }}
                <v-icon icon="mdi-open-in-new" size="x-small" />
              </a>
              <a
                v-else
                href="#"
                class="useful-link__title"
                @click.prevent="action.copy?.()"
              >
                {{ action.label }}
                <v-icon icon="mdi-content-copy" size="x-small" />
              </a>
            </template>
          </div>
          <span class="useful-link__description">{{ link.description }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { USEFUL_LINKS_KEY } from "@overbookd/configuration";
import { Edition } from "@overbookd/time";
import {
  CTMA_URL,
  OVERVIEW_URL,
  PREPROD_URL,
  WIKI_URL,
} from "~/utils/navigation/url.constant";
import { ECOUTE_EMAIL } from "~/utils/mail/mail.constant";
import { copyToClipboard } from "~/utils/clipboard";

type UsefulLinkAction = {
  label: string;
  href?: string;
  copy?: () => void;
};

type UsefulLink = {
  emoji: string;
  description: string;
  actions: UsefulLinkAction[];
};

const configurationStore = useConfigurationStore();

onMounted(() => {
  if (!configurationStore.get(USEFUL_LINKS_KEY)) {
    configurationStore.fetch(USEFUL_LINKS_KEY);
  }
});

const calendarUrl = computed<string | undefined>(
  () => configurationStore.usefulLinks.googleCalendar,
);
const slackUrl = computed<string | undefined>(
  () => configurationStore.usefulLinks.slack,
);
const helplineUrl = computed<string | undefined>(
  () => configurationStore.usefulLinks.helpline,
);

const links = computed<UsefulLink[]>(() => {
  const calendar = calendarUrl.value;
  return [
    {
      emoji: "📚",
      description: "Le wiki du Club des 24 heures de l'INSA",
      actions: [{ label: "Wiki", href: WIKI_URL }],
    },
    {
      emoji: "🗺️",
      description: "La street view du festival",
      actions: [{ label: "OverView", href: OVERVIEW_URL }],
    },
    {
      emoji: "💌",
      description: "Un problème au sein de l'asso ? Contacte la cellule écoute",
      actions: [
        ...(helplineUrl.value
          ? [{ label: "Cellule écoute", href: helplineUrl.value }]
          : []),
        {
          label: ECOUTE_EMAIL,
          copy: () => copyToClipboard(ECOUTE_EMAIL, "Mail copié ✅"),
        },
      ],
    },
    ...(slackUrl.value
      ? [
          {
            emoji: "💬",
            description: "Rejoins le groupe Slack de l'asso",
            actions: [{ label: "Slack", href: slackUrl.value }],
          },
        ]
      : []),
    ...(calendar
      ? [
          {
            emoji: "📅",
            description: `Copie le lien du calendrier de la ${Edition.current}e édition pour ne rater aucun évènement important`,
            actions: [
              {
                label: "Google Calendar",
                copy: () => copyToClipboard(calendar, "Lien copié ✅"),
              },
            ],
          },
        ]
      : []),
    {
      emoji: "🕰️",
      description: "Overbookd tel qu'il était l'année dernière",
      actions: [{ label: "C'était mieux avant", href: CTMA_URL }],
    },
    {
      emoji: "🧪",
      description: "L'environnement de test d'Overbookd, viens tout casser !",
      actions: [{ label: "Preprod", href: PREPROD_URL }],
    },
  ];
});
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

.useful-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 8px;

  &__emoji {
    font-size: 1.4rem;
    flex-shrink: 0;
    width: 1.8rem;
    line-height: 1;
    text-align: center;
  }

  &__content {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    column-gap: 6px;
  }

  &__separator {
    opacity: 0.5;
  }

  &__title {
    font-weight: 600;
    text-decoration: none;
    overflow-wrap: anywhere;

    &:hover {
      text-decoration: underline;
    }
  }

  &__description {
    opacity: 0.7;
    font-size: 0.8rem;
  }
}
</style>
