# Frontend Bundle For ChatGPT

This bundle contains the frontend source and config files from the project.

Omitted on purpose:
- `frontend/node_modules/` (generated dependencies)
- `frontend/dist/` (build output)
- `frontend/package-lock.json` (large generated lockfile)
- `frontend/src/assets/hero.png` (binary image asset)

## frontend\.gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

## frontend\README.md

```
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
```

## frontend\package.json

```
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.14.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "recharts": "^3.8.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.4",
    "@tailwindcss/vite": "^4.2.2",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "eslint": "^9.39.4",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.4.0",
    "tailwindcss": "^4.2.2",
    "vite": "^8.0.4"
  }
}
```

## frontend\eslint.config.js

```
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
```

## frontend\index.html

```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>frontend</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## frontend\tailwind.config.js

```
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        text: "var(--text)",
        "text-h": "var(--text-h)",
        bg: "var(--bg)",
        border: "var(--border)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [],
};
```

## frontend\vite.config.js

```
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

## frontend\public\favicon.svg

```
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="46" fill="none" viewBox="0 0 48 46"><path fill="#863bff" d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z" style="fill:#863bff;fill:color(display-p3 .5252 .23 1);fill-opacity:1"/><mask id="a" width="48" height="46" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M25.842 44.938c-.664.844-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.183c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.498 0-3.579-1.842-3.579H1.133c-.92 0-1.456-1.04-.92-1.787L9.91.473c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.578 1.842 3.578h11.377c.943 0 1.473 1.088.89 1.832L25.843 44.94z" style="fill:#000;fill-opacity:1"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#ede6ff" rx="5.508" ry="14.704" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -4.47 31.516)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#ede6ff" rx="10.399" ry="29.851" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -39.328 7.883)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#7e14ff" rx="5.508" ry="30.487" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -25.913 -14.639)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.814 -32.644 -3.334)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#7e14ff" rx="5.508" ry="30.599" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="matrix(.00324 1 1 -.00324 -34.34 30.47)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#ede6ff" rx="14.072" ry="22.078" style="fill:#ede6ff;fill:color(display-p3 .9275 .9033 1);fill-opacity:1" transform="rotate(93.35 24.506 48.493)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#7e14ff" rx="3.47" ry="21.501" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(89.009 28.708 47.59)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx=".387" cy="8.972" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(39.51 .387 8.972)"/></g><g filter="url(#k)"><ellipse cx="47.523" cy="-6.092" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 47.523 -6.092)"/></g><g filter="url(#l)"><ellipse cx="41.412" cy="6.333" fill="#47bfff" rx="5.971" ry="9.665" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 41.412 6.333)"/></g><g filter="url(#m)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#n)"><ellipse cx="-1.879" cy="38.332" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 -1.88 38.332)"/></g><g filter="url(#o)"><ellipse cx="35.651" cy="29.907" fill="#7e14ff" rx="4.407" ry="29.108" style="fill:#7e14ff;fill:color(display-p3 .4922 .0767 1);fill-opacity:1" transform="rotate(37.892 35.651 29.907)"/></g><g filter="url(#p)"><ellipse cx="38.418" cy="32.4" fill="#47bfff" rx="5.971" ry="15.297" style="fill:#47bfff;fill:color(display-p3 .2799 .748 1);fill-opacity:1" transform="rotate(37.892 38.418 32.4)"/></g></g><defs><filter id="b" width="60.045" height="41.654" x="-19.77" y="16.149" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-54.613" y="-7.533" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-49.64" y="2.03" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-45.045" y="20.029" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-43.513" y="21.178" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="15.756" y="-17.901" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="23.548" y="2.284" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-27.636" y="-22.853" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="20.116" y="-38.415" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="24.641" y="-11.323" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-29.286" y="6.009" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="8.244" y="-2.416" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="18.713" y="10.588" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17158" stdDeviation="4.596"/></filter></defs></svg>
```

## frontend\public\icons.svg

```
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="bluesky-icon" viewBox="0 0 16 17">
    <g clip-path="url(#bluesky-clip)"><path fill="#08060d" d="M7.75 7.735c-.693-1.348-2.58-3.86-4.334-5.097-1.68-1.187-2.32-.981-2.74-.79C.188 2.065.1 2.812.1 3.251s.241 3.602.398 4.13c.52 1.744 2.367 2.333 4.07 2.145-2.495.37-4.71 1.278-1.805 4.512 3.196 3.309 4.38-.71 4.987-2.746.608 2.036 1.307 5.91 4.93 2.746 2.72-2.746.747-4.143-1.747-4.512 1.702.189 3.55-.4 4.07-2.145.156-.528.397-3.691.397-4.13s-.088-1.186-.575-1.406c-.42-.19-1.06-.395-2.741.79-1.755 1.24-3.64 3.752-4.334 5.099"/></g>
    <defs><clipPath id="bluesky-clip"><path fill="#fff" d="M.1.85h15.3v15.3H.1z"/></clipPath></defs>
  </symbol>
  <symbol id="discord-icon" viewBox="0 0 20 19">
    <path fill="#08060d" d="M16.224 3.768a14.5 14.5 0 0 0-3.67-1.153c-.158.286-.343.67-.47.976a13.5 13.5 0 0 0-4.067 0c-.128-.306-.317-.69-.476-.976A14.4 14.4 0 0 0 3.868 3.77C1.546 7.28.916 10.703 1.231 14.077a14.7 14.7 0 0 0 4.5 2.306q.545-.748.965-1.587a9.5 9.5 0 0 1-1.518-.74q.191-.14.372-.293c2.927 1.369 6.107 1.369 8.999 0q.183.152.372.294-.723.437-1.52.74.418.838.963 1.588a14.6 14.6 0 0 0 4.504-2.308c.37-3.911-.63-7.302-2.644-10.309m-9.13 8.234c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.894 0 1.614.82 1.599 1.82.001 1-.705 1.82-1.6 1.82m5.91 0c-.878 0-1.599-.82-1.599-1.82 0-.998.705-1.82 1.6-1.82.893 0 1.614.82 1.599 1.82 0 1-.706 1.82-1.6 1.82"/>
  </symbol>
  <symbol id="documentation-icon" viewBox="0 0 21 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="m15.5 13.333 1.533 1.322c.645.555.967.833.967 1.178s-.322.623-.967 1.179L15.5 18.333m-3.333-5-1.534 1.322c-.644.555-.966.833-.966 1.178s.322.623.966 1.179l1.534 1.321"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M17.167 10.836v-4.32c0-1.41 0-2.117-.224-2.68-.359-.906-1.118-1.621-2.08-1.96-.599-.21-1.349-.21-2.848-.21-2.623 0-3.935 0-4.983.369-1.684.591-3.013 1.842-3.641 3.428C3 6.449 3 7.684 3 10.154v2.122c0 2.558 0 3.838.706 4.726q.306.383.713.671c.76.536 1.79.64 3.581.66"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M3 10a2.78 2.78 0 0 1 2.778-2.778c.555 0 1.209.097 1.748-.047.48-.129.854-.503.982-.982.145-.54.048-1.194.048-1.749a2.78 2.78 0 0 1 2.777-2.777"/>
  </symbol>
  <symbol id="github-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clip-rule="evenodd"/>
  </symbol>
  <symbol id="social-icon" viewBox="0 0 20 20">
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M12.5 6.667a4.167 4.167 0 1 0-8.334 0 4.167 4.167 0 0 0 8.334 0"/>
    <path fill="none" stroke="#aa3bff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.35" d="M2.5 16.667a5.833 5.833 0 0 1 8.75-5.053m3.837.474.513 1.035c.07.144.257.282.414.309l.93.155c.596.1.736.536.307.965l-.723.73a.64.64 0 0 0-.152.531l.207.903c.164.715-.213.991-.84.618l-.872-.52a.63.63 0 0 0-.577 0l-.872.52c-.624.373-1.003.094-.84-.618l.207-.903a.64.64 0 0 0-.152-.532l-.723-.729c-.426-.43-.289-.864.306-.964l.93-.156a.64.64 0 0 0 .412-.31l.513-1.034c.28-.562.735-.562 1.012 0"/>
  </symbol>
  <symbol id="x-icon" viewBox="0 0 19 19">
    <path fill="#08060d" fill-rule="evenodd" d="M1.893 1.98c.052.072 1.245 1.769 2.653 3.77l2.892 4.114c.183.261.333.48.333.486s-.068.089-.152.183l-.522.593-.765.867-3.597 4.087c-.375.426-.734.834-.798.905a1 1 0 0 0-.118.148c0 .01.236.017.664.017h.663l.729-.83c.4-.457.796-.906.879-.999a692 692 0 0 0 1.794-2.038c.034-.037.301-.34.594-.675l.551-.624.345-.392a7 7 0 0 1 .34-.374c.006 0 .93 1.306 2.052 2.903l2.084 2.965.045.063h2.275c1.87 0 2.273-.003 2.266-.021-.008-.02-1.098-1.572-3.894-5.547-2.013-2.862-2.28-3.246-2.273-3.266.008-.019.282-.332 2.085-2.38l2-2.274 1.567-1.782c.022-.028-.016-.03-.65-.03h-.674l-.3.342a871 871 0 0 1-1.782 2.025c-.067.075-.405.458-.75.852a100 100 0 0 1-.803.91c-.148.172-.299.344-.99 1.127-.304.343-.32.358-.345.327-.015-.019-.904-1.282-1.976-2.808L6.365 1.85H1.8zm1.782.91 8.078 11.294c.772 1.08 1.413 1.973 1.425 1.984.016.017.241.02 1.05.017l1.03-.004-2.694-3.766L7.796 5.75 5.722 2.852l-1.039-.004-1.039-.004z" clip-rule="evenodd"/>
  </symbol>
</svg>
```

## frontend\src\main.jsx

```
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

## frontend\src\App.jsx

```
import { useEffect, useMemo, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TopNav from "./components/TopNav.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Alerts from "./pages/Alerts.jsx";
import Logs from "./pages/Logs.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import { fetchAnalysis, fetchLogs, fetchSummary } from "./services/api.js";
import { matchesDate, matchesQuery } from "./utils/threat.js";

const PAGE_META = {
  dashboard: {
    title: "Threat Intelligence Control Center",
    description:
      "Executive overview of live incidents, security posture, and operational risk.",
  },
  alerts: {
    title: "Alerts Workspace",
    description:
      "Review escalations, inspect severity, and isolate suspicious IP activity.",
  },
  logs: {
    title: "Activity Ledger",
    description:
      "Inspect authentication traffic, server events, and user-level activity trails.",
  },
  analytics: {
    title: "Threat Analytics",
    description:
      "Track attack movement, event distribution, and behavior patterns over time.",
  },
  settings: {
    title: "Workspace Settings",
    description:
      "Manage operational preferences and keep the monitoring environment aligned.",
  },
};

const MOBILE_NAV_ITEMS = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Alerts", key: "alerts" },
  { label: "Logs", key: "logs" },
  { label: "Analytics", key: "analytics" },
  { label: "Settings", key: "settings" },
];

export default function App() {
  const [summary, setSummary] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    let active = true;

    const loadAppData = async () => {
      setLoading(true);
      setError("");

      try {
        const [summaryData, alertsData, logsData] = await Promise.all([
          fetchSummary(),
          fetchAnalysis(),
          fetchLogs(),
        ]);

        if (!active) {
          return;
        }

        setSummary(summaryData);
        setAlerts(alertsData);
        setLogs(logsData);
      } catch (loadError) {
        console.error("Failed to load application data:", loadError);
        if (active) {
          setError("We could not load the dashboard data. Please try again.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAppData();

    return () => {
      active = false;
    };
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const queryMatches = matchesQuery(
        [log.timestamp, log.ip, log.event_type, log.status, log.username],
        searchQuery,
      );
      const dateMatches = matchesDate(log.timestamp, selectedDate);
      return queryMatches && dateMatches;
    });
  }, [logs, searchQuery, selectedDate]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) =>
      matchesQuery(
        [alert.type, alert.ip, alert.summary, alert.severity],
        searchQuery,
      ),
    );
  }, [alerts, searchQuery]);

  const highThreatCount = useMemo(
    () => filteredAlerts.filter((alert) => alert.severity === "High").length,
    [filteredAlerts],
  );

  const uniqueIps = useMemo(
    () => new Set(filteredLogs.map((log) => log.ip).filter(Boolean)).size,
    [filteredLogs],
  );

  const successfulEvents = useMemo(
    () => filteredLogs.filter((log) => log.status === "success").length,
    [filteredLogs],
  );

  const postureScore = filteredLogs.length
    ? Math.round((successfulEvents / filteredLogs.length) * 100)
    : 100;

  const lastUpdated =
    filteredLogs[0]?.timestamp || logs[0]?.timestamp || "Live feed";

  const pageMeta = PAGE_META[activePage] || PAGE_META.dashboard;

  const retry = () => {
    setLoading(true);
    setError("");
    Promise.all([fetchSummary(), fetchAnalysis(), fetchLogs()])
      .then(([summaryData, alertsData, logsData]) => {
        setSummary(summaryData);
        setAlerts(alertsData);
        setLogs(logsData);
      })
      .catch((retryError) => {
        console.error("Retry failed:", retryError);
        setError("We could not load the dashboard data. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  const sharedPageProps = {
    summary,
    alerts: filteredAlerts,
    logs: filteredLogs,
    loading,
    onNavigate: setActivePage,
  };

  const renderPage = () => {
    if (activePage === "alerts") {
      return <Alerts alerts={filteredAlerts} loading={loading} />;
    }

    if (activePage === "logs") {
      return <Logs logs={filteredLogs} loading={loading} />;
    }

    if (activePage === "analytics") {
      return <Analytics logs={filteredLogs} loading={loading} />;
    }

    if (activePage === "settings") {
      return <Settings />;
    }

    return <Dashboard {...sharedPageProps} />;
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 text-slate-100 md:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-1/2 top-0 h-[360px] w-[560px] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute -right-16 top-48 h-[320px] w-[320px] rounded-full bg-amber-300/8 blur-3xl" />
        <div className="absolute -left-20 bottom-16 h-[280px] w-[280px] rounded-full bg-emerald-300/8 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[1600px] gap-5">
        <Sidebar
          activeSection={activePage}
          onNavigate={setActivePage}
          postureScore={postureScore}
          totalAlerts={summary?.total_alerts ?? 0}
          highThreatCount={summary?.high_threats ?? 0}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-5 overflow-y-auto pb-6 pr-1">
          <TopNav
            pageTitle={pageMeta.title}
            pageDescription={pageMeta.description}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            highThreatCount={highThreatCount}
            uniqueIps={uniqueIps}
            lastUpdated={lastUpdated}
          />

          <div className="flex gap-2 overflow-x-auto pb-1 xl:hidden">
            {MOBILE_NAV_ITEMS.map((item) => {
              const isActive = activePage === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActivePage(item.key)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-cyan-300/20 bg-cyan-300/12 text-cyan-100"
                      : "border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {error ? (
            <div className="rounded-[24px] border border-red-400/20 bg-red-500/10 px-4 py-4 text-sm text-red-100 shadow-[0_20px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={retry}
                  className="self-start rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-400"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : null}

          {renderPage()}
        </div>
      </div>
    </main>
  );
}
```

## frontend\src\index.css

```
@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap");
@import "tailwindcss";

:root {
  --text: #becadb;
  --text-h: #f7f9fc;
  --bg: #07131d;
  --panel: rgba(9, 18, 29, 0.8);
  --panel-strong: rgba(7, 14, 24, 0.92);
  --border: rgba(226, 232, 240, 0.12);
  --accent: #62d6c7;
  --accent-strong: #8df0bf;
  --highlight: #f7b267;
  --danger: #ff7d7d;
  --shadow:
    0 30px 90px rgba(2, 8, 23, 0.35),
    0 6px 20px rgba(2, 8, 23, 0.22);

  --sans: "Manrope", "Segoe UI", sans-serif;
  --heading: "Space Grotesk", "Segoe UI", sans-serif;
  --mono: ui-monospace, SFMono-Regular, Consolas, monospace;

  font: 16px/150% var(--sans);
  letter-spacing: 0.01em;
  color-scheme: dark;
  color: var(--text);
  background:
    radial-gradient(circle at top left, rgba(99, 211, 255, 0.16), transparent 28%),
    radial-gradient(circle at 85% 10%, rgba(247, 178, 103, 0.12), transparent 22%),
    radial-gradient(circle at 50% 120%, rgba(98, 214, 199, 0.12), transparent 30%),
    linear-gradient(180deg, #0b1620 0%, #07111a 50%, #050b12 100%);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(99, 211, 255, 0.16), transparent 28%),
    radial-gradient(circle at 85% 10%, rgba(247, 178, 103, 0.12), transparent 22%),
    radial-gradient(circle at 50% 120%, rgba(98, 214, 199, 0.12), transparent 30%),
    linear-gradient(180deg, #0b1620 0%, #07111a 50%, #050b12 100%);
  color: var(--text);
  font-family: var(--sans);
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 120px 120px;
  mask-image: radial-gradient(circle at center, black 32%, transparent 84%);
  opacity: 0.3;
}

::selection {
  background: rgba(98, 214, 199, 0.3);
  color: white;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--text-h);
  font-family: var(--heading);
  letter-spacing: -0.03em;
}

button,
input,
select,
textarea {
  font: inherit;
}

#root {
  min-height: 100svh;
  isolation: isolate;
}

.scrollbar-hidden {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}
```

## frontend\src\services\api.js

```
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "/api",
});

export const fetchLogs = async () => {
  const response = await api.get("/logs");
  return response.data.logs;
};

export const fetchAnalysis = async () => {
  const response = await api.get("/analyze");
  return response.data.alerts;
};

export const fetchSummary = async () => {
  const response = await api.get("/summary");
  return response.data.summary;
};

export default api;
```

## frontend\src\utils\threat.js

```
export function matchesQuery(values, query) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return values
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(normalized));
}

export function matchesDate(timestamp, selectedDate) {
  if (!selectedDate) {
    return true;
  }

  return String(timestamp || "").startsWith(selectedDate);
}

export function getSeverityCounts(alerts = []) {
  return alerts.reduce(
    (accumulator, alert) => {
      const severity = alert.severity || "Low";
      accumulator[severity] = (accumulator[severity] || 0) + 1;
      return accumulator;
    },
    { High: 0, Medium: 0, Low: 0 },
  );
}

export function getTrendData(logs = []) {
  const counts = new Map();

  logs.forEach((log) => {
    const timestamp = String(log.timestamp || "");
    const label = timestamp.slice(11, 16) || timestamp.slice(0, 10) || "Now";
    const isAlert =
      log.status === "failed" ||
      log.event_type === "login_attempt" ||
      !["192.168.1.10", "10.0.0.5"].includes(log.ip);

    if (!counts.has(label)) {
      counts.set(label, 0);
    }

    if (isAlert) {
      counts.set(label, counts.get(label) + 1);
    }
  });

  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }));
}

export function getTopIps(logs = [], limit = 5) {
  const counts = logs.reduce((accumulator, log) => {
    if (!log.ip) {
      return accumulator;
    }

    accumulator[log.ip] = (accumulator[log.ip] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([ip, value]) => ({ ip, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, limit);
}

export function getEventTypeDistribution(logs = []) {
  const counts = logs.reduce((accumulator, log) => {
    const eventType = log.event_type || "unknown";
    accumulator[eventType] = (accumulator[eventType] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function buildAiSummary(alerts = []) {
  const highThreat = alerts.find((alert) => alert.severity === "High");

  if (highThreat) {
    return `Multiple failed login attempts detected from IP ${highThreat.ip}. Possible brute-force attack. Immediate action recommended.`;
  }

  const mediumThreat = alerts.find((alert) => alert.severity === "Medium");

  if (mediumThreat) {
    return `${mediumThreat.type} detected from IP ${mediumThreat.ip}. Review activity and validate whether it is expected.`;
  }

  return "No high-risk pattern detected right now. Continue monitoring alerts, logs, and severity trends for unusual activity.";
}

export function getLogStatusBadge(status) {
  return status === "success" ? "success" : "failed";
}
```

## frontend\src\components\AiSummaryPanel.jsx

```
export default function AiSummaryPanel({ text, loading }) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-cyan-300/14 bg-[linear-gradient(135deg,rgba(11,26,40,0.98)_0%,rgba(7,17,28,0.96)_60%,rgba(24,34,31,0.88)_100%)] p-5 shadow-[0_30px_90px_rgba(2,8,23,0.24)] ring-1 ring-cyan-300/10 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 md:p-6">
      <div className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
            AI Threat Summary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Automatic threat narrative
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
            Machine-generated briefing distilled from your active alerts and
            activity stream.
          </p>
        </div>
        <span className="rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
          AI
        </span>
      </div>

      <div className="relative mt-5 rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm leading-7 text-slate-200">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded bg-white/10" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-white/10" />
          </div>
        ) : (
          <div className="space-y-4">
            <p>{text}</p>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Prioritized
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Contextual
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Analyst-ready
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
```

## frontend\src\components\AlertCard.jsx

```
function severityStyles(severity) {
  if (severity === "High") {
    return {
      background:
        "from-[#2f1217]/95 via-[#271117]/90 to-[#17131d]/92 border-rose-400/20",
      badge: "border-rose-400/20 bg-rose-400/12 text-rose-100",
      line: "bg-rose-300",
    };
  }

  if (severity === "Medium") {
    return {
      background:
        "from-[#2a1f11]/95 via-[#241b12]/90 to-[#17141a]/92 border-amber-300/20",
      badge: "border-amber-300/20 bg-amber-300/12 text-amber-100",
      line: "bg-amber-300",
    };
  }

  return {
    background:
      "from-[#122536]/95 via-[#0f2232]/90 to-[#131822]/92 border-cyan-300/20",
    badge: "border-cyan-300/20 bg-cyan-300/12 text-cyan-100",
    line: "bg-cyan-300",
  };
}

function AlertSkeleton() {
  return (
    <article className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="h-4 w-32 animate-pulse rounded bg-white/20" />
          <div className="mt-3 h-3 w-44 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-3 w-40 animate-pulse rounded bg-white/10" />
        </div>
        <div className="h-7 w-16 animate-pulse rounded bg-white/20" />
      </div>
    </article>
  );
}

export default function AlertCard({ alerts = [], loading }) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <AlertSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!alerts.length) {
    return (
      <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-8 text-center text-sm text-slate-200 shadow-[0_18px_50px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        No active alerts right now.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {alerts.slice(0, 3).map((alert, idx) => {
        const styles = severityStyles(alert.severity);

        return (
          <article
            key={`${alert.type}-${idx}`}
            className={`relative overflow-hidden rounded-[28px] border bg-gradient-to-br ${styles.background} px-5 py-5 shadow-[0_24px_60px_rgba(2,8,23,0.18)] ring-1 ring-white/6 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5`}
          >
            <div className={`absolute left-0 top-6 h-16 w-1.5 rounded-r-full ${styles.line}`} />
            <div className="flex items-start justify-between gap-3 pl-2">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Incident snapshot
                </p>
                <h3 className="mt-3 text-[18px] font-semibold text-white">
                  {alert.type}
                </h3>
                <p className="mt-2 text-[13px] uppercase tracking-[0.12em] text-slate-400">
                  IP: {alert.ip}
                </p>
                <p className="mt-4 border-t border-white/10 pt-4 text-[14px] leading-6 text-slate-200/90">
                  {alert.summary}
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-lg ${styles.badge}`}
              >
                {alert.severity}
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}
```

## frontend\src\components\Badge.jsx

```
const variants = {
  high: "border-rose-400/20 bg-rose-400/12 text-rose-100",
  medium: "border-amber-300/20 bg-amber-300/12 text-amber-100",
  low: "border-emerald-300/20 bg-emerald-300/12 text-emerald-100",
  success: "border-emerald-300/20 bg-emerald-300/12 text-emerald-100",
  failed: "border-rose-400/20 bg-rose-400/12 text-rose-100",
  neutral: "border-white/10 bg-white/6 text-slate-200",
  ai: "border-cyan-300/20 bg-cyan-300/12 text-cyan-100",
};

export default function Badge({ variant = "neutral", children, className = "" }) {
  const style = variants[variant] || variants.neutral;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${style} ${className}`}
    >
      {children}
    </span>
  );
}
```

## frontend\src\components\Card.jsx

```
export default function Card({
  children,
  className = "",
  as: Component = "section",
}) {
  return (
    <Component
      className={`rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,24,37,0.92)_0%,rgba(9,17,28,0.84)_100%)] shadow-[0_24px_80px_rgba(2,8,23,0.26)] ring-1 ring-white/6 backdrop-blur-2xl transition duration-300 ${className}`}
    >
      {children}
    </Component>
  );
}
```

## frontend\src\components\LogsTable.jsx

```
import { useMemo, useState } from "react";

const PAGE_SIZE = 4;

function formatEventType(value) {
  return String(value || "unknown").replaceAll("_", " ");
}

export default function LogsTable({ logs = [], loading }) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visibleLogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return logs.slice(start, start + PAGE_SIZE);
  }, [logs, currentPage]);

  const goPrevious = () => setPage((value) => Math.max(1, value - 1));
  const goNext = () => setPage((value) => Math.min(totalPages, value + 1));

  if (loading) {
    return (
      <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,25,38,0.92)_0%,rgba(9,18,29,0.84)_100%)] px-5 py-5 shadow-[0_24px_80px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl">
        <h2 className="text-xl font-semibold text-slate-100">Activity ledger</h2>
        <div className="mt-4 space-y-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-2xl bg-white/10"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,25,38,0.92)_0%,rgba(9,18,29,0.84)_100%)] px-5 py-5 shadow-[0_24px_80px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl md:px-6 md:py-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Activity stream
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-100">
            Activity ledger
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Recent authentication and server events from the monitored estate.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {visibleLogs.length ? (
        <div className="mt-5 overflow-x-auto rounded-[24px] border border-white/8 bg-[rgba(255,255,255,0.02)]">
          <table className="min-w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="bg-white/8 text-slate-300">
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.16em]">
                  Timestamp
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.16em]">
                  IP Address
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.16em]">
                  Event Type
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.16em]">
                  Status
                </th>
                <th className="px-5 py-4 font-semibold uppercase tracking-[0.16em]">
                  Username
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleLogs.map((log, index) => (
                <tr
                  key={`${log.timestamp}-${index}`}
                  className="border-b border-white/8 bg-transparent transition hover:bg-white/5"
                >
                  <td className="px-5 py-4 text-slate-200">{log.timestamp}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-slate-100">
                      {log.ip}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-200 capitalize">
                    {formatEventType(log.event_type)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        log.status === "success"
                          ? "bg-emerald-400/15 text-emerald-100"
                          : "bg-rose-400/15 text-rose-100"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-200">
                    {log.username || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 py-8 text-center text-sm text-slate-300">
          No logs available
        </p>
      )}

      <div className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-300">
        <button
          type="button"
          onClick={goPrevious}
          disabled={currentPage === 1}
          className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {"<"}
        </button>
        <span className="rounded-full bg-[linear-gradient(135deg,#7ee7d7_0%,#5fb8ff_100%)] px-3 py-1 font-semibold text-slate-950 shadow-[0_10px_20px_rgba(34,211,238,0.18)]">
          {currentPage}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={currentPage === totalPages}
          className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {">"}
        </button>
      </div>
    </section>
  );
}
```

## frontend\src\components\Sidebar.jsx

```
const navItems = [
  { label: "Dashboard", key: "dashboard", hint: "Executive overview" },
  { label: "Alerts", key: "alerts", hint: "Escalations and triage" },
  { label: "Logs", key: "logs", hint: "Full activity ledger" },
  { label: "Analytics", key: "analytics", hint: "Threat movement" },
  { label: "Settings", key: "settings", hint: "Workspace controls" },
];

function SidebarIcon({ itemKey, isActive }) {
  const fill = isActive ? "#ffffff" : "#94a3b8";

  if (itemKey === "alerts") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M12 3 3 19h18L12 3Zm0 5.8 3.95 7.2H8.05L12 8.8Zm0 5.95a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1Z"
          fill={fill}
        />
      </svg>
    );
  }

  if (itemKey === "logs") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M6 4h12a2 2 0 0 1 2 2v12.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5V6a2 2 0 0 1 2-2Zm0 2v12h12V6H6Zm2.5 3h7v1.8h-7V9Zm0 4h7v1.8h-7V13Z"
          fill={fill}
        />
      </svg>
    );
  }

  if (itemKey === "analytics") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="M4 18h16v2H2V4h2v14Zm2-2V9h3v7H6Zm5 0V5h3v11h-3Zm5 0v-4h3v4h-3Z"
          fill={fill}
        />
      </svg>
    );
  }

  if (itemKey === "settings") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path
          d="m12 2 1.2 2.45 2.72.4-.97 2.57 1.92 1.95-1.92 1.94.97 2.58-2.72.4L12 18l-1.2-2.45-2.72-.4.97-2.58-1.92-1.94 1.92-1.95-.97-2.57 2.72-.4L12 2Zm0 6.1a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8Z"
          fill={fill}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        d="M3 13h8V3H3v10Zm10 8h8V3h-8v18ZM3 21h8v-6H3v6Z"
        fill={fill}
      />
    </svg>
  );
}

export default function Sidebar({
  activeSection,
  onNavigate,
  postureScore = 92,
  totalAlerts = 0,
  highThreatCount = 0,
}) {
  return (
    <aside className="scrollbar-hidden sticky top-5 hidden h-[calc(100svh-2.5rem)] w-[320px] shrink-0 overflow-y-auto rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(7,16,26,0.96)_0%,rgba(5,11,19,0.92)_100%)] p-5 shadow-[0_30px_100px_rgba(2,8,23,0.38)] ring-1 ring-white/8 backdrop-blur-2xl xl:block">
      <div className="absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(99,211,255,0.22),transparent_72%)] opacity-80" />

      <div className="relative rounded-[26px] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7ee7d7_0%,#f7b267_100%)] text-sm font-bold text-slate-950 shadow-[0_18px_30px_rgba(98,214,199,0.18)]">
            TI
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-100/80">
              ThreatOps
            </p>
            <h2 className="mt-1 text-[22px] font-semibold text-white">
              Command Deck
            </h2>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-400">
          Premium security operations workspace for monitoring posture,
          incident spikes, and suspicious log movement.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Posture
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {postureScore}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Alerts
            </p>
            <p className="mt-2 text-2xl font-semibold text-white">
              {totalAlerts}
            </p>
          </div>
        </div>
      </div>

      <nav className="relative mt-6 space-y-2">
        {navItems.map((item) => {
          const isActive = activeSection === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              className={`flex w-full items-center gap-4 rounded-[22px] border px-4 py-3.5 text-left transition duration-300 ${
                isActive
                  ? "border-cyan-300/20 bg-[linear-gradient(135deg,rgba(99,211,255,0.18),rgba(255,255,255,0.08))] text-white shadow-[0_18px_30px_rgba(96,165,250,0.14)]"
                  : "border-transparent text-slate-300 hover:border-white/8 hover:bg-white/6 hover:text-white"
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${
                  isActive
                    ? "border-white/16 bg-white/10"
                    : "border-white/8 bg-white/4"
                }`}
              >
                <SidebarIcon itemKey={item.key} isActive={isActive} />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  {item.label}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  {item.hint}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="relative mt-6 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,24,37,0.92)_0%,rgba(8,15,26,0.88)_100%)] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Security Posture
        </p>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-sm text-slate-300">Environment status</p>
              <p className="mt-1 text-3xl font-semibold text-white">
                Guarded
              </p>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
              Stable
            </span>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-500">
                <span>Detection coverage</span>
                <span>{postureScore}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-white/8">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#7ee7d7_0%,#9cf3c8_100%)]"
                  style={{ width: `${postureScore}%` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-3 py-2">
              <span>High-priority incidents</span>
              <span className="font-semibold text-rose-200">
                {highThreatCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
```

## frontend\src\components\SummaryCard.jsx

```
function StatCard({
  label,
  value,
  accentClassName,
  pulseClassName,
  loading,
}) {
  return (
    <article className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,25,38,0.95)_0%,rgba(9,17,27,0.88)_100%)] px-5 py-4 shadow-[0_20px_60px_rgba(2,8,23,0.18)] ring-1 ring-white/6 backdrop-blur-2xl transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(2,8,23,0.26)]">
      <div
        className={`absolute -right-10 top-0 h-24 w-24 rounded-full blur-3xl ${pulseClassName}`}
      />
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          {label}
        </h3>
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-200/70 shadow-[0_0_0_6px_rgba(103,232,249,0.1)]" />
      </div>
      <div className="mt-5 flex items-end justify-start">
        {loading ? (
          <div className="h-8 w-14 animate-pulse rounded bg-white/20" />
        ) : (
          <span
            className={`text-[30px] font-semibold leading-none tracking-[-0.05em] ${accentClassName}`}
          >
            {value}
          </span>
        )}
      </div>
    </article>
  );
}

export default function SummaryCard({ summary, loading }) {
  const cards = [
    {
      label: "Total Alerts",
      value: summary?.total_alerts ?? 0,
      accentClassName: "text-white",
      pulseClassName: "bg-cyan-400/18",
    },
    {
      label: "High Threats",
      value: summary?.high_threats ?? 0,
      accentClassName: "text-rose-100",
      pulseClassName: "bg-rose-400/18",
    },
    {
      label: "Medium Threats",
      value: summary?.medium_threats ?? 0,
      accentClassName: "text-amber-100",
      pulseClassName: "bg-amber-300/20",
    },
    {
      label: "Low Threats",
      value: summary?.low_threats ?? 0,
      accentClassName: "text-emerald-100",
      pulseClassName: "bg-emerald-300/18",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} loading={loading} {...card} />
      ))}
    </section>
  );
}
```

## frontend\src\components\Table.jsx

```
import Card from "./Card.jsx";

export default function Table({ title, subtitle, children, className = "" }) {
  return (
    <Card className={`px-4 py-4 md:px-5 md:py-5 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title ? <h2 className="text-[15px] font-semibold text-slate-100">{title}</h2> : null}
          {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
        </div>
      )}
      {children}
    </Card>
  );
}
```

## frontend\src\components\ThreatChart.jsx

```
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ChartSkeleton() {
  return (
    <div className="h-55 w-full animate-pulse rounded-[22px] bg-white/10" />
  );
}

export default function ThreatChart({ chartData = [], loading }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,25,38,0.92)_0%,rgba(9,18,29,0.84)_100%)] px-5 py-5 shadow-[0_24px_80px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl md:px-6 md:py-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Threat mix
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100">
            Severity overview
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Compare critical, elevated, and low-priority detections at a glance.
          </p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-300">
          Live counts
        </span>
      </div>

      <div className="mt-5 h-[260px]">
        {loading ? (
          <ChartSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 18, right: 6, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#d8e2f0", fontSize: 13 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#d8e2f0", fontSize: 13 }}
              />
              <Tooltip
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(8, 15, 28, 0.96)",
                  color: "#fff",
                  boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
                }}
              />
              <Bar dataKey="value" radius={[16, 16, 4, 4]} barSize={72}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
```

## frontend\src\components\TopNav.jsx

```
function IconSearch() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M10.5 4a6.5 6.5 0 1 0 4.14 11.52l4.42 4.43 1.41-1.42-4.42-4.42A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v13a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2h3V2Zm12 8H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9Zm-1-4H6a1 1 0 0 0-1 1v1h14V7a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-current"
    >
      <path d="M12 3a5 5 0 0 0-5 5v1.29c0 .86-.3 1.69-.84 2.35L4.2 14.1a1 1 0 0 0 .8 1.6h14a1 1 0 0 0 .8-1.6l-1.96-2.46a3.75 3.75 0 0 1-.84-2.35V8a5 5 0 0 0-5-5Zm0 18a2.75 2.75 0 0 0 2.58-1.8H9.42A2.75 2.75 0 0 0 12 21Z" />
    </svg>
  );
}

export default function TopNav({
  pageTitle = "Threat Intelligence Control Center",
  pageDescription = "Premium operational view for live threat monitoring and incident response.",
  searchQuery,
  onSearchChange,
  selectedDate,
  onDateChange,
  highThreatCount = 0,
  uniqueIps = 0,
  lastUpdated = "Awaiting sync",
}) {
  return (
    <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(12,23,36,0.94)_0%,rgba(8,16,27,0.9)_100%)] px-5 py-5 shadow-[0_30px_90px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl md:px-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-100/80">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(134,239,172,0.14)]" />
            Live monitoring
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white md:text-5xl">
            {pageTitle}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 md:text-[15px]">
            {pageDescription}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                High threats
              </p>
              <p className="mt-2 text-lg font-semibold text-rose-100">
                {highThreatCount}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Active IPs
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {uniqueIps}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Last sync
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {lastUpdated}
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-[560px] flex-col gap-3">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="flex flex-1 items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <IconSearch />
              <input
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search IP, username, alert, or event"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              />
            </label>
            <label className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <IconCalendar />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Date
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => onDateChange(event.target.value)}
                className="appearance-none bg-transparent text-sm text-white outline-none [color-scheme:dark]"
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/5 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-300">
              <p className="font-medium text-white">Current context</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                API proxy active | data streaming live
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white transition hover:scale-[1.03] hover:bg-white/10"
                aria-label="Notifications"
              >
                <IconBell />
              </button>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                Synced
              </span>
              <button
                type="button"
                className="flex h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(126,231,215,0.28),rgba(247,178,103,0.2))] px-4 text-sm font-semibold text-white transition hover:scale-[1.03]"
                aria-label="Profile"
              >
                TI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## frontend\src\components\TrendChart.jsx

```
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function TrendSkeleton() {
  return (
    <div className="h-65 w-full animate-pulse rounded-[22px] bg-white/10" />
  );
}

export default function TrendChart({ data = [], loading }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,25,38,0.92)_0%,rgba(9,18,29,0.84)_100%)] px-5 py-5 shadow-[0_24px_80px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl md:px-6 md:py-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
            Trendline
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-100">
            Alert movement over time
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Watch short-term spikes and see when risk starts accelerating.
          </p>
        </div>
        <span className="rounded-full border border-cyan-300/18 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
          Telemetry
        </span>
      </div>

      <div className="mt-5 h-[270px]">
        {loading ? (
          <TrendSkeleton />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 18, right: 6, left: -10, bottom: 0 }}
            >
              <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#d8e2f0", fontSize: 13 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#d8e2f0", fontSize: 13 }}
              />
              <Tooltip
                cursor={{ stroke: "rgba(103,232,249,0.2)" }}
                contentStyle={{
                  borderRadius: "18px",
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(8, 15, 28, 0.94)",
                  color: "#fff",
                  boxShadow: "0 18px 36px rgba(0,0,0,0.35)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#7ee7d7"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "#07101f" }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
```

## frontend\src\pages\Alerts.jsx

```
import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Badge from "../components/Badge.jsx";
import { matchesQuery } from "../utils/threat.js";

const PAGE_SIZE = 6;

function getSeverityVariant(severity) {
  return severity === "High"
    ? "high"
    : severity === "Medium"
      ? "medium"
      : "low";
}

export default function Alerts({ alerts = [], loading }) {
  const [severity, setSeverity] = useState("All");
  const [ipSearch, setIpSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [severity, ipSearch]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const severityMatches = severity === "All" || alert.severity === severity;
      const searchMatches = matchesQuery([alert.ip], ipSearch);
      return severityMatches && searchMatches;
    });
  }, [alerts, severity, ipSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleAlerts = filteredAlerts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="space-y-5">
      <Card className="px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              Alerts
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Full alert feed with severity filtering and IP lookup.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <label className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-300">
              <span className="mr-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Search IP
              </span>
              <input
                value={ipSearch}
                onChange={(event) => setIpSearch(event.target.value)}
                placeholder="192.168.1.10"
                className="bg-transparent text-white outline-none placeholder:text-slate-500"
              />
            </label>
            <select
              value={severity}
              onChange={(event) => setSeverity(event.target.value)}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="All" className="bg-slate-950">
                All severity
              </option>
              <option value="High" className="bg-slate-950">
                High
              </option>
              <option value="Medium" className="bg-slate-950">
                Medium
              </option>
              <option value="Low" className="bg-slate-950">
                Low
              </option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {(loading ? [...Array(6)] : visibleAlerts).map((alert, index) => {
          if (loading) {
            return (
              <Card
                key={index}
                className="h-[168px] animate-pulse bg-white/6 px-5 py-5"
              >
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="mt-4 h-5 w-40 rounded bg-white/10" />
                <div className="mt-4 h-3 w-3/4 rounded bg-white/10" />
                <div className="mt-3 h-3 w-2/3 rounded bg-white/10" />
              </Card>
            );
          }

          const variant = getSeverityVariant(alert.severity);

          return (
            <Card
              key={`${alert.type}-${index}`}
              className="px-5 py-5 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge variant={variant}>{alert.severity}</Badge>
                  <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.03em] text-white">
                    {alert.type}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">IP: {alert.ip}</p>
                </div>
              </div>
              <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-6 text-slate-200/90">
                {alert.summary}
              </p>
            </Card>
          );
        })}
      </div>

      {!loading ? (
        <Card className="px-5 py-4">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
            <span>
              Showing {visibleAlerts.length} of {filteredAlerts.length} alerts
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <Badge variant="neutral">
                {currentPage} / {totalPages}
              </Badge>
              <button
                type="button"
                onClick={() =>
                  setPage((value) => Math.min(totalPages, value + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
```

## frontend\src\pages\Analytics.jsx

```
import Card from "../components/Card.jsx";
import TrendChart from "../components/TrendChart.jsx";
import {
  getEventTypeDistribution,
  getTopIps,
  getTrendData,
} from "../utils/threat.js";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#67e8f9", "#7c8cff", "#f6a13a", "#7ddb8c", "#ff7c7c"];

export default function Analytics({ logs = [], loading }) {
  const trendData = getTrendData(logs);
  const topIps = getTopIps(logs, 5);
  const eventTypes = getEventTypeDistribution(logs);

  return (
    <div className="space-y-5">
      <Card className="px-5 py-5">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Analytics
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Advanced charting for threat trends, suspicious IPs, and event mix.
        </p>
      </Card>

      <TrendChart data={trendData} loading={loading} />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="px-4 py-4 md:px-5 md:py-5">
          <h3 className="text-[15px] font-semibold text-slate-100">
            Top Attacking IPs
          </h3>
          <div className="mt-4 h-[280px]">
            {loading ? (
              <div className="h-full animate-pulse rounded-[22px] bg-white/10" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topIps}
                  layout="vertical"
                  margin={{ top: 8, right: 18, left: 6, bottom: 0 }}
                >
                  <CartesianGrid
                    stroke="rgba(148,163,184,0.14)"
                    vertical={false}
                  />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#d8e2f0", fontSize: 13 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="ip"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#d8e2f0", fontSize: 13 }}
                    width={110}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(8, 15, 28, 0.94)",
                      color: "#fff",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#67e8f9"
                    radius={[0, 12, 12, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="px-4 py-4 md:px-5 md:py-5">
          <h3 className="text-[15px] font-semibold text-slate-100">
            Event Type Distribution
          </h3>
          <div className="mt-4 h-[280px]">
            {loading ? (
              <div className="h-full animate-pulse rounded-[22px] bg-white/10" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypes}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={98}
                    paddingAngle={4}
                  >
                    {eventTypes.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "14px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(8, 15, 28, 0.94)",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {eventTypes.map((entry, index) => (
              <span
                key={entry.name}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-300"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: PIE_COLORS[index % PIE_COLORS.length] }}
                />
                {entry.name}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
```

## frontend\src\pages\Dashboard.jsx

```
import { useMemo } from "react";
import SummaryCard from "../components/SummaryCard.jsx";

export default function Dashboard({
  summary,
  alerts = [],
  logs = [],
  loading,
  onNavigate,
}) {
  const highThreatCount = alerts.filter(
    (alert) => alert.severity === "High",
  ).length;

  const successfulEvents = logs.filter((log) => log.status === "success").length;
  const successRate = logs.length
    ? Math.round((successfulEvents / logs.length) * 100)
    : 100;
  const uniqueIps = new Set(logs.map((log) => log.ip).filter(Boolean)).size;

  const watchlist = useMemo(() => {
    const rank = { High: 0, Medium: 1, Low: 2 };

    return [...alerts]
      .sort((left, right) => {
        const severityRank =
          (rank[left.severity] ?? 3) - (rank[right.severity] ?? 3);

        if (severityRank !== 0) {
          return severityRank;
        }

        return String(right.timestamp || "").localeCompare(
          String(left.timestamp || ""),
        );
      })
      .slice(0, 3);
  }, [alerts]);

  const priorityLabel = highThreatCount
    ? "Immediate analyst attention recommended."
    : "No critical incidents at this moment.";

  return (
    <div className="space-y-4">
      <section className="grid gap-5 2xl:grid-cols-[1.1fr_0.9fr]">
        <article className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(12,25,38,0.98)_0%,rgba(8,16,27,0.94)_50%,rgba(18,32,32,0.92)_100%)] p-6 shadow-[0_30px_90px_rgba(2,8,23,0.26)] ring-1 ring-white/6 backdrop-blur-2xl">
          <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl" />
          <div className="relative flex flex-col gap-5">
            <div className="min-w-0 max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-cyan-100/80">
                Executive overview
              </p>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white md:text-4xl">
                Dashboard overview
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                Track posture, review critical activity, and jump into the
                detailed workspaces when needed.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Monitored IPs
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {uniqueIps}
                </p>
              </div>
              <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Success rate
                </p>
                <p className="mt-3 text-3xl font-semibold text-emerald-100">
                  {successRate}%
                </p>
              </div>
              <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Priority note
                </p>
                <p className="mt-3 break-words text-sm font-semibold leading-5 text-white">
                  {priorityLabel}
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="grid gap-5 sm:grid-cols-2 2xl:grid-cols-1">
          <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(13,25,38,0.94)_0%,rgba(9,17,28,0.88)_100%)] p-5 shadow-[0_24px_70px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                  Mission status
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Threat posture guarded
                </h3>
              </div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">
                Stable
              </span>
            </div>
            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => onNavigate("alerts")}
                className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/8"
              >
                <span className="text-sm text-slate-300">Open full alerts</span>
                <span className="text-lg font-semibold text-white">
                  {alerts.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate("logs")}
                className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/8"
              >
                <span className="text-sm text-slate-300">Open full logs</span>
                <span className="text-sm font-semibold text-white">
                  {logs.length} events
                </span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate("analytics")}
                className="flex w-full items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/8"
              >
                <span className="text-sm text-slate-300">
                  Open analytics workspace
                </span>
                <span className="text-sm font-semibold text-cyan-100">
                  Trends
                </span>
              </button>
            </div>
          </article>

          <article className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,25,35,0.96)_0%,rgba(10,16,24,0.92)_100%)] p-5 shadow-[0_24px_70px_rgba(2,8,23,0.22)] ring-1 ring-white/6 backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
              Analyst watchlist
            </p>
            <div className="mt-4 space-y-3">
              {watchlist.length ? (
                watchlist.map((alert, index) => (
                  <div
                    key={`${alert.type}-${index}`}
                    className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">
                        {alert.type}
                      </p>
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        {alert.severity}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-400">{alert.ip}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-slate-400">
                  No alerts in the current filter set.
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      <SummaryCard summary={summary} loading={loading} />
    </div>
  );
}
```

## frontend\src\pages\Logs.jsx

```
import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card.jsx";
import Badge from "../components/Badge.jsx";

const PAGE_SIZE = 6;

const EVENT_TYPES = ["All", "login_attempt", "server_access", "unknown"];

export default function Logs({ logs = [], loading }) {
  const [eventType, setEventType] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [eventType, status, logs.length]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const eventMatches = eventType === "All" || log.event_type === eventType;
      const statusMatches = status === "All" || log.status === status;
      return eventMatches && statusMatches;
    });
  }, [logs, eventType, status]);

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleLogs = filteredLogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="space-y-5">
      <Card className="px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
              Logs
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Full activity table with event and status filtering.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <select
              value={eventType}
              onChange={(event) => setEventType(event.target.value)}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none"
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type} className="bg-slate-950">
                  {type === "All" ? "All event types" : type}
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-full border border-white/10 bg-white/6 px-4 py-3 text-sm text-white outline-none"
            >
              <option value="All" className="bg-slate-950">
                All status
              </option>
              <option value="success" className="bg-slate-950">
                success
              </option>
              <option value="failed" className="bg-slate-950">
                failed
              </option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden px-0 py-0">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-white/10 text-slate-200">
                <th className="px-5 py-4 font-semibold">Timestamp</th>
                <th className="px-5 py-4 font-semibold">IP</th>
                <th className="px-5 py-4 font-semibold">Event Type</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Username</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? [...Array(PAGE_SIZE)].map((_, index) => (
                    <tr key={index} className="border-b border-white/8">
                      <td className="px-5 py-4">
                        <div className="h-4 w-36 animate-pulse rounded bg-white/10" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-6 w-16 animate-pulse rounded bg-white/10" />
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
                      </td>
                    </tr>
                  ))
                : visibleLogs.map((log, index) => (
                    <tr
                      key={`${log.timestamp}-${index}`}
                      className="border-b border-white/8 hover:bg-white/5"
                    >
                      <td className="px-5 py-4 text-slate-200">
                        {log.timestamp}
                      </td>
                      <td className="px-5 py-4 text-slate-200">{log.ip}</td>
                      <td className="px-5 py-4 text-slate-200">
                        {log.event_type}
                      </td>
                      <td className="px-5 py-4">
                        <Badge
                          variant={
                            log.status === "success" ? "success" : "failed"
                          }
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-slate-200">
                        {log.username || "-"}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Card>

      {!loading ? (
        <Card className="px-5 py-4">
          <div className="flex items-center justify-between gap-3 text-sm text-slate-300">
            <span>
              Showing {visibleLogs.length} of {filteredLogs.length} logs
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Prev
              </button>
              <Badge variant="neutral">
                {currentPage} / {totalPages}
              </Badge>
              <button
                type="button"
                onClick={() =>
                  setPage((value) => Math.min(totalPages, value + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
```

## frontend\src\pages\Settings.jsx

```
import { useState } from "react";
import Card from "../components/Card.jsx";
import Badge from "../components/Badge.jsx";

function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[18px] border border-white/10 bg-white/5 p-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-8 w-14 rounded-full border transition duration-300 ${
          checked
            ? "border-cyan-300/30 bg-cyan-400/25"
            : "border-white/10 bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition duration-300 ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [autoRemediation, setAutoRemediation] = useState(false);

  return (
    <div className="space-y-5">
      <Card className="px-5 py-5">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
          Settings
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Manage notification behavior, API health, and system preferences.
        </p>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4 px-5 py-5">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-100">
              Preferences
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Simple controls for the current cybersecurity workspace.
            </p>
          </div>
          <Toggle
            checked={notifications}
            onChange={setNotifications}
            label="Enable notifications"
            description="Receive alerts when high-severity events are detected."
          />
          <Toggle
            checked={autoRemediation}
            onChange={setAutoRemediation}
            label="Auto remediation"
            description="Enable suggested mitigation actions for repeat offenders."
          />
        </Card>

        <Card className="space-y-4 px-5 py-5">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-100">
              System Info
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Basic runtime and API state.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">API Status</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">Backend</span>
              <span className="text-sm font-medium text-white">FastAPI</span>
            </div>
            <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-300">Theme</span>
              <span className="text-sm font-medium text-white">
                Premium Dark SaaS
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
```

## frontend\src\assets\react.svg

```
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```

## frontend\src\assets\vite.svg

```
<svg xmlns="http://www.w3.org/2000/svg" width="77" height="47" fill="none" aria-labelledby="vite-logo-title" viewBox="0 0 77 47"><title id="vite-logo-title">Vite</title><style>.parenthesis{fill:#000}@media (prefers-color-scheme:dark){.parenthesis{fill:#fff}}</style><path fill="#9135ff" d="M40.151 45.71c-.663.844-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.493c-.92 0-1.457-1.04-.92-1.788l7.479-10.471c1.07-1.498 0-3.578-1.842-3.578H15.443c-.92 0-1.456-1.04-.92-1.788l9.696-13.576c.213-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.472c-1.07 1.497 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.087.89 1.83L40.153 45.712z"/><mask id="a" width="48" height="47" x="14" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M40.047 45.71c-.663.843-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.389c-.92 0-1.457-1.04-.92-1.788l7.479-10.472c1.07-1.497 0-3.578-1.842-3.578H15.34c-.92 0-1.456-1.04-.92-1.788l9.696-13.575c.213-.297.556-.474.92-.474H53.93c.92 0 1.456 1.04.92 1.788L47.37 13.03c-1.07 1.498 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.088.89 1.831L40.049 45.712z"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#eee6ff" rx="5.508" ry="14.704" transform="rotate(269.814 20.96 11.29)scale(-1 1)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#eee6ff" rx="10.399" ry="29.851" transform="rotate(89.814 -16.902 -8.275)scale(1 -1)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#8900ff" rx="5.508" ry="30.487" transform="rotate(89.814 -19.197 -7.127)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.928 4.177)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.738 5.52)scale(1 -1)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#eee6ff" rx="14.072" ry="22.078" transform="rotate(93.35 31.245 55.578)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx="14.592" cy="9.743" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(39.51 14.592 9.743)"/></g><g filter="url(#k)"><ellipse cx="61.728" cy="-5.321" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 61.728 -5.32)"/></g><g filter="url(#l)"><ellipse cx="55.618" cy="7.104" fill="#00c2ff" rx="5.971" ry="9.665" transform="rotate(37.892 55.618 7.104)"/></g><g filter="url(#m)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#n)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#o)"><ellipse cx="49.857" cy="30.678" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 49.857 30.678)"/></g><g filter="url(#p)"><ellipse cx="52.623" cy="33.171" fill="#00c2ff" rx="5.971" ry="15.297" transform="rotate(37.892 52.623 33.17)"/></g></g><path d="M6.919 0c-9.198 13.166-9.252 33.575 0 46.789h6.215c-9.25-13.214-9.196-33.623 0-46.789zm62.424 0h-6.215c9.198 13.166 9.252 33.575 0 46.789h6.215c9.25-13.214 9.196-33.623 0-46.789" class="parenthesis"/><defs><filter id="b" width="60.045" height="41.654" x="-5.564" y="16.92" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-40.407" y="-6.762" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-35.435" y="2.801" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-30.84" y="20.8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-29.307" y="21.949" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="29.961" y="-17.13" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-13.43" y="-22.082" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="34.321" y="-37.644" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="38.847" y="-10.552" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="22.45" y="-1.645" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="32.919" y="11.36" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter></defs></svg>
```

