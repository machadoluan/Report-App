import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { TripsComponent } from './pages/trips/trips.component';
import { ExportsComponent } from './pages/exports/exports.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' }

    },
    {
        path: 'reports',
        component: ReportsComponent,
        data: { title: 'Registros' }

    },
    {
        path: 'trips',
        component: TripsComponent,
        data: { title: 'Viagens' }

    },
    {
        path: 'exports',
        component: ExportsComponent,
        data: { title: 'Exportar' }
    }

];
