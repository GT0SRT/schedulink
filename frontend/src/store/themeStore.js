import { create } from 'zustand'

const themeStore = create((set) => ({
  dark: false,
  setDark: (value) => set({ dark: value }),
}))

export default themeStore