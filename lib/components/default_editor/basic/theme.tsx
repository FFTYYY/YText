import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import type { ThemeOptions } from "@mui/material/styles"

export {my_theme}

const my_theme = createTheme({
	palette: {
		divider: "#00000077" , 
		primary: {
			main: "#111111"
		}
	},
	margins: {
		/** 用来书写的纸张跟内部元素的距离。 */
		background: "0.5rem" ,

		/** 段落之间的上下距离。 */
		paragraph: "0.8rem" , 

		/** 小间隔。 */
		small: "0.2rem" , 
	} , 
	widths: {
		/** 所有可以弹出的 Drawer 的宽度。 */
		editable_drawer: "70%" , 
	}
} as ThemeOptions)
