export enum Status {
    PendingApproval = 'pendienteAprobacion',
    Unattended = 'sinAtender',
    OnHold = 'enEspera',
    CanTakeTable = 'puedeTomarMesa',
    Attended = 'atendido',
    Ordered = 'esperandoOrden',
    Ended = 'finalizado',

    Available = 'disponible',
    Busy = 'ocupada',
    Reserved = 'reservada'
}