/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        "white-F1": "#F1F1F1",
        "white-FB3": "#FFFFFFB3",
        "white-D9": "#d9d9d9",
        "white-e": "#eeeeee",
        black: "#0f0f0f",
        "gray-A": "#AAAAAA",
        "red-CC": "#CC0000",
        "red-FF": "#FF0000",
        "gray-71": "#717171",
        "gray-170": "rgb(170,170,170)",
        "blue-3E": "#3EA6FF",
        "blue-26": "#263850",
        "black-0.1": "rgba(255,255,255,0.1)",
        "black-0.2": "rgba(255,255,255,0.2)",
        "black-21": "#212121",
        "black-28": "#282828",
      },
      backgroundColor: {
        "hover-black": "rgba(255,255,255,0.1)",
      },
      screens: {
        xsm: "426px",
        528: "528px",
        "2xsm": "576px",
        610: "610px",
        642: "642px",
        "1-5sm": "700px",
        800: "800px",
        856: "856px",
        880: "880px",
        "2md": "938px",
        1070: "1070px",
        1075: "1075px",
        1156: "1156px",
        "2lg": "1168px",
        1275: "1275px",
        1312: "1312px",
        1336: "1336px",
        1356: "1356px",
        1360: "1360px",
        "1-5xl": "1436px",
        1400: "1400px",
        1573: "1573px",
        "3xl": "1760px",
        "3-5xl": "1976px",
        "4xl": "2086px",
        "5xl": "2256px",
        "6xl": "2386px",
      },
      spacing: {
        "min-480": "calc(480px * (16 / 9) + 24px * 3 + 300px)",
        "min-360": "calc(360px * (16 / 9) + 24px * 3 + 300px)",
        "max-16/9": "calc((100vh - 56px - 24px - 136px)*(16 / 9))",
        "480-16/9": "calc(480px*(16 / 9))",
        "360-16/9": "calc(360px*(16 / 9))",
        "240-16/9": "calc(240px*(16 / 9))",
        "full-minus-16": "calc(100% - 16px)",
        "full-minus-24": "calc(100% - 24px)",
        "full-minus-32": "calc(100% - 32px)",
        "full-minus-56": "calc(100% - 56px)",
        "full-minus-16": "calc(100% - 16px)",
        "full-minus-120": "calc(100% - 120px)",
        "screen-h-minus-11": "calc(100vh - 11px)",
        "screen-h-minus-56": "calc(100vh - 56px)",
        "screen-h-minus-128": "calc(100vh - 128px)",
        "screen-h-minus-72": "calc(100vh - 72px)",
        "screen-w-minus-240": "calc(100vw - 240px)",
        "screen-w-minus-74": "calc(100vw - 74px)",
        "screen-w-16-9": "calc((100vh - 56px - 0px - 136px )*( 16 / 9 ))",
      },
      transitionTimingFunction: {
        "cubic-bezier-[0,0,0.2,1]": "cubic-bezier(0,0,0.2,1)",
        "cubic-bezier-[0.4,0,1,1]": "cubic-bezier(0.4, 0, 1, 1)",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-20%)", opacity: 0, display: "none" },
          "100%": { transform: "translateY(0)", opacity: 1, display: "block" },
        },
        slideOut: {
          "0%": { transform: "translateY(0)", opacity: 1, display: "block" },
          "100%": {
            transform: "translateY(-20%)",
            opacity: 0,
            display: "none",
          },
        },
        labelMoveUp: {
          "0%": {
            left: "8px",
            top: "0px",
            transform: "scale(0.95)",
          },
          "100%": {
            left: "0px",
            top: "-24px",
            transform: "scale(1)",
          },
        },
        labelMoveDown: {
          "0%": { left: "0px", top: "-24px", transform: "scale(1)" },

          "100%": { left: "8px", top: "0px", transform: "scale(0.95)" },
        },
        centerSlideIn: {
          "0%": {
            left: "50%",
            width: "0%",
          },
          "100%": {
            left: "0%",
            width: "100%",
          },
        },
        btnPing: {
          "0%": {
            opacity: 1,
            transform: "scale(1)",
          },
          "100%": {
            opacity: 0,
            transform: "scale(1.4)",
          },
        },
        subBtnChangeBgColor: {
          "0%": {
            backgroundColor: "#f1f1f1",
          },
          "50%": {
            backgroundColor: "#FF2A70",
          },
          "100%": {
            backgroundColor: "rgba(255, 255, 255,.1)",
          },
        },
        subTextSlideIn: {
          "0%": {
            width: "10px",
          },
          "100%": {
            width: "70px",
          },
        },
        subBellRing: {
          "0%": {
            transform: "rotate(-15deg)",
          },
          "100%": {
            transform: "rotate(15deg)",
          },
        },
      },
      animation: {
        slideIn: "slideIn 0.3s ease-out forwards",
        slideOut: "slideOut 0.3s ease-out forwards",
        labelMoveUp: "labelMoveUp 0.25s ease-out forwards",
        labelMoveDown: "labelMoveDown 0.25s ease-out forwards",
        buttonPing: "btnPing 0.4s ease-out forwards",
        centerSliderIn: "centerSlideIn 0.25s ease-out forwards",
        subBtnChangeBgColor: "subBtnChangeBgColor 1s ease-in-out forwards",
        subTextSlideIn: "subTextSlideIn 1s ease-in-out forwards",
        subBellRing: "subBellRing 0.3s ease-in-out 4 alternate",
      },
    },
  },
  plugins: [],
};
