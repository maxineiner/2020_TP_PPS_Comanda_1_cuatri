export enum Status {

    //Client Status
    PendingApproval = 'pendienteAprobacion',
    Unattended = 'sinAtender',
    OnHold = 'enEspera',
    CanTakeTable = 'puedeTomarMesa',
    Attended = 'atendido',
    Ordered = 'esperandoOrden',
    Ended = 'finalizado',

    //Table Status
    Available = 'disponible',
    Busy = 'ocupada',
    Reserved = 'reservada',

    //Order Status
    Pending = 'pendiente',
    Prepared = 'preparado',
    Delivered = 'entregado',
    Confirmed = 'confirmado'
}