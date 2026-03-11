import { initHover } from "../modules/hover.js";
import { initScrollTop } from "../modules/scrollTop.js";
import { initAuth } from "../modules/auth.js";
import { initModal } from "../modules/modals.js";
import { initFAQ } from "../modules/faq.js";
import { initSupport } from "../modules/support.js";
import { initDonate } from "../modules/donate.js";
import { initTelegram } from "../modules/telegram.js";
import { initCopyList } from "../modules/copyNotice.js";
import { initCustomCursor } from "../modules/customCursor.js";
import { initTitleAnimation } from "../modules/titleAnimation.js";
import { initProfile } from "../modules/profile.js";

initHover();
initScrollTop();
initProfile();
initAuth();
initModal("aboutUsLink", "aboutModal", "closeAboutModal");
initFAQ();
initSupport();
initDonate();
initTelegram();
initCopyList();
initCustomCursor();
initTitleAnimation();

console.log("App initialized");