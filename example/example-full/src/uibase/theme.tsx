import { createTheme, ThemeProvider, styled , ThemeOptions, PaletteOptions } from "@mui/material/styles"
import { PaletteColor} from "@mui/material/styles"
export { my_theme }

const my_theme: ThemeOptions = {
    palette: {
        divider: "#eeeeee" , 
        mode: "dark",
        primary: {
            main: '#aeaef5',
        },
        secondary: {
            main: '#cb3f75',
        },
        background: {
            default: 'rgba(35,35,48,0.98)',
            paper: '#393942',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255,255,255,0.71)',
            disabled: 'rgba(255,255,255,0.5)',
        },
      
      
    }
}
