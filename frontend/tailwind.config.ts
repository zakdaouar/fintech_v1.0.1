import type { Config } from 'tailwindcss'


const config: Config = {


  content: ['./pages/**/*.{js,ts,jsx,tsx}','./components/**/*.{js,ts,jsx,tsx}'],


  theme: {


    extend: {


      colors: {


        brand: {


          DEFAULT: '#10b981',


          dark: '#059669',


          light: '#34d399'


        }


      }


    }


  },


  plugins: []


}


export default config