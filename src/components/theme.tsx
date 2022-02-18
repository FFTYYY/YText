import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import type { PaletteColor} from "@mui/material/styles"
import type { ThemeOptions } from "../../lib" 
export { my_theme }

const my_theme: ThemeOptions = {
    palette: {
        divider: "#00000077" , 
        primary: {
            main: "#000000"
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
                fontFamily: "STXihei" , 
                fontSize: "1rem" , 
                lineHeight: "1.5rem" , 
                lineSpacing: "0.00938em" , 
                fontWeight: 400 , 
            },
            structure: {
                fontFamily: "DengXian" , 
                fontSize: "1rem" , 
                lineHeight: "1.5rem" , 
                lineSpacing: "0.00938em" , 
                fontWeight: 400 , 
            } , 
            display: {
                fontFamily: "KaiTi" , 
                fontSize: "1rem" , 
                lineHeight: "1.5rem" , 
                lineSpacing: "0.00938em" , 
                fontWeight: 400 ,         
            } , 
        } , 
    } , 
}
