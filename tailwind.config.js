module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        quacks: "url('../public/images/quacks.png')",
      }),
      fontFamily: {
        'title': ['"Architects Daughter"', 'cursive']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
