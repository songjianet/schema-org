<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Vitesse',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
  ],
})

useSchemaOrg([
  defineWebSite({
    name: 'Vitesse',
  }),
  defineOrganization({
    name: 'Vitesse',
    logo: '/logo.png',
  }),
  defineWebPagePartial(),

  defineBreadcrumb({
    itemListElement: [
      {
        position: 1,
        name: 'Harlan\'s Hamburgers',
      },
    ],
  }),
])
</script>

<template>
<div class="flex w-full container mx-auto">
  <RouterView class="w-full" />
  <SchemaOrgInspector class="w-1200px mt-15" />
</div>
</template>
