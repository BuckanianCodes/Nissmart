import { Routes } from '@angular/router';
import { Home } from './layouts/client/home/home';
import { AdminLayout } from './layouts/admin-layout/admin-layout/admin-layout';
import { HomePage } from './layouts/client/routes/home-page/home-page';
import { SystemSummary } from './layouts/admin-layout/routes/system-summary/system-summary';
import { Transactions } from './layouts/admin-layout/routes/transactions/transactions';
import { UserPage } from './layouts/client/routes/user-page/user-page';
import { RecentActivities } from './layouts/admin-layout/routes/recent-activities/recent-activities';
import { TransferFunds } from './layouts/client/routes/transfer-funds/transfer-funds';

export const routes: Routes = [
    {
        path:"",
        component:Home,
        children:[
            {path:'',component:HomePage},
            {path:'user/:userId',component:UserPage},
            {path:'transfer/:userId',component:TransferFunds}
        ]
    },
    {
        
        path:"admin",
        component:AdminLayout,
        children:[
           {path:'',component:SystemSummary},
           {path:'transactions',component:Transactions},
           {path:'logs',component:RecentActivities}
        ]
    }
];
