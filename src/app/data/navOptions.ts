import { environment } from "src/environments/environment";

const navOptions = [
    /*{
        name: 'Home',
        path: '/',
        icon: '../assets/home.png',
        exact: true,
		auth: true
    },*/
    {
        name: 'Encrypt/Decrypt',
        path: '/',
        icon: '../assets/encrypt.png',
        exact: true,
    },
    {
        name: 'Sign/Verify',
        path: '/sign-verify',
        icon: '../assets/sign.png',
        exact: true,
    },
    {
        name: 'Blind Sign',
        path: '/blind-sign',
        icon: '../assets/blind.png',
        exact: true,
    },
    {
        name: 'Paillier',
        path: '/paillier',
        icon: '../assets/paillier.png',
        exact: true,
    },
    
];

export default navOptions;