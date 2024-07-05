import { shallowMount } from '@vue/test-utils'
import TripList from '@/components/TripList.vue'

describe('TripList.vue', () => {
  it('fetches trips on created hook', async () => {
    const wrapper = shallowMount(TripList)
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.trips).toEqual(expect.any(Array))
  })
})
