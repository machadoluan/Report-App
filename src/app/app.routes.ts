import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { TripsComponent } from './pages/trips/trips.component';
import { TripDetailsComponent } from './components/trip-details/trip-details.component';
import { ReportDetailsComponent } from './components/report-details/report-details.component';
import { CreateTripComponent } from './pages/create-trip/create-trip.component';
import { CreateReportComponent } from './pages/create-report/create-report.component';
import { NoAuthGuard } from './guards/no-auth.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [NoAuthGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' },
        canActivate: [AuthGuard]


    },
    {
        path: 'reports',
        component: ReportsComponent,
        data: { title: 'Registros' },
        canActivate: [AuthGuard]

    },
    {
        path: 'trip',
        component: TripsComponent,
        data: { title: 'Viagens' },
        canActivate: [AuthGuard]

    },
    {
        path: 'trip/:id',
        component: TripDetailsComponent,
        data: { title: 'Viagens' }
    },
    {
        path: 'trip/:id',
        component: TripDetailsComponent,
        data: { title: 'Viagens' }
    },
    {
        path: 'report/:id',
        component: ReportDetailsComponent,
        data: { title: 'Registros' },
        canActivate: [AuthGuard]
    },
    {
        path: 'createTrip',
        component: CreateTripComponent,
        data: { title: 'Criar viagem' },
        canActivate: [AuthGuard]
    },
    {
        path: 'createReport',
        component: CreateReportComponent,
        data: { title: 'Criar Registro' },
        canActivate: [AuthGuard]
    }
];
