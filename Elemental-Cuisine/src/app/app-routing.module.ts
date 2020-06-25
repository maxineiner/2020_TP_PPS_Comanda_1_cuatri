import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'inicio', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'listado', loadChildren: './pages/lists/lists.module#ListsPageModule' },
  { path: 'registro/:type', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'modificar/:type/:id', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'configuracion', loadChildren: './pages/configuration/configuration.module#ConfigurationPageModule' },
  { path: 'lista-de-espera', loadChildren: './pages/wait-list/wait-list.module#WaitListPageModule' },
  { path: 'lista-de-atendidos', loadChildren: './pages/attended-list/attended-list.module#AttendedListPageModule' },
  { path: 'reservar', loadChildren: './pages/book/book.module#BookPageModule' },
  { path: 'delivery', loadChildren: './pages/delivery/delivery.module#DeliveryPageModule' },
  { path: 'pedido', loadChildren: './pages/order/order.module#OrderPageModule' },
  { path: 'client-list', loadChildren: './pages/client-list/client-list.module#ClientListPageModule' },
  { path: 'order-list', loadChildren: './pages/order-list/order-list.module#OrderListPageModule' },
  { path: 'pedido/detalle', loadChildren: './pages/order-details/order-details.module#OrderDetailsPageModule' },
  { path: 'juegos', loadChildren: './pages/games/games.module#GamesPageModule' },
  { path: 'juegos/memotest', loadChildren: './pages/game-memotest/game-memotest.module#GameMemotestPageModule' },
  { path: 'juegos/simon', loadChildren: './pages/game-simon/simon.module#SimonPageModule' },
  { path: 'juegos/tateti', loadChildren: './pages/game-tateti/tateti.module#TatetiPageModule' },
  { path: 'pagar', loadChildren: './pages/payment/payment.module#PaymentPageModule' },
  { path: 'encuestas', loadChildren: './pages/poll-client-list/poll-client-list.module#PollClientListPageModule' },
  { path: 'encuestas/cliente', loadChildren: './pages/poll-client-form/poll-client-form.module#PollClientFormPageModule' }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
