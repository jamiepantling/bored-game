module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {backgroundImage: (theme) => ({
      quacks: "url('../public/images/quacks.png')",
    }),},
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
