import { environment } from "src/environments/environment";

const navOptions = [
    {
        name: 'Vote',
        path: '/introduce-username',
        icon: '../assets/vote.png',
        exact: true,
    },
    {
        name: 'Vote Count',
        path: '/vote-count',
        icon: '../assets/vote-count.png',
        exact: true,
    },
    
];

export default navOptions;