import { AlertController } from '@ionic/angular';
import { Table } from './../../classes/table';
import { TableService } from './../../services/table.service';
import { CurrentAttentionService } from './../../services/currentAttention.service';
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Product } from './../../classes/product';
import { FcmService } from './../../services/fcmService';
import { OrderService } from 'src/app/services/order.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Status } from 'src/app/classes/enums/Status';
import { TypeNotification } from 'src/app/classes/enums/TypeNotification';
import { Order } from 'src/app/classes/order';
import { User } from 'src/app/classes/user';
import { Profiles } from 'src/app/classes/enums/profiles';
import { isNullOrUndefined } from 'util';
import { Attention } from 'src/app/classes/attention';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.page.html',
  styleUrls: ['./order-list.page.scss'],
})
export class OrderListPage implements OnInit {

  /* #region  Atributos */

  allOrders: Array<OrderWithUser> = Array<OrderWithUser>();
  allOrdersDividedByProfile: Array<OrderWithUser> = Array<OrderWithUser>(); // Todas las ordenes con la comida y bedida en ordenes separadas
  pendingConfirmOrders: Array<OrderWithUser> = Array<OrderWithUser>();
  pendingPreparationOrders: Array<OrderWithUser> = Array<OrderWithUser>();
  preparingOrders: Array<OrderWithUser> = Array<OrderWithUser>();
  preparedOrders: Array<OrderWithUser> = Array<OrderWithUser>();
  currentUser: User;

  Status = Status;
  Profiles = Profiles;

  /* #endregion */

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private orderService: OrderService,
    private fcmService: FcmService,
    private authService: AuthService,
    private router: Router,
    private loadingService: LoadingService,
    private currentAttentionService: CurrentAttentionService,
    private tableService: TableService,
    private alertController: AlertController
  ) { }

  ngOnInit() {

    this.loadingService.showLoading("Espere...");

    let user = this.authService.getCurrentUser();
    if (isNullOrUndefined(user)) {
      this.router.navigateByUrl("/login");
    }
    this.userService.getUser(user.uid).subscribe(userData => {
      this.currentUser = Object.assign(new User, userData);

      this.getOrders();
      this.getOrdersByProfile();
    });


    this.loadingService.closeLoading();
  }

  /* #region  Métodos */

  private getOrders(): void {

    this.orderService.getAllOrders().subscribe(ordersData => {
      this.allOrders = [];
      ordersData.map(ordersData => {
        let orders = Object.values(ordersData.payload.doc.data()) as Order[];
        orders.forEach(order => {
          let orderWithUser: OrderWithUser = new OrderWithUser();
          orderWithUser.id = ordersData.payload.doc.id
          orderWithUser.order = order;
          orderWithUser.type = this.getOrderType(order.menu as Product[]);
          this.getCurrentTableNumberById(orderWithUser.id).then(tableNumber => orderWithUser.currentTable = tableNumber);
          orderWithUser.index = orders.indexOf(order);
          this.userService.getUserById(orderWithUser.id).then(user => orderWithUser.user = user.data() as User);
          this.allOrders.push(orderWithUser);
        });
      });

      this.pendingConfirmOrders = this.allOrders.filter(orders => (orders.order.statusDrink === Status.PendingConfirm || orders.order.statusFood === Status.PendingConfirm));

    });
  }

  private getOrdersByProfile(): void {

    this.orderService.getAllOrders().subscribe(async ordersData => {
      this.allOrdersDividedByProfile = [];
      ordersData.map(ordersData => {
        let orders = Object.values(ordersData.payload.doc.data()) as Order[];

        orders.forEach(miniOrder => {
          // Cuando no entiendas nada, descomenta la linea de abajo para empezar a ubicarte
          // console.log("Order Nro: " + ordersData.payload.doc.id + "indice: " + orders.indexOf(miniOrder), miniOrder);
          let products = miniOrder.menu as Product[];
          let drinks = products.filter(product => product.managerProfile == Profiles.Bartender);
          let foods = products.filter(product => product.managerProfile == Profiles.Chef);

          if (drinks.length > 0) {
            let orderWithUser: OrderWithUser = new OrderWithUser();
            orderWithUser.id = ordersData.payload.doc.id;
            orderWithUser.index = orders.indexOf(miniOrder);
            orderWithUser.profile = Profiles.Bartender;
            orderWithUser.order = Object.assign({}, miniOrder);
            orderWithUser.order.menu = drinks;
            this.getCurrentTableNumberById(orderWithUser.id).then(tableNumber => orderWithUser.currentTable = tableNumber);
            this.userService.getUserById(orderWithUser.id).then(user => orderWithUser.user = user.data() as User);
            this.allOrdersDividedByProfile.push(orderWithUser);
          }

          if (foods.length > 0) {
            let orderWithUser: OrderWithUser = new OrderWithUser();
            orderWithUser.id = ordersData.payload.doc.id;
            orderWithUser.index = orders.indexOf(miniOrder);
            orderWithUser.profile = Profiles.Chef;
            orderWithUser.order = Object.assign({}, miniOrder);
            orderWithUser.order.menu = foods;
            this.getCurrentTableNumberById(orderWithUser.id).then(tableNumber => orderWithUser.currentTable = tableNumber);
            this.userService.getUserById(orderWithUser.id).then(user => orderWithUser.user = user.data() as User);
            this.allOrdersDividedByProfile.push(orderWithUser);
          }
        })
      });

      console.log(this.currentUser);

      switch (await this.currentUser.profile) {
        case Profiles.Waiter:
          this.preparingOrders = this.allOrdersDividedByProfile.filter(orders => ((orders.profile == Profiles.Bartender && orders.order.statusDrink == Status.Preparing) || (orders.profile == Profiles.Chef && orders.order.statusFood == Status.Preparing)));
          this.pendingPreparationOrders = this.allOrdersDividedByProfile.filter(orders => ((orders.profile == Profiles.Bartender && orders.order.statusDrink == Status.PendingPreparation) || (orders.profile == Profiles.Chef && orders.order.statusFood == Status.PendingPreparation)));
          this.preparedOrders = this.allOrdersDividedByProfile.filter(orders => ((orders.profile == Profiles.Bartender && orders.order.statusDrink == Status.Prepared) || (orders.profile == Profiles.Chef && orders.order.statusFood == Status.Prepared)));
          break;

        case Profiles.Bartender:
          this.pendingPreparationOrders = this.allOrdersDividedByProfile.filter(orders => (orders.profile == Profiles.Bartender && orders.order.statusDrink == Status.PendingPreparation));
          this.preparingOrders = this.allOrdersDividedByProfile.filter(orders => (orders.profile == Profiles.Bartender && orders.order.statusDrink == Status.Preparing));
          break;

        case Profiles.Chef:
          this.pendingPreparationOrders = this.allOrdersDividedByProfile.filter(orders => (orders.profile == Profiles.Chef && orders.order.statusFood == Status.PendingPreparation));
          this.preparingOrders = this.allOrdersDividedByProfile.filter(orders => (orders.profile == Profiles.Chef && orders.order.statusFood == Status.Preparing));
          break;
      }

    });
  }

  updateOrderStatus(selectedOrder: OrderWithUser, status: Status): void {

    this.orderService.getOrderById(selectedOrder.id).then(orderData => {
      let orders = orderData.data() as Order[];

      if (status == Status.PendingPreparation) {

        if (selectedOrder.type == OrderType.TheTwo) {
          orders[selectedOrder.index].statusDrink = status;
          orders[selectedOrder.index].statusFood = status;

        } else if (selectedOrder.type == OrderType.OnlyDrinks) {
          orders[selectedOrder.index].statusDrink = status;

        } else if (selectedOrder.type == OrderType.OnlyFood) {
          orders[selectedOrder.index].statusFood = status;
        }
      } else {
        switch (selectedOrder.profile) {
          case Profiles.Bartender:
            orders[selectedOrder.index].statusDrink = status;
            break;

          case Profiles.Chef:
            orders[selectedOrder.index].statusFood = status;
            break;
        }
      }

      // Modificamos el estado en Firebase
      this.orderService.modifyOrder(selectedOrder.id, orders);
      console.log(selectedOrder);

      // Realizamos tareas adicionales en funcion del estado
      switch (status) {
        case Status.PendingPreparation:
          let products = orders[selectedOrder.index].menu as Product[];
          let hasDrinks: boolean = products.filter(product => product.managerProfile == Profiles.Bartender).length > 0;
          let hasFoods: boolean = products.filter(product => product.managerProfile == Profiles.Chef).length > 0;

          if (hasDrinks) {
            this.sendNotificationByProfile(Profiles.Bartender, 'Nuevo pedido!', 'Hay un nuevo pedido para la barra de bebidas');
          }

          if (hasFoods) {
            this.sendNotificationByProfile(Profiles.Chef, 'Nuevo pedido!', 'Hay un nuevo pedido para la cocina');
          }

          this.notificationService.presentToast('El pedido fue confirmado!', TypeNotification.Success, "bottom", false);
          break;

        case Status.Preparing:
          this.notificationService.presentToast('Comienzo de la preparación del pedido', TypeNotification.Info, "bottom", false);
          break;

        case Status.Prepared:
          this.notificationService.presentToast('Finalización de la preparación del pedido', TypeNotification.Info, "bottom", false);
          this.sendNotificationByProfile(Profiles.Waiter, 'Se finalizó la preparación del pedido!', `El pedido de la mesa ${selectedOrder.user.currentTable} se encuentra listo`);
          break;

        case Status.Delivered:
          this.notificationService.presentToast('El pedido fue entregado con éxito!', TypeNotification.Info, "bottom", false);
          break;

        case Status.Cancelled:
          this.notificationService.presentToast('La orden fue cancelada', TypeNotification.Error, "bottom", false);
          break;
      }

    });

  }

  private sendNotificationByProfile(profileManager: Profiles, title: string, subTitle: string): void {
    this.fcmService.getTokensByProfile(profileManager).then(userDevices => {
      this.fcmService.sendNotification(title, subTitle, userDevices);
    });
  }

  private getCurrentTableNumberById(attentionId): Promise<number> {
    return this.currentAttentionService.getAttentionById(attentionId).then(attentionData => {
      let attention = attentionData.data() as Attention;
      return this.tableService.getTableById(attention.tableId).then(tableData => {
        let table = tableData.data() as Table;
        return table.number;
      });
    });
  }

  prueba(ads) {
    console.log(asd);
  }


  private getOrderType(products: Product[]): OrderType {
    let auxReturn: OrderType;

    let hasDrinks: boolean = products.filter(product => product.managerProfile == Profiles.Bartender).length > 0;
    let hasFoods: boolean = products.filter(product => product.managerProfile == Profiles.Chef).length > 0;

    if (hasDrinks && hasFoods) {
      auxReturn = OrderType.TheTwo;
    } else if (hasDrinks) {
      auxReturn = OrderType.OnlyDrinks;
    } else if (hasFoods) {
      auxReturn = OrderType.OnlyFood
    }
    return auxReturn;
  }


  showDetails(selectedOrder: OrderWithUser) {
    this.loadingService.showLoading();
    this.createAlert(selectedOrder);
  }

  createAlert(selectedOrder: OrderWithUser) {
    let productList = '';
    let products = selectedOrder.order.menu as Product[];
    products.forEach(product => {
      productList += 
      `<ion-item>
          <ion-label class="ion-text-wrap">
            <ion-text><h3><b>${product.name} ${product.description}</b></h3></ion-text>
            <ion-text><p>x${product['quantity']}</p></ion-text>
          </ion-label>
        </ion-item>`
    });
    
    let message = `<div>${productList}</div>`;

    this.loadingService.closeLoading(undefined, undefined, undefined, 1000);
    return this.showAlert(selectedOrder, message);
  }

  async showAlert(selectedOrder: OrderWithUser, message: string) {
    const alert = await this.alertController.create({
      
      header: `Mesa Nro. ${selectedOrder.currentTable}`,
      subHeader: `${selectedOrder.user.name} ${selectedOrder.user.surname}`,
      message: message,
      buttons: [
        {
          text: 'Aceptar',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        }
      ]
    });
    alert.present();
    return alert.onDidDismiss().then((data) => {
      return data;
    })
  }


}

/* #endregion */

// Es una clase auxiliar para relacionar el pedido con un usuario
class OrderWithUser {
  id: string;
  index: number;
  order: Order = new Order();
  user: User = new User();
  profile: string;
  currentTable: number;
  type: OrderType
}

enum OrderType {
  OnlyFood = "Solo comidas",
  OnlyDrinks = "Solo bebidas",
  TheTwo = "Comidas y Bebidas"
}