import { OrderCreatedEvent, Publisher, Subjects } from "@diegodmicroserv/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}