import type { StackScreenProps } from '@react-navigation/stack';
import { IAppRoutes } from '../routes/app.routes';
import { IAuthRoutes } from '../routes/auth.routes';

export type AppointmentCreatedNavProps = StackScreenProps<
  IAppRoutes,
  'AppointmentCreated'
>;

export type CreateAppointmentNavProps = StackScreenProps<
  IAppRoutes,
  'CreateAppointment'
>;

export type DashboardNavProps = StackScreenProps<IAppRoutes, 'Dashboard'>;

export type SignInNavProps = StackScreenProps<IAuthRoutes, 'SignIn'>;
