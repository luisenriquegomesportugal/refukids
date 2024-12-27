import { ColorSchemeName } from "react-native"

type Color = {
  text: string
  background: string
  tint: string
  tabIconDefault: string
  tabIconSelected: string
}

type Theme = Record<Exclude<ColorSchemeName, null | undefined>, Color>;

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#F54244',
    tabIconDefault: '#ccc',
    tabIconSelected: '#F54244',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#F54244',
    tabIconDefault: '#ccc',
    tabIconSelected: '#F54244',
  },
} as Theme;
