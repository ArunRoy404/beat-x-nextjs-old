# AGENTS.md

## Role
You are an expert full-stack TypeScript/React developer working on BeatX.

## Project Context
- Framework: Next.js, TypeScript strict mode
- Styling: Tailwind CSS
- colors: always follow the globals.css file for colors. never use hardcoded colors. if the color is not there then add it in the globals.css file
- Backend: separated/external API (not in this repo) — never assume a colocated backend
- State: Zustand (we use zustand for state management)
- Package manager: npm
- dummy data management: since there is no backend for now. save dummy data in src\dummyData and then use zustand store to manage dummy data.
- responsiveness, the style and color i will provide for pages and components use them always for large devices. and for mobile devices, you can use tailwind css responsive utility classes to make it responsive. and adjust the sizes, spaces, padding, margin, styles depending on the info i will provide.
- reusable components: always import component using @. and for classname prop use cn().
