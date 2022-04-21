import { defineComponent, h, onMounted, ref } from 'vue-demi'
import { defineQuestion, useSchemaOrg } from 'vueuse-schema-org'

export interface UseQuestionProps {
  as?: string
  question?: string
  answer?: string
}

export const SchemaOrgQuestion = defineComponent<UseQuestionProps>({
  name: 'SchemaOrgQuestion',
  props: [
    'as',
    'question',
    'answer',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const target = ref()
    const question = ref()
    const answer = ref()

    onMounted(() => {
      useSchemaOrg([
        defineQuestion({
          // @todo escape
          name: question.value.innerText.trim(),
          acceptedAnswer: answer.value.innerText.trim(),
        }),
      ])
    })

    return () => {
      return h(props.as || 'div', { ref: target }, [
        slots.default ? slots.default({ props }) : null,
        h(props.as || 'div', { ref: question }, [slots.question ? slots.question({ props }) : null]),
        h(props.as || 'div', { ref: answer }, [slots.answer ? slots.answer({ props }) : null]),
      ])
    }
  },
})