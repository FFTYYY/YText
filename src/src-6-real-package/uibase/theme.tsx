import { Theme } from "@ftyyy/ytext"
export { my_theme }

const my_theme: Theme = {
    mui:{
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
        },    
    } , 
    printer: {

        margins: {
            paragraph: "0.4rem" ,  
            special: "1.0rem" ,  
            colon: "1rem" ,  
            level: "2rem" ,  
        } , 
        fonts: {
            body: {
                fontFamily: "STXihei" , 
            },
            title: {
                fontFamily: "SimHei" , 
            } , 
            structure: {
                fontFamily: "SimHei" , 
            } , 
            display: {
                fontFamily: "KaiTi" , 
            } , 
            weaken: {
                fontFamily: "FangSong" , 
            }
        } , 
    } , 
}
