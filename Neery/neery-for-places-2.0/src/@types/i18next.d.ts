import "i18next";
import land from "../../public/locales/en/land.json";
import tags from "../../public/locales/en/tags.json";
import translation from "../../public/locales/en/translation.json";
import portalNavbar from "../../public/locales/en/portal/navbar.json";
import portalCalendar from "../../public/locales/en/portal/calendar.json";
import portalSettingsNavbar from "../../public/locales/en/portal/settings/navbar.json";
import portalSettingsProfile from "../../public/locales/en/portal/settings/profile.json";
import portalSettingsImages from "../../public/locales/en/portal/settings/images.json";
import portalSettingsReservation from "../../public/locales/en/portal/settings/reservation.json";
import portalSettingsTables from "../../public/locales/en/portal/settings/tables.json";
import portalSettingsMenu from "../../public/locales/en/portal/settings/menu.json";
import portalSettingsLunchMenu from "../../public/locales/en/portal/settings/lunchMenu.json";
import portalSettingsCalls from "../../public/locales/en/portal/settings/calls.json";
import portalSettingsSubscription from "../../public/locales/en/portal/settings/subscription.json";
import portalSettingsAccessControl from "../../public/locales/en/portal/settings/access.json";
import portalReviews from "../../public/locales/en/portal/reviews.json";
import portalReviewsReply from "../../public/locales/en/portal/reviews/reply.json";
import portalCustomers from "../../public/locales/en/portal/customers.json";
import portalCalls from "../../public/locales/en/portal/calls.json";
import portalStatistics from "../../public/locales/en/portal/statistics.json"
import portalCreate from "../../public/locales/en/portal/create.json";
import portalCreateBasics from "../../public/locales/en/portal/create/basics.json";
import portalCreateUseful1 from "../../public/locales/en/portal/create/useful1.json";
import portalCreateUseful2 from "../../public/locales/en/portal/create/useful2.json";
import portalCreateReservation from "../../public/locales/en/portal/create/reservation.json";
import manageReservation from "../../public/locales/en/manage/reservation.json";
import landingAuth from "../../public/locales/en/landing/auth.json";
import portalSettingsAppearance from "../../public/locales/en/portal/settings/appearance.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      land: typeof land,
      tags: typeof tags,
      translation: typeof translation,
      "portal/navbar": typeof portalNavbar,
      "portal/settings/navbar": typeof portalSettingsNavbar,
      "portal/calendar" : typeof portalCalendar,
      "portal/settings/profile": typeof portalSettingsProfile,
      "portal/settings/images": typeof portalSettingsImages,
      "portal/settings/reservation": typeof portalSettingsReservation,
      "portal/settings/tables": typeof portalSettingsTables,
      "portal/settings/menu": typeof portalSettingsMenu,
      "portal/settings/lunchMenu": typeof portalSettingsLunchMenu,
      "portal/settings/calls": typeof portalSettingsCalls,
      "portal/settings/subscription": typeof portalSettingsSubscription,
      "portal/settings/access": typeof portalSettingsAccessControl,
      "portal/reviews": typeof portalReviews,
      "portal/reviews/reply": typeof portalReviewsReply,
      "portal/customers": typeof portalCustomers,
      "portal/calls": typeof portalCalls,
      "portal/statisctics": typeof portalStatistics,
      "portal/create": typeof portalCreate,
      "portal/create/basics": typeof portalCreateBasics,
      "portal/create/useful1": typeof portalCreateUseful1,
      "portal/create/useful2": typeof portalCreateUseful2,
      "portal/create/reservation": typeof portalCreateReservation,
      "manage/reservation": typeof manageReservation,
      "landing/auth": typeof landingAuth,
      "portal/settings/appearance": typeof portalSettingsAppearance,
    };
    defaultValue: "?";
  }

  type TranslationKeys = string;
}
