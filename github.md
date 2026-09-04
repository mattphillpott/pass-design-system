repo: MathsMadeEasy/mme-wp
branch: main
path: packages/pfs-exam-management, packages/mme-core, packages/complete-tuition-theme/templates/pfs

## Last sync
date: 2026-08-25T15:15:54Z

### Updated in this project
- Traced the real product-page buy box: a WooCommerce Composite Product in `mme-core`, not variation attributes — corrected C8-A's implementation claims accordingly.
- Confirmed each selection resolves to a separate product via `_aem_product_type`, so a basket holds several line items.
- Confirmed the option controls are already a segmented radio row (`options-radio-buttons.php`) and that calendar-on-load is an existing ACF toggle.
- Confirmed invigilation type is restricted per awarding body, and that TQUK is assumed for remote and Open Awards for human invigilation.
- Confirmed Fast Track results are a separately purchased upsell, not the baseline turnaround the live page implies.

## Screen map
| Project screen | Repo files |
| --- | --- |
| C8-A — step rows and option controls | packages/mme-core/src/Classes/Templates/woocommerce/single-product/js/options-radio-buttons.php, single-product/component-single-page.php, single-product/add-to-cart/composite.php |
| C8-A — implementation notes | packages/mme-core/src/Classes/Templates/woocommerce/single-product/component-title.php, component-description.php, composite-add-to-cart.php |
| C1–C8 — product model and line items | packages/pfs-exam-management/src/Classes/WooCommerce.php |
| C1–C8 — enforcers (places left, countdown) | packages/mme-core/src/Utils/Subscriber/SaleEvent/partials/single-product/product-sale-spaces.php, product-sale-countdown.php |
| C3, C7, C8-A — result dates and working-day maths | packages/pfs-exam-management/src/Classes/BusinessLogic.php |
| C1–C8 — results turnaround and Fast Track upsell | packages/pfs-exam-management/src/Utils/partials/exam/result-speed.php |
| C1–C8 — invigilation constraint per awarding body | packages/pfs-exam-management/src/Services/ExamValidator.php |
| All concepts — page chrome (topbar, nav, cart, login) | packages/complete-tuition-theme/templates/pfs/template-parts/header/partial-topbar.php, partial-navbar.php, partial-nav_buttons.php |
| All concepts — brand marks | packages/complete-tuition-theme/src/img/exam-boards/, src/img/logos/, src/img/cards/ |
| PFS CRO Strategy.html — post-purchase date booking | packages/pfs-exam-management/src/Utils/partials/exam/exam-date.php, course-option.php |

## Sync history
- 2026-08-25T13:50:52Z — imported brand marks (Open Awards, City & Guilds, Trustpilot, Klarna, Clearpay, PayPal); rebuilt page chrome from the header partials.
- 2026-08-25T13:36:44Z — first read of the PFS exam booking engine to ground the redesign in real constraints.
