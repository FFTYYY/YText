import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import type { PaletteColor} from "@mui/material/styles"
import type { ThemeOptions } from "../../lib" 
export { my_theme }

const my_theme: ThemeOptions = {
    palette: {
        divider: "#00000077" , 
        primary: {
            main: "#111111"
        }
    },    
    printer: {
        margins: {
            paragraph: "0.4rem" ,  
            special: "0.8rem" ,  
            colon: "1rem" ,  
            level: "2rem" ,  
        } , 
        typography: {
            body: {
                fontFamily: "default" , 
                fontSize: "1rem" , 
                lineHeight: "1.5rem" , 
                lineSpacing: "0.00938em" , 
                fontWeight: 400 , 
            },
            structure: {
                fontFamily: "default" , 
                fontSize: "1rem" , 
                lineHeight: "1.5rem" , 
                lineSpacing: "0.00938em" , 
                fontWeight: 600 , 
            } , 
            display: {
                fontFamily: "default" , 
                fontSize: "1rem" , 
                lineHeight: "1.5rem" , 
                lineSpacing: "0.00938em" , 
                fontWeight: 400 ,         
            } , 
        } , 
    } , 
}
