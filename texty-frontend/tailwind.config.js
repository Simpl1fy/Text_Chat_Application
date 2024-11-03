/** @type {import('tailwindcss').Config} */

import withMT from '@material-tailwind/react/utils/withMT';
import { sky, slate, stone, zinc } from 'tailwindcss/colors'

export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: slate,
        stone: stone,
        zinc: zinc,
        sky: sky,
      }
    },
  },
  plugins: [],
})