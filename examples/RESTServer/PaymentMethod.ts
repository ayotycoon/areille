import component from 'areille/common/decorators/component';

@component()
export class PaymentMethod {
  name = 'default';
}

@component({ primary: true })
export class Zelle extends PaymentMethod {}

@component()
export class ACH extends PaymentMethod {}

@component()
export class FastZelle extends Zelle {}
