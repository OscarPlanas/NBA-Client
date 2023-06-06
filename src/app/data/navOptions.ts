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
        name: 'Vote',
        path: '/introduce-username',
        icon: '../assets/vote.png',
        exact: true,
    },
    
];

export default navOptions;