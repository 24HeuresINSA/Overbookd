import { __VLS_internalComponent, __VLS_componentsOption, __VLS_name } from "./AskRejectReasonFormCard.vue";

function __VLS_template() {
let __VLS_ctx!: InstanceType<__VLS_PickNotAny<typeof __VLS_internalComponent, new () => {}>> & {};
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_internalComponent extends { components: infer C; } ? C : {}> & typeof __VLS_componentsOption;
let __VLS_own!: __VLS_SelfComponent<typeof __VLS_name, typeof __VLS_internalComponent & (new () => { $slots: typeof __VLS_slots; })>;
let __VLS_localComponents!: typeof __VLS_otherComponents & Omit<typeof __VLS_own, keyof typeof __VLS_otherComponents>;
let __VLS_components!: typeof __VLS_localComponents & __VLS_GlobalComponents & typeof __VLS_ctx;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
/* CSS variable injection end */
let __VLS_resolvedLocalAndGlobalComponents!: {} &
__VLS_WithComponent<'VCard', typeof __VLS_localComponents, "VCard", "vCard", "v-card"> &
__VLS_WithComponent<'VBtn', typeof __VLS_localComponents, "VBtn", "vBtn", "v-btn"> &
__VLS_WithComponent<'VIcon', typeof __VLS_localComponents, "VIcon", "vIcon", "v-icon">;
__VLS_components.VCard; __VLS_components.VCard; __VLS_components.vCard; __VLS_components.vCard; __VLS_components["v-card"]; __VLS_components["v-card"];
// @ts-ignore
[VCard, VCard,];
__VLS_components.VBtn; __VLS_components.VBtn; __VLS_components.vBtn; __VLS_components.vBtn; __VLS_components["v-btn"]; __VLS_components["v-btn"];
// @ts-ignore
[VBtn, VBtn,];
__VLS_components.VIcon; __VLS_components.VIcon; __VLS_components.vIcon; __VLS_components.vIcon; __VLS_components["v-icon"]; __VLS_components["v-icon"];
// @ts-ignore
[VIcon, VIcon,];
{
const __VLS_0 = ({} as 'VCard' extends keyof typeof __VLS_ctx ? { 'VCard': typeof __VLS_ctx.VCard; } : 'vCard' extends keyof typeof __VLS_ctx ? { 'VCard': typeof __VLS_ctx.vCard; } : 'v-card' extends keyof typeof __VLS_ctx ? { 'VCard': (typeof __VLS_ctx)["v-card"]; } : typeof __VLS_resolvedLocalAndGlobalComponents).VCard;
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ ...{}, class: ("public-activity-card"), }));
({} as { VCard: typeof __VLS_0; }).VCard;
({} as { VCard: typeof __VLS_0; }).VCard;
const __VLS_2 = __VLS_1({ ...{}, class: ("public-activity-card"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_0, typeof __VLS_2> & Record<string, unknown>) => void)({ ...{}, class: ("public-activity-card"), });
const __VLS_3 = __VLS_pickFunctionalComponentCtx(__VLS_0, __VLS_2)!;
let __VLS_4!: __VLS_NormalizeEmits<typeof __VLS_3.emit>;
{
const __VLS_5 = ({} as 'VBtn' extends keyof typeof __VLS_ctx ? { 'VBtn': typeof __VLS_ctx.VBtn; } : 'vBtn' extends keyof typeof __VLS_ctx ? { 'VBtn': typeof __VLS_ctx.vBtn; } : 'v-btn' extends keyof typeof __VLS_ctx ? { 'VBtn': (typeof __VLS_ctx)["v-btn"]; } : typeof __VLS_resolvedLocalAndGlobalComponents).VBtn;
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({ ...{ onClick: {} as any, }, class: ("public-activity-card__close-btn"), icon: (true), }));
({} as { VBtn: typeof __VLS_5; }).VBtn;
({} as { VBtn: typeof __VLS_5; }).VBtn;
const __VLS_7 = __VLS_6({ ...{ onClick: {} as any, }, class: ("public-activity-card__close-btn"), icon: (true), }, ...__VLS_functionalComponentArgsRest(__VLS_6));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_5, typeof __VLS_7> & Record<string, unknown>) => void)({ ...{ onClick: {} as any, }, class: ("public-activity-card__close-btn"), icon: (true), });
const __VLS_8 = __VLS_pickFunctionalComponentCtx(__VLS_5, __VLS_7)!;
let __VLS_9!: __VLS_NormalizeEmits<typeof __VLS_8.emit>;
let __VLS_10 = { 'click': __VLS_pickEvent(__VLS_9['click'], ({} as __VLS_FunctionalComponentProps<typeof __VLS_6, typeof __VLS_7>).onClick) };
__VLS_10 = { click: (__VLS_ctx.closeDialog) };
{
const __VLS_11 = ({} as 'VIcon' extends keyof typeof __VLS_ctx ? { 'VIcon': typeof __VLS_ctx.VIcon; } : 'vIcon' extends keyof typeof __VLS_ctx ? { 'VIcon': typeof __VLS_ctx.vIcon; } : 'v-icon' extends keyof typeof __VLS_ctx ? { 'VIcon': (typeof __VLS_ctx)["v-icon"]; } : typeof __VLS_resolvedLocalAndGlobalComponents).VIcon;
const __VLS_12 = __VLS_asFunctionalComponent(__VLS_11, new __VLS_11({ ...{}, }));
({} as { VIcon: typeof __VLS_11; }).VIcon;
({} as { VIcon: typeof __VLS_11; }).VIcon;
const __VLS_13 = __VLS_12({ ...{}, }, ...__VLS_functionalComponentArgsRest(__VLS_12));
({} as (props: __VLS_FunctionalComponentProps<typeof __VLS_11, typeof __VLS_13> & Record<string, unknown>) => void)({ ...{}, });
const __VLS_14 = __VLS_pickFunctionalComponentCtx(__VLS_11, __VLS_13)!;
let __VLS_15!: __VLS_NormalizeEmits<typeof __VLS_14.emit>;
(__VLS_14.slots!).default;
}
(__VLS_8.slots!).default;
}
(__VLS_3.slots!).default;
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
var __VLS_slots!: {};
// @ts-ignore
[closeDialog,];
return __VLS_slots;
}
