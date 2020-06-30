export enum Status {

    //Client Status
    PendingApproval = 'pendienteAprobacion',
    Unattended = 'sinAtender',
    OnHold = 'enEspera',
    CanTakeTable = 'puedeTomarMesa',
    Attended = 'atendido',

    //Table Status
    Available = 'disponible',
    Busy = 'ocupada',
    Reserved = 'reservada',

    //Order Status
    PendingConfirm = "Pendiente de confirmación",
    PendingPreparation = 'Pendiente de preparación',
    Preparing = 'En preparación',
    Prepared = 'Preparado',
    Delivered = 'Entregado',
    Confirmed = 'Confirmado'
}