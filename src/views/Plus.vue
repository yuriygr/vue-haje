<template>
  <n-header>{{ $t('plus.title') }}</n-header>
  <meta-info :items="metaItems" />

<spacer />

  <label class="plus-option" v-for="item in options" :key="`plus-option-${item.label}`">
    <n-checkbox :label="item.label" v-model="item.selected" :disabled="item.disabled" />
    <div class="plus-option__info">{{ item.info }}</div>
    <div class="plus-option__cost">{{ item.cost }} рублей в месяц</div>
  </label>

  <n-button :disabled="getTotal == 0" @click="submit">{{ $t('plus.total', { total: getTotal }) }}</n-button>
</template>

<script>
import { Placeholder, NHeader, NButton, Spacer } from '@vue-norma/ui'

export default {
  name: 'plus',
  components: { Placeholder,  NHeader, NButton, Spacer },
  meta() { return this.meta },
  data() {
    return {
      meta: {
        title: this.$t('plus.title')
      },

      options: [
        { label: "Ультра Мега Про План+", info: "Дает возможность редактировать чужие посты", cost: 5599.00, selected: false },
        { label: "Макси Про Убер+", info: "Открывает доступ к удивительному миру картинок", cost: 1599.00, selected: false },
        { label: "Про Убер+", info: "Будьте всегда в курсе событий с Уведомлениями", cost: 1499.00, selected: false },
        { label: "Про План+", info: "Заимейте полный контроль над своими комментариями", cost: 229.00, selected: false },
        { label: "Про+", info: "Особый бейджик \"Не Лох\"", cost: 149.00, selected: false },
        { label: "Про", info: "Фильтры в поиске", cost: 99.00, selected: false },
        { label: "Плюс", info: "Возможность покупки подписки", cost: 49.00, selected: false, disabled: true },
      ]
    }
  },
  computed: {
    getTotal() {
      const initialValue = 0.00;
      return this.options.filter(i => i.selected).reduce((total, item) => total + item.cost,
      initialValue)
    },
    metaItems() {
      let _result = []
      _result.push({ label: this.$t('plus.intro') })

      return _result
    },
  },
  methods: {
    submit() {
      alert("Вам необходима подписка Плюс для продолжения!")
    }
  }
}
</script>

<style lang="scss">
.plus-option {
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  &__info {
    font-size: 1.4rem;
    opacity: .7;
  }
  &__cost {
    font-size: 1.4rem;
    opacity: .7;
  }
}
</style>