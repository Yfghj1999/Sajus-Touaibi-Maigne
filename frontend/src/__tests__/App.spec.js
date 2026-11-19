import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('affiche la navigation', () => {
    const wrapper = mount(App, { global: { plugins: [router] } })
    expect(wrapper.text()).toContain('Accueil')
  })
})
