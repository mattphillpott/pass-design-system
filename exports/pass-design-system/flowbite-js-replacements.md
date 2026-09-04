# What depended on Flowbite JS — and what to replace it with

Pass's UI kits never loaded `flowbite.js` — there is no Flowbite runtime in the project. Components were already hand-rolled.

But because you're consuming Flowbite-style class strings, the interactive behaviours that Flowbite's JS would have provided **need PrimeVue (unstyled) equivalents**. Here's the mapping.

| Flowbite JS behaviour            | Replace with (PrimeVue 4 unstyled)  | Class strings file in this export |
|----------------------------------|-------------------------------------|-----------------------------------|
| Dropdown / popover               | `<Popover>` or `<Menu>`              | `components/Menu.html`            |
| Modal / dialog                   | `<Dialog>` (modal)                   | `components/Dialog.html`          |
| Drawer / off-canvas              | `<Drawer>`                           | `components/Drawer.html`          |
| Tabs                             | `<Tabs>` + `<TabList>` + `<TabPanel>` | `components/Tabs.html`         |
| Tooltip                          | `v-tooltip` directive OR `<Tooltip>`  | `components/Tooltip.html`         |
| Toast                            | `<Toast>` + `useToast()`              | `components/Toast.html`           |
| Accordion / Collapse             | `<Accordion>` + `<AccordionPanel>`    | (use `<details>` for static)       |
| Dismiss (alert close)            | local `v-if` on `@click`              | `components/Alert.html`           |
| Tabs with arrow-key roving       | `<Tabs>`                              | `components/Tabs.html`            |
| Select (combobox)                | `<Select>` (unstyled)                 | `components/Select.html`          |
| Multiselect / Tag input          | `<MultiSelect>` / `<AutoComplete multiple>` | (skin per `Select.html`)     |
| Datepicker                       | `<DatePicker>` (unstyled)             | — (skin per `Input.html`)         |
| Carousel                         | `<Carousel>`                          | — (rare on Pass)                  |
| Stepper                          | `<Stepper>`                           | — (use Tabs styling)              |

## How to wire PrimeVue 4 unstyled in Nuxt 3

`nuxt.config.ts`:

```ts
modules: ['@primevue/nuxt-module'],
primevue: {
  options: { unstyled: true },
  // OR pass our default pass-through to every component:
  importPT: { from: '~/primevue/pass-preset.ts' },
}
```

`primevue/pass-preset.ts` returns a Pass-tinted preset that points each component slot at the class strings in this export. For most teams, **inline `:pt`** is faster to start with — wrap and roll up shared bits once patterns repeat.

```vue
<Button :pt="{
  root: { class: 'inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-[3px] focus-visible:ring-primary-600/25' }
}">
  Book a demo
</Button>
```

## What you DON'T need PrimeVue for

These are static markup — no library:

- **Button** (native `<button>`)
- **Input / Textarea / Checkbox / Radio / Switch** (native form controls + `peer` + `:has()`)
- **Card**
- **Badge / Alert**
- **Avatar**
- **Table** (static; bring TanStack Table only if you need sorting/virtualisation)
- **Pagination** (logic in your store; markup is static)
- **Breadcrumb**
- **Nav** (top bar + sidebar; static `<header>` / `<aside>`)
- **Tooltip** (pure-CSS for hover-only; PrimeVue for keyboard + portal)

That's the bulk of the kit — you only reach for PrimeVue on overlays + complex form widgets.
