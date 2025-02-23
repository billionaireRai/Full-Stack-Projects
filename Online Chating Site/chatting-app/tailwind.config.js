module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'messagesImage': "url('./assets/messages_light_colour_background.jpg')",
        'chatInterfaceImage':"url('./assets/chatInterface-BG.jpg')"
      },
      fontVariant: {
        smallcaps: 'small-caps',
      },
    },
  },

  plugins: [],
}
