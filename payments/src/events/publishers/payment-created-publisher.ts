import { PaymentCreatedEvent, Publisher, Subjects } from "@diegodmicroserv/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}