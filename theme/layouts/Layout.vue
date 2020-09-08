<template>
  <div class="theme-container">
    <div class="navigation">
      <RouterLink to="/">🍌 Spencer's Wiki</RouterLink>
    </div>

    <Content />
  </div>
</template>

<script>
import Page from '@theme/components/Page.vue'

export default {
  name: 'Layout',

  components: {
    Page,
  },
}
</script>

<style lang="stylus" scoped>
@require '../styles/config.styl'
@require '../styles/typography.styl'

.navigation
  padding 0.5em 1em
  border-radius 0.5em
  background-color lighten($accentColor, 97%)

  a
    font-family $monospaceFont
    font-size 1.1em
    line-height 1.5
</style>
