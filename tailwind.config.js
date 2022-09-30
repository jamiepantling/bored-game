module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        quacks: "url('../public/images/quacks.png')",
      }),
      fontFamily: {
        'title': ['"Love Ya Like A Sister"', 'cursive']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require("tailwindcss-debug-screens")
  ],
}
